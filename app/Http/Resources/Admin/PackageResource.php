<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PackageResource extends JsonResource
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
            'index_id' => $this->index_id,
            'index' => new IndexResource($this->whenLoaded('index')),
            'categories' => CategoryResource::collection($this->whenLoaded('categories')),
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'repository_url' => $this->repository_url,
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'language' => $this->language,
            'stars' => $this->stars,
            'forks' => $this->forks,
            'open_issues' => $this->open_issues,
            'owner' => $this->owner,
            'owner_avatar' => $this->owner_avatar,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
