<?php

namespace App\Http\Controllers\Blog;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class FollowController extends Controller
{
    public function store(Request $request, User $user): RedirectResponse
    {
        if ($request->user()->id === $user->id) {
            abort(422, 'You cannot follow yourself.');
        }

        $request->user()->following()->syncWithoutDetaching([$user->id]);

        return back();
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        $request->user()->following()->detach($user->id);

        return back();
    }
}
