<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    public function __invoke(): Response
    {
        $featured = Post::with('author:id,name')
            ->withCount(['likes', 'comments'])
            ->where('status', 'published')
            ->latest('published_at')
            ->limit(6)
            ->get();

        $stats = [
            'posts' => Post::where('status', 'published')->count(),
            'authors' => Post::where('status', 'published')
                ->distinct('user_id')
                ->count('user_id'),
        ];

        return Inertia::render('welcome', [
            'featured' => $featured,
            'stats' => $stats,
        ]);
    }
}
