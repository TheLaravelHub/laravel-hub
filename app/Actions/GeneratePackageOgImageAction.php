<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\Package;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Spatie\Browsershot\Browsershot;

class GeneratePackageOgImageAction
{
    public function handle(Package $package): void
    {
        try {
            $tempUrl = route('og-images.package', ['package' => $package->id]);

            // Target file
            $storagePath = storage_path('app/public/package-og-images');
            $this->ensureDir($storagePath);

            $filename = Str::slug($package->name).'-'.Str::random(8).'.jpg';
            $fullPath = $storagePath.'/'.$filename;

            // Binaries
            $nodePath = $this->which('node') ?? '/usr/bin/node';
            $npmPath = $this->which('npm') ?? '/usr/bin/npm';

            // Writable Chrome profile/cache dir
            $userDataDir = rtrim((string) env('BROWSERSHOT_USER_DATA_DIR', '/var/www/browsershot-cache'), '/');
            $this->ensureDir($userDataDir);

            // Ensure the env seen by the child process points to our writable dir
            foreach (['HOME', 'XDG_CONFIG_HOME', 'XDG_CACHE_HOME'] as $var) {
                putenv($var.'='.$userDataDir);
                $_ENV[$var] = $userDataDir;
                $_SERVER[$var] = $userDataDir;
            }

            // Prefer explicit path via env; otherwise auto-detect
            $chromePath = env('CHROME_PATH') ?: $this->detectChromePath();

            // IMPORTANT: do NOT prefix with `--` here; Browsershot will add them
            $chromiumArgs = [
                'headless=new',
                'no-sandbox',
                'disable-setuid-sandbox',
                'disable-dev-shm-usage',
                'disable-gpu',
                'no-zygote',
                'single-process',
                'hide-scrollbars',
                "user-data-dir={$userDataDir}",
                'no-first-run',
                'no-default-browser-check',
                'disable-crash-reporter',
                "data-path={$userDataDir}/data",
                "disk-cache-dir={$userDataDir}/cache",
            ];

            $browserShot = Browsershot::url($tempUrl)
                ->setNodeBinary($nodePath)
                ->setNpmBinary($npmPath)
                ->windowSize(1200, 630)
                ->waitUntilNetworkIdle()
                ->setScreenshotType('jpeg', 90)
                ->addChromiumArguments($chromiumArgs);

            if ($chromePath) {
                $browserShot->setChromePath($chromePath);
            }

            $browserShot->save($fullPath);

            if (is_file($fullPath)) {
                $package->addMedia($fullPath)
                    ->usingName('og-image')
                    ->usingFileName($filename)
                    ->toMediaCollection('og-images', 'package-og-images');

                Log::info('OG Image Generated: '.$package->getFirstMediaUrl('og-images'));
            } else {
                Log::error('OG image file missing after save', ['path' => $fullPath]);
            }
        } catch (\Throwable $e) {
            Log::error('OG Image Generation Error: '.$e->getMessage(), ['exception' => $e]);
            throw $e;
        }
    }

    private function ensureDir(string $dir): void
    {
        if (! is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }
    }

    private function which(string $bin): ?string
    {
        $path = @exec(sprintf('command -v %s', escapeshellarg($bin)));

        return $path ?: null;
    }

    private function detectChromePath(): ?string
    {
        $candidates = [
            '/usr/bin/google-chrome',
            '/usr/bin/google-chrome-stable',
            '/usr/local/bin/google-chrome',
            '/usr/bin/chromium',
            '/usr/bin/chromium-browser',
        ];

        foreach ($candidates as $path) {
            if (is_file($path) && is_executable($path)) {
                return $path;
            }
        }

        return null;
    }
}
