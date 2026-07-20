import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    MessageCircle,
    PenLine,
    Send,
    ThumbsUp,
    Trash2,
    Undo2,
    UserCheck,
    UserPlus,
} from 'lucide-react';
import CommentController from '@/actions/App/Http/Controllers/Blog/CommentController';
import FollowController from '@/actions/App/Http/Controllers/Blog/FollowController';
import LikeController from '@/actions/App/Http/Controllers/Blog/LikeController';
import PostController from '@/actions/App/Http/Controllers/Blog/PostController';
import PublicProfileController from '@/actions/App/Http/Controllers/PublicProfileController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import type { Auth, Comment, Post } from '@/types';

type Props = {
    post: Post;
    comments: Comment[];
    canEdit: boolean;
    liked: boolean;
    isFollowingAuthor: boolean;
    authorFollowersCount: number;
};

export default function BlogShow({
    post,
    comments,
    canEdit,
    liked,
    isFollowingAuthor,
    authorFollowersCount,
}: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const isOwner = auth.user?.id === post.user_id;

    const commentForm = useForm({ body: '' });

    // ── Post actions ──────────────────────────────────────────────────────

    function handleDelete() {
        if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) {
            return;
        }

        router.delete(PostController.destroy(post));
    }

    function handlePublish() {
        router.patch(PostController.publish.url(post));
    }

    function handleUnpublish() {
        router.patch(PostController.unpublish.url(post));
    }

    // ── Like ──────────────────────────────────────────────────────────────

    function handleLike() {
        if (!auth.user) {
            return router.visit('/login');
        }

        if (liked) {
            router.delete(LikeController.destroy.url(post), {
                preserveScroll: true,
            });
        } else {
            router.post(
                LikeController.store.url(post),
                {},
                { preserveScroll: true },
            );
        }
    }

    // ── Follow ────────────────────────────────────────────────────────────

    function handleFollow() {
        if (!auth.user) {
            return router.visit('/login');
        }

        if (isFollowingAuthor) {
            router.delete(FollowController.destroy.url(post.author!), {
                preserveScroll: true,
            });
        } else {
            router.post(
                FollowController.store.url(post.author!),
                {},
                { preserveScroll: true },
            );
        }
    }

    // ── Comment ───────────────────────────────────────────────────────────

    function handleComment(e: React.FormEvent) {
        e.preventDefault();
        commentForm.post(CommentController.store.url(post), {
            preserveScroll: true,
            onSuccess: () => commentForm.reset(),
        });
    }

    function handleDeleteComment(comment: Comment) {
        router.delete(CommentController.destroy.url([post, comment]), {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title={post.title} />

            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 md:p-8">
                {/* Cover image */}
                {post.cover_image_url && (
                    <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="h-64 w-full rounded-xl object-cover"
                    />
                )}

                {/* Meta row */}
                <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge
                            variant={
                                post.status === 'published'
                                    ? 'default'
                                    : 'secondary'
                            }
                        >
                            {post.status}
                        </Badge>
                        {post.published_at && (
                            <span className="text-sm text-muted-foreground">
                                {new Date(post.published_at).toLocaleDateString(
                                    'en-US',
                                    {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric',
                                    },
                                )}
                            </span>
                        )}
                    </div>

                    <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
                        {post.title}
                    </h1>

                    {post.excerpt && (
                        <p className="text-lg text-muted-foreground">
                            {post.excerpt}
                        </p>
                    )}

                    {/* Author card */}
                    {post.author && (
                        <div className="mt-2 flex items-center justify-between rounded-lg border px-4 py-3">
                            <Link
                                href={PublicProfileController.show.url(
                                    post.author,
                                )}
                                className="flex items-center gap-3 hover:opacity-80"
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                                    {post.author.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">
                                        {post.author.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {authorFollowersCount}{' '}
                                        {authorFollowersCount === 1
                                            ? 'follower'
                                            : 'followers'}
                                    </p>
                                </div>
                            </Link>

                            {auth.user && !isOwner && (
                                <Button
                                    variant={
                                        isFollowingAuthor
                                            ? 'outline'
                                            : 'default'
                                    }
                                    size="sm"
                                    className="gap-1.5"
                                    onClick={handleFollow}
                                >
                                    {isFollowingAuthor ? (
                                        <>
                                            <UserCheck className="h-3.5 w-3.5" />
                                            Following
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="h-3.5 w-3.5" />
                                            Follow
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                <Separator />

                {/* Body */}
                <article className="prose max-w-none prose-neutral dark:prose-invert">
                    {post.body.split('\n\n').map((para, i) => (
                        <p key={i}>{para}</p>
                    ))}
                </article>

                {/* Like + share bar */}
                <div className="flex items-center gap-3">
                    <Button
                        variant={liked ? 'default' : 'outline'}
                        size="sm"
                        className="gap-2"
                        onClick={handleLike}
                    >
                        <ThumbsUp className="h-4 w-4" />
                        {post.likes_count ?? 0}{' '}
                        {(post.likes_count ?? 0) === 1 ? 'Like' : 'Likes'}
                    </Button>
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MessageCircle className="h-4 w-4" />
                        {comments.length}{' '}
                        {comments.length === 1 ? 'comment' : 'comments'}
                    </span>
                </div>

                {/* Owner actions */}
                {(canEdit || isOwner) && (
                    <>
                        <Separator />
                        <div className="flex flex-wrap gap-3">
                            {post.status === 'draft' ? (
                                <Button
                                    onClick={handlePublish}
                                    className="gap-1.5"
                                >
                                    <Send className="h-4 w-4" />
                                    Publish now
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={handleUnpublish}
                                    className="gap-1.5"
                                >
                                    <Undo2 className="h-4 w-4" />
                                    Revert to draft
                                </Button>
                            )}
                            <Button asChild variant="outline">
                                <Link href={PostController.edit(post)}>
                                    <PenLine className="mr-2 h-4 w-4" />
                                    Edit
                                </Link>
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                        </div>
                    </>
                )}

                <Separator />

                {/* Comments section */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold">
                        {comments.length === 0
                            ? 'No comments yet'
                            : `Comments (${comments.length})`}
                    </h2>

                    {/* Comment form */}
                    {auth.user ? (
                        <form
                            onSubmit={handleComment}
                            className="flex flex-col gap-2"
                        >
                            <Textarea
                                rows={3}
                                placeholder="Write a comment…"
                                value={commentForm.data.body}
                                onChange={(e) =>
                                    commentForm.setData('body', e.target.value)
                                }
                                maxLength={1000}
                            />
                            {commentForm.errors.body && (
                                <p className="text-sm text-destructive">
                                    {commentForm.errors.body}
                                </p>
                            )}
                            <Button
                                type="submit"
                                size="sm"
                                className="w-fit"
                                disabled={
                                    commentForm.processing ||
                                    !commentForm.data.body.trim()
                                }
                            >
                                Post comment
                            </Button>
                        </form>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            <Link href="/login" className="underline">
                                Sign in
                            </Link>{' '}
                            to leave a comment.
                        </p>
                    )}

                    {/* Comment list */}
                    {comments.length > 0 && (
                        <div className="flex flex-col gap-3">
                            {comments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="rounded-lg border px-4 py-3"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={PublicProfileController.show.url(
                                                    comment.author!,
                                                )}
                                                className="flex items-center gap-2 hover:opacity-80"
                                            >
                                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                                                    {comment.author?.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                                <span className="text-sm font-medium">
                                                    {comment.author?.name}
                                                </span>
                                            </Link>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(
                                                    comment.created_at,
                                                ).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                        {auth.user?.id === comment.user_id && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                                                onClick={() =>
                                                    handleDeleteComment(comment)
                                                }
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        )}
                                    </div>
                                    <p className="mt-2 text-sm">
                                        {comment.body}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="pt-2">
                    <Button asChild variant="ghost" size="sm">
                        <Link href={PostController.index()}>
                            ← Back to Blog
                        </Link>
                    </Button>
                </div>
            </div>
        </>
    );
}
