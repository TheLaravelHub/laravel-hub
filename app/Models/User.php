<?php

namespace App\Models;

use App\Enums\SocialProvider;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Thefeqy\ModelStatus\Traits\HasActiveScope;

class User extends Authenticatable implements FilamentUser, MustVerifyEmail
{
    use HasActiveScope;

    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory;

    use Notifiable;
    use SoftDeletes;

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'provider_token',
        'provider_refresh_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'github_id' => 'string',
            'github_avatar' => 'string',
            'provider_type' => SocialProvider::class,
        ];
    }

    public function packages(): HasMany
    {
        return $this->hasMany(Package::class);
    }

    /**
     * Get the package submissions for the user.
     */
    public function packageSubmissions(): HasMany
    {
        return $this->hasMany(PackageSubmission::class);
    }

    public function canAccessPanel(Panel $panel): bool
    {
        return $this->is_admin;
    }

    public function bookmarkedPosts()
    {
        return $this->belongsToMany(FeedPost::class, 'feed_post_bookmarks')
            ->using(FeedPostBookmark::class)
            ->withTimestamps();
    }

    public function getAvatarUrlAttribute(): string
    {
        if (! empty($this->avatar)) {
            return $this->avatar;
        }

        return 'https://ui-avatars.com/api/?name='.urlencode(Str::substr($this->name, 0, 1)).'&background=random&color=fff&size=128';
    }
}
