<?php

namespace App\Models;

use App\Traits\HasSlug;
use App\Traits\HasStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Thefeqy\ModelStatus\Casts\StatusCast;
use Thefeqy\ModelStatus\Traits\HasActiveScope;

class Index extends Model implements HasMedia
{
    use HasActiveScope;
    use HasSlug;
    use HasStatus;
    use InteractsWithMedia;
    use SoftDeletes;

    protected $table = 'indexes';

    protected $fillable = ['name', 'description', 'slug', 'color_code'];

    protected array $cascadeDeactivate = ['packages'];

    //    protected function casts()
    //    {
    //        return [
    //            'status' => StatusCast::class,
    //        ];
    //    }

    public function packages(): BelongsToMany
    {
        return $this->belongsToMany(Package::class);
    }
}
