<?php

namespace App\Queries;

use App\Models\User;

class AvatarUsersMapQuery
{
    public function get(): array
    {
        return User::query()
            ->whereNotNull('avatar')
            ->limit(6)
            ->get(['id', 'name', 'avatar'])
            ->keyBy('id')
            ->map(fn ($u) => [
                'name' => $u->name,
                'avatar' => $u->avatar,
            ])
            ->toArray();
    }
}
