import { usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import React, { useState } from 'react';
import ProfileDropdown from '@/components/UI/ProfileDropdown';
import { useAuth } from '@/hooks/useAuth';
import HeaderLogo from '../../components/Student/HeaderLogo';
import Navbar from '../../components/Student/Navbar';

interface Props {
    children: React.ReactNode;
}

export default function Layout({ children }: Props) {
    const { user } = useAuth();
    const { url, props } = usePage() as any;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const categories = props.auth?.user?.course_categories ?? [];

    return (
        <div className="min-h-screen bg-[#FFF8ED] font-sans text-[#24458F] antialiased dark:bg-slate-950 dark:text-slate-100">
            <header className="sticky top-0 z-40 border-b border-[#24458F]/8 bg-[#FFF8ED]/92 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/92">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between md:h-20">
                        <div className="flex shrink-0 items-center">
                            <HeaderLogo userName={user?.name} />
                        </div>

                        <div className="hidden md:block">
                            <Navbar currentUrl={url} categories={categories} />
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                            <ProfileDropdown user={user} />

                            <button
                                type="button"
                                onClick={() =>
                                    setIsMobileMenuOpen(!isMobileMenuOpen)
                                }
                                className="inline-flex cursor-pointer items-center justify-center rounded-xl p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none md:hidden dark:text-slate-300 dark:hover:bg-slate-800"
                                aria-expanded={isMobileMenuOpen}
                                aria-label="Toggle main menu"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>

                    {isMobileMenuOpen && (
                        <div className="animate-in slide-in-from-top-2 border-t border-gray-100 py-3 duration-200 md:hidden dark:border-slate-800">
                            <Navbar
                                currentUrl={url}
                                categories={categories}
                                isMobile
                                onItemClick={() => setIsMobileMenuOpen(false)}
                            />
                        </div>
                    )}
                </div>
            </header>

            <main className="animate-fade-in mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                {children}
            </main>
        </div>
    );
}
