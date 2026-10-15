export interface Teacher {
    id: number;
    name: string;
    email: string;
}

export interface TeacherStats {
    total_courses: number;
    published_courses: number;
    mandarin_courses: number;
    total_lessons: number;
}

export interface CategoryInfo {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    icon?: string | null;
}

export interface Course {
    id: number;
    teacher_id?: number;
    category_id?: number;
    title: string;
    slug?: string;
    description?: string | null;
    category?: CategoryInfo | string | null;
    price: number;
    status: 'draft' | 'published' | 'archived';
    is_published?: boolean;
    thumbnail_path?: string | null;
    thumbnail_url?: string | null;
    lessons_count?: number;
    created_at?: string;
    lessons?: Lesson[];
}

export interface Lesson {
    id: number;
    module_id: number;
    title: string;
    content?: string | null;
    content_type?: 'video' | 'audio' | 'pdf' | 'text';
    video_url?: string | null;
    video_path?: string | null;
    pdf_path?: string | null;
    order?: number;
    sort_order?: number;
    is_free_preview: boolean;
}