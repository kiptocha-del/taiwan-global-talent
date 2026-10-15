<?php

namespace App\Http\Controllers\Company;

use App\Events\CommunityCommentCreated;
use App\Events\CommunityPostCreated;
use App\Events\CommunityPostLiked;
use App\Http\Controllers\Controller;
use App\Models\CommunityComment;
use App\Models\CommunityPost;
use App\Models\CommunityPostLike;
use App\Models\CommunityPostReport;
use App\Services\CommunityModerationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CompanyCommunityController extends Controller
{
    /**
     * Display the community feed for company portal.
     */
    public function index()
    {
        $user = auth()->user()->load('companyProfile');
        $company = $user->companyProfile;

        if ($company) {
            $disk = Storage::disk('s3');
            $company->logo_url = $company->logo_path ? $disk->url($company->logo_path) : null;
            $company->banner_url = $company->banner_path ? $disk->url($company->banner_path) : null;
        }

        $postsQuery = CommunityPost::with(['user.companyProfile', 'likes', 'comments.user.companyProfile'])
            ->orderBy('is_pinned', 'desc')
            ->latest()
            ->paginate(10);

        $formattedPosts = $postsQuery->through(function ($post) {
            return [
                'id' => $post->id,
                'user' => [
                    'id' => $post->user->id,
                    'name' => $post->user->display_name ?? $post->user->name,
                    'avatar_url' => $post->user->display_avatar ?? $post->user->avatar,
                    'university' => $post->user->display_subtitle ?? ($post->user->companyProfile ? 'Company Partner' : 'Member'),
                    'role' => $post->user->companyProfile ? 'company' : 'student',
                ],
                'tag' => $post->tag ?? 'General',
                'content' => $post->content,
                'media_url' => $post->media_url,
                'media_type' => $post->media_type,
                'is_pinned' => (bool) $post->is_pinned,
                'likes_count' => $post->likes_count,
                'comments_count' => $post->comments()->count(),
                'is_liked_by_me' => auth()->check() ? $post->likes->contains('user_id', auth()->id()) : false,
                'comments' => $post->comments->map(fn ($comment) => [
                    'id' => $comment->id,
                    'content' => $comment->content,
                    'created_at' => $comment->created_at->toIso8601String(),
                    'user' => [
                        'id' => $comment->user->id,
                        'name' => $comment->user->display_name ?? $comment->user->name,
                        'avatar_url' => $comment->user->display_avatar ?? $comment->user->avatar,
                    ],
                ]),
                'created_at' => $post->created_at->toIso8601String(),
            ];
        });

        if ((request()->wantsJson() || request()->ajax()) && ! request()->hasHeader('X-Inertia')) {
            return response()->json($formattedPosts);
        }

        return Inertia::render('Company/Community/Index', [
            'company' => $company,
            'initialPosts' => $formattedPosts,
        ]);
    }

    /**
     * Store a newly created post from company with CommunityModerationService.
     */
    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string|max:5000',
            'tag' => 'required|string',
            'media' => 'nullable|file|mimes:jpeg,png,jpg,gif,mp4,mov,webp|max:20480', // Max 20MB
        ]);

        // ValidationException otomatis dilempar jika terdeteksi pelanggaran kata/tautan/media
        CommunityModerationService::validate($request->content, $request->file('media'));

        $mediaPath = null;
        $mediaType = null;

        if ($request->hasFile('media')) {
            $file = $request->file('media');
            $mediaPath = $file->store('community-media', 's3');
            $mime = $file->getClientMimeType();
            $mediaType = str_contains($mime, 'video') ? 'video' : 'image';
        }

        $post = CommunityPost::create([
            'user_id' => auth()->id(),
            'content' => $request->content,
            'tag' => $request->tag,
            'media_path' => $mediaPath,
            'media_type' => $mediaType,
        ]);

        $post->load('user.companyProfile');

        broadcast(new CommunityPostCreated($post))->toOthers();

        return redirect()->back()->with('success', 'Company update posted successfully!');
    }

    /**
     * Toggle like post.
     */
    public function toggleLike($id)
    {
        $userId = auth()->id();
        $like = CommunityPostLike::where('community_post_id', $id)->where('user_id', $userId)->first();
        $post = CommunityPost::findOrFail($id);

        if ($like) {
            $like->delete();
            $post->decrement('likes_count');
            $isLiked = false;
        } else {
            CommunityPostLike::create([
                'community_post_id' => $id,
                'user_id' => $userId,
            ]);
            $post->increment('likes_count');
            $isLiked = true;
        }

        broadcast(new CommunityPostLiked($post->id, $post->likes_count, $userId, $isLiked))->toOthers();

        return redirect()->back();
    }

    /**
     * Store comment with CommunityModerationService.
     */
    public function storeComment(Request $request, $postId)
    {
        $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        // ValidationException otomatis dilempar jika komentar melanggar
        CommunityModerationService::validate($request->content);

        $comment = CommunityComment::create([
            'community_post_id' => $postId,
            'user_id' => auth()->id(),
            'content' => $request->content,
        ]);

        $comment->load('user.companyProfile');

        broadcast(new CommunityCommentCreated($comment))->toOthers();

        return redirect()->back();
    }

    /**
     * Report a community post.
     */
    public function report(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string|max:255',
            'details' => 'nullable|string|max:1000',
        ]);

        $post = CommunityPost::findOrFail($id);

        CommunityPostReport::updateOrCreate(
            [
                'community_post_id' => $post->id,
                'user_id' => auth()->id(),
            ],
            [
                'reason' => $request->reason,
                'details' => $request->details,
            ]
        );

        if ($post->reports()->count() >= 3) {
            if ($post->media_path) {
                Storage::disk('s3')->delete($post->media_path);
            }
            $post->delete();

            return redirect()->back()->with('success', 'Post deleted due to multiple community violation reports.');
        }

        return redirect()->back()->with('success', 'Thank you. Post reported for moderation review.');
    }

    /**
     * Delete own community post.
     */
    public function destroy($id)
    {
        $post = CommunityPost::findOrFail($id);

        if ($post->user_id !== auth()->id() && ! auth()->user()->hasRole('admin')) {
            abort(403, 'Unauthorized to delete this post.');
        }

        if ($post->media_path) {
            Storage::disk('s3')->delete($post->media_path);
        }

        $post->delete();

        return redirect()->back()->with('success', 'Post deleted successfully.');
    }
}
