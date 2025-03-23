<?php

declare(strict_types=1);

namespace App\Traits;

trait HasStatus
{
    public function setStatusAttribute($value)
    {
        $this->attributes['status'] = $value ? 'active' : 'inactive';
    }
}
