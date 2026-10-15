import { useForm, router } from '@inertiajs/react';
import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import type {
    CommunityPost,
    CommunityComment,
    CommunityUser,
} from '@/types/community';

declare global {
    interface Window {
        Echo: any;
    }
}

interface UseCommunityFeedProps {
    initialPosts?: {
        data: CommunityPost[];
        next_page_url: string | null;
    };
    currentUser: CommunityUser;
    routePrefix?: string;
}

export function useCommunityFeed({
    initialPosts,
    currentUser,
    routePrefix,
}: UseCommunityFeedProps) {
    const safeInitialData = initialPosts?.data ?? [];

    const [posts, setPosts] = useState<CommunityPost[]>(safeInitialData);
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(
        initialPosts?.next_page_url ?? null,
    );
    const [loadingMore, setLoadingMore] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const [prevInitialPosts, setPrevInitialPosts] = useState(initialPosts);

    if (initialPosts !== prevInitialPosts) {
        setPrevInitialPosts(initialPosts);

        if (initialPosts?.data) {
            setPosts(initialPosts.data);
            setNextPageUrl(initialPosts.next_page_url);
        }
    }

    const { reset } = useForm({
        content: '',
        tag: 'General',
        media: null as File | null,
    });

    const getBasePrefix = useCallback(() => {
        if (routePrefix) {
            return routePrefix;
        }

        const rawRole =
            currentUser?.role || (currentUser as any)?.role || 'student';
        const role = String(rawRole).toLowerCase();

        if (role === 'company') {
            return '/company/community';
        }

        if (role === 'teacher') {
            return '/teacher/community';
        }

        return '/student/community';
    }, [routePrefix, currentUser]);

    const basePrefix = getBasePrefix();

    const clearServerError = useCallback(() => setServerError(null), []);

    const handleCreatePost = (
        content: string,
        tag: string,
        media: File | null,
    ) => {
        setServerError(null);

        const postEndpoint = basePrefix.includes('/student/community')
            ? '/student/community/posts'
            : basePrefix;

        router.post(
            postEndpoint,
            {
                content,
                tag,
                media,
            },
            {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setServerError(null);
                },
                onError: (errors: any) => {
                    const message =
                        errors.content ||
                        errors.media ||
                        (typeof errors === 'string'
                            ? errors
                            : 'Failed to post update. Please check community guidelines.');

                    setServerError(message);
                },
            },
        );
    };

    const handleLike = (postId: number) => {
        setPosts((prev) =>
            prev.map((p) =>
                p.id === postId
                    ? {
                          ...p,
                          is_liked_by_me: !p.is_liked_by_me,
                          likes_count: p.is_liked_by_me
                              ? p.likes_count - 1
                              : p.likes_count + 1,
                      }
                    : p,
            ),
        );

        const likeEndpoint = basePrefix.includes('/student/community')
            ? `/student/community/posts/${postId}/like`
            : `${basePrefix}/${postId}/like`;

        router.post(likeEndpoint, {}, { preserveScroll: true });
    };

    const handleCommentSubmit = (
        postId: number,
        content: string,
        onErrorCallback?: (errorMsg: string) => void,
    ) => {
        setServerError(null);
        const tempId = Date.now();

        setPosts((prev) =>
            prev.map((post) => {
                if (post.id === postId) {
                    const newComment = {
                        id: tempId,
                        community_post_id: postId,
                        user: currentUser,
                        parent_id: null,
                        content,
                        created_at: new Date().toISOString(),
                    };

                    return {
                        ...post,
                        comments_count: post.comments_count + 1,
                        comments: [...(post.comments ?? []), newComment],
                    };
                }

                return post;
            }),
        );

        const commentEndpoint = basePrefix.includes('/student/community')
            ? `/student/community/posts/${postId}/comments`
            : `${basePrefix}/${postId}/comment`;

        router.post(
            commentEndpoint,
            { content },
            {
                preserveScroll: true,
                onError: (errors: any) => {
                    setPosts((prev) =>
                        prev.map((post) => {
                            if (post.id === postId) {
                                return {
                                    ...post,
                                    comments_count: Math.max(
                                        0,
                                        post.comments_count - 1,
                                    ),
                                    comments: (post.comments ?? []).filter(
                                        (c) => c.id !== tempId,
                                    ),
                                };
                            }

                            return post;
                        }),
                    );

                    const errorMsg =
                        errors.content ||
                        errors.media ||
                        'Comment blocked due to community policy guidelines.';

                    setServerError(errorMsg);

                    if (onErrorCallback) {
                        onErrorCallback(errorMsg);
                    }
                },
            },
        );
    };

    const loadMorePosts = useCallback(() => {
        if (!nextPageUrl || loadingMore || isFetching) {
            return;
        }

        setLoadingMore(true);
        setIsFetching(true);

        axios
            .get(nextPageUrl, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    Accept: 'application/json',
                },
            })
            .then((response) => {
                const incoming = response.data;

                if (incoming && incoming.data) {
                    setPosts((prev) => {
                        const existingIds = new Set(prev.map((p) => p.id));
                        const uniqueIncoming = incoming.data.filter(
                            (p: CommunityPost) => !existingIds.has(p.id),
                        );

                        return [...prev, ...uniqueIncoming];
                    });
                    setNextPageUrl(incoming.next_page_url);
                }

                setLoadingMore(false);
                setIsFetching(false);
            })
            .catch((error) => {
                console.error('Failed to load older posts:', error);
                setLoadingMore(false);
                setIsFetching(false);
            });
    }, [nextPageUrl, loadingMore, isFetching]);

    useEffect(() => {
        if (typeof window.Echo !== 'undefined') {
            const channel = window.Echo.channel('community-feed');

            channel.listen(
                '.CommunityPostCreated',
                (event: { post: CommunityPost }) => {
                    setPosts((prev) => {
                        if (prev.some((p) => p.id === event.post.id)) {
                            return prev;
                        }

                        return [event.post, ...prev];
                    });
                },
            );

            channel.listen(
                '.CommunityPostLiked',
                (event: { postId: number; likesCount: number }) => {
                    setPosts((prev) =>
                        prev.map((p) =>
                            p.id === event.postId
                                ? { ...p, likes_count: event.likesCount }
                                : p,
                        ),
                    );
                },
            );

            channel.listen(
                '.CommunityCommentCreated',
                (event: { comment: CommunityComment }) => {
                    setPosts((prev) =>
                        prev.map((p) => {
                            if (p.id === event.comment.community_post_id) {
                                const filteredComments = (
                                    p.comments ?? []
                                ).filter(
                                    (c) =>
                                        c.id !== event.comment.id &&
                                        !(
                                            c.user?.id ===
                                                event.comment.user?.id &&
                                            c.content === event.comment.content
                                        ),
                                );

                                return {
                                    ...p,
                                    comments_count: p.comments_count + 1,
                                    comments: [
                                        ...filteredComments,
                                        event.comment,
                                    ],
                                };
                            }

                            return p;
                        }),
                    );
                },
            );
        }

        return () => {
            if (typeof window.Echo !== 'undefined') {
                window.Echo.leaveChannel('community-feed');
            }
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >=
                document.documentElement.scrollHeight - 300
            ) {
                loadMorePosts();
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [loadMorePosts]);

    return {
        posts,
        loadingMore,
        serverError,
        clearServerError,
        handleCreatePost,
        handleLike,
        handleCommentSubmit,
        loadMorePosts,
    };
}