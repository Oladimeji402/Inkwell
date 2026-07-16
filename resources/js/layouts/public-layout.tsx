import { Link, usePage } from '@inertiajs/react';
import { Github, Moon, Sun, Twitter } from 'lucide-react';
import PostController from '@/actions/App/Http/Controllers/Blog/PostController';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import { login, register } from '@/routes';
import type { Auth } from '@/types';

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
            {/* ── Navbar ── */}
            <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
                <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
                    {/* Logo */}
                    <Link href="/" className="group flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-xs font-bold text-background transition-transform group-hover:scale-110">
                            Iw
                        </span>
                        <span className="font-semibold tracking-tight">
                            Inkwell
                        </span>
                    </Link>

                    {/* Nav links */}
                    <nav className="hidden items-center gap-6 text-sm md:flex">
                        <Link
                            href={PostController.index()}
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Blog
                        </Link>
                        <Link
                            href="/about"
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            About
                        </Link>
                        <Link
                            href="/contact"
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Contact
                        </Link>
                    </nav>

                    {/* Right actions */}
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
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Button asChild size="sm" variant="ghost">
                                    <Link href={login()}>Sign in</Link>
                                </Button>
                                <Button asChild size="sm">
                                    <Link href={register()}>Get started</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* ── Page content ── */}
            <main className="flex-1">{children}</main>

            {/* ── Footer ── */}
            <footer className="border-t border-border/60 py-8">
                <div className="mx-auto max-w-6xl px-4 md:px-6">
                    <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:gap-4">
                        {/* Brand */}
                        <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded bg-foreground text-[10px] font-bold text-background">
                                Iw
                            </span>
                            <span className="text-sm font-medium">Inkwell</span>
                        </div>

                        {/* Nav links */}
                        <nav className="flex gap-5 text-sm text-muted-foreground">
                            <Link
                                href={PostController.index()}
                                className="hover:text-foreground"
                            >
                                Blog
                            </Link>
                            <Link
                                href="/about"
                                className="hover:text-foreground"
                            >
                                About
                            </Link>
                            <Link
                                href="/contact"
                                className="hover:text-foreground"
                            >
                                Contact
                            </Link>
                        </nav>

                        {/* Social + credit */}
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
