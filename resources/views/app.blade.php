<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8" />
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1"
        />

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Open Graph Meta Tags -->
        <meta
            property="og:title"
            content="{{ 'Indxs - Explore Open Source Packages' }}"
        />
        <meta
            property="og:description"
            content="{{ 'Find the best Laravel and PHP packages.' }}"
        />
        <meta
            property="og:image"
            content="{{ asset('assets/images/og-image.png') }}"
        />
        <meta
            property="og:url"
            content="{{ url()->current() }}"
        />
        <meta
            property="og:type"
            content="website"
        />

        <!-- Twitter Card Meta Tags -->
        <meta
            name="twitter:card"
            content="summary_large_image"
        />
        <meta
            name="twitter:title"
            content="{{ 'Indxs - Explore Open Source Packages' }}"
        />
        <meta
            name="twitter:description"
            content="{{ 'Find the best Laravel and PHP packages.' }}"
        />
        <meta
            name="twitter:image"
            content="{{ asset('assets/images/og-image.png') }}"
        />

        <!-- Fonts -->
        <link
            rel="preconnect"
            href="https://fonts.bunny.net"
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

        <script>
            window.asset = (path) => `{{ asset('${path}') }}`
        </script>
    </body>
</html>
