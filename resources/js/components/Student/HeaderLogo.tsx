import React from 'react';

interface HeaderLogoProps {
    userName?: string;
}

export default function HeaderLogo({ userName }: HeaderLogoProps) {
    return (
        <div className="flex w-full items-center gap-3 md:w-auto">
            <div className="flex size-10 items-center justify-center rounded-control bg-brand-strong font-bold text-on-brand">
                TW
            </div>
            <div>
                <h1 className="max-w-45 truncate text-base font-bold text-brand-strong">
                    {userName ?? 'User'}
                </h1>
                <p className="text-[10px] tracking-widest text-muted uppercase">
                    Taiwan Global Talent
                </p>
            </div>
        </div>
    );
}
