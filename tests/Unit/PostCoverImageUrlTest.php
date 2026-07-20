<?php

use App\Models\Post;
use Illuminate\Support\Facades\Storage;

test('cover image url strips file extensions for cloudinary public ids', function () {
    $disk = Mockery::mock();
    $disk->shouldReceive('url')
        ->once()
        ->with('covers/demo-cover')
        ->andReturn('https://res.cloudinary.com/demo/image/upload/v1/covers/demo-cover');

    Storage::shouldReceive('disk')
        ->once()
        ->with('cloudinary')
        ->andReturn($disk);

    $post = new Post(['cover_image' => 'covers/demo-cover.png']);

    expect($post->cover_image_url)
        ->toBe('https://res.cloudinary.com/demo/image/upload/v1/covers/demo-cover');
});

test('cover image url returns null when missing', function () {
    $post = new Post(['cover_image' => null]);

    expect($post->cover_image_url)->toBeNull();
});
