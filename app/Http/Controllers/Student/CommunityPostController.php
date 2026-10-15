<?php

namespace App\Http\Controllers\Student;

use App\Events\CommunityCommentCreated;
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

class CommunityPostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $postsQuery = CommunityPost::with(['user.companyProfile', 'likes', 'comments.user.companyProfile'])
            ->orderBy('is_pinned', 'desc')
            ->latest()
            ->paginate(10);

        $formattedPosts = $postsQuery->through(function ($post) {
            return [
                'id' => $post->id,
                'user' => [
                    'id' => $post->user->id,
                    'name' => $post->user->display_name,
                    'avatar_url' => $post->user->display_avatar,
                    'university' => $post->user->display_subtitle,
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
                        'name' => $comment->user->display_name,
                        'avatar_url' => $comment->user->display_avatar,
                    ],
                ]),
                'created_at' => $post->created_at->toIso8601String(),
            ];
        });

        if ((request()->wantsJson() || request()->ajax()) && ! request()->hasHeader('X-Inertia')) {
            return response()->json($formattedPosts);
        }

        return Inertia::render('Student/Community/Index', [
            'initialPosts' => $formattedPosts,
        ]);
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string|max:5000',
            'tag' => 'required|string',
            'media' => 'nullable|file|mimes:jpeg,png,jpg,gif,mp4,mov,webp|max:20480',
        ]);

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

        return redirect()->back()->with('success', 'Post published successfully!');
    }

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

    public function storeComment(Request $request, $postId)
    {
        $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        CommunityModerationService::validate($request->content);

        $comment = CommunityComment::create([
            'community_post_id' => $postId,
            'user_id' => auth()->id(),
            'content' => $request->content,
        ]);

        // Load relasi user untuk keperluan profile penulisan real-time di frontend
        $comment->load('user');

        // Pemicu siaran komentar real-time
        broadcast(new CommunityCommentCreated($comment))->toOthers();

        return redirect()->back();
    }

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
