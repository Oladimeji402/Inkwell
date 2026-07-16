import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import PostController from '@/actions/App/Http/Controllers/Blog/PostController';
import { Button } from '@/components/ui/button';
import { register } from '@/routes';

export default function About() {
    return (
        <>
            <Head title="About" />

            {/* Hero */}
            <section className="border-b border-border/60 bg-muted/30">
                <div className="mx-auto max-w-3xl px-4 py-20 text-center md:px-6">
                    <span className="mb-4 inline-block rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                        Our story
                    </span>
                    <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
                        About Inkwell
                    </h1>
                    <p className="mt-5 text-lg text-muted-foreground">
                        A platform built for writers who believe words still
                        matter.
                    </p>
                </div>
            </section>

            {/* Body */}
            <section className="mx-auto max-w-2xl px-4 py-16 md:px-6">
                <div className="prose max-w-none prose-neutral dark:prose-invert">
                    <h2>What is Inkwell?</h2>
                    <p>
                        Inkwell is an open, community-driven blog platform where
                        anyone can publish thoughtful articles, follow writers
                        they admire, and join conversations that matter. We
                        believe the internet needs more long-form thinking —
                        less noise, more depth.
                    </p>

                    <h2>Why we built it</h2>
                    <p>
                        Most modern platforms optimize for engagement over
                        quality. Inkwell flips that equation. We give writers a
                        clean, distraction-free space to express themselves, and
                        readers a calm feed of curated, human-authored content.
                    </p>

                    <h2>The tech</h2>
                    <p>
                        Inkwell is built on <strong>Laravel 13</strong> with an{' '}
                        <strong>Inertia.js + React 19</strong> frontend. The UI
                        uses <strong>Tailwind CSS v4</strong> and shadcn/ui
                        components. It's open source and a portfolio
                        demonstration of modern full-stack development practices
                        — authentication, authorization, file uploads,
                        real-time-style interactions, and clean REST API design.
                    </p>

                    <h2>Who's behind it</h2>
                    <p>
                        Inkwell was designed and built by{' '}
                        <a
                            href="https://oladimejiportfolio.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-foreground underline underline-offset-4 hover:opacity-80"
                        >
                            Bello Sulaimon
                        </a>
                        , a full-stack developer passionate about building
                        products that are both technically solid and delightful
                        to use. This project demonstrates end-to-end product
                        development — from database schema and Laravel API
                        design to React component architecture and UX polish.
                    </p>
                </div>

                {/* Founder card */}
                <div className="mt-10 rounded-2xl border border-border bg-muted/40 p-6">
                    <div className="flex items-center gap-5">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-foreground text-lg font-bold text-background">
                            BS
                        </div>
                        <div>
                            <p className="font-semibold">Bello Sulaimon</p>
                            <p className="text-sm text-muted-foreground">
                                Founder &amp; Developer
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm">
                        <a
                            href="https://oladimejiportfolio.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-muted-foreground hover:text-foreground"
                        >
                            🌐 Portfolio ↗
                        </a>
                        <a
                            href="mailto:bellosulaimon177@gmail.com"
                            className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-muted-foreground hover:text-foreground"
                        >
                            ✉️ bellosulaimon177@gmail.com
                        </a>
                        <a
                            href="https://github.com/Oladimeji402"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-muted-foreground hover:text-foreground"
                        >
                            GitHub ↗
                        </a>
                        <a
                            href="https://x.com/bellosulai756"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-muted-foreground hover:text-foreground"
                        >
                            𝕏 @bellosulai756 ↗
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
