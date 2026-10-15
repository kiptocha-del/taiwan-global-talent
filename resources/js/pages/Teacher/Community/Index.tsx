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

    // Form Postingan Baru
    const { data, setData, post, processing, reset, errors } = useForm({
        content: '',
        tag: 'Announcements',
        media: null as File | null,
    });

    // Form Komentar
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
            <div className="min-h-screen bg-gray-50/50 font-sans text-gray-800 antialiased">
                <TeacherNavbar teacher={teacher} />

                <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
                    {/* Header Banner */}
                    <div className="rounded-3xl bg-indigo-600 p-6 sm:p-8 text-white shadow-xs">
                        <h1 className="text-xl sm:text-2xl font-bold">
                            Teacher Community Feed
                        </h1>
                        <p className="mt-1 text-xs sm:text-sm text-indigo-100">
                            Share announcements, course updates, and engage with other creators.
                        </p>
                    </div>

                    {/* Create Post Box */}
                    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs">
                        <form onSubmit={handlePostSubmit} className="space-y-4">
                            <textarea
                                rows={3}
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                placeholder="Share an announcement or update with students..."
                                className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 p-4 text-sm outline-hidden transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                                required
                            />
                            {errors.content && (
                                <p className="text-xs text-red-500">{errors.content}</p>
                            )}

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-gray-100">
                                <div className="flex items-center gap-3">
                                    {/* Tag Selection */}
                                    <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600">
                                        <Tag className="h-3.5 w-3.5 text-indigo-600" />
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
                                    <label className="inline-flex items-center gap-1.5 cursor-pointer rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition">
                                        <ImageIcon className="h-3.5 w-3.5 text-indigo-600" />
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
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    <Send className="h-3.5 w-3.5" /> Post Update
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Feed Posts List */}
                    <div className="space-y-4">
                        {posts.length === 0 ? (
                            <div className="rounded-3xl border-2 border-dashed border-gray-100 py-12 text-center bg-white">
                                <MessageSquare className="mx-auto mb-2 h-10 w-10 text-gray-300" />
                                <p className="text-xs font-bold text-gray-700">
                                    No community posts yet
                                </p>
                            </div>
                        ) : (
                            posts.map((postItem) => (
                                <div
                                    key={postItem.id}
                                    className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs space-y-4"
                                >
                                    {/* Post Header */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 font-bold text-indigo-700 text-sm">
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
                                                <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                                                    {postItem.user.name}
                                                </h4>
                                                <p className="text-[10px] text-gray-400">
                                                    {postItem.user.subtitle} • {postItem.created_at}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {postItem.is_pinned && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-600">
                                                    <Pin className="h-3 w-3" /> Pinned
                                                </span>
                                            )}
                                            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-600 uppercase">
                                                {postItem.tag}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                        {postItem.content}
                                    </p>

                                    {/* Media */}
                                    {postItem.media_url && (
                                        <div className="overflow-hidden rounded-2xl bg-gray-100 max-h-96">
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
                                    <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
                                        <button
                                            onClick={() => handleLike(postItem.id)}
                                            className={`inline-flex items-center gap-1.5 font-bold transition ${
                                                postItem.is_liked_by_me
                                                    ? 'text-red-500'
                                                    : 'hover:text-gray-900'
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
                                            className="inline-flex items-center gap-1.5 font-bold hover:text-gray-900 transition"
                                        >
                                            <MessageSquare className="h-4 w-4 text-indigo-500" />
                                            <span>{postItem.comments_count} Comments</span>
                                        </button>
                                    </div>

                                    {/* Comments Section */}
                                    {activeCommentPostId === postItem.id && (
                                        <div className="border-t border-gray-100 pt-4 space-y-3 animate-in fade-in duration-150">
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
                                                    className="flex-1 rounded-xl border border-gray-200 px-3.5 py-1.5 text-xs outline-hidden focus:border-indigo-500"
                                                    required
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={commentForm.processing}
                                                    className="rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition"
                                                >
                                                    Comment
                                                </button>
                                            </form>

                                            <div className="space-y-2 pt-2">
                                                {postItem.comments.map((comment) => (
                                                    <div
                                                        key={comment.id}
                                                        className="rounded-2xl bg-gray-50/80 p-3 text-xs"
                                                    >
                                                        <span className="font-bold text-gray-900">
                                                            {comment.user.name}
                                                        </span>
                                                        <p className="mt-0.5 text-gray-600">
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