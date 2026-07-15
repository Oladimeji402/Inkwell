<?php

use App\Http\Controllers\Blog\CommentController;
use App\Http\Controllers\Blog\FollowController;
use App\Http\Controllers\Blog\LikeController;
use App\Http\Controllers\Blog\PostController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PublicProfileController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;

// ── Public pages ──────────────────────────────────────────────────────────
Route::get('/', WelcomeController::class)->name('home');
Route::inertia('/about', 'about')->name('about');
Route::inertia('/contact', 'contact')->name('contact');

// ── Auth app ──────────────────────────────────────────────────────────────
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
});

// ── Blog (public read) ────────────────────────────────────────────────────
Route::get('blog', [PostController::class, 'index'])->name('blog.index');

// ── Blog (auth write) — must come BEFORE the {post:slug} wildcard ─────────
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('blog/create', [PostController::class, 'create'])->name('blog.create');
    Route::get('blog/drafts', [PostController::class, 'drafts'])->name('blog.drafts');
    Route::post('blog', [PostController::class, 'store'])->name('blog.store')->middleware('throttle:30,1');
    Route::get('blog/{post:slug}/edit', [PostController::class, 'edit'])->name('blog.edit');
    Route::put('blog/{post:slug}', [PostController::class, 'update'])->name('blog.update');
    Route::patch('blog/{post:slug}/publish', [PostController::class, 'publish'])->name('blog.publish');
    Route::patch('blog/{post:slug}/unpublish', [PostController::class, 'unpublish'])->name('blog.unpublish');
    Route::delete('blog/{post:slug}', [PostController::class, 'destroy'])->name('blog.destroy');

    // Comments — 60 per hour per user
    Route::post('blog/{post:slug}/comments', [CommentController::class, 'store'])
        ->name('comments.store')
        ->middleware('throttle:60,60');
    Route::delete('blog/{post:slug}/comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');

    // Likes — 120 per minute (toggle quickly)
    Route::post('blog/{post:slug}/like', [LikeController::class, 'store'])
        ->name('likes.store')
        ->middleware('throttle:120,1');
    Route::delete('blog/{post:slug}/like', [LikeController::class, 'destroy'])
        ->name('likes.destroy')
        ->middleware('throttle:120,1');

    // Follows — 60 per minute
    Route::post('users/{user}/follow', [FollowController::class, 'store'])
        ->name('users.follow')
        ->middleware('throttle:60,1');
    Route::delete('users/{user}/follow', [FollowController::class, 'destroy'])
        ->name('users.unfollow')
        ->middleware('throttle:60,1');
});

// Wildcard slug route — must come AFTER all static /blog/* routes
Route::get('blog/{post:slug}', [PostController::class, 'show'])->name('blog.show');

// ── Public profiles ───────────────────────────────────────────────────────
Route::get('users/{user}', [PublicProfileController::class, 'show'])->name('users.show');

require __DIR__.'/settings.php';
