<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Thefeqy\ModelStatus\Enums\Status;
use Thefeqy\ModelStatus\Traits\HasActiveScope;

class Index extends Model implements HasMedia
{
    use SoftDeletes, InteractsWithMedia, HasActiveScope;

    protected $table = 'indexes';

    protected $fillable = ['name', 'description', 'slug'];

    protected function casts()
    {
        return [
            'status' => Status::class,
        ];
    }
}
