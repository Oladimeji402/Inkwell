<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Database\Seeders\Support\SeedCoverGenerator;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $bello = User::query()->updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Bello Sulaimon',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'bio' => 'Full-stack developer writing about craft, tools, and the quiet parts of building software.',
            ],
        );

        $maya = User::query()->updateOrCreate(
            ['email' => 'maya@example.com'],
            [
                'name' => 'Maya Okonkwo',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'bio' => 'Product designer who still sketches on paper before opening Figma.',
            ],
        );

        $jonas = User::query()->updateOrCreate(
            ['email' => 'jonas@example.com'],
            [
                'name' => 'Jonas Reed',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'bio' => 'Writer and engineer. Interested in attention, habits, and durable systems.',
            ],
        );

        $coverGenerator = new SeedCoverGenerator;

        foreach ($this->posts() as $index => $post) {
            $author = match ($post['author']) {
                'maya' => $maya,
                'jonas' => $jonas,
                default => $bello,
            };

            $coverPath = $this->storeGeneratedCover(
                $coverGenerator,
                $post['title'],
                $index,
            );

            $created = Post::query()->updateOrCreate(
                ['slug' => $post['slug']],
                [
                    'user_id' => $author->id,
                    'title' => $post['title'],
                    'excerpt' => $post['excerpt'],
                    'body' => $post['body'],
                    'cover_image' => $coverPath,
                    'status' => 'published',
                    'published_at' => now()->subDays($post['days_ago'])->setTime(9, 30),
                ],
            );

            if (! empty($post['comments'])) {
                foreach ($post['comments'] as $comment) {
                    $commentAuthor = match ($comment['author']) {
                        'maya' => $maya,
                        'jonas' => $jonas,
                        default => $bello,
                    };

                    Comment::query()->firstOrCreate(
                        [
                            'post_id' => $created->id,
                            'user_id' => $commentAuthor->id,
                            'body' => $comment['body'],
                        ],
                    );
                }
            }
        }

        // Keep a couple of real drafts for the demo account
        Post::query()->updateOrCreate(
            ['slug' => 'notes-on-shipping-slowly'],
            [
                'user_id' => $bello->id,
                'title' => 'Notes on shipping slowly',
                'excerpt' => 'A half-finished thought about pace, polish, and when “done” is good enough.',
                'body' => "I keep restarting this draft.\n\nMaybe that is the point. Some ideas need to sit unfinished until they stop sounding clever and start sounding true.",
                'cover_image' => null,
                'status' => 'draft',
                'published_at' => null,
            ],
        );

        Post::query()->updateOrCreate(
            ['slug' => 'untitled-evening-page'],
            [
                'user_id' => $bello->id,
                'title' => 'Untitled evening page',
                'excerpt' => null,
                'body' => 'No title yet. Just a page for the things I notice after dinner — the kind of sentences that disappear if I wait until morning.',
                'cover_image' => null,
                'status' => 'draft',
                'published_at' => null,
            ],
        );
    }

    /**
     * @return list<array{
     *     author: string,
     *     slug: string,
     *     title: string,
     *     excerpt: string,
     *     body: string,
     *     days_ago: int,
     *     comments?: list<array{author: string, body: string}>
     * }>
     */
    private function posts(): array
    {
        return [
            [
                'author' => 'bello',
                'slug' => 'the-first-hour-matters-more-than-the-stack',
                'title' => 'The first hour matters more than the stack',
                'excerpt' => 'Frameworks change. Your opening hour — how you name things, how you leave room to breathe — usually decides whether the project feels calm or chaotic.',
                'days_ago' => 2,
                'body' => <<<'BODY'
I used to chase the “right” stack the way other people chase productivity systems. New framework, new folder structure, new sense that this time the work would finally feel clean.

It never did — at least not because of the tools.

What changed things was quieter. On a new project, I now spend the first hour on boring decisions: what the product is for, what the main nouns are, and which screens a stranger should understand without a tour.

If those are wrong, Laravel or React will not save you. If they are right, almost any sensible stack will feel like enough.

I still care about craft. I still rewrite CSS until the type sits properly. But I stopped treating technology choice as the main creative act. The main creative act is deciding what belongs on the page — and what does not.
BODY,
                'comments' => [
                    [
                        'author' => 'maya',
                        'body' => 'This is exactly how I feel about design systems. The first naming pass does more work than the component library.',
                    ],
                ],
            ],
            [
                'author' => 'maya',
                'slug' => 'design-is-mostly-editing',
                'title' => 'Design is mostly editing',
                'excerpt' => 'The glamorous part is the moodboard. The useful part is deleting half of it before anyone else sees the file.',
                'days_ago' => 5,
                'body' => <<<'BODY'
People ask how I “come up with” interfaces. I rarely invent them. I collect, then cut.

A first draft of a landing page is usually too loud: too many badges, too many promises, too many ways to prove the product is serious. That noise is useful — it gets the ideas out of my head. It is not the product.

Editing is where the work becomes honest. Can this section disappear without losing meaning? Does the headline still make sense if the logo is covered? Would I trust this page if it belonged to a stranger?

Most of my best design days end with a smaller file, not a prettier one.
BODY,
                'comments' => [
                    [
                        'author' => 'jonas',
                        'body' => '“Would I trust this page if it belonged to a stranger?” is going on a sticky note above my monitor.',
                    ],
                ],
            ],
            [
                'author' => 'jonas',
                'slug' => 'reading-on-a-screen-without-losing-the-thread',
                'title' => 'Reading on a screen without losing the thread',
                'excerpt' => 'Long-form on the web fails when the page behaves like a dashboard. Give the text a measure, a rhythm, and somewhere quiet to land.',
                'days_ago' => 8,
                'body' => <<<'BODY'
I abandoned three essays this month because the reading experience felt like work. Not the writing — the chrome around it. Sidebars, chips, related posts, a sticky bar asking me to subscribe before I had finished the first paragraph.

Attention is not infinite. A page that respects reading treats the paragraph as the main event.

That means a comfortable line length, enough contrast, and headings that act like landmarks instead of billboards. It also means resisting the urge to decorate every pause with an engagement widget.

When I write for Inkwell, I try to leave space. White space is not empty. It is the place where a sentence finishes landing.
BODY,
            ],
            [
                'author' => 'bello',
                'slug' => 'what-i-look-for-in-a-portfolio-project',
                'title' => 'What I look for in a portfolio project',
                'excerpt' => 'Hiring managers skim. The projects that stick usually share three traits: a clear problem, a visible decision, and proof it actually works.',
                'days_ago' => 12,
                'body' => <<<'BODY'
A portfolio does not need twelve apps. It needs a few that feel finished on purpose.

When I open someone else's work, I look for three things:

First, a problem stated in plain language. Not “built a CRUD app.” Something like “writers needed a calm place to publish without the feed fighting them.”

Second, a decision I can see. Why this layout? Why this auth approach? Why this compromise? Taste shows up in tradeoffs.

Third, evidence. A live link, seed data that does not look like lorem ipsum, and an empty state that does not apologize.

You do not have to be famous. You do have to look like you care about the last 10% — the part most demos skip.
BODY,
                'comments' => [
                    [
                        'author' => 'maya',
                        'body' => 'The empty-state point is underrated. That is often where you can tell if someone thought about real users.',
                    ],
                    [
                        'author' => 'jonas',
                        'body' => 'Agree. Seed content that sounds human does more for credibility than another feature checklist.',
                    ],
                ],
            ],
            [
                'author' => 'maya',
                'slug' => 'a-small-ritual-before-i-open-figma',
                'title' => 'A small ritual before I open Figma',
                'excerpt' => 'Five minutes with a pen stops me from decorating my way out of an unclear brief.',
                'days_ago' => 16,
                'body' => <<<'BODY'
Before I open design software, I write three lines on paper:

1. Who is this for, in one sentence.
2. What should they feel after thirty seconds.
3. What I will refuse to include, even if it looks impressive.

It sounds precious. It saves hours.

Software invites polish. Paper invites clarity. If I cannot answer those three lines, I am not ready to choose colors — I am ready to ask better questions.
BODY,
            ],
            [
                'author' => 'jonas',
                'slug' => 'on-keeping-a-writing-habit-that-survives-busy-weeks',
                'title' => 'On keeping a writing habit that survives busy weeks',
                'excerpt' => 'I stopped aiming for brilliance and started aiming for continuity. A short honest page beats a perfect draft that never ships.',
                'days_ago' => 21,
                'body' => <<<'BODY'
My writing habit used to collapse the moment work got intense. I would wait for a free Saturday, promise myself a long essay, and then produce nothing because the bar was theatrical.

Now the rule is smaller: two hundred words, three times a week. They can be messy. They can live as drafts. They just have to exist.

Continuity changes how I see my own ideas. Themes reappear. Sentences improve because I am practicing, not performing.

If you are stuck, lower the ceremony. Open the page. Write the dull true thing. Publish when it earns it — not when the calendar demands a masterpiece.
BODY,
            ],
            [
                'author' => 'bello',
                'slug' => 'building-in-public-without-performing',
                'title' => 'Building in public without performing',
                'excerpt' => 'Sharing progress is useful. Turning every commit into content is exhausting. There is a middle path.',
                'days_ago' => 27,
                'body' => <<<'BODY'
Building in public taught me useful habits: write changelogs, explain decisions, ask for feedback early. It also taught me a bad one — packing every evening into a thread so the work would look alive.

The audience is not the product.

These days I share when there is a real fork in the road: a design I am unsure about, a bug that taught me something, a feature I cut. I skip the daily scoreboard.

People can tell the difference between documentation and performance. So can you, usually, if you read your own posts the next morning.
BODY,
            ],
            [
                'author' => 'maya',
                'slug' => 'why-i-stopped-centering-every-hero',
                'title' => 'Why I stopped centering every hero',
                'excerpt' => 'Centered heroes feel safe. Asymmetry feels like someone made a choice — which is what visitors remember.',
                'days_ago' => 33,
                'body' => <<<'BODY'
For years my default landing page was a centered headline, two buttons, and a polite amount of space. It worked. It also looked like every other careful template on the internet.

I started shifting weight. Brand on the left. A darker panel on the right. One sentence that does not compete with the name of the product.

Nothing about that is radical. It is simply harder to mistake for a generic AI layout — because it refuses the safe middle.

If your first screen could belong to another company after you remove the logo, the composition is still doing too little.
BODY,
            ],
        ];
    }

    private function storeGeneratedCover(SeedCoverGenerator $generator, string $title, int $variant): ?string
    {
        try {
            $localPath = $generator->generate($title, $variant);
            $publicId = 'covers/'.pathinfo($localPath, PATHINFO_FILENAME);

            Storage::disk('cloudinary')->put(
                $publicId,
                (string) file_get_contents($localPath),
            );

            return $publicId;
        } catch (\Throwable) {
            return null;
        }
    }
}
