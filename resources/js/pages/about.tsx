import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Github, Mail, Twitter } from 'lucide-react';
import PostController from '@/actions/App/Http/Controllers/Blog/PostController';
import { Button } from '@/components/ui/button';
import { register } from '@/routes';

export default function About() {
    return (
        <>
            <Head title="About" />

            <section className="border-b border-border/60">
                <div className="ink-grain mx-auto max-w-3xl px-4 py-20 md:px-6">
                    <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                        About
                    </p>
                    <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
                        Inkwell
                    </h1>
                    <p className="mt-5 max-w-xl text-lg text-muted-foreground">
                        A platform for writers who believe words still matter.
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-2xl px-4 py-16 md:px-6">
                <div className="prose max-w-none prose-neutral dark:prose-invert">
                    <h2>What is Inkwell?</h2>
                    <p>
                        Inkwell is a community blog where anyone can publish
                        thoughtful articles, follow writers they admire, and
                        join conversations that matter. We believe the internet
                        needs more long-form thinking — less noise, more depth.
                    </p>

                    <h2>Why we built it</h2>
                    <p>
                        Most platforms optimize for engagement over quality.
                        Inkwell flips that equation: a calm space to write, and
                        a quiet feed of human-authored work worth reading.
                    </p>

                    <h2>Built with</h2>
                    <p>
                        Laravel 13, Inertia.js, React 19, and Tailwind CSS v4 —
                        with Fortify auth (including 2FA and passkeys), file
                        uploads, and a full social layer for follows, likes, and
                        comments.
                    </p>

                    <h2>Who's behind it</h2>
                    <p>
                        Designed and built by{' '}
                        <a
                            href="https://oladimejiportfolio.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Bello Sulaimon
                        </a>
                        — end-to-end product work from schema and API design to
                        React architecture and visual craft.
                    </p>
                </div>

                <div className="mt-10 border border-border bg-muted/40 p-6">
                    <div className="flex items-center gap-5">
                        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ink font-display text-lg font-semibold text-paper">
                            BS
                            <span className="absolute right-1 bottom-1 h-2 w-2 rounded-full bg-brand" />
                        </div>
                        <div>
                            <p className="font-display text-lg font-semibold">
                                Bello Sulaimon
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Founder &amp; Developer
                            </p>
                        </div>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2 text-sm">
                        <a
                            href="https://oladimejiportfolio.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 border border-border bg-background px-3 py-1.5 text-muted-foreground hover:text-foreground"
                        >
                            Portfolio
                            <ArrowRight className="h-3 w-3" />
                        </a>
                        <a
                            href="mailto:bellosulaimon177@gmail.com"
                            className="inline-flex items-center gap-1.5 border border-border bg-background px-3 py-1.5 text-muted-foreground hover:text-foreground"
                        >
                            <Mail className="h-3.5 w-3.5" />
                            Email
                        </a>
                        <a
                            href="https://github.com/Oladimeji402"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 border border-border bg-background px-3 py-1.5 text-muted-foreground hover:text-foreground"
                        >
                            <Github className="h-3.5 w-3.5" />
                            GitHub
                        </a>
                        <a
                            href="https://x.com/bellosulai756"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 border border-border bg-background px-3 py-1.5 text-muted-foreground hover:text-foreground"
                        >
                            <Twitter className="h-3.5 w-3.5" />
                            @bellosulai756
                        </a>
                    </div>
                </div>

                <div className="mt-12 flex flex-wrap gap-3">
                    <Button asChild size="lg" className="gap-2">
                        <Link href={PostController.index()}>
                            Browse articles <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link href={register()}>Start writing</Link>
                    </Button>
                </div>
            </section>
        </>
    );
}
