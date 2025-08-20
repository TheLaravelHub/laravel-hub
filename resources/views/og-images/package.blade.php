<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
        />
        <title>{{ $package->name }} OG Image</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                width: 1200px;
                height: 630px;
                font-family:
                    system-ui,
                    -apple-system,
                    BlinkMacSystemFont,
                    'Segoe UI',
                    Roboto,
                    Oxygen,
                    Ubuntu,
                    Cantarell,
                    'Open Sans',
                    'Helvetica Neue',
                    sans-serif;
                background: linear-gradient(to right, #0f172a, #1e293b);
                color: #f8fafc;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                position: relative;
            }
            .container {
                width: 1100px;
                height: 530px;
                padding: 40px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                position: relative;
                z-index: 10;
            }
            .header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 20px;
            }
            .logo {
                width: 300px;
            }
            .logo img {
                width: 100%;
            }
            .package-name {
                font-size: 64px;
                font-weight: 800;
                margin: 20px 0;
                line-height: 1.1;
                max-width: 900px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
            .description {
                font-size: 28px;
                color: #cbd5e1;
                margin-bottom: 30px;
                max-width: 900px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
            }
            .meta {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 30px;
                margin-top: 20px;
            }
            .meta > div {
                display: flex;
                align-items: center;
                gap: 20px;
            }
            .meta-item {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .meta-item-value {
                font-size: 24px;
                font-weight: 600;
            }
            .meta-item-label {
                font-size: 18px;
                color: #94a3b8;
            }
            .owner {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            .owner-avatar {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                object-fit: cover;
            }
            .owner-name {
                font-size: 24px;
                font-weight: 600;
            }
            .background-pattern {
                position: absolute;
                top: 0;
                right: 0;
                width: 100%;
                height: 100%;
                opacity: 0.05;
                z-index: 1;
                background-size: 20px 20px;
                background-image:
                    linear-gradient(to right, #64748b 1px, transparent 1px),
                    linear-gradient(to bottom, #64748b 1px, transparent 1px);
            }
            .index-badges {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-top: 10px;
            }
            .index-badge {
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 18px;
                font-weight: 600;
                color: #ffffff;
                display: inline-block;
            }
            .index-badge {
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 18px;
                font-weight: 600;
                color: #ffffff;
                display: inline-block;
            }
            .index-badge {
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 18px;
                font-weight: 600;
                color: #ffffff;
                display: inline-block;
            }
        </style>
    </head>
    <body>
        <div class="background-pattern"></div>
        <div class="container">
            <div>
                <div class="header">
                    <div class="logo">
                        <img
                            src="{{ asset('assets/images/logo.png') }}"
                            alt="Laravel Hub Logo"
                        />
                    </div>
                    <div class="index-badges">
                        @foreach ($package->indexes as $index)
                            <div
                                class="index-badge"
                                style="
                                    background-color: {{ $index->color_code ?? '#2563eb' }};
                                "
                            >
                                {{ $index->name }}
                            </div>
                        @endforeach
                    </div>
                </div>
                <h1 class="package-name">{{ $package->name }}</h1>
                @if ($package->description)
                    <p class="description">{{ $package->description }}</p>
                @endif
            </div>

            <div class="meta">
                <div class="owner">
                    @if ($package->owner_avatar)
                        <img
                            src="{{ $package->owner_avatar }}"
                            alt="{{ $package->owner }}"
                            class="owner-avatar"
                        />
                    @endif

                    <span class="owner-name">{{ $package->owner }}</span>
                </div>

                <div>
                    <div class="meta-item">
                        <div class="meta-item-value">
                            {{ $package->stars }}
                        </div>
                        <div class="meta-item-label">Stars</div>
                    </div>

                    @if ($package->categories->count() > 0)
                        <div class="meta-item">
                            <div class="meta-item-value">
                                {{ $package->categories->first()->name }}
                            </div>
                            <div class="meta-item-label">Category</div>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </body>
</html>
