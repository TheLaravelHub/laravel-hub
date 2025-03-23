<?php

declare(strict_types=1);

namespace App\Filament\Resources\BlogPostCategoryResource\Pages;

use App\Filament\Resources\BlogPostCategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

final class EditBlogPostCategory extends EditRecord
{
    protected static string $resource = BlogPostCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
