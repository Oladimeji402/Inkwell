import { Head, Link, router } from '@inertiajs/react';
import { PenLine, Send, Trash2 } from 'lucide-react';
import PostController from '@/actions/App/Http/Controllers/Blog/PostController';
import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Paginated, Post } from '@/types';

type Props = {
    drafts: Paginated<Post>;
};

export default function BlogDrafts({ drafts }: Props) {
    function handlePublish(post: Post) {
        router.patch(
            PostController.publish.url(post),
            {},
            { preserveScroll: true },
        );
    }

    function handleDelete(post: Post) {
        if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) {
            return;
        }

        router.delete(PostController.destroy(post), { preserveScroll: true });
    }

    return (
        <>
            <Head title="Drafts" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-display text-2xl font-semibold tracking-tight">
                            Drafts
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {drafts.total === 0
                                ? 'No drafts yet.'
                                : `${drafts.total} unpublished post${drafts.total !== 1 ? 's' : ''}`}
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={PostController.create()}>New Post</Link>
                    </Button>
                </div>

                <Separator />

                {/* Empty state */}
                {drafts.data.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-20 text-center text-muted-foreground">
                        <FileTextIcon className="h-10 w-10 opacity-30" />
                        <p className="text-lg font-medium">
                            All caught up — no drafts.
                        </p>
                        <Button asChild variant="outline">
                            <Link href={PostController.create()}>
                                Start writing
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {drafts.data.map((post) => (
                            <Card
                                key={post.id}
                                className="flex flex-col sm:flex-row sm:items-center sm:gap-4"
                            >
                                {/* Cover thumbnail */}
                                {post.cover_image_url && (
                                    <img
                                        src={post.cover_image_url}
                                        alt={post.title}
                                        className="h-32 w-full rounded-t-xl object-cover sm:h-20 sm:w-28 sm:rounded-l-xl sm:rounded-tr-none"
                                    />
                                )}

                                {/* Content */}
                                <CardHeader className="flex-1 pt-4 pb-0 sm:py-4">
                                    <div className="flex items-start gap-2">
                                        <div className="flex-1">
                                            <Link
                                                href={PostController.show(post)}
                                                className="line-clamp-1 font-semibold hover:underline"
                                            >
                                                {post.title}
                                            </Link>
                                            {post.excerpt && (
                                                <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                                                    {post.excerpt}
                                                </p>
                                            )}
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Last edited{' '}
                                                {new Date(
                                                    post.updated_at,
                                                ).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                        <Badge
                                            variant="secondary"
                                            className="shrink-0"
                                        >
                                            draft
                                        </Badge>
                                    </div>
                                </CardHeader>

                                {/* Actions */}
                                <CardFooter className="flex gap-2 pt-3 pb-4 sm:py-0 sm:pr-4">
                                    <Button
                                        size="sm"
                                        className="gap-1.5"
                                        onClick={() => handlePublish(post)}
                                    >
                                        <Send className="h-3.5 w-3.5" />
                                        Publish
                                    </Button>
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={PostController.edit(post)}>
                                            <PenLine className="h-3.5 w-3.5" />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(post)}
                                    >
                                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                <Pagination
                    links={drafts.links}
                    prevUrl={drafts.prev_page_url}
                    nextUrl={drafts.next_page_url}
                    currentPage={drafts.current_page}
                    lastPage={drafts.last_page}
                    from={drafts.from}
                    to={drafts.to}
                    total={drafts.total}
                />
            </div>
        </>
    );
}

// Inline icon to avoid an extra import
function FileTextIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M10 9H8" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
        </svg>
    );
}

BlogDrafts.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Blog', href: PostController.index() },
        { title: 'Drafts', href: PostController.drafts() },
    ],
};
