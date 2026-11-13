import { Head, usePage } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';
import React from 'react';
import CommunityPostCard from '@/components/Community/CommunityPostCard';
import CreatePostBox from '@/components/Community/CreatePostBox';
import CompanyNavbar from '@/components/Company/CompanyNavbar';
import EmptyState from '@/components/UI/EmptyState';
import PageHeader from '@/components/UI/PageHeader';
import { useCommunityFeed } from '@/hooks/useCommunityFeed';
import type { CommunityPost, CommunityUser } from '@/types/community';

interface Props {
    company: any;
    initialPosts?: {
        data: CommunityPost[];
        next_page_url: string | null;
    };
}

export default function CompanyCommunityIndex({ company, initialPosts }: Props) {
    const { auth } = usePage().props as any;
    const currentUser: CommunityUser = auth?.user;

    const {
        posts,
        loadingMore,
        serverError,
        handleCreatePost,
        handleLike,
        handleCommentSubmit,
        clearServerError,
    } = useCommunityFeed({ 
        initialPosts, 
        currentUser,
        routePrefix: '/company/community' // Eksplisit tentukan rute company
    });

    return (
        <div className="min-h-screen bg-canvas text-ink">
            <Head title="Talent & Company Community" />
            <CompanyNavbar company={company} />

            <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <PageHeader
                    title="Talent & Company Community"
                    subtitle="Share company achievements, hiring updates, and engage with global talents."
                    actionButton={
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                            <Sparkles className="h-5 w-5"/>
                        </div>
                    }
                />

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                    <div className="space-y-5 lg:col-span-3">
                        <CreatePostBox
                            currentUser={currentUser}
                            routePath="/company/community"
                            errorMessage={serverError}
                            onClearError={clearServerError}
                            onSubmit={(content, tag, media) => handleCreatePost(content, tag, media)}
                        />

                        <div className="space-y-4">
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <CommunityPostCard
                                        key={post.id}
                                        post={post}
                                        onLike={handleLike}
                                        onCommentSubmit={handleCommentSubmit}
                                        routePrefix="/company/community"
                                    />
                                ))
                            ) : (
                                <EmptyState
                                    icon={Sparkles}
                                    title="No Community Posts Available"
                                    description="Be the first to share an update, job vacancy, or announcement with the community."
                                />
                            )}
                        </div>

                        {loadingMore && (
                            <div className="flex items-center justify-center gap-2 p-4 text-xs font-medium text-muted">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-indigo-600"></span>
                                <span>Loading older discussions...</span>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}