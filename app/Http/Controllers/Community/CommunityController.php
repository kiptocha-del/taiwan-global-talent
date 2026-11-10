<?php

namespace App\Http\Controllers\Community;

use App\Events\CommunityCommentCreated;
use App\Events\CommunityPostCreated;
use App\Events\CommunityPostLiked;
use App\Http\Controllers\Controller;
use App\Models\CommunityComment;
use App\Models\CommunityPost;
use App\Models\CommunityPostLike;
use App\Models\CommunityPostReport;
use App\Models\User;
use App\Services\CommunityModerationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

/**
 * One community feed shared by the student, teacher and company portals.
 *
 * The portal is taken from the first URL segment so every role gets the same
 * moderation, broadcasting, reporting and deletion rules.
 */
class CommunityController extends Controller
{
    private const PORTALS = ['student', 'teacher', 'company'];

    private const REPORTS_BEFORE_REMOVAL = 3;

    public function index(Request $request): Response|JsonResponse
    {
        $portal = $this->portal($request);
        $user = $request->user();

        $posts = CommunityPost::query()
            ->with(['user.companyProfile', 'user.roles', 'likes', 'comments.user.companyProfile'])
            ->withCount('comments')
            ->orderByDesc('is_pinned')
            ->latest()
            ->paginate(10)
            ->through(fn (CommunityPost $post) => $this->formatPost($post, $user->id));

        if (($request->wantsJson() || $request->ajax()) && ! $request->hasHeader('X-Inertia')) {
            return response()->json($posts);
        }

        return Inertia::render(ucfirst($portal).'/Community/Index', [
            'initialPosts' => $posts,
            ...$this->portalProps($portal, $user),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'content' => 'required|string|max:5000',
            'tag' => 'required|string',
            'media' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp,mp4,mov|max:20480',
        ]);

        CommunityModerationService::validate($request->content, $request->file('media'));

        $mediaPath = null;
        $mediaType = null;

        if ($request->hasFile('media')) {
            $file = $request->file('media');

            if (! $file->isValid()) {
                return redirect()->back()->withErrors(['media' => 'The uploaded file is invalid.']);
            }

            try {
                $mediaPath = $file->store('community-media', 's3');
                $mediaType = str_contains($file->getClientMimeType(), 'video') ? 'video' : 'image';
            } catch (\Throwable $e) {
                Log::error('Community media upload failed: '.$e->getMessage());

                return redirect()->back()->withErrors(['media' => 'We could not upload your media. Please try again.']);
            }
        }

        $post = CommunityPost::create([
            'user_id' => $request->user()->id,
            'content' => $request->content,
            'tag' => $request->tag,
            'media_path' => $mediaPath,
            'media_type' => $mediaType,
        ]);

        $post->load('user.companyProfile');

        broadcast(new CommunityPostCreated($post))->toOthers();

        return redirect()->back()->with('success', 'Post published successfully!');
    }

    public function toggleLike(Request $request, int $id): RedirectResponse
    {
        $userId = $request->user()->id;
        $post = CommunityPost::findOrFail($id);
        $like = CommunityPostLike::where('community_post_id', $post->id)->where('user_id', $userId)->first();

        if ($like) {
            $like->delete();
            $post->decrement('likes_count');
            $isLiked = false;
        } else {
            CommunityPostLike::create([
                'community_post_id' => $post->id,
                'user_id' => $userId,
            ]);
            $post->increment('likes_count');
            $isLiked = true;
        }

        broadcast(new CommunityPostLiked($post->id, $post->likes_count, $userId, $isLiked))->toOthers();

        return redirect()->back();
    }

    public function storeComment(Request $request, int $postId): RedirectResponse
    {
        $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        CommunityModerationService::validate($request->content);

        $post = CommunityPost::findOrFail($postId);

        $comment = CommunityComment::create([
            'community_post_id' => $post->id,
            'user_id' => $request->user()->id,
            'content' => $request->content,
        ]);

        $comment->load('user.companyProfile');

        broadcast(new CommunityCommentCreated($comment))->toOthers();

        return redirect()->back();
    }

    public function report(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'reason' => 'required|string|max:255',
            'details' => 'nullable|string|max:1000',
        ]);

        $post = CommunityPost::findOrFail($id);

        CommunityPostReport::updateOrCreate(
            [
                'community_post_id' => $post->id,
                'user_id' => $request->user()->id,
            ],
            [
                'reason' => $request->reason,
                'details' => $request->details,
            ]
        );

        if ($post->reports()->count() >= self::REPORTS_BEFORE_REMOVAL) {
            $this->deletePost($post);

            return redirect()->back()->with('success', 'Post removed after multiple community reports.');
        }

        return redirect()->back()->with('success', 'Thank you. The post has been reported for review.');
    }

    public function destroy(Request $request, int $id): RedirectResponse
    {
        $post = CommunityPost::findOrFail($id);
        $user = $request->user();

        if ($post->user_id !== $user->id && ! $user->hasRole('admin')) {
            abort(403, 'You can only delete your own posts.');
        }

        $this->deletePost($post);

        return redirect()->back()->with('success', 'Post deleted successfully.');
    }

    private function deletePost(CommunityPost $post): void
    {
        if ($post->media_path) {
            Storage::disk('s3')->delete($post->media_path);
        }

        $post->delete();
    }

    /**
     * The portal (student, teacher or company) serving this request.
     */
    private function portal(Request $request): string
    {
        $portal = $request->segment(1);

        abort_unless(in_array($portal, self::PORTALS, true), 404);

        return $portal;
    }

    /**
     * Extra page props each portal's community page expects.
     *
     * @return array<string, mixed>
     */
    private function portalProps(string $portal, User $user): array
    {
        return match ($portal) {
            'teacher' => [
                'teacher' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
            ],
            'company' => ['company' => $this->companyProps($user)],
            default => [],
        };
    }

    private function companyProps(User $user): mixed
    {
        $company = $user->loadMissing('companyProfile')->companyProfile;

        if ($company) {
            $company->logo_url = $company->logo_path ? Storage::disk('s3')->url($company->logo_path) : null;
            $company->banner_url = $company->banner_path ? Storage::disk('s3')->url($company->banner_path) : null;
        }

        return $company;
    }

    /**
     * @return array<string, mixed>
     */
    private function formatPost(CommunityPost $post, int $viewerId): array
    {
        $author = $post->user;
        $subtitle = $author->display_subtitle;

        return [
            'id' => $post->id,
            'user' => [
                'id' => $author->id,
                'name' => $author->display_name,
                'avatar_url' => $author->display_avatar,
                'subtitle' => $subtitle,
                'university' => $subtitle,
                'role' => $author->roles->first()?->name ?? 'student',
            ],
            'tag' => $post->tag ?? 'General',
            'content' => $post->content,
            'media_url' => $post->media_url,
            'media_type' => $post->media_type,
            'is_pinned' => (bool) $post->is_pinned,
            'likes_count' => $post->likes_count,
            'comments_count' => $post->comments_count,
            'is_liked_by_me' => $post->likes->contains('user_id', $viewerId),
            'comments' => $post->comments->map(fn (CommunityComment $comment) => [
                'id' => $comment->id,
                'content' => $comment->content,
                'created_at' => $comment->created_at->toIso8601String(),
                'user' => [
                    'id' => $comment->user->id,
                    'name' => $comment->user->display_name,
                    'avatar_url' => $comment->user->display_avatar,
                ],
            ]),
            'created_at' => $post->created_at->toIso8601String(),
        ];
    }
}
