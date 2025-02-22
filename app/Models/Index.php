<?php

namespace App\Models;

use App\Traits\HasSlug;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Thefeqy\ModelStatus\Traits\HasActiveScope;

class Index extends Model implements HasMedia
{
    use HasActiveScope;
    use HasSlug;
    use InteractsWithMedia;
    use SoftDeletes;

    protected $table = 'indexes';

    protected $fillable = ['name', 'description', 'slug', 'color_code'];

    protected function casts()
    {
        return [
            // 'status' => Status::class,
        ];
    }
}
