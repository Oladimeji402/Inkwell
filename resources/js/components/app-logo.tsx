import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="relative flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5" />
                <span className="absolute right-0.5 bottom-0.5 h-1.5 w-1.5 rounded-full bg-brand" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate font-display text-base leading-tight font-semibold tracking-tight">
                    Inkwell
                </span>
            </div>
        </>
    );
}
