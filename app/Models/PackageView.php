<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PackageView extends Model
{
    /**
     * Get the package that this view belongs to.
     */
    public function package()
    {
        return $this->belongsTo(Package::class);
    }
}
