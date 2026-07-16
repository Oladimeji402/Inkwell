import { Head, Link, router, usePage } from '@inertiajs/react';
import { Camera, ImageIcon, X } from 'lucide-react';
import { useRef, useState } from 'react';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { Auth } from '@/types';

type FormErrors = Partial<Record<'name' | 'email' | 'bio' | 'avatar', string>>;

// Allowed MIME types — covers iPhone HEIC/HEIF converted by browser,
// standard JPEG, PNG, WebP, GIF, and Android camera formats
const ALLOWED_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/heic',
    'image/heif',
];
const MAX_SIZE_MB = 2;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

function validateImage(file: File): string | null {
    // Check type — use both MIME and extension for iPhone HEIC files
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    const validExt = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'heic', 'heif'].includes(ext);
    const validMime = ALLOWED_TYPES.includes(file.type) || file.type === '';

    if (!validMime && !validExt) {
        return `Unsupported file type "${file.type || ext}". Please use JPG, PNG, WebP, or GIF.`;
    }

    if (file.size > MAX_SIZE_BYTES) {
        const sizeMB = (file.size / 1024 / 1024).toFixed(1);

        return `File is ${sizeMB} MB — maximum allowed size is ${MAX_SIZE_MB} MB.`;
    }

    return null;
}

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<{ auth: Auth }>().props;

    // Two separate inputs — one for gallery, one for camera
    const galleryInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState(auth.user.name);
    const [email, setEmail] = useState(auth.user.email);
    const [bio, setBio] = useState((auth.user.bio as string) ?? '');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(auth.user.avatar_url ?? null);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});

    function applyFile(file: File | null) {
        if (!file) {
return;
}

        const validationError = validateImage(file);

        if (validationError) {
            setErrors((prev) => ({ ...prev, avatar: validationError }));
            setAvatarFile(null);
            setPreview(auth.user.avatar_url ?? null);

            return;
        }

        // Clear any previous avatar error
        setErrors((prev) => {
            const next = { ...prev };
            delete next.avatar;

            return next;
        });
        setAvatarFile(file);
        setPreview(URL.createObjectURL(file));
    }

    function handleGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
        applyFile(e.target.files?.[0] ?? null);
    }

    function handleCameraChange(e: React.ChangeEvent<HTMLInputElement>) {
        applyFile(e.target.files?.[0] ?? null);
    }

    function clearAvatar() {
        setAvatarFile(null);
        setPreview(auth.user.avatar_url ?? null);
        setErrors((prev) => {
            const next = { ...prev };
            delete next.avatar;

            return next;
        });

        if (galleryInputRef.current) {
galleryInputRef.current.value = '';
}

        if (cameraInputRef.current) {
cameraInputRef.current.value = '';
}
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // Block submit if there's a pending avatar error
        if (errors.avatar) {
return;
}

        setProcessing(true);
        setErrors({});

        const fd = new FormData();
        fd.append('name', name);
        fd.append('email', email);
        fd.append('bio', bio);

        if (avatarFile) {
            fd.append('avatar', avatarFile);
        }

        router.post('/settings/profile/avatar', fd, {
            preserveScroll: true,
            onError: (errs) => {
                setErrors(errs as FormErrors);
                setProcessing(false);
            },
            onSuccess: () => {
                setAvatarFile(null);
                setProcessing(false);
            },
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Profile"
                    description="Update your name, email, bio and profile picture"
                />

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ── Avatar ── */}
                    <div className="grid gap-2">
                        <Label>Profile picture</Label>
                        <div className="flex flex-wrap items-center gap-4">
                            {/* Preview circle */}
                            <div className="relative shrink-0">
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Avatar preview"
                                        className="h-20 w-20 rounded-full object-cover ring-2 ring-border"
                                    />
                                ) : (
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground ring-2 ring-border">
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                {/* Camera overlay shortcut — opens gallery on mobile */}
                                <button
                                    type="button"
                                    onClick={() => galleryInputRef.current?.click()}
                                    className="absolute right-0 bottom-0 flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background shadow-sm transition hover:scale-110"
                                    aria-label="Upload photo"
                                >
                                    <Camera className="h-3.5 w-3.5" />
                                </button>
                            </div>

                            {/* Action buttons */}
                            <div className="flex flex-col gap-2">
                                {/* Gallery / file picker */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                    onClick={() => galleryInputRef.current?.click()}
                                >
                                    <ImageIcon className="h-3.5 w-3.5" />
                                    {preview ? 'Change photo' : 'Choose from gallery'}
                                </Button>

                                {/* Camera — only shown on devices that support capture */}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="gap-2 text-muted-foreground"
                                    onClick={() => cameraInputRef.current?.click()}
                                >
                                    <Camera className="h-3.5 w-3.5" />
                                    Take a photo
                                </Button>

                                {avatarFile && (
                                    <button
                                        type="button"
                                        onClick={clearAvatar}
                                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                                    >
                                        <X className="h-3 w-3" />
                                        Remove
                                    </button>
                                )}

                                <p className="text-xs text-muted-foreground">
                                    JPG, PNG, WebP, GIF · max {MAX_SIZE_MB} MB
                                </p>
                            </div>
                        </div>

                        {/* Hidden gallery input — no capture, opens photo library on mobile */}
                        <input
                            ref={galleryInputRef}
                            type="file"
                            accept="image/*,.heic,.heif"
                            className="hidden"
                            onChange={handleGalleryChange}
                        />

                        {/* Hidden camera input — capture="user" opens front camera */}
                        <input
                            ref={cameraInputRef}
                            type="file"
                            accept="image/*"
                            capture="user"
                            className="hidden"
                            onChange={handleCameraChange}
                        />

                        {/* Error shown immediately for bad file type/size */}
                        {errors.avatar && (
                            <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2">
                                <span className="mt-0.5 text-destructive">⚠</span>
                                <p className="text-sm text-destructive">{errors.avatar}</p>
                            </div>
                        )}
                    </div>

                    {/* ── Name ── */}
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            autoComplete="name"
                            placeholder="Full name"
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* ── Email ── */}
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="username"
                            placeholder="Email address"
                        />
                        <InputError message={errors.email} />
                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="-mt-1 text-sm text-muted-foreground">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={send()}
                                        as="button"
                                        className="text-foreground underline underline-offset-4"
                                    >
                                        Resend verification email.
                                    </Link>
                                </p>
                                {status === 'verification-link-sent' && (
                                    <p className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── Bio ── */}
                    <div className="grid gap-2">
                        <Label htmlFor="bio">
                            Bio{' '}
                            <span className="text-xs text-muted-foreground">
                                (optional · max 300 chars)
                            </span>
                        </Label>
                        <Textarea
                            id="bio"
                            rows={3}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell the world a little about yourself…"
                            maxLength={300}
                        />
                        <p className="text-right text-xs text-muted-foreground">
                            {bio.length}/300
                        </p>
                        <InputError message={errors.bio} />
                    </div>

                    <Button type="submit" disabled={processing || !!errors.avatar}>
                        {processing ? 'Saving…' : 'Save changes'}
                    </Button>
                </form>
            </div>

            <DeleteUser />
        </>
    );
}

Profile.layout = {
    breadcrumbs: [{ title: 'Profile settings', href: edit() }],
};
