<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8" />
        <meta
            name="color-scheme"
            content="light"
        />
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1"
        />

        <!-- Fonts -->
        <link
            rel="preconnect"
            href="https://fonts.bunny.net"
            crossorigin
        />
        <link
            href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap"
            rel="stylesheet"
        />

        <!-- Favicon -->
        <link
            rel="icon"
            href="{{ asset('assets/images/favicon.ico') }}"
        />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
