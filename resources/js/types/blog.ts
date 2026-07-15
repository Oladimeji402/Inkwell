import type { User } from './auth';

export type PostStatus = 'draft' | 'published';

export type Post = {
    id: number;
    user_id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    body: string;
    cover_image: string | null;
    cover_image_url: string | null;
    status: PostStatus;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    author?: Pick<User, 'id' | 'name'>;
    likes_count?: number;
    comments_count?: number;
};

export type Comment = {
    id: number;
    post_id: number;
    user_id: number;
    body: string;
    created_at: string;
    updated_at: string;
    author?: Pick<User, 'id' | 'name'>;
};

export type Author = {
    id: number;
    name: string;
    bio: string | null;
    avatar_url: string | null;
    created_at: string;
    followers_count: number;
    following_count: number;
    posts_count: number;
    total_likes: number;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
    next_page_url: string | null;
    prev_page_url: string | null;
};
