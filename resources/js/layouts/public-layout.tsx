import { Link, usePage } from '@inertiajs/react';
import { Github, Moon, Sun, Twitter } from 'lucide-react';
import PostController from '@/actions/App/Http/Controllers/Blog/PostController';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import { login, register } from '@/routes';
import type { Auth } from '@/types';

function BrandMark({ className = 'h-7 w-7 text-[11px]' }: { className?: string }) {
    return (
        <span
            className={`relative flex items-center justify-center rounded-md bg-ink font-sans font-bold text-paper ${className}`}
        >
            Iw
            <span className="absolute right-1 bottom-1 h-1.5 w-1.5 rounded-full bg-brand" />
        </span>
    );
}

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const { appearance, updateAppearance } = useAppearance();

    function toggleTheme() {
        updateAppearance(appearance === 'dark' ? 'light' : 'dark');
    }

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
                <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
                    <Link href="/" className="group flex items-center gap-2.5">
                        <BrandMark />
                        <span className="font-display text-lg font-semibold tracking-tight">
                            Inkwell
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-6 text-sm md:flex">
                        <Link
                            href={PostController.index()}
                            prefetch
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Blog
                        </Link>
                        <Link
                            href="/about"
                            prefetch
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            About
                        </Link>
                        <Link
                            href="/contact"
                            prefetch
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Contact
                        </Link>
                    </nav>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="h-8 w-8"
                            aria-label="Toggle theme"
                        >
                            {appearance === 'dark' ? (
                                <Sun className="h-4 w-4" />
                            ) : (
                                <Moon className="h-4 w-4" />
                            )}
                        </Button>

                        {auth.user ? (
                            <Button asChild size="sm" variant="outline">
                                <Link href="/dashboard" prefetch>
                                    Dashboard
                                </Link>
                            </Button>
                        ) : (
                            <>
                                <Button asChild size="sm" variant="ghost">
                                    <Link href={login()} prefetch>
                                        Sign in
                                    </Link>
                                </Button>
                                <Button asChild size="sm">
                                    <Link href={register()} prefetch>
                                        Get started
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1">{children}</main>

            <footer className="border-t border-border/60 py-10">
                <div className="mx-auto max-w-6xl px-4 md:px-6">
                    <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:gap-4">
                        <div className="flex items-center gap-2.5">
                            <BrandMark className="h-6 w-6 text-[10px]" />
                            <span className="font-display text-sm font-semibold">
                                Inkwell
                            </span>
                        </div>

                        <nav className="flex gap-5 text-sm text-muted-foreground">
                            <Link
                                href={PostController.index()}
                                prefetch
                                className="hover:text-foreground"
                            >
                                Blog
                            </Link>
                            <Link
                                href="/about"
                                prefetch
                                className="hover:text-foreground"
                            >
                                About
                            </Link>
                            <Link
                                href="/contact"
                                prefetch
                                className="hover:text-foreground"
                            >
                                Contact
                            </Link>
                        </nav>

                        <div className="flex flex-col items-center gap-2 sm:items-end">
                            <div className="flex items-center gap-3">
                                <a
                                    href="https://github.com/Oladimeji402"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="GitHub"
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <Github className="h-4 w-4" />
                                </a>
                                <a
                                    href="https://x.com/bellosulai756"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="X / Twitter"
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <Twitter className="h-4 w-4" />
                                </a>
                                <a
                                    href="mailto:bellosulaimon177@gmail.com"
                                    aria-label="Email"
                                    className="text-xs text-muted-foreground hover:text-foreground"
                                >
                                    bellosulaimon177@gmail.com
                                </a>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                © {new Date().getFullYear()} Inkwell · Built by{' '}
                                <a
                                    href="https://oladimejiportfolio.vercel.app/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-foreground hover:underline"
                                >
                                    Bello Sulaimon
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
