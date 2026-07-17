import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import PublicLayout from '@/layouts/public-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Inkwell';

createInertiaApp({
    title: (title) => (title ? `${title} — ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            // Public-facing pages — full-width with top nav
            case name === 'welcome':
            case name === 'about':
            case name === 'contact':
            case name === 'errors/404':
            case name === 'blog/index':
            case name === 'blog/show':
            case name.startsWith('profile/'):
                return PublicLayout;

            // Auth flows
            case name.startsWith('auth/'):
                return AuthLayout;

            // Settings nested layout
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];

            // Everything else — dashboard, blog/create, blog/edit,
            // blog/drafts, etc. — gets the app shell with sidebar
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        delay: 250,
        color: '#6366f1',
        includeCSS: true,
        showSpinner: false,
    },
});

// This will set light / dark mode on load...
initializeTheme();
