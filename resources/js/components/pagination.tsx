import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PaginationLink } from '@/types';

type Props = {
    links: PaginationLink[];
    prevUrl: string | null;
    nextUrl: string | null;
    currentPage: number;
    lastPage: number;
    from: number | null;
    to: number | null;
    total: number;
};

export default function Pagination({
    links,
    prevUrl,
    nextUrl,
    currentPage,
    lastPage,
    from,
    to,
    total,
}: Props) {
    if (lastPage <= 1) {
        return null;
    }

    // Only keep numeric page links (strip "Previous" / "Next" labels)
    const pageLinks = links.filter((l) => {
        const n = Number(l.label);

        return !isNaN(n);
    });

    return (
        <div className="flex flex-col items-center gap-3 pt-8">
            {/* Page count label */}
            {from !== null && to !== null && (
                <p className="text-xs text-muted-foreground">
                    Showing{' '}
                    <span className="font-medium text-foreground">
                        {from}–{to}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium text-foreground">{total}</span>{' '}
                    posts
                </p>
            )}

            {/* Controls */}
            <div className="flex items-center gap-1">
                {/* Prev */}
                {prevUrl ? (
                    <Link
                        href={prevUrl}
                        className={cn(
                            'inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm',
                            'transition-colors hover:bg-accent hover:text-accent-foreground',
                        )}
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                ) : (
                    <span className="inline-flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-md border border-input bg-background text-sm opacity-40">
                        <ChevronLeft className="h-4 w-4" />
                    </span>
                )}

                {/* Page numbers */}
                {pageLinks.map((link) => {
                    const page = Number(link.label);

                    return link.url ? (
                        <Link
                            key={page}
                            href={link.url}
                            className={cn(
                                'inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 text-sm transition-colors',
                                link.active
                                    ? 'border-foreground bg-foreground font-semibold text-background'
                                    : 'border-input bg-background hover:bg-accent hover:text-accent-foreground',
                            )}
                            aria-current={link.active ? 'page' : undefined}
                            aria-label={`Page ${page}`}
                        >
                            {page}
                        </Link>
                    ) : (
                        <span
                            key={page}
                            className="inline-flex h-9 min-w-9 cursor-not-allowed items-center justify-center rounded-md border border-input bg-background px-2 text-sm opacity-40"
                        >
                            {page}
                        </span>
                    );
                })}

                {/* Next */}
                {nextUrl ? (
                    <Link
                        href={nextUrl}
                        className={cn(
                            'inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm',
                            'transition-colors hover:bg-accent hover:text-accent-foreground',
                        )}
                        aria-label="Next page"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                ) : (
                    <span className="inline-flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-md border border-input bg-background text-sm opacity-40">
                        <ChevronRight className="h-4 w-4" />
                    </span>
                )}
            </div>

            {/* Page x of y */}
            <p className="text-xs text-muted-foreground">
                Page {currentPage} of {lastPage}
            </p>
        </div>
    );
}
