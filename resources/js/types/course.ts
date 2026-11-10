export interface CourseProgress {
    id: number;
    title: string;
    level: string | null;
    category: {
        name: string;
        slug: string;
    } | null;
    total_lessons: number;
    completed_lessons: number;
    /** Whole percentage from 0 to 100. */
    progress: number;
    url: string;
}
