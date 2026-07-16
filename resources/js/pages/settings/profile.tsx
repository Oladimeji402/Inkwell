import { Head, Link, router, usePage } from '@inertiajs/react';
import { Camera, X } from 'lucide-react';
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

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState(auth.user.name);
    const [email, setEmail] = useState(auth.user.email);
    const [bio, setBio] = useState((auth.user.bio as string) ?? '');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(
        auth.user.avatar_url ?? null,
    );
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        setAvatarFile(file);
        setPreview(
            file ? URL.createObjectURL(file) : (auth.user.avatar_url ?? null),
        );
    }

    function clearAvatar() {
        setAvatarFile(null);
        setPreview(auth.user.avatar_url ?? null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        // Build FormData manually — the only reliable way to send
        // files with a PATCH-spoofed POST via Inertia
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
                        <div className="flex items-center gap-4">
                            <div className="relative">
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
                                <button
                                    type="button"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className="absolute right-0 bottom-0 flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background shadow-sm transition hover:scale-110"
                                    aria-label="Upload photo"
                                >
                                    <Camera className="h-3.5 w-3.5" />
                                </button>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                >
                                    {preview ? 'Change photo' : 'Upload photo'}
                                </Button>
                                {avatarFile && (
                                    <button
                                        type="button"
                                        onClick={clearAvatar}
                                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                                    >
                                        <X className="h-3 w-3" /> Remove
                                    </button>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    JPG, PNG, WebP · max 2 MB
                                </p>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                        {errors.avatar && (
                            <InputError message={errors.avatar} />
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
                        {mustVerifyEmail &&
                            auth.user.email_verified_at === null && (
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
                                            A new verification link has been
                                            sent.
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

                    <Button type="submit" disabled={processing}>
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
