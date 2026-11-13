import { Award, FileDownIcon, LockKeyhole } from 'lucide-react';
import { useState } from 'react';
import Button from '@/components/UI/Button';
import DownloadProgressBar from '@/components/UI/DownloadProgressBar';
import EmptyState from '@/components/UI/EmptyState';
import PageHeader from '@/components/UI/PageHeader';
import StatusBadge from '@/components/UI/StatusBadge';
import { useTranslation } from '@/context/LanguageContext';
import Layout from '../../Layout';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Props {
    modules: any[];
    stats: any;
    currentCategory: Category | null;
    allCategories: Category[];
}

export default function CertificateIndex({ modules = [] }: Props) {
    const { t } = useTranslation();
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [activeCourseTitle, setActiveCourseTitle] = useState<string>('');

    const handleDownloadCertificate = async (
        moduleId: number,
        moduleTitle: string,
    ) => {
        if (isPopupOpen) {
            return;
        }

        setActiveCourseTitle(moduleTitle);
        setIsPopupOpen(true);

        try {
            const response = await fetch(
                `/student/courses/${moduleId}/certificate`,
            );

            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to process certificate.');
                setIsPopupOpen(false);

                return;
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);

            const downloadLink = document.createElement('a');
            downloadLink.href = downloadUrl;
            downloadLink.download = t('certificate.fileName', { title: moduleTitle });
            document.body.appendChild(downloadLink);
            downloadLink.click();

            downloadLink.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error(error);
            alert(
                'Failed to download certificate. There was a network connection error while downloading the certificate.',
            );
        } finally {
            setIsPopupOpen(false);
        }
    };

    return (
        <Layout>
            <div className="relative space-y-6">
                <DownloadProgressBar
                    isOpen={isPopupOpen}
                    courseTitle={activeCourseTitle}
                />

                {/* Page Header */}
                <PageHeader
                    title="My Course Certificates"
                    subtitle="View your completed modules and download your official completion certificates."
                />

                {/* Course List */}
                <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xs">
                    <div className="divide-y divide-border">
                        {modules.length === 0 ? (
                            <div className="p-4">
                                <EmptyState
                                    icon={Award}
                                    title="No Course Certificates Found"
                                    description="You haven't completed any course modules yet. Complete all lessons in a module to unlock your certificate."
                                />
                            </div>
                        ) : (
                            modules.map((module: any) => (
                                <div
                                    key={module.id}
                                    className="flex flex-col justify-between gap-6 p-6 transition-colors hover:bg-canvas md:flex-row md:items-center"
                                >
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="rounded-md bg-accent-soft px-2 py-0.5 text-xs font-bold text-accent uppercase">
                                                {module.level || 'General'}
                                            </span>
                                            <StatusBadge
                                                status={module.status}
                                            />
                                        </div>
                                        <h4 className="text-base font-bold text-ink">
                                            {module.title}
                                        </h4>
                                    </div>

                                    <div className="w-full space-y-1 md:w-48">
                                        <div className="mb-1 flex justify-between text-xs font-medium text-muted">
                                            <span>Progress</span>
                                            <span>{module.progress}%</span>
                                        </div>
                                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
                                            <div
                                                className="h-full rounded-full bg-accent transition-all duration-300"
                                                style={{
                                                    width: `${module.progress}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {module.status === 'Completed' ? (
                                            <Button
                                                type="button"
                                                variant="primary"
                                                size="sm"
                                                icon={FileDownIcon}
                                                isLoading={
                                                    isPopupOpen &&
                                                    activeCourseTitle ===
                                                        module.title
                                                }
                                                onClick={() =>
                                                    handleDownloadCertificate(
                                                        module.id,
                                                        module.title,
                                                    )
                                                }
                                                className="w-full bg-status-positive shadow-emerald-600/20 hover:bg-status-positive md:w-auto"
                                            >
                                                Download Certificate
                                            </Button>
                                        ) : (
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                icon={LockKeyhole}
                                                disabled
                                                className="w-full md:w-auto"
                                            >
                                                Locked
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
