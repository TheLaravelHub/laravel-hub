<?php

namespace App\Actions;

use App\Models\Package;
use Illuminate\Support\Str;
use Spatie\Browsershot\Browsershot;

class GeneratePackageOgImageAction
{
    /**
     * Generate an OG image for a package and store it using Spatie Media Library
     */
    public function handle(Package $package): void
    {
        try {
            $tempUrl = route('og-images.package', ['package' => $package->id]);

            $storagePath = storage_path('app/public/package-og-images');
            if (! file_exists($storagePath)) {
                mkdir($storagePath, 0755, true);
            }

            $filename = Str::slug($package->name).'-'.Str::random(8).'.jpg';
            $fullPath = $storagePath.'/'.$filename;

            $nodePath = exec('which node') ?: '/usr/bin/node';
            $npmPath = exec('which npm') ?: '/usr/bin/npm';

            Browsershot::url($tempUrl)
                ->setNodeBinary($nodePath)
                ->setNpmBinary($npmPath)
                ->windowSize(1200, 630)
                ->waitUntilNetworkIdle()
                ->setScreenshotType('jpeg', 90)
                ->save($fullPath);

            if (file_exists($fullPath)) {
                $media = $package->addMedia($fullPath)
                    ->usingName('og-image')
                    ->usingFileName($filename)
                    ->toMediaCollection('og-images', 'package-og-images');

                \Log::info('OG Image Generated: '.$package->getFirstMediaUrl('og-images'));
            }
        } catch (\Exception $e) {
            \Log::error('OG Image Generation Error: '.$e->getMessage());
            \Log::error($e->getTraceAsString());

            throw $e;
        }
    }
}
