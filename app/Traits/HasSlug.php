<?php

namespace App\Traits;

trait HasSlug
{
    /**
     * Boot the trait.
     */
    public static function bootHasSlug(): void
    {
        static::creating(function ($model) {
            $model->slug = $model->generateSlug();
        });

        //        static::updating(function ($model) {
        //            $model->slug = $model->generateSlug($model->name);
        //        });
    }

    /**
     * Generate a unique slug for the model.
     */
    protected function generateSlug(): string
    {
        $sluggableColumn = $this->sluggable ?? 'name';
        $sluggableValue = $this->{$sluggableColumn};

        $slug = \Str::slug($sluggableValue);

        $count = $this->where('slug', $slug)->where('id', '!=', $this->id)->count();

        return $count ? "{$slug}-{$count}" : $slug;
    }
}
