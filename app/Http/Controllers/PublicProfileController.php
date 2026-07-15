<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicProfileController extends Controller
{
    public function show(Request $request, User $user): Response
    {
        $authUser = $request->user();

        $posts = $user->posts()
            ->where('status', 'published')
            ->withCount(['likes', 'comments'])
            ->latest('published_at')
            ->paginate(9)
            ->withQueryString();

        // Total likes received across all published posts
        $totalLikes = Post::where('user_id', $user->id)
            ->withCount('likes')
            ->get()
            ->sum('likes_count');

        return Inertia::render('profile/show', [
            'author' => [
                'id' => $user->id,
                'name' => $user->name,
                'bio' => $user->bio,
                'avatar_url' => $user->avatar_url,
                'created_at' => $user->created_at,
                'followers_count' => $user->followers()->count(),
                'following_count' => $user->following()->count(),
                'posts_count' => $user->posts()->where('status', 'published')->count(),
                'total_likes' => $totalLikes,
            ],
            'posts' => $posts,
            'isFollowing' => $authUser ? $authUser->isFollowing($user) : false,
            'isOwnProfile' => $authUser?->id === $user->id,
        ]);
    }
}
