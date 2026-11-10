import { useForm, usePage } from '@inertiajs/react';
import { Image, X, Send, Film } from 'lucide-react';
import React, { useState, useRef } from 'react';
import ModerationErrorAlert from '@/components/UI/ModerationErrorAlert';

interface CreatePostBoxProps {
    currentUser?: any;
    routePath?: string;
    errorMessage?: string | null;
    onClearError?: () => void;
    onSubmit?: (content: string, tag: string, media: File | null) => void;
}

export default function CreatePostBox({
    currentUser: propUser,
    routePath,
    errorMessage,
    onClearError,
    onSubmit,
}: CreatePostBoxProps) {
    const { auth, errors: inertiaErrors }: any = usePage().props;
    const user = propUser || auth?.user;

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [clientError, setClientError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Pick the route prefix from the user role
    const getDynamicRoutePath = () => {
        if (routePath) {
            return routePath;
        }

        const rawRole = user?.role_name || user?.role || 'student';
        const role = String(rawRole).toLowerCase();

        if (role === 'company') {
            return '/company/community';
        }

        if (role === 'teacher') {
            return '/teacher/community';
        }

        return '/student/community/posts';
    };

    const targetRoute = getDynamicRoutePath();

    const { data, setData, post, processing, reset, errors } = useForm({
        content: '',
        tag: 'General',
        media: null as File | null,
    });

    const handleClear = () => {
        setClientError(null);

        if (onClearError) {
            onClearError();
        }
    };

    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleClear();

        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('media', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRemoveMedia = () => {
        setData('media', null);
        setPreviewUrl(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleClear();

        if (onSubmit) {
            onSubmit(data.content, data.tag, data.media);
        } else {
            post(targetRoute, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    handleRemoveMedia();
                },
            });
        }
    };

    // Gabungkan Error Moderasi / Form Validation
    const activeError =
        errorMessage ||
        clientError ||
        errors.content ||
        errors.media ||
        inertiaErrors?.content ||
        inertiaErrors?.media;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition sm:p-5 dark:border-slate-800 dark:bg-slate-900">
            {/* Banner Warning Moderasi / Error */}
            {activeError && (
                <div className="mb-4">
                    <ModerationErrorAlert
                        message={activeError}
                        onClose={handleClear}
                    />
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-600 text-xs font-bold text-white shadow-xs">
                        {user?.avatar_url || user?.avatar ? (
                            <img
                                src={user.avatar_url || user.avatar}
                                alt={user.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            user?.name?.charAt(0).toUpperCase() || 'U'
                        )}
                    </div>

                    <textarea
                        value={data.content}
                        onChange={(e) => {
                            setData('content', e.target.value);

                            if (activeError) {
                                handleClear();
                            }
                        }}
                        placeholder="Share updates, job openings, or experiences..."
                        className="w-full resize-none rounded-xl border-0 p-2 text-xs text-slate-900 outline-none focus:ring-0 sm:text-sm dark:bg-slate-900 dark:text-white"
                        rows={3}
                        required
                    />
                </div>

                {previewUrl && (
                    <div className="relative max-h-60 overflow-hidden rounded-xl border border-slate-200 bg-black/5 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={handleRemoveMedia}
                            className="absolute top-2 right-2 z-10 cursor-pointer rounded-full bg-black/60 p-1.5 text-white transition hover:bg-black"
                            title="Remove media"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        {data.media?.type.includes('video') ? (
                            <div className="flex items-center justify-center bg-black">
                                <video
                                    src={previewUrl}
                                    controls
                                    className="max-h-60 w-full object-contain"
                                />
                            </div>
                        ) : (
                            <img
                                src={previewUrl}
                                alt="Upload Preview"
                                className="max-h-60 w-full object-cover"
                            />
                        )}
                    </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        <select
                            value={data.tag}
                            onChange={(e) => setData('tag', e.target.value)}
                            className="rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                        >
                            <option value="General">General</option>
                            <option value="Hiring / Career">
                                Hiring / Career
                            </option>
                            <option value="Company Culture">
                                Company Culture
                            </option>
                            <option value="Announcement">Announcement</option>
                            <option value="Scholarships & Paperwork">
                                Scholarships & Paperwork
                            </option>
                            <option value="Internship Info">
                                Internship Info
                            </option>
                            <option value="Life in Taiwan">
                                Life in Taiwan
                            </option>
                        </select>

                        <label className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300">
                            {data.media?.type.includes('video') ? (
                                <Film className="h-4 w-4 text-purple-600" />
                            ) : (
                                <Image className="h-4 w-4 text-indigo-600" />
                            )}
                            <span className="hidden sm:inline">
                                {data.media ? 'Change Attachment' : 'Attachment'}
                            </span>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleMediaChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={processing || !data.content.trim()}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-indigo-700 disabled:opacity-50"
                    >
                        <Send className="h-3.5 w-3.5" />
                        <span>Post</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
