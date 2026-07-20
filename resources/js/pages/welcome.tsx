import { Head, Link } from '@inertiajs/react';
import { ArrowRight, MessageCircle, ThumbsUp } from 'lucide-react';
import PostController from '@/actions/App/Http/Controllers/Blog/PostController';
import PublicProfileController from '@/actions/App/Http/Controllers/PublicProfileController';
import CoverFallback from '@/components/cover-fallback';
import { Button } from '@/components/ui/button';
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

            {/* ── Hero: brand-first, one composition ─────────────────────── */}
            <section className="relative overflow-hidden border-b border-border/60">
                <div
                    aria-hidden
                    className="ink-grain absolute inset-0 bg-background"
                />
                <div
                    aria-hidden
                    className="absolute inset-y-0 right-0 hidden w-1/2 bg-ink md:block"
                >
                    <div className="ink-grain absolute inset-0 opacity-40" />
                    <div className="absolute inset-0 flex items-end justify-end p-10 lg:p-16">
                        <p className="max-w-xs text-right font-display text-2xl leading-snug text-paper/80 italic lg:text-3xl">
                            Less noise.
                            <br />
                            More depth.
                        </p>
                    </div>
                    <span className="absolute top-12 right-12 h-3 w-3 rounded-full bg-brand" />
                </div>

                <div className="relative mx-auto max-w-6xl px-4 py-24 md:px-6 md:py-32 lg:py-36">
                    <div className="max-w-xl md:max-w-[48%]">
                        <p className="animate-fade-up font-display text-5xl font-semibold tracking-tight text-foreground md:text-6xl lg:text-7xl">
                            Inkwell
                        </p>

                        <h1
                            className="animate-fade-up mt-6 font-display text-3xl font-medium tracking-tight text-foreground md:text-4xl"
                            style={{ animationDelay: '80ms' }}
                        >
                            Ideas worth{' '}
                            <span className="relative inline-block">
                                <span className="relative z-10">sharing.</span>
                                <span
                                    aria-hidden
                                    className="animate-ink-underline absolute bottom-1 left-0 z-0 h-2.5 w-full bg-brand/70"
                                />
                            </span>
                        </h1>

                        <p
                            className="animate-fade-up mt-5 max-w-md text-base text-muted-foreground md:text-lg"
                            style={{ animationDelay: '160ms' }}
                        >
                            A calm place for long-form writing — discover
                            stories, follow authors, and publish work that lasts.
                        </p>

                        <div
                            className="animate-fade-up mt-10 flex flex-wrap items-center gap-3"
                            style={{ animationDelay: '240ms' }}
                        >
                            <Button asChild size="lg" className="gap-2">
                                <Link href={PostController.index()}>
                                    Start reading
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline">
                                <Link href={register()}>Start writing</Link>
                            </Button>
                        </div>

                        {(stats.posts > 0 || stats.authors > 0) && (
                            <p
                                className="animate-fade-up mt-8 text-sm text-muted-foreground"
                                style={{ animationDelay: '320ms' }}
                            >
                                {stats.posts}{' '}
                                {stats.posts === 1 ? 'article' : 'articles'}
                                {' · '}
                                {stats.authors}{' '}
                                {stats.authors === 1 ? 'author' : 'authors'}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* ── Featured ───────────────────────────────────────────────── */}
            {hero && (
                <section className="border-b border-border/60 bg-muted/40">
                    <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
                        <p className="mb-6 text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
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
                                    className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                                />
                            ) : (
                                <CoverFallback
                                    title={hero.title}
                                    className="aspect-[16/10] w-full"
                                />
                            )}
                            <div className="flex flex-col justify-center gap-4">
                                <h2 className="font-display text-3xl font-semibold tracking-tight decoration-brand decoration-2 underline-offset-4 group-hover:underline md:text-4xl">
                                    {hero.title}
                                </h2>
                                {hero.excerpt && (
                                    <p className="line-clamp-3 text-base text-muted-foreground">
                                        {hero.excerpt}
                                    </p>
                                )}
                                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
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

            {/* ── Recent ─────────────────────────────────────────────────── */}
            {rest.length > 0 && (
                <section className="border-b border-border/60">
                    <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
                        <div className="mb-8 flex items-center justify-between">
                            <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
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

                        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                            {rest.map((post) => (
                                <article
                                    key={post.id}
                                    className="group flex flex-col gap-4"
                                >
                                    <Link href={PostController.show(post)}>
                                        {post.cover_image_url ? (
                                            <img
                                                src={post.cover_image_url}
                                                alt={post.title}
                                                className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                                            />
                                        ) : (
                                            <CoverFallback
                                                title={post.title}
                                                className="aspect-[16/10] w-full"
                                            />
                                        )}
                                    </Link>

                                    <div className="flex flex-1 flex-col gap-2">
                                        <Link
                                            href={PostController.show(post)}
                                            className="font-display text-xl font-semibold leading-snug tracking-tight group-hover:underline group-hover:decoration-brand group-hover:underline-offset-4"
                                        >
                                            {post.title}
                                        </Link>
                                        {post.author && (
                                            <Link
                                                href={PublicProfileController.show.url(
                                                    post.author,
                                                )}
                                                className="text-xs text-muted-foreground hover:text-foreground"
                                            >
                                                {post.author.name}
                                            </Link>
                                        )}
                                        {post.excerpt && (
                                            <p className="line-clamp-2 text-sm text-muted-foreground">
                                                {post.excerpt}
                                            </p>
                                        )}
                                        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
                                            <span>
                                                {post.published_at &&
                                                    new Date(
                                                        post.published_at,
                                                    ).toLocaleDateString(
                                                        'en-US',
                                                        {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        },
                                                    )}
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
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Quiet CTA ──────────────────────────────────────────────── */}
            <section className="border-b border-border/60">
                <div className="mx-auto max-w-6xl px-4 py-20 md:px-6">
                    <div className="max-w-2xl border-l-2 border-brand pl-6 md:pl-8">
                        <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
                            Ready to share your story?
                        </h2>
                        <p className="mt-3 text-muted-foreground">
                            Join Inkwell — free to read and write.
                        </p>
                        <Button asChild size="lg" className="mt-8 gap-2">
                            <Link href={register()}>
                                Create your account
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
}
