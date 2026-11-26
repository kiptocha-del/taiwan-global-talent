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

/**
 * Shrink an image in the browser so its longest side is at most `maxSide` pixels, keeping
 * transparency. Returns the original file when it is already small enough or cannot be read.
 */
export async function downscaleImage(
    file: File,
    maxSide: number,
): Promise<File> {
    try {
        const bitmap = await createImageBitmap(file);
        const scale = maxSide / Math.max(bitmap.width, bitmap.height);

        if (scale >= 1) {
            bitmap.close();

            return file;
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.round(bitmap.width * scale);
        canvas.height = Math.round(bitmap.height * scale);

        const context = canvas.getContext('2d');

        if (!context) {
            bitmap.close();

            return file;
        }

        context.imageSmoothingQuality = 'high';
        context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        bitmap.close();

        const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, 'image/webp', 0.9),
        );

        if (!blob) {
            return file;
        }

        // Browsers that cannot encode WebP hand back a PNG instead.
        const extension = blob.type === 'image/webp' ? 'webp' : 'png';
        const baseName = file.name.replace(/\.[^.]+$/, '');

        return new File([blob], `${baseName}.${extension}`, {
            type: blob.type,
        });
    } catch {
        return file;
    }
}

export const getS3Url =(path: string | null): string | null => {
    if (!path) {
        return null;
    }

    if (path.startsWith('http')) {
        return path; // Already a full URL
    }

    const baseUrl = import.meta.env.VITE_AWS_URL || '';
    
    return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};
