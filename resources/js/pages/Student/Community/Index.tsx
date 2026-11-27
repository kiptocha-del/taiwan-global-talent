import { usePage } from '@inertiajs/react';
import { ShieldAlert } from 'lucide-react';
import CommunityPostCard from '@/components/Community/CommunityPostCard';
import CreatePostBox from '@/components/Community/CreatePostBox';
import { useCommunityFeed } from '@/hooks/useCommunityFeed';
import type { CommunityPost, CommunityUser } from '@/types/community';
import Layout from '../Layout';

interface Props {
    initialPosts?: {
        data: CommunityPost[];
        next_page_url: string | null;
    };
}

export default function Index({ initialPosts }: Props) {
    const { auth } = usePage().props as any;
    const currentUser: CommunityUser = auth.user;

    const {
        posts,
        loadingMore,
        serverError,
        handleCreatePost,
        handleLike,
        handleCommentSubmit,
        clearServerError,
    } = useCommunityFeed({ initialPosts, currentUser });

    return (
        <Layout>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                {/* Feed Utama (Kolom Kiri - Span 3) */}
                <div className="space-y-5 lg:col-span-3">
                    <CreatePostBox
                        currentUser={currentUser}
                        onSubmit={handleCreatePost}
                        errorMessage={serverError}
                        onClearError={clearServerError}
                    />

                    <div className="space-y-4">
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <CommunityPostCard
                                    key={post.id}
                                    post={post}
                                    onLike={handleLike}
                                    onCommentSubmit={handleCommentSubmit}
                                />
                            ))
                        ) : (
                            <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center text-sm text-muted">
                                No discussions found. Be the first to start a
                                conversation!
                            </div>
                        )}
                    </div>

                    {/* Loader Infinite Scroll */}
                    {loadingMore && (
                        <div className="flex items-center justify-center gap-2 p-4 text-xs font-medium text-muted">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-blue-600"></span>
                            <span>Loading older discussions...</span>
                        </div>
                    )}
                </div>

                {/* Sidebar Widget Kanan */}
                <div className="hidden space-y-4 lg:col-span-1 lg:block">
                    <div className="space-y-3 rounded-2xl border border-border bg-surface p-4 shadow-xs">
                        <div className="flex items-center gap-2 border-b border-border pb-2 text-xs font-bold text-ink">
                            <ShieldAlert className="h-4 w-4 text-accent"/>
                            <span>Community Guidelines</span>
                        </div>
                        <ul className="space-y-2 text-[11px] leading-relaxed text-muted">
                            <li className="flex items-start gap-1.5">
                                <span className="font-bold text-accent">
                                    •
                                </span>
                                <span>
                                    Respect all members of the talent community.
                                </span>
                            </li>
                            <li className="flex items-start gap-1.5">
                                <span className="font-bold text-accent">
                                    •
                                </span>
                                <span>
                                    No 18+/NSFW content or spam/scam promotion.
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
