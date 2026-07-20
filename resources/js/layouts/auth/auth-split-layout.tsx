import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative grid min-h-dvh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col justify-between bg-ink p-10 text-paper lg:flex">
                <div className="ink-grain absolute inset-0 opacity-50" />
                <Link
                    href={home()}
                    className="relative z-20 flex items-center gap-2.5 text-lg"
                >
                    <AppLogoIcon className="size-8 text-paper" />
                    <span className="font-display font-semibold tracking-tight">
                        Inkwell
                    </span>
                </Link>

                <div className="relative z-20 max-w-sm">
                    <p className="font-display text-3xl leading-snug font-medium italic">
                        Write what lasts.
                    </p>
                    <p className="mt-4 text-sm text-paper/70">
                        A calm space for long-form thinking — less noise, more
                        depth.
                    </p>
                </div>

                <span className="absolute top-1/3 right-16 h-3 w-3 rounded-full bg-brand" />
            </div>

            <div className="w-full bg-background p-6 lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link
                        href={home()}
                        className="relative z-20 flex items-center justify-center gap-2 lg:hidden"
                    >
                        <AppLogoIcon className="size-9 text-foreground" />
                        <span className="font-display text-lg font-semibold">
                            Inkwell
                        </span>
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="font-display text-2xl font-semibold tracking-tight">
                            {title}
                        </h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
