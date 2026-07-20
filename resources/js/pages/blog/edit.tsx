import { Head } from '@inertiajs/react';
import PostController from '@/actions/App/Http/Controllers/Blog/PostController';
import { Separator } from '@/components/ui/separator';
import type { Post } from '@/types';
import PostForm from './partials/post-form';

type Props = {
    post: Post;
};

export default function BlogEdit({ post }: Props) {
    return (
        <>
            <Head title={`Edit: ${post.title}`} />

            <div className="mx-auto w-full max-w-3xl p-4 md:p-8">
                <div className="mb-6 flex flex-col gap-1">
                    <h1 className="font-display text-2xl font-semibold tracking-tight">
                        Edit Post
                    </h1>
                    <p className="line-clamp-1 text-sm text-muted-foreground">
                        {post.title}
                    </p>
                </div>

                <Separator className="mb-6" />

                <PostForm
                    post={post}
                    submitLabel="Save Changes"
                    onSubmit={(form) => {
                        // Browsers can't send multipart/form-data via PUT.
                        // POST with _method=PUT is Laravel's method spoofing convention.
                        form.transform((data) => ({
                            ...data,
                            _method: 'PUT',
                        })).post(PostController.update.url(post), {
                            forceFormData: true,
                        });
                        // Note: route accepts PUT but we POST with _method spoofing
                        // handled by Inertia's forceFormData + Laravel's method spoofing
                    }}
                />
            </div>
        </>
    );
}

BlogEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Blog', href: PostController.index() },
        { title: 'Edit Post', href: '#' },
    ],
};
