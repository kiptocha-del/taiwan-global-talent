import { BookOpen } from 'lucide-react';
import EmptyState from '@/components/UI/EmptyState';
import PageHeader from '@/components/UI/PageHeader';
import CourseCategoryCard from '../../../components/Student/CourseCategoryCard';
import Layout from '../Layout';

interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    icon?: string | null;
    instructor?: string | null;
    duration?: string | null;
    price: number;
    thumbnail_path?: string | null;
    updated_at?: string | null;
}

export default function Index({ categories = [] }: { categories: Category[] }) {
    return (
        <Layout>
            <div className="space-y-6">
                {/* Page Header */}
                <PageHeader
                    title="Choose Course Category"
                    subtitle="Select a category path below to start learning and view available modules"
                />

                {/* Grid List Categories */}
                {categories.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((cat) => (
                            <CourseCategoryCard key={cat.id} category={cat} />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={BookOpen}
                        title="No Course Categories"
                        description="Course categories are currently unavailable. Please check back later."
                    />
                )}
            </div>
        </Layout>
    );
}