import { Head, Link, router } from '@inertiajs/react';
import { FileText, PenLine, Plus, Rss, Send, Trash2 } from 'lucide-react';
import PostController from '@/actions/App/Http/Controllers/Blog/PostController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { dashboard } from '@/routes';
import type { Post } from '@/types';

type Stats = {
    published: number;
    drafts: number;
    total: number;
};

type Props = {
    stats: Stats;
    recentPosts: Pick<
        Post,
        'id' | 'title' | 'slug' | 'status' | 'published_at' | 'updated_at'
    >[];
};

export default function Dashboard({ stats, recentPosts }: Props) {
    function handlePublish(post: Props['recentPosts'][number]) {
        router.patch(
            PostController.publish.url(post),
            {},
            { preserveScroll: true },
        );
    }

    function handleDelete(post: Props['recentPosts'][number]) {
        if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) {
            return;
        }

        router.delete(PostController.destroy(post), { preserveScroll: true });
    }

    return (
        <>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Welcome */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Dashboard
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Here's what's going on with your blog.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={PostController.create()}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Post
                        </Link>
                    </Button>
                </div>

                {/* Stat cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Posts
                            </CardTitle>
                            <Rss className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats.total}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                all time
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Published
                            </CardTitle>
                            <Send className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">
                                {stats.published}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                <Link
                                    href={PostController.index()}
                                    className="hover:underline"
                                >
                                    View all posts →
                                </Link>
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Drafts
                            </CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats.drafts}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {stats.drafts > 0 ? (
                                    <Link
                                        href={PostController.drafts()}
                                        className="hover:underline"
                                    >
                                        Review drafts →
                                    </Link>
                                ) : (
                                    'Nothing waiting'
                                )}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Separator />

                {/* Recent posts */}
                <div className="flex flex-col gap-3">
                    <h2 className="text-base font-semibold">Recent Posts</h2>

                    {recentPosts.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
                            <p>You haven't written anything yet.</p>
                            <Button asChild variant="outline">
                                <Link href={PostController.create()}>
                                    Write your first post
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {recentPosts.map((post) => (
                                <div
                                    key={post.id}
                                    className="flex items-center gap-3 rounded-lg border px-4 py-3"
                                >
                                    {/* Title + meta */}
                                    <div className="min-w-0 flex-1">
                                        <Link
                                            href={PostController.show(post)}
                                            className="truncate font-medium hover:underline"
                                        >
                                            {post.title}
                                        </Link>
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            {post.published_at
                                                ? `Published ${new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                                                : `Edited ${new Date(post.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                                        </p>
                                    </div>

                                    {/* Status badge */}
                                    <Badge
                                        variant={
                                            post.status === 'published'
                                                ? 'default'
                                                : 'secondary'
                                        }
                                        className="shrink-0"
                                    >
                                        {post.status}
                                    </Badge>

                                    {/* Actions */}
                                    <div className="flex shrink-0 gap-1">
                                        {post.status === 'draft' && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 gap-1 px-2 text-xs"
                                                onClick={() =>
                                                    handlePublish(post)
                                                }
                                            >
                                                <Send className="h-3 w-3" />
                                                Publish
                                            </Button>
                                        )}
                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                        >
                                            <Link
                                                href={PostController.edit(post)}
                                            >
                                                <PenLine className="h-3.5 w-3.5" />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() => handleDelete(post)}
                                        >
                                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {recentPosts.length > 0 && (
                        <div className="pt-1">
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground"
                            >
                                <Link href={PostController.index()}>
                                    View all posts →
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard() }],
};
