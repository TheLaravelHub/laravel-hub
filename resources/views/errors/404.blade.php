<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1"
        />
        <title>404 - Not Found</title>
        <link
            rel="preconnect"
            href="https://fonts.bunny.net"
        />
        <link
            href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap"
            rel="stylesheet"
        />
        @viteReactRefresh
        @vite(['resources/js/app.tsx'])
    </head>
    <body class="bg-white text-foreground">
        <div class="flex min-h-screen flex-col items-center justify-center p-4">
            <div class="mb-8">
                <img
                    src="{{ asset('assets/images/Indxs-logo.png') }}"
                    alt="Indxs Logo"
                    class="h-16"
                />
            </div>
            <div class="text-center">
                <h1 class="text-9xl font-bold text-primary">404</h1>
                <h2 class="mt-4 text-2xl text-gray-900">Page Not Found</h2>
                <p class="mt-2 text-gray-600">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <div class="mt-8 flex justify-center">
                    <a
                        href="/"
                        class="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
                    >
                        Return Home
                    </a>
                </div>
            </div>
        </div>
    </body>
</html>
