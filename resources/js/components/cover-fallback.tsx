import { cn } from '@/lib/utils';

type Props = {
    title: string;
    className?: string;
};

/**
 * Typographic ink-monogram placeholder when a post has no cover image.
 */
export default function CoverFallback({ title, className }: Props) {
    const initial = title.trim().charAt(0).toUpperCase() || 'I';

    return (
        <div
            aria-hidden
            className={cn(
                'relative flex items-center justify-center overflow-hidden bg-ink text-paper',
                className,
            )}
        >
            <div className="ink-grain absolute inset-0 opacity-80" />
            <span className="relative font-display text-5xl font-medium tracking-tight md:text-6xl">
                {initial}
            </span>
            <span className="absolute right-4 bottom-4 h-2 w-2 rounded-full bg-brand" />
        </div>
    );
}
