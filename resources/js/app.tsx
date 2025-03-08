import '../css/app.css'
import './bootstrap'

import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { router } from '@inertiajs/react'
import Mixpanel from '@/lib/mixpanel'

const appName = import.meta.env.VITE_APP_NAME || 'Laravel'
router.on('navigate', (event) => {
    Mixpanel.track('Page Viewed', { page: event.detail.page.url })
})

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        if (import.meta.env.SSR) {
            hydrateRoot(el, <App {...props} />)
            return
        }

        createRoot(el).render(<App {...props} />)
    },
    progress: {
        color: '#4B5563',
    },
})
