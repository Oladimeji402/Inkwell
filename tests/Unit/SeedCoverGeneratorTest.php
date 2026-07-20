<?php

use Database\Seeders\Support\SeedCoverGenerator;
use Tests\TestCase;

uses(TestCase::class);

test('seed cover generator creates a png file', function () {
    $path = (new SeedCoverGenerator)->generate('Design is mostly editing', 1);

    expect($path)->toBeString()
        ->and(is_file($path))->toBeTrue()
        ->and(mime_content_type($path))->toBe('image/png');

    @unlink($path);
})->skip(
    fn () => ! extension_loaded('gd'),
    'GD extension is required to generate seed covers.',
);
