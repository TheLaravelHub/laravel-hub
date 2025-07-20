<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UserService
{
    public function generateUsername(User $user): string
    {
        $base = Str::of($user->name)
            ->lower()
            ->replaceMatches('/[^a-z0-9]+/', '.')
            ->trim('.');

        $username = $base;
        $i = 1;

        while (
            DB::table('users')
                ->where('username', $username)
                ->exists()
        ) {
            $username = "{$base}{$i}";
            $i++;
        }

        return $username;
    }
}
