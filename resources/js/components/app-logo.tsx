export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <svg viewBox="0 0 24 24" className="size-5 fill-current text-white dark:text-black" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 2a1 1 0 0 1 .894.553l.98 1.96A1 1 0 0 1 19 6h-1v13a1 1 0 0 1-.553.894l-2 1A1 1 0 0 1 14 20v-1H6v1a1 1 0 0 1-1.447.894l-2-1A1 1 0 0 1 2 19V6H1a1 1 0 0 1-.874-1.487l.98-1.96A1 1 0 0 1 2 2h16zm-3 4H5v12h10V6zm-4 2a1 1 0 0 1 1 1v6a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1z"/>
                </svg>
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    Inkwell
                </span>
            </div>
        </>
    );
}
