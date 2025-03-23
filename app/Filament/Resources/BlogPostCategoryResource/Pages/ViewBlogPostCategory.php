<?php

declare(strict_types=1);

namespace App\Filament\Resources\BlogPostCategoryResource\Pages;

use App\Filament\Resources\BlogPostCategoryResource;
use Filament\Resources\Pages\ViewRecord;

final class ViewBlogPostCategory extends ViewRecord
{
    protected static string $resource = BlogPostCategoryResource::class;
}
