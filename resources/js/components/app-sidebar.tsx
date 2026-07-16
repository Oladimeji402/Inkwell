import { Link } from '@inertiajs/react';
import {
    FileText,
    Globe,
    HelpCircle,
    LayoutGrid,
    NotebookPen,
    Rss,
    UserCircle,
} from 'lucide-react';
import PostController from '@/actions/App/Http/Controllers/Blog/PostController';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Explore',
        href: PostController.index(),
        icon: Globe,
    },
];

const blogNavItems: NavItem[] = [
    {
        title: 'All Posts',
        href: PostController.index(),
        icon: Rss,
    },
    {
        title: 'Drafts',
        href: PostController.drafts(),
        icon: FileText,
    },
    {
        title: 'New Post',
        href: PostController.create(),
        icon: NotebookPen,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'About Inkwell',
        href: '/about',
        icon: UserCircle,
    },
    {
        title: 'Contact',
        href: '/contact',
        icon: HelpCircle,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavMain items={blogNavItems} label="Blog" />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
