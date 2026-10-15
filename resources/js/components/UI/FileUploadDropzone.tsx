import { UploadCloud, FileText, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface FileUploadDropzoneProps {
    value: File | null;
    onChange: (file: File | null) => void;
    accept?: string;
    maxSizeMB?: number;
    error?: string;
    label?: string;
}

export default function FileUploadDropzone({
    value,
    onChange,
    accept = '.pdf,.doc,.docx,.png,.jpg,.jpeg',
    maxSizeMB = 5,
    error,
    label = 'Upload File',
}: FileUploadDropzoneProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFile = (file: File | null) => {
        if (!file) {
            return;
        }

        if (file.size > maxSizeMB * 1024 * 1024) {
            alert(
                `File size exceeds the maximum limit of ${maxSizeMB}MB`
            );

            return;
        }

        onChange(file);
    };

    return (
        <div className="w-full">
            {label && (
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}

            {value ? (
                <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/50 p-3.5">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <FileText className="h-5 w-5 shrink-0 text-blue-600" />
                        <div className="truncate">
                            <p className="truncate text-sm font-medium text-gray-800">
                                {value.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {(value.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => onChange(null)}
                        className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-rose-100 hover:text-rose-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ) : (
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);

                        if (e.dataTransfer.files?.[0]) {
                            handleFile(e.dataTransfer.files[0]);
                        }
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all ${
                        isDragging
                            ? 'border-blue-500 bg-blue-50/50'
                            : 'border-gray-200 bg-gray-50/50 hover:border-blue-400'
                    }`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={accept}
                        className="hidden"
                        onChange={(e) =>
                            e.target.files?.[0] && handleFile(e.target.files[0])
                        }
                    />
                    <UploadCloud className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                    <p className="text-sm font-medium text-gray-700">
                        Click or Drag & Drop File Here
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        Format: {accept} (Max.{maxSizeMB}MB)
                    </p>
                </div>
            )}

            {error && <p className="mt-1.5 text-xs text-rose-600">{error}</p>}
        </div>
    );
}
