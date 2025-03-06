<?php

namespace App\Traits;

trait HasStatus
{
    public function setStatusAttribute($value)
    {
        $this->attributes['status'] = $value ? 'active' : 'inactive';
    }
}
