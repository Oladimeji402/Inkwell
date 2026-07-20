import emailjs from '@emailjs/browser';
import { Head } from '@inertiajs/react';
import { Github, Loader2, Mail, Twitter } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// ─────────────────────────────────────────────────────────────
// EmailJS config — set these three values from your EmailJS
// dashboard (https://www.emailjs.com) and put them in .env:
//   VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
//   VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
//   VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxxxxxx
// ─────────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function Contact() {
    const formRef = useRef<HTMLFormElement>(null);
    const [status, setStatus] = useState<Status>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!formRef.current) {
            return;
        }

        setStatus('sending');
        setErrorMsg('');

        try {
            await emailjs.sendForm(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                formRef.current,
                { publicKey: EMAILJS_PUBLIC_KEY },
            );
            setStatus('sent');
            formRef.current.reset();
        } catch (err: unknown) {
            console.error('EmailJS error:', err);
            setErrorMsg(
                'Something went wrong. Please email me directly at bellosulaimon177@gmail.com',
            );
            setStatus('error');
        }
    }

    return (
        <>
            <Head title="Contact" />

            <section className="border-b border-border/60">
                <div className="ink-grain mx-auto max-w-3xl px-4 py-20 md:px-6">
                    <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                        Get in touch
                    </p>
                    <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
                        Contact
                    </h1>
                    <p className="mt-5 max-w-xl text-lg text-muted-foreground">
                        Have a question, idea, or just want to say hello? I'd
                        love to hear from you.
                    </p>
                </div>
            </section>

            <section className="mx-auto grid max-w-5xl gap-12 px-4 py-16 md:grid-cols-2 md:px-6">
                {/* ── Contact form ── */}
                <div>
                    <h2 className="mb-6 font-display text-xl font-semibold">
                        Send a message
                    </h2>

                    {status === 'sent' ? (
                        <div className="flex flex-col items-start gap-3 border border-brand/40 bg-brand/10 p-6">
                            <p className="font-display text-lg font-semibold text-foreground">
                                Message sent
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Thanks for reaching out. I'll get back to you
                                within 1–2 business days.
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setStatus('idle')}
                            >
                                Send another
                            </Button>
                        </div>
                    ) : (
                        <form
                            ref={formRef}
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-5"
                        >
                            {/* EmailJS needs name attributes that match your template variables */}
                            <div className="grid gap-1.5">
                                <Label htmlFor="from_name">Name</Label>
                                <Input
                                    id="from_name"
                                    name="from_name"
                                    placeholder="Your name"
                                    required
                                    disabled={status === 'sending'}
                                />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="from_email">Email</Label>
                                <Input
                                    id="from_email"
                                    name="from_email"
                                    type="email"
                                    placeholder="you@example.com"
                                    required
                                    disabled={status === 'sending'}
                                />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="subject">Subject</Label>
                                <Input
                                    id="subject"
                                    name="subject"
                                    placeholder="What's this about?"
                                    required
                                    disabled={status === 'sending'}
                                />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    placeholder="What's on your mind?"
                                    required
                                    disabled={status === 'sending'}
                                />
                            </div>

                            {status === 'error' && (
                                <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                    {errorMsg}
                                </p>
                            )}

                            <Button
                                type="submit"
                                className="w-fit gap-2"
                                disabled={status === 'sending'}
                            >
                                {status === 'sending' && (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                )}
                                {status === 'sending'
                                    ? 'Sending…'
                                    : 'Send message'}
                            </Button>
                        </form>
                    )}
                </div>

                {/* ── Contact info ── */}
                <div className="flex flex-col gap-8">
                    <div>
                        <h2 className="mb-4 font-display text-xl font-semibold">
                            Other ways to reach me
                        </h2>
                        <div className="flex flex-col gap-4">
                            <a
                                href="mailto:bellosulaimon177@gmail.com"
                                className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                                    <Mail className="h-4 w-4" />
                                </div>
                                bellosulaimon177@gmail.com
                            </a>
                            <a
                                href="https://github.com/Oladimeji402"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                                    <Github className="h-4 w-4" />
                                </div>
                                github.com/Oladimeji402
                            </a>
                            <a
                                href="https://x.com/bellosulai756"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                                    <Twitter className="h-4 w-4" />
                                </div>
                                @bellosulai756
                            </a>
                        </div>
                    </div>

                    <div className="border border-border bg-muted/40 p-6">
                        <h3 className="mb-2 font-display font-semibold">
                            Response time
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            I typically respond within 1–2 business days. For
                            urgent matters, email is the fastest route.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
