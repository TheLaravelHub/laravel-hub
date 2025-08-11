<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait HasSlug
{
    /**
     * Boot the trait.
     */
    public static function bootHasSlug(): void
    {
        static::creating(function ($model) {
            if (empty($model->slug)) {
                $sluggableColumn = $model->sluggable ?? 'name';
                $model->slug = static::generateSlug($model->{$sluggableColumn});
            }
        });
    }

    /**
     * Generate a unique slug for the model.
     */
    public static function generateSlug(?string $name = null): string
    {
        $instance = new static;
        $sluggableColumn = $instance->sluggable ?? 'name';
        $sluggableValue = $name ?? $instance->{$sluggableColumn};

        $slug = Str::slug($sluggableValue);

        return static::ensureUniqueSlug($slug);
    }

    /**
     * Ensure the slug is unique by appending a number if necessary.
     */
    private static function ensureUniqueSlug(string $slug, int $count = 0): string
    {
        $instance = new static;
        $currentSlug = $count ? "{$slug}-{$count}" : $slug;

        $exists = $instance->query()->where('slug', $currentSlug)->exists();

        if ($exists) {
            return static::ensureUniqueSlug($slug, $count + 1);
        }

        return $currentSlug;
    }
}
