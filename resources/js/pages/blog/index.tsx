import { Head, Link, usePage } from '@inertiajs/react';
import {
    MessageCircle,
    PenLine,
    Plus,
    Send,
    ThumbsUp,
    Trash2,
} from 'lucide-react';
import PostController from '@/actions/App/Http/Controllers/Blog/PostController';
import PublicProfileController from '@/actions/App/Http/Controllers/PublicProfileController';
import Pagination from '@/components/pagination';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Auth, Paginated, Post } from '@/types';

type Props = {
    posts: Paginated<Post>;
};

export default function BlogIndex({ posts }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;

    function handleDelete(post: Post) {
        if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) {
            return;
        }

        router.delete(PostController.destroy(post), { preserveScroll: true });
    }

    function handlePublish(post: Post) {
        router.patch(
            PostController.publish.url(post),
            {},
            { preserveScroll: true },
        );
    }

    return (
        <>
            <Head title="Blog" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Blog
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {posts.total} published post
                            {posts.total !== 1 ? 's' : ''}
                        </p>
                    </div>
                    {auth.user && (
                        <Button asChild>
                            <Link href={PostController.create()}>
                                <Plus className="mr-2 h-4 w-4" />
                                New Post
                            </Link>
                        </Button>
                    )}
                </div>

                <Separator />

                {/* Post grid */}
                {posts.data.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-20 text-center text-muted-foreground">
                        <p className="text-lg font-medium">No posts yet.</p>
                        {auth.user && (
                            <Button asChild variant="outline">
                                <Link href={PostController.create()}>
                                    Write the first post
                                </Link>
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.data.map((post) => (
                            <Card key={post.id} className="flex flex-col">
                                {post.cover_image_url && (
                                    <img
                                        src={post.cover_image_url}
                                        alt={post.title}
                                        className="h-40 w-full rounded-t-xl object-cover"
                                    />
                                )}

                                <CardHeader className="pb-2">
                                    <Link
                                        href={PostController.show(post)}
                                        className="line-clamp-2 text-base leading-snug font-semibold hover:underline"
                                    >
                                        {post.title}
                                    </Link>
                                    {/* Author link */}
                                    <p className="text-xs text-muted-foreground">
                                        by{' '}
                                        <Link
                                            href={PublicProfileController.show.url(
                                                post.author!,
                                            )}
                                            className="font-medium hover:underline"
                                        >
                                            {post.author?.name}
                                        </Link>
                                        {post.published_at && (
                                            <>
                                                {' '}
                                                &middot;{' '}
                                                {new Date(
                                                    post.published_at,
                                                ).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </>
                                        )}
                                    </p>
                                </CardHeader>

                                {post.excerpt && (
                                    <CardContent className="flex-1 py-0">
                                        <p className="line-clamp-3 text-sm text-muted-foreground">
                                            {post.excerpt}
                                        </p>
                                    </CardContent>
                                )}

                                <CardFooter className="mt-auto flex items-center justify-between gap-2 pt-4">
                                    <div className="flex items-center gap-3">
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                        >
                                            <Link
                                                href={PostController.show(post)}
                                            >
                                                Read
                                            </Link>
                                        </Button>
                                        {/* Engagement counts */}
                                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <ThumbsUp className="h-3.5 w-3.5" />
                                            {post.likes_count ?? 0}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <MessageCircle className="h-3.5 w-3.5" />
                                            {post.comments_count ?? 0}
                                        </span>
                                    </div>

                                    {/* Owner actions */}
                                    {auth.user?.id === post.user_id && (
                                        <div className="flex items-center gap-1">
                                            {post.status === 'draft' && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        handlePublish(post)
                                                    }
                                                    title="Publish"
                                                >
                                                    <Send className="h-3.5 w-3.5" />
                                                </Button>
                                            )}
                                            <Button
                                                asChild
                                                variant="ghost"
                                                size="sm"
                                            >
                                                <Link
                                                    href={PostController.edit(
                                                        post,
                                                    )}
                                                >
                                                    <PenLine className="h-3.5 w-3.5" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleDelete(post)
                                                }
                                            >
                                                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                            </Button>
                                        </div>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                <Pagination
                    links={posts.links}
                    prevUrl={posts.prev_page_url}
                    nextUrl={posts.next_page_url}
                    currentPage={posts.current_page}
                    lastPage={posts.last_page}
                    from={posts.from}
                    to={posts.to}
                    total={posts.total}
                />
            </div>
        </>
    );
}
