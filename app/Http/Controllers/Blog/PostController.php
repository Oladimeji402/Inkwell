<?php

namespace App\Http\Controllers\Blog;

use App\Http\Controllers\Controller;
use App\Http\Requests\Blog\StorePostRequest;
use App\Http\Requests\Blog\UpdatePostRequest;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    /**
     * List published posts — all authors when public, own posts when logged in.
     */
    public function index(Request $request): Response
    {
        $posts = Post::with('author:id,name')
            ->withCount(['likes', 'comments'])
            ->where('status', 'published')
            ->latest('published_at')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('blog/index', [
            'posts' => $posts,
        ]);
    }

    /**
     * List only the authenticated user's draft posts.
     */
    public function drafts(Request $request): Response
    {
        $drafts = Post::where('user_id', $request->user()->id)
            ->where('status', 'draft')
            ->latest('updated_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('blog/drafts', [
            'drafts' => $drafts,
        ]);
    }

    /**
     * Show the form for creating a new post.
     */
    public function create(): Response
    {
        return Inertia::render('blog/create');
    }

    /**
     * Store a newly created post.
     */
    public function store(StorePostRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;
        $data['slug'] = Post::generateSlug($data['title']);

        if ($request->hasFile('cover_image')) {
            // Store without extension — Cloudinary appends it automatically
            $file = $request->file('cover_image');
            $filename = 'covers/'.pathinfo($file->hashName(), PATHINFO_FILENAME);
            Storage::disk('cloudinary')->put($filename, file_get_contents($file->getRealPath()));
            $data['cover_image'] = $filename;
        } else {
            $data['cover_image'] = null;
        }

        if ($data['status'] === 'published') {
            $data['published_at'] = Carbon::now();
        }

        $post = Post::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Post created successfully.']);

        return to_route('blog.show', $post);
    }

    /**
     * Display a single post with likes, comments, follow state.
     */
    public function show(Request $request, Post $post): Response
    {
        if (! $post->isPublished() && $request->user()?->id !== $post->user_id) {
            abort(404);
        }

        $authUser = $request->user();

        $post->load('author:id,name');
        $post->loadCount(['likes', 'comments']);

        $comments = $post->comments()
            ->with('author:id,name')
            ->latest()
            ->get();

        return Inertia::render('blog/show', [
            'post' => $post,
            'comments' => $comments,
            'canEdit' => $authUser?->id === $post->user_id,
            'liked' => $authUser ? $authUser->hasLiked($post) : false,
            'isFollowingAuthor' => $authUser && $authUser->id !== $post->user_id
                ? $authUser->isFollowing($post->author)
                : false,
            'authorFollowersCount' => $post->author->followers()->count(),
        ]);
    }

    /**
     * Show the form for editing the post.
     */
    public function edit(Request $request, Post $post): Response
    {
        if ($request->user()->id !== $post->user_id) {
            abort(403);
        }

        return Inertia::render('blog/edit', [
            'post' => $post,
        ]);
    }

    /**
     * Update the post.
     */
    public function update(UpdatePostRequest $request, Post $post): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('cover_image')) {
            // Delete the old image if one exists
            if ($post->cover_image) {
                Storage::disk('cloudinary')->delete($post->cover_image);
            }
            // Store without extension — Cloudinary appends it automatically
            $file = $request->file('cover_image');
            $filename = 'covers/'.pathinfo($file->hashName(), PATHINFO_FILENAME);
            Storage::disk('cloudinary')->put($filename, file_get_contents($file->getRealPath()));
            $data['cover_image'] = $filename;
        } else {
            // Keep the existing image path; don't overwrite with null
            unset($data['cover_image']);
        }

        // If publishing for the first time, record when
        if ($data['status'] === 'published' && $post->status === 'draft') {
            $data['published_at'] = Carbon::now();
        }

        // If switching back to draft, clear published_at
        if ($data['status'] === 'draft') {
            $data['published_at'] = null;
        }

        $post->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Post updated successfully.']);

        return to_route('blog.show', $post);
    }

    /**
     * Publish a draft post with one click.
     */
    public function publish(Request $request, Post $post): RedirectResponse
    {
        if ($request->user()->id !== $post->user_id) {
            abort(403);
        }

        if ($post->status === 'published') {
            return back();
        }

        $post->update([
            'status' => 'published',
            'published_at' => Carbon::now(),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Post published!']);

        return back();
    }

    /**
     * Unpublish (revert to draft) with one click.
     */
    public function unpublish(Request $request, Post $post): RedirectResponse
    {
        if ($request->user()->id !== $post->user_id) {
            abort(403);
        }

        $post->update([
            'status' => 'draft',
            'published_at' => null,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Post moved back to drafts.']);

        return back();
    }

    /**
     * Delete the post.
     */
    public function destroy(Request $request, Post $post): RedirectResponse
    {
        if ($request->user()->id !== $post->user_id) {
            abort(403);
        }

        if ($post->cover_image) {
            Storage::disk('cloudinary')->delete($post->cover_image);
        }

        $post->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Post deleted.']);

        return to_route('blog.index');
    }
}
