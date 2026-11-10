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
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <div className="divide-y divide-gray-100 dark:divide-slate-800">
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
                                    className="flex flex-col justify-between gap-6 p-6 transition-colors hover:bg-gray-50/50 md:flex-row md:items-center dark:hover:bg-slate-800/50"
                                >
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-600 uppercase dark:bg-blue-950 dark:text-blue-400">
                                                {module.level || 'General'}
                                            </span>
                                            <StatusBadge
                                                status={module.status}
                                            />
                                        </div>
                                        <h4 className="text-base font-bold text-gray-900 dark:text-white">
                                            {module.title}
                                        </h4>
                                    </div>

                                    <div className="w-full space-y-1 md:w-48">
                                        <div className="mb-1 flex justify-between text-xs font-medium text-gray-500 dark:text-slate-400">
                                            <span>Progress</span>
                                            <span>{module.progress}%</span>
                                        </div>
                                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-slate-800">
                                            <div
                                                className="h-full rounded-full bg-blue-600 transition-all duration-300"
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
                                                className="w-full bg-emerald-600 shadow-emerald-600/20 hover:bg-emerald-700 md:w-auto"
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
