<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $published = Post::where('user_id', $user->id)
            ->where('status', 'published')
            ->count();

        $drafts = Post::where('user_id', $user->id)
            ->where('status', 'draft')
            ->count();

        $recentPosts = Post::where('user_id', $user->id)
            ->latest('updated_at')
            ->limit(5)
            ->get(['id', 'title', 'slug', 'status', 'published_at', 'updated_at']);

        return Inertia::render('dashboard', [
            'stats' => [
                'published' => $published,
                'drafts' => $drafts,
                'total' => $published + $drafts,
            ],
            'recentPosts' => $recentPosts,
        ]);
    }
}
