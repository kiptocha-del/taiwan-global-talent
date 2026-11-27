import { Loader2Icon } from 'lucide-react';

interface DownloadProgressBarProps {
    isOpen: boolean;
    courseTitle: string;
}

export default function DownloadProgressBar({ isOpen, courseTitle }: DownloadProgressBarProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-xs p-4">
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-surface p-6 shadow-xl border border-border space-y-6 animate-in fade-in zoom-in-95 duration-200">
                
                {/* Header Info */}
                <div className="space-y-2 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-status-positive-soft text-status-positive animate-pulse">
                        <Loader2Icon size={24} className="animate-spin"/>
                    </div>
                    <h3 className="text-lg font-bold text-ink">Generating Certificate</h3>
                    <p className="text-xs text-muted px-4 line-clamp-2">
                        Please Wait, System is processing your certificate for course <span className="font-semibold text-muted">"{courseTitle}"</span>.
                    </p>
                </div>

                {/* Indikator Progress */}
                <div className="space-y-2">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted relative">
                        {/* Looping shimmer: the streamed fetch has no Content-Length, so real progress is unknown */}
                        <div className="h-full rounded-full bg-status-positive animate-infinite-loading w-1/2 absolute left-0"></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-medium text-muted">
                        <span>Connecting to System...</span>
                        <span className="animate-pulse">Processing PDF</span>
                    </div>
                </div>

                {/* Catatan Pengaman */}
                <div className="rounded-xl bg-status-warning-soft/70 p-3 border border-status-warning/30">
                    <p className="text-[11px] leading-relaxed text-status-warning text-center">
                        ⚠️ Please don't close or refresh this page.
                    </p>
                </div>

            </div>
        </div>
    );
}