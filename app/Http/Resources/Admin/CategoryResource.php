<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public static $wrap = null;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'status' => $this->status,
            'packages_count' => $this->packages_count,
            'packages' => $this->whenLoaded('packages', function () {
                $packages = $this->packages()->paginate(12);
                return [
                    'data' => PackageResource::collection($packages->load('index', 'categories')),
                    'links' => [
                        'first' => $packages->url(1),
                        'last' => $packages->url($packages->lastPage()),
                        'prev' => $packages->previousPageUrl(),
                        'next' => $packages->nextPageUrl(),
                    ],
                    'meta' => [
                        'current_page' => $packages->currentPage(),
                        'from' => $packages->firstItem() ?? 0,
                        'last_page' => $packages->lastPage(),
                        'path' => $packages->path(),
                        'per_page' => $packages->perPage(),
                        'to' => $packages->lastItem() ?? 0,
                        'total' => $packages->total(),
                        'links' => $packages->linkCollection()->values()->all(),
                    ],
                ];
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
