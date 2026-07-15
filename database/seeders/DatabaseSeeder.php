<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // 10 published posts by the test user
        Post::factory(10)->published()->create(['user_id' => $user->id]);

        // 3 draft posts
        Post::factory(3)->draft()->create(['user_id' => $user->id]);
    }
}
