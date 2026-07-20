import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import PostController from '@/actions/App/Http/Controllers/Blog/PostController';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <>
            <Head title="Page not found" />

            <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
                {/* Big 404 */}
                <p
                    aria-hidden
                    className="font-display text-[8rem] leading-none font-semibold tracking-tighter text-muted/50 select-none md:text-[12rem]"
                >
                    404
                </p>

                <div className="-mt-4 flex flex-col items-center gap-3">
                    <h1 className="font-display text-2xl font-semibold tracking-tight">
                        Page not found
                    </h1>
                    <p className="max-w-sm text-muted-foreground">
                        We couldn't find the page you're looking for. It may
                        have been moved, deleted, or perhaps it never existed.
                    </p>
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Button asChild variant="outline" className="gap-2">
                        <Link href="/">
                            <ArrowLeft className="h-4 w-4" />
                            Back home
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href={PostController.index()}>
                            Browse articles
                        </Link>
                    </Button>
                </div>
            </div>
        </>
    );
}
