<?php

namespace App\Http\Controllers\Blog;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommentController extends Controller
{
    public function store(Request $request, Post $post): RedirectResponse
    {
        $request->validate([
            'body' => ['required', 'string', 'max:1000'],
        ]);

        $post->comments()->create([
            'user_id' => $request->user()->id,
            'body' => $request->body,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Comment posted.']);

        return back();
    }

    public function destroy(Request $request, Post $post, Comment $comment): RedirectResponse
    {
        if ($request->user()->id !== $comment->user_id) {
            abort(403);
        }

        $comment->delete();

        return back();
    }
}
