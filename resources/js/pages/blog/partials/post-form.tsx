import { useForm } from '@inertiajs/react';
import { ImageIcon, X } from 'lucide-react';
import { useRef, useState, type FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Post, PostStatus } from '@/types';

type PostFormData = {
    title: string;
    excerpt: string;
    body: string;
    cover_image: File | null;
    status: PostStatus;
};

type Props = {
    post?: Post;
    onSubmit: (form: ReturnType<typeof useForm<PostFormData>>) => void;
    submitLabel?: string;
};

export default function PostForm({ post, onSubmit, submitLabel = 'Save' }: Props) {
    const form = useForm<PostFormData>({
        title: post?.title ?? '',
        excerpt: post?.excerpt ?? '',
        body: post?.body ?? '',
        cover_image: null,
        status: post?.status ?? 'draft',
    });

    // Preview: start with the existing cover image URL (edit mode), or null
    const [preview, setPreview] = useState<string | null>(post?.cover_image_url ?? null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        form.setData('cover_image', file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(post?.cover_image_url ?? null);
        }
    }

    function clearImage() {
        form.setData('cover_image', null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Title */}
            <div className="grid gap-1.5">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    value={form.data.title}
                    onChange={(e) => form.setData('title', e.target.value)}
                    placeholder="My awesome post"
                    required
                    autoFocus
                />
                {form.errors.title && (
                    <p className="text-sm text-destructive">{form.errors.title}</p>
                )}
            </div>

            {/* Excerpt */}
            <div className="grid gap-1.5">
                <Label htmlFor="excerpt">
                    Excerpt{' '}
                    <span className="text-xs text-muted-foreground">(optional)</span>
                </Label>
                <Textarea
                    id="excerpt"
                    rows={2}
                    value={form.data.excerpt}
                    onChange={(e) => form.setData('excerpt', e.target.value)}
                    placeholder="A short summary shown in the post list…"
                    maxLength={500}
                />
                {form.errors.excerpt && (
                    <p className="text-sm text-destructive">{form.errors.excerpt}</p>
                )}
            </div>

            {/* Body */}
            <div className="grid gap-1.5">
                <Label htmlFor="body">Content</Label>
                <Textarea
                    id="body"
                    rows={14}
                    value={form.data.body}
                    onChange={(e) => form.setData('body', e.target.value)}
                    placeholder="Write your post here…"
                    required
                />
                {form.errors.body && (
                    <p className="text-sm text-destructive">{form.errors.body}</p>
                )}
            </div>

            {/* Cover image upload */}
            <div className="grid gap-1.5">
                <Label htmlFor="cover_image">
                    Cover image{' '}
                    <span className="text-xs text-muted-foreground">(optional · max 2 MB)</span>
                </Label>

                {/* Preview */}
                {preview ? (
                    <div className="relative w-full overflow-hidden rounded-lg border">
                        <img
                            src={preview}
                            alt="Cover preview"
                            className="h-48 w-full object-cover"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-7 w-7"
                            onClick={clearImage}
                            aria-label="Remove image"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="border-input hover:bg-accent flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors"
                    >
                        <ImageIcon className="text-muted-foreground h-8 w-8" />
                        <span className="text-muted-foreground text-sm">
                            Click to upload an image
                        </span>
                    </button>
                )}

                <input
                    ref={fileInputRef}
                    id="cover_image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />

                {/* Allow picking a different file even when preview is shown */}
                {preview && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-fit"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Change image
                    </Button>
                )}

                {form.errors.cover_image && (
                    <p className="text-sm text-destructive">{form.errors.cover_image}</p>
                )}
            </div>

            {/* Status */}
            <div className="grid gap-1.5">
                <Label htmlFor="status">Status</Label>
                <Select
                    value={form.data.status}
                    onValueChange={(v) => form.setData('status', v as PostStatus)}
                >
                    <SelectTrigger id="status" className="w-40">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                </Select>
                {form.errors.status && (
                    <p className="text-sm text-destructive">{form.errors.status}</p>
                )}
            </div>

            <Button type="submit" disabled={form.processing} className="w-fit">
                {form.processing ? 'Saving…' : submitLabel}
            </Button>
        </form>
    );
}
