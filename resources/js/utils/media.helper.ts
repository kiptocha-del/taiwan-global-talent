import { t } from '@/i18n';

export function playAudio(path: string | null): void {
    if (!path) {
        alert(t('media.audioUnavailable'));

        return;
    }

    new Audio(`/storage/${path}`).play().catch((err) => {
        console.error('Audio error:', err);
    });
}

export function getYouTubeEmbedUrl(url: string): string | null {
    if (!url) {
        return null;
    }

    const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
    }

    return null;
}

export const getS3Url = (path: string | null): string | null => {
    if (!path) {
        return null;
    }

    if (path.startsWith('http')) {
        return path; // Already a full URL
    }

    const baseUrl = import.meta.env.VITE_AWS_URL || '';
    
    return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};
