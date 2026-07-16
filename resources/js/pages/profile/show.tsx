import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    CalendarDays,
    MessageCircle,
    ThumbsUp,
    UserCheck,
    UserPlus,
} from 'lucide-react';
import FollowController from '@/actions/App/Http/Controllers/Blog/FollowController';
import PostController from '@/actions/App/Http/Controllers/Blog/PostController';
import Pagination from '@/components/pagination';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Auth, Author, Paginated, Post } from '@/types';

type Props = {
    author: Author;
    posts: Paginated<Post>;
    isFollowing: boolean;
    isOwnProfile: boolean;
};

export default function ProfileShow({
    author,
    posts,
    isFollowing,
    isOwnProfile,
}: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;

    function handleFollow() {
        router.post(
            FollowController.store.url(author),
            {},
            { preserveScroll: true },
        );
    }

    function handleUnfollow() {
        router.delete(FollowController.destroy.url(author), {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title={`${author.name}`} />

            <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
                {/* ── Profile card ── */}
                <div className="mb-8 flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-5">
                        {/* Avatar */}
                        <div className="shrink-0">
                            {author.avatar_url ? (
                                <img
                                    src={author.avatar_url}
                                    alt={author.name}
                                    className="h-20 w-20 rounded-full object-cover ring-2 ring-border"
                                />
                            ) : (
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground ring-2 ring-border">
                                    {author.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        {/* Name + bio + joined */}
                        <div className="flex flex-col gap-1.5">
                            <h1 className="text-2xl leading-tight font-bold">
                                {author.name}
                            </h1>
                            {author.bio && (
                                <p className="max-w-sm text-sm text-muted-foreground">
                                    {author.bio}
                                </p>
                            )}
                            <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                <CalendarDays className="h-3.5 w-3.5" />
                                Joined{' '}
                                {new Date(author.created_at).toLocaleDateString(
                                    'en-US',
                                    {
                                        month: 'long',
                                        year: 'numeric',
                                    },
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Follow / own profile */}
                    {auth.user && !isOwnProfile && (
                        <div className="shrink-0">
                            {isFollowing ? (
                                <Button
                                    variant="outline"
                                    className="gap-2"
                                    onClick={handleUnfollow}
                                >
                                    <UserCheck className="h-4 w-4" />
                                    Following
                                </Button>
                            ) : (
                                <Button
                                    className="gap-2"
                                    onClick={handleFollow}
                                >
                                    <UserPlus className="h-4 w-4" />
                                    Follow
                                </Button>
                            )}
                        </div>
                    )}
                    {isOwnProfile && (
                        <Button asChild variant="outline" size="sm">
                            <Link href="/settings/profile">Edit profile</Link>
                        </Button>
                    )}
                </div>

                {/* ── Stats row ── */}
                <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                        { label: 'Posts', value: author.posts_count },
                        { label: 'Followers', value: author.followers_count },
                        { label: 'Following', value: author.following_count },
                        {
                            label: 'Total Likes',
                            value: author.total_likes,
                            icon: (
                                <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                            ),
                        },
                    ].map((s) => (
                        <div
                            key={s.label}
                            className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card py-4 shadow-sm"
                        >
                            {s.icon && s.icon}
                            <p className="text-2xl font-bold">{s.value}</p>
                            <p className="text-xs text-muted-foreground">
                                {s.label}
                            </p>
                        </div>
                    ))}
                </div>

                <Separator className="mb-8" />

                {/* ── Posts ── */}
                <h2 className="mb-5 text-lg font-semibold">Published Posts</h2>

                {posts.data.length === 0 ? (
                    <p className="py-16 text-center text-muted-foreground">
                        No published posts yet.
                    </p>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.data.map((post) => (
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
                                    <p className="text-xs text-muted-foreground">
                                        {post.published_at &&
                                            new Date(
                                                post.published_at,
                                            ).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                    </p>
                                </CardHeader>

                                {post.excerpt && (
                                    <CardContent className="flex-1 py-0">
                                        <p className="line-clamp-3 text-sm text-muted-foreground">
                                            {post.excerpt}
                                        </p>
                                    </CardContent>
                                )}

                                <CardFooter className="mt-auto flex items-center justify-between pt-4">
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={PostController.show(post)}>
                                            Read
                                        </Link>
                                    </Button>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <ThumbsUp className="h-3.5 w-3.5" />
                                            {post.likes_count ?? 0}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MessageCircle className="h-3.5 w-3.5" />
                                            {post.comments_count ?? 0}
                                        </span>
                                    </div>
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
