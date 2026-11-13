import { usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import React, { useState } from 'react';
import ProfileDropdown from '@/components/UI/ProfileDropdown';
import ThemeToggle from '@/components/UI/ThemeToggle';
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
        <div className="min-h-screen bg-canvas font-sans text-ink antialiased">
            <header className="sticky top-0 z-40 border-b border-border bg-surface/95 text-ink shadow-sm backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between md:h-20">
                        <div className="flex shrink-0 items-center">
                            <HeaderLogo userName={user?.name} />
                        </div>

                        <div className="hidden md:block">
                            <Navbar currentUrl={url} categories={categories} />
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                            <ThemeToggle />
                            <ProfileDropdown user={user} />

                            <button
                                type="button"
                                onClick={() =>
                                    setIsMobileMenuOpen(!isMobileMenuOpen)
                                }
                                className="inline-flex cursor-pointer items-center justify-center rounded-control p-2 text-muted transition hover:bg-surface-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:hidden"
                                aria-expanded={isMobileMenuOpen}
                                aria-label="Toggle main menu"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="h-6 w-6"/>
                                ) : (
                                    <Menu className="h-6 w-6"/>
                                )}
                            </button>
                        </div>
                    </div>

                    {isMobileMenuOpen && (
                        <div className="animate-in slide-in-from-top-2 border-t border-border py-3 duration-200 md:hidden">
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
