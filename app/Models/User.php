<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string|null $avatar
 * @property string|null $bio
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read string|null $avatar_url
 */
#[Fillable(['name', 'email', 'password', 'avatar', 'bio'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    protected $appends = ['avatar_url'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function getAvatarUrlAttribute(): ?string
    {
        if (! $this->avatar) {
            return null;
        }

        return Storage::disk('public')->url($this->avatar);
    }

    // ── Posts ──────────────────────────────────────────────────────────────

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    // ── Follows ────────────────────────────────────────────────────────────

    public function following(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'follows', 'follower_id', 'following_id')
            ->withPivot('created_at');
    }

    public function followers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'follows', 'following_id', 'follower_id')
            ->withPivot('created_at');
    }

    public function isFollowing(User $user): bool
    {
        return $this->following()->where('following_id', $user->id)->exists();
    }

    // ── Likes ──────────────────────────────────────────────────────────────

    public function likedPosts(): BelongsToMany
    {
        return $this->belongsToMany(Post::class, 'likes')->withPivot('created_at');
    }

    public function hasLiked(Post $post): bool
    {
        return $this->likedPosts()->where('post_id', $post->id)->exists();
    }

    public function totalLikesReceived(): int
    {
        return Post::where('user_id', $this->id)
            ->withCount('likes')
            ->get()
            ->sum('likes_count');
    }

    // ── Comments ───────────────────────────────────────────────────────────

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }
}
