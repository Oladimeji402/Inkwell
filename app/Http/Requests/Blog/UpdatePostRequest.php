<?php

namespace App\Http\Requests\Blog;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Policy check: only the post author can update
        $post = $this->route('post');

        return $post && $this->user()?->id === $post->user_id;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'body' => ['required', 'string'],
            'cover_image' => ['nullable', 'image', 'max:2048'],
            'status' => ['required', Rule::in(['draft', 'published'])],
        ];
    }
}
