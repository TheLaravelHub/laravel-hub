<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1"
        />
        <title>419 - too many attempts</title>
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

        <style>
            body {
                background: url('assets/images/419.png');
                background-size: cover; /* Like object-fit: cover */
                background-position: center; /* Center the image */
                background-repeat: no-repeat; /* Prevent tiling */
                width: 100%; /* Full width */
                height: 100vh;
            }
        </style>
    </head>
    <body class="bg-white text-foreground"></body>
</html>
