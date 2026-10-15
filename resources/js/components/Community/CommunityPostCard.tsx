import { router, usePage } from '@inertiajs/react';
import {
    ThumbsUp,
    MessageSquare,
    Flag,
    Trash2,
    Send,
    Tag,
    AlertCircle,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import type { CommunityPost } from '@/types/community';

interface CommunityPostCardProps {
    post: CommunityPost;
    onLike?: (postId: number) => void;
    onCommentSubmit?: (
        postId: number,
        content: string,
        onErrorCallback?: (errorMsg: string) => void,
    ) => void;
    routePrefix?: string;
}

export default function CommunityPostCard({
    post,
    onLike,
    onCommentSubmit,
    routePrefix,
}: CommunityPostCardProps) {
    const { auth }: any = usePage().props;
    const currentUser = auth?.user;

    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [commentError, setCommentError] = useState<string | null>(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState('Scam / Spam');

    // Deteksi Role & Base Route Prefix Dinamis
    const getBasePrefix = () => {
        if (routePrefix) {
            return routePrefix;
        }

        const rawRole =
            currentUser?.role_name || currentUser?.role || 'student';
        const role = String(rawRole).toLowerCase();

        if (role === 'company') {
            return '/company/community';
        }

        if (role === 'teacher') {
            return '/teacher/community';
        }

        return '/student/community';
    };

    const basePrefix = getBasePrefix();
    const isOwner = currentUser?.id === post.user?.id;

    // Handler Like Dinamis
    const handleLike = () => {
        if (onLike) {
            onLike(post.id);
        } else {
            router.post(
                `${basePrefix}/${post.id}/like`,
                {},
                { preserveScroll: true },
            );
        }
    };

    // Handler Report Dinamis
    const handleReport = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            `${basePrefix}/posts/${post.id}/report`,
            { reason: reportReason },
            {
                preserveScroll: true,
                onSuccess: () => setShowReportModal(false),
            },
        );
    };

    // Handler Delete Dinamis
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this post?')) {
            router.delete(`${basePrefix}/posts/${post.id}`, {
                preserveScroll: true,
            });
        }
    };

    // Handler Kirim Komentar Dinamis
    const handleComment = (e: React.FormEvent) => {
        e.preventDefault();

        if (!commentText.trim()) {
            return;
        }

        setCommentError(null);

        if (onCommentSubmit) {
            onCommentSubmit(post.id, commentText, (err) =>
                setCommentError(err),
            );
            setCommentText('');
        } else {
            router.post(
                `${basePrefix}/${post.id}/comment`,
                { content: commentText },
                {
                    preserveScroll: true,
                    onSuccess: () => setCommentText(''),
                    onError: (errors: any) => {
                        const message =
                            errors?.content ||
                            errors?.message ||
                            'Failed to send comment.';
                        setCommentError(message);
                    },
                },
            );
        }
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition sm:p-5 dark:border-slate-800 dark:bg-slate-900">
            {/* Header Post */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-600 text-xs font-bold text-white">
                        {post.user?.avatar_url ? (
                            <img
                                src={post.user.avatar_url}
                                alt={post.user.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            post.user?.name?.charAt(0).toUpperCase() || 'U'
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h4 className="truncate text-xs font-bold text-slate-900 sm:text-sm dark:text-white">
                            {post.user?.name}
                        </h4>
                        <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                            {post.user?.university || 'Member'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                        <Tag className="h-3 w-3" /> {post.tag || 'General'}
                    </span>

                    {isOwner ? (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="cursor-pointer p-1 text-slate-400 transition-colors hover:text-rose-600"
                            title="Delete Post"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setShowReportModal(true)}
                            className="cursor-pointer p-1 text-slate-400 transition-colors hover:text-amber-600"
                            title="Report Post"
                        >
                            <Flag className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Content & Media Attachment */}
            <div className="mt-3 space-y-3">
                <p className="wrap-break-words text-xs leading-relaxed text-slate-800 sm:text-sm dark:text-slate-200">
                    {post.content}
                </p>

                {post.media_url && (
                    <div className="flex max-h-96 w-full items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-black dark:border-slate-800">
                        {post.media_type === 'video' ? (
                            <video
                                src={post.media_url}
                                controls
                                className="max-h-96 w-full object-contain"
                            />
                        ) : (
                            <img
                                src={post.media_url}
                                alt="Attachment"
                                className="max-h-96 w-full object-contain"
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Social Actions */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <button
                    type="button"
                    onClick={handleLike}
                    className={`inline-flex cursor-pointer items-center gap-1.5 transition hover:text-indigo-600 ${
                        post.is_liked_by_me
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : ''
                    }`}
                >
                    <ThumbsUp
                        className={`h-4 w-4 ${post.is_liked_by_me ? 'fill-indigo-600 dark:fill-indigo-400' : ''}`}
                    />
                    <span>{post.likes_count ?? 0} Like</span>
                </button>

                <button
                    type="button"
                    onClick={() => setShowComments(!showComments)}
                    className="inline-flex cursor-pointer items-center gap-1.5 transition hover:text-slate-900 dark:hover:text-white"
                >
                    <MessageSquare className="h-4 w-4 text-indigo-500" />
                    <span>
                        {post.comments_count ?? post.comments?.length ?? 0}{' '}
                        Comment
                    </span>
                </button>
            </div>

            {/* Comment Section */}
            {showComments && (
                <div className="mt-3 space-y-3 border-t border-slate-100 pt-3 dark:border-slate-800">
                    {commentError && (
                        <div className="flex items-center justify-between gap-2 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs font-semibold text-rose-600 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-400">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                                <span>{commentError}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setCommentError(null)}
                                className="text-rose-400 hover:text-rose-600"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleComment} className="flex gap-2">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => {
                                setCommentText(e.target.value);

                                if (commentError) {
                                    setCommentError(null);
                                }
                            }}
                            placeholder="Write a comment..."
                            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                            required
                        />
                        <button
                            type="submit"
                            className="cursor-pointer rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-indigo-700"
                        >
                            <Send className="h-3.5 w-3.5" />
                        </button>
                    </form>

                    <div className="max-h-60 space-y-2 overflow-y-auto">
                        {post.comments?.map((comment) => (
                            <div
                                key={comment.id}
                                className="rounded-xl bg-slate-50 p-2.5 text-xs dark:bg-slate-800/50"
                            >
                                <span className="font-bold text-slate-900 dark:text-white">
                                    {comment.user?.name}:{' '}
                                </span>
                                <span className="wrap-break-words text-slate-700 dark:text-slate-300">
                                    {comment.content}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            Report Community Post
                        </h3>
                        <form onSubmit={handleReport} className="space-y-3">
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Choose Reason
                            </label>
                            <select
                                value={reportReason}
                                onChange={(e) =>
                                    setReportReason(e.target.value)
                                }
                                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                            >
                                <option value="Scam / Spam">Scam / Spam</option>
                                <option value="18+ / Adult Content">
                                    18+ / Adult Content
                                </option>
                                <option value="Hate Speech">Hate Speech</option>
                                <option value="Misleading Information">
                                    Misleading Information
                                </option>
                            </select>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowReportModal(false)}
                                    className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="cursor-pointer rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700"
                                >
                                    Submit Report
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
