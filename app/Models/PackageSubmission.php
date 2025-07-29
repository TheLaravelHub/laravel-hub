<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PackageSubmission extends Model
{
    use SoftDeletes;

    protected $casts = [
        'notification_sent' => 'boolean',
    ];

    /**
     * Relationship: PackageSubmission belongs to a User
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
