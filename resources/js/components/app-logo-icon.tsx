import type { SVGAttributes } from 'react';

/** Inkwell bottle mark — shared across auth and app chrome. */
export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
        >
            <path d="M18 2a1 1 0 0 1 .894.553l.98 1.96A1 1 0 0 1 19 6h-1v13a1 1 0 0 1-.553.894l-2 1A1 1 0 0 1 14 20v-1H6v1a1 1 0 0 1-1.447.894l-2-1A1 1 0 0 1 2 19V6H1a1 1 0 0 1-.874-1.487l.98-1.96A1 1 0 0 1 2 2h16zm-3 4H5v12h10V6zm-4 2a1 1 0 0 1 1 1v6a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1z" />
        </svg>
    );
}
