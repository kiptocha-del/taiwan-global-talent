import { Head, useForm, router } from '@inertiajs/react';
import {
    Heart,
    MessageSquare,
    Send,
    Image as ImageIcon,
    Pin,
    Tag,
} from 'lucide-react';
import React, { useState } from 'react';
import TeacherNavbar from '@/components/Teacher/TeacherNavbar';

interface UserAuthor {
    id: number;
    name: string;
    avatar_url?: string | null;
    subtitle?: string | null;
    role?: string;
}

interface Comment {
    id: number;
    content: string;
    created_at: string;
    user: {
        name: string;
        avatar_url?: string | null;
    };
}

interface Post {
    id: number;
    user: UserAuthor;
    tag: string;
    content: string;
    media_url?: string | null;
    media_type?: 'image' | 'video' | null;
    is_pinned: boolean;
    likes_count: number;
    comments_count: number;
    is_liked_by_me: boolean;
    comments: Comment[];
    created_at: string;
}

interface TeacherCommunityProps {
    teacher: any;
    initialPosts: {
        data: Post[];
    };
}

export default function Index({ teacher, initialPosts }: TeacherCommunityProps) {
    const posts = initialPosts?.data || [];
    const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(null);

    // New post form
    const { data, setData, post, processing, reset, errors } = useForm({
        content: '',
        tag: 'Announcements',
        media: null as File | null,
    });

    // Comment form
    const commentForm = useForm({
        content: '',
    });

    const handlePostSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/teacher/community', {
            onSuccess: () => reset(),
        });
    };

    const handleLike = (postId: number) => {
        router.post(`/teacher/community/${postId}/like`, {}, { preserveScroll: true });
    };

    const handleCommentSubmit = (e: React.FormEvent, postId: number) => {
        e.preventDefault();
        commentForm.post(`/teacher/community/${postId}/comment`, {
            preserveScroll: true,
            onSuccess: () => commentForm.reset(),
        });
    };

    return (
        <>
            <Head title="Teacher Community Feed" />
            <div className="min-h-screen bg-canvas font-sans text-ink antialiased">
                <TeacherNavbar teacher={teacher} />

                <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
                    {/* Header Banner */}
                    <div className="rounded-3xl bg-accent p-6 sm:p-8 text-on-brand shadow-xs">
                        <h1 className="text-xl sm:text-2xl font-bold">
                            Teacher Community Feed
                        </h1>
                        <p className="mt-1 text-xs sm:text-sm text-accent">
                            Share announcements, course updates, and engage with other creators.
                        </p>
                    </div>

                    {/* Create Post Box */}
                    <div className="rounded-3xl border border-border bg-surface p-6 shadow-xs">
                        <form onSubmit={handlePostSubmit} className="space-y-4">
                            <textarea
                                rows={3}
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                placeholder="Share an announcement or update with students..."
                                className="w-full rounded-2xl border border-border bg-canvas p-4 text-sm outline-hidden transition focus:border-accent focus:bg-surface focus:ring-2 focus:ring-accent/20"
                                required
                            />
                            {errors.content && (
                                <p className="text-xs text-status-danger">{errors.content}</p>
                            )}

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-border">
                                <div className="flex items-center gap-3">
                                    {/* Tag Selection */}
                                    <div className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-muted">
                                        <Tag className="h-3.5 w-3.5 text-accent"/>
                                        <select
                                            value={data.tag}
                                            onChange={(e) => setData('tag', e.target.value)}
                                            className="bg-transparent outline-none cursor-pointer"
                                        >
                                            <option value="Announcements">Announcements</option>
                                            <option value="Course Update">Course Update</option>
                                            <option value="Q&A Discussion">Q&A Discussion</option>
                                            <option value="Tips & Tricks">Tips & Tricks</option>
                                        </select>
                                    </div>

                                    {/* File Upload */}
                                    <label className="inline-flex items-center gap-1.5 cursor-pointer rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-muted hover:bg-canvas transition">
                                        <ImageIcon className="h-3.5 w-3.5 text-accent"/>
                                        <span>
                                            {data.media ? data.media.name : 'Attach Media'}
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*,video/*"
                                            onChange={(e) =>
                                                setData('media', e.target.files?.[0] || null)
                                            }
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-2 text-xs font-bold text-on-brand transition hover:bg-accent/90 disabled:opacity-50"
                                >
                                    <Send className="h-3.5 w-3.5"/> Post Update
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Feed Posts List */}
                    <div className="space-y-4">
                        {posts.length === 0 ? (
                            <div className="rounded-3xl border-2 border-dashed border-border py-12 text-center bg-surface">
                                <MessageSquare className="mx-auto mb-2 h-10 w-10 text-muted"/>
                                <p className="text-xs font-bold text-muted">
                                    No community posts yet
                                </p>
                            </div>
                        ) : (
                            posts.map((postItem) => (
                                <div
                                    key={postItem.id}
                                    className="rounded-3xl border border-border bg-surface p-6 shadow-xs space-y-4"
                                >
                                    {/* Post Header */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-soft font-bold text-accent text-sm">
                                                {postItem.user.avatar_url ? (
                                                    <img
                                                        src={postItem.user.avatar_url}
                                                        alt={postItem.user.name}
                                                        className="h-full w-full rounded-2xl object-cover"
                                                    />
                                                ) : (
                                                    postItem.user.name.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-xs sm:text-sm font-bold text-ink">
                                                    {postItem.user.name}
                                                </h4>
                                                <p className="text-[10px] text-muted">
                                                    {postItem.user.subtitle} • {postItem.created_at}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {postItem.is_pinned && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-status-warning-soft px-2.5 py-0.5 text-[10px] font-bold text-status-warning">
                                                    <Pin className="h-3 w-3"/> Pinned
                                                </span>
                                            )}
                                            <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-[10px] font-bold text-accent uppercase">
                                                {postItem.tag}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <p className="text-xs sm:text-sm text-muted leading-relaxed whitespace-pre-line">
                                        {postItem.content}
                                    </p>

                                    {/* Media */}
                                    {postItem.media_url && (
                                        <div className="overflow-hidden rounded-2xl bg-surface-muted max-h-96">
                                            {postItem.media_type === 'video' ? (
                                                <video
                                                    src={postItem.media_url}
                                                    controls
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <img
                                                    src={postItem.media_url}
                                                    alt="Post media"
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                    )}

                                    {/* Interaction Bar */}
                                    <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted">
                                        <button
                                            onClick={() => handleLike(postItem.id)}
                                            className={`inline-flex items-center gap-1.5 font-bold transition ${
                                                postItem.is_liked_by_me
                                                    ? 'text-status-danger'
                                                    : 'hover:text-ink'
                                            }`}
                                        >
                                            <Heart
                                                className={`h-4 w-4 ${
                                                    postItem.is_liked_by_me ? 'fill-current' : ''
                                                }`}
                                            />
                                            <span>{postItem.likes_count} Likes</span>
                                        </button>

                                        <button
                                            onClick={() =>
                                                setActiveCommentPostId(
                                                    activeCommentPostId === postItem.id
                                                        ? null
                                                        : postItem.id
                                                )
                                            }
                                            className="inline-flex items-center gap-1.5 font-bold hover:text-ink transition"
                                        >
                                            <MessageSquare className="h-4 w-4 text-accent"/>
                                            <span>{postItem.comments_count} Comments</span>
                                        </button>
                                    </div>

                                    {/* Comments Section */}
                                    {activeCommentPostId === postItem.id && (
                                        <div className="border-t border-border pt-4 space-y-3 animate-in fade-in duration-150">
                                            <form
                                                onSubmit={(e) =>
                                                    handleCommentSubmit(e, postItem.id)
                                                }
                                                className="flex gap-2"
                                            >
                                                <input
                                                    type="text"
                                                    value={commentForm.data.content}
                                                    onChange={(e) =>
                                                        commentForm.setData(
                                                            'content',
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Write a comment..."
                                                    className="flex-1 rounded-xl border border-border px-3.5 py-1.5 text-xs outline-hidden focus:border-accent"
                                                    required
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={commentForm.processing}
                                                    className="rounded-xl bg-accent px-4 py-1.5 text-xs font-bold text-on-brand hover:bg-accent/90 transition"
                                                >
                                                    Comment
                                                </button>
                                            </form>

                                            <div className="space-y-2 pt-2">
                                                {postItem.comments.map((comment) => (
                                                    <div
                                                        key={comment.id}
                                                        className="rounded-2xl bg-canvas p-3 text-xs"
                                                    >
                                                        <span className="font-bold text-ink">
                                                            {comment.user.name}
                                                        </span>
                                                        <p className="mt-0.5 text-muted">
                                                            {comment.content}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}