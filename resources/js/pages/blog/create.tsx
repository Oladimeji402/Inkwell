import { Head } from '@inertiajs/react';
import PostController from '@/actions/App/Http/Controllers/Blog/PostController';
import { Separator } from '@/components/ui/separator';
import PostForm from './partials/post-form';

export default function BlogCreate() {
    return (
        <>
            <Head title="New Post" />

            <div className="mx-auto w-full max-w-3xl p-4 md:p-8">
                <div className="mb-6 flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        New Post
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Fill in the details below and publish when ready.
                    </p>
                </div>

                <Separator className="mb-6" />

                <PostForm
                    submitLabel="Create Post"
                    onSubmit={(form) => {
                        form.post(PostController.store.url(), {
                            forceFormData: true,
                        });
                    }}
                />
            </div>
        </>
    );
}

BlogCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Blog', href: PostController.index() },
        { title: 'New Post', href: PostController.create() },
    ],
};
