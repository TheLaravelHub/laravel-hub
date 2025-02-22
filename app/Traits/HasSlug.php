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
            $model->slug = $model->generateSlug($model->name);
        });

//        static::updating(function ($model) {
//            $model->slug = $model->generateSlug($model->name);
//        });
    }

    /**
     * Generate a unique slug for the model.
     *
     * @param  string  $name
     * @return string
     */
    protected function generateSlug(string $name): string
    {
        $slug = \Str::slug($name);

        $count = $this->where('slug', $slug)->where('id', '!=', $this->id)->count();

        return $count ? "{$slug}-{$count}" : $slug;
    }
}
