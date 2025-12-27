<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class FeedSource extends Model implements HasMedia
{
    use InteractsWithMedia;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'logo_url',
        'website_url',
        'rss_feed_url',
        'type',
        'is_active',
        'last_fetched_at',
        'fetch_frequency_minutes',
        'metadata',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'last_fetched_at' => 'datetime',
        'metadata' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();

        // Cascade soft delete to posts
        static::deleting(function ($feedSource) {
            if ($feedSource->isForceDeleting()) {
                // Force delete all posts when force deleting the source
                $feedSource->posts()->forceDelete();
            } else {
                // Soft delete all posts when soft deleting the source
                $feedSource->posts()->delete();
            }
        });

        // Cascade restore to posts
        static::restoring(function ($feedSource) {
            $feedSource->posts()->onlyTrashed()->restore();
        });
    }

    public function posts(): HasMany
    {
        return $this->hasMany(FeedPost::class);
    }

    public function activePosts(): HasMany
    {
        return $this->hasMany(FeedPost::class)->whereNull('deleted_at');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeNeedsFetch($query)
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('last_fetched_at')
                    ->orWhereRaw("last_fetched_at < NOW() - (fetch_frequency_minutes || ' minutes')::interval");
            });
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('source_logo')
            ->singleFile()
            ->useFallbackUrl(asset('assets/images/placeholder-logo.png'));
    }

    // Accessor to get logo URL (maintaining backward compatibility with logo_url field)
    public function getLogoAttribute(): ?string
    {
        // First check if there's a media file
        $media = $this->getFirstMediaUrl('source_logo');
        if ($media) {
            return $media;
        }

        // Fallback to logo_url field if no media
        return $this->logo_url;
    }
}
