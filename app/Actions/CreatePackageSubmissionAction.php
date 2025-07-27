<?php

namespace App\Actions;

use App\Enums\ReviewStatus;
use App\Models\PackageSubmission;
use App\Models\User;

class CreatePackageSubmissionAction
{
    /**
     * Handle the package submission creation.
     *
     * @param User $user
     * @param array<string, mixed> $data
     * @return PackageSubmission
     */
    public function handle(User $user, array $data): PackageSubmission
    {
        return $user->packageSubmissions()->create([
            'repository_url' => $data['repository_url'],
            'status' => ReviewStatus::PENDING,
        ]);
    }
}
