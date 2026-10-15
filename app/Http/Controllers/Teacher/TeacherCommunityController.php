<?php

namespace App\Http\Controllers\Teacher;

use App\Events\CommunityCommentCreated;
use App\Events\CommunityPostCreated;
use App\Events\CommunityPostLiked;
use App\Http\Controllers\Controller;
use App\Models\CommunityComment;
use App\Models\CommunityPost;
use App\Models\CommunityPostLike;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TeacherCommunityController extends Controller
{
    /**
     * Display the community feed for teacher portal.
     */
    public function index()
    {
        $user = auth()->user();

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
                    'avatar_url' => $post->user->display_avatar ?? null,
                    'subtitle' => $post->user->display_subtitle ?? 'Content Creator / Teacher',
                    'role' => $post->user->role ?? 'teacher',
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
                        'name' => $comment->user->display_name ?? $comment->user->name,
                        'avatar_url' => $comment->user->display_avatar ?? null,
                    ],
                ]),
                'created_at' => $post->created_at->toIso8601String(),
            ];
        });

        if ((request()->wantsJson() || request()->ajax()) && ! request()->hasHeader('X-Inertia')) {
            return response()->json($formattedPosts);
        }

        return Inertia::render('Teacher/Community/Index', [
            'teacher' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'initialPosts' => $formattedPosts,
        ]);
    }

    /**
     * Store a newly created post from teacher.
     */
    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string|max:5000',
            'tag' => 'required|string',
            'media' => 'nullable|file|mimes:jpeg,png,jpg,gif,mp4,mov|max:20480', // Max 20MB
        ]);

        $mediaPath = null;
        $mediaType = null;

        if ($request->hasFile('media')) {
            try {
                $file = $request->file('media');

                if ($file->isValid()) {
                    // Upload langsung ke Cloudflare R2 / S3
                    $mediaPath = $file->store('community-media', 's3');
                    $mime = $file->getClientMimeType();
                    $mediaType = str_contains($mime, 'video') ? 'video' : 'image';
                } else {
                    return redirect()->back()->withErrors(['media' => 'Uploaded file is invalid.']);
                }
            } catch (\Exception $e) {
                Log::error('Failed uploading to R2 from Teacher Community: '.$e->getMessage());

                return redirect()->back()->withErrors(['media' => 'R2 Upload Failed: '.$e->getMessage()]);
            }
        }

        $post = CommunityPost::create([
            'user_id' => auth()->id(),
            'content' => $request->content,
            'tag' => $request->tag,
            'media_path' => $mediaPath,
            'media_type' => $mediaType,
        ]);

        $post->load('user');

        // Siaran real-time via WebSocket / Reverb
        broadcast(new CommunityPostCreated($post))->toOthers();

        return redirect()->back()->with('success', 'Post created successfully!');
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
     * Store comment.
     */
    public function storeComment(Request $request, $postId)
    {
        $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        $comment = CommunityComment::create([
            'community_post_id' => $postId,
            'user_id' => auth()->id(),
            'content' => $request->content,
        ]);

        $comment->load('user');

        broadcast(new CommunityCommentCreated($comment))->toOthers();

        return redirect()->back();
    }
}