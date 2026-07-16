import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    MessageCircle,
    ThumbsUp,
    Users,
    FileText,
} from 'lucide-react';
import PostController from '@/actions/App/Http/Controllers/Blog/PostController';
import PublicProfileController from '@/actions/App/Http/Controllers/PublicProfileController';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { register } from '@/routes';
import type { Post } from '@/types';

type Stats = { posts: number; authors: number };
type Props = { featured: Post[]; stats: Stats };

export default function Welcome({ featured, stats }: Props) {
    const hero = featured[0] ?? null;
    const rest = featured.slice(1, 6);

    return (
        <>
            <Head title="Home" />

            {/* ── Hero ────────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden border-b border-border/60 bg-background">
                {/* subtle grid background */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
                    style={{
                        backgroundImage:
                            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                    }}
                />

                <div className="relative mx-auto max-w-6xl px-4 py-24 md:px-6 md:py-36">
                    <div className="mx-auto max-w-3xl text-center">
                        {/* pill badge */}
                        <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            {stats.posts} published articles by {stats.authors}{' '}
                            {stats.authors === 1 ? 'author' : 'authors'}
                        </span>

                        <h1 className="mt-2 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                            Ideas worth{' '}
                            <span className="relative inline-block">
                                <span className="relative z-10">sharing.</span>
                                <span
                                    aria-hidden
                                    className="absolute bottom-1 left-0 z-0 h-3 w-full -rotate-1 bg-foreground/10 dark:bg-foreground/20"
                                />
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
                            Inkwell is a place for thoughtful writing. Discover
                            stories, follow writers you love, and share your own
                            perspective with the world.
                        </p>

                        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                            <Button asChild size="lg" className="gap-2">
                                <Link href={PostController.index()}>
                                    Start reading
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline">
                                <Link href={register()}>Write for free</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Featured hero post ──────────────────────────────────────── */}
            {hero && (
                <section className="border-b border-border/60 bg-muted/30">
                    <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
                        <p className="mb-6 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                            Featured
                        </p>
                        <Link
                            href={PostController.show(hero)}
                            className="group grid gap-6 md:grid-cols-2 md:gap-10"
                        >
                            {hero.cover_image_url ? (
                                <img
                                    src={hero.cover_image_url}
                                    alt={hero.title}
                                    className="aspect-video w-full rounded-xl object-cover shadow-sm transition-transform duration-300 group-hover:scale-[1.01]"
                                />
                            ) : (
                                <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-muted text-4xl shadow-sm">
                                    ✍️
                                </div>
                            )}
                            <div className="flex flex-col justify-center gap-4">
                                <h2 className="text-3xl font-bold tracking-tight decoration-2 underline-offset-4 group-hover:underline md:text-4xl">
                                    {hero.title}
                                </h2>
                                {hero.excerpt && (
                                    <p className="line-clamp-3 text-base text-muted-foreground">
                                        {hero.excerpt}
                                    </p>
                                )}
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    {hero.author && (
                                        <Link
                                            href={PublicProfileController.show.url(
                                                hero.author,
                                            )}
                                            onClick={(e) => e.stopPropagation()}
                                            className="font-medium text-foreground hover:underline"
                                        >
                                            {hero.author.name}
                                        </Link>
                                    )}
                                    {hero.published_at && (
                                        <span>
                                            {new Date(
                                                hero.published_at,
                                            ).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1">
                                        <ThumbsUp className="h-3.5 w-3.5" />
                                        {hero.likes_count ?? 0}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageCircle className="h-3.5 w-3.5" />
                                        {hero.comments_count ?? 0}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>
                </section>
            )}

            {/* ── Recent posts grid ───────────────────────────────────────── */}
            {rest.length > 0 && (
                <section className="border-b border-border/60">
                    <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
                        <div className="mb-8 flex items-center justify-between">
                            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                                Recent
                            </p>
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="gap-1 text-xs"
                            >
                                <Link href={PostController.index()}>
                                    View all <ArrowRight className="h-3 w-3" />
                                </Link>
                            </Button>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {rest.map((post) => (
                                <Card
                                    key={post.id}
                                    className="group flex flex-col overflow-hidden transition-shadow hover:shadow-md"
                                >
                                    {post.cover_image_url ? (
                                        <img
                                            src={post.cover_image_url}
                                            alt={post.title}
                                            className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                                        />
                                    ) : (
                                        <div className="flex h-44 w-full items-center justify-center bg-muted text-3xl">
                                            ✍️
                                        </div>
                                    )}

                                    <CardHeader className="pb-2">
                                        <Link
                                            href={PostController.show(post)}
                                            className="line-clamp-2 leading-snug font-semibold group-hover:underline"
                                        >
                                            {post.title}
                                        </Link>
                                        {post.author && (
                                            <Link
                                                href={PublicProfileController.show.url(
                                                    post.author,
                                                )}
                                                className="text-xs text-muted-foreground hover:underline"
                                            >
                                                by {post.author.name}
                                            </Link>
                                        )}
                                    </CardHeader>

                                    {post.excerpt && (
                                        <CardContent className="flex-1 py-0">
                                            <p className="line-clamp-2 text-sm text-muted-foreground">
                                                {post.excerpt}
                                            </p>
                                        </CardContent>
                                    )}

                                    <CardFooter className="mt-auto flex items-center justify-between pt-4 text-xs text-muted-foreground">
                                        <span>
                                            {post.published_at &&
                                                new Date(
                                                    post.published_at,
                                                ).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center gap-1">
                                                <ThumbsUp className="h-3 w-3" />
                                                {post.likes_count ?? 0}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MessageCircle className="h-3 w-3" />
                                                {post.comments_count ?? 0}
                                            </span>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Why Inkwell ─────────────────────────────────────────────── */}
            <section className="border-b border-border/60 bg-muted/20">
                <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
                    <div className="grid gap-8 sm:grid-cols-3">
                        {[
                            {
                                icon: <FileText className="h-6 w-6" />,
                                title: 'Write freely',
                                body: 'A distraction-free editor lets you focus on what matters — your words.',
                            },
                            {
                                icon: <Users className="h-6 w-6" />,
                                title: 'Build an audience',
                                body: 'Followers, likes, and comments help your best work find the people who need it.',
                            },
                            {
                                icon: <ThumbsUp className="h-6 w-6" />,
                                title: 'Discover great reads',
                                body: 'A curated feed surfaces ideas from writers across every topic.',
                            },
                        ].map((f) => (
                            <div key={f.title} className="flex flex-col gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground text-background">
                                    {f.icon}
                                </div>
                                <h3 className="font-semibold">{f.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {f.body}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ─────────────────────────────────────────────────────── */}
            <section className="bg-foreground text-background">
                <div className="mx-auto max-w-6xl px-4 py-20 text-center md:px-6">
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                        Ready to share your story?
                    </h2>
                    <p className="mt-3 text-base opacity-70">
                        Join Inkwell — it's free, forever.
                    </p>
                    <Button
                        asChild
                        size="lg"
                        variant="secondary"
                        className="mt-8 gap-2"
                    >
                        <Link href={register()}>
                            Create your account
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </section>
        </>
    );
}
