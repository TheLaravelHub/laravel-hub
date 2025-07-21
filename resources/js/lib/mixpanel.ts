import mixpanel from 'mixpanel-browser'

// Create a safer version of Mixpanel that won't break if blocked by ad blockers
let mixpanelInitialized = false

try {
    if (import.meta.env.VITE_MIXPANEL_TOKEN) {
        mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN)
        mixpanelInitialized = true
    }
} catch (error) {
    console.warn(
        'Mixpanel initialization failed, analytics will be disabled',
        error,
    )
}

const Mixpanel = {
    track: (event: string, properties?: Record<string, any>) => {
        if (mixpanelInitialized) {
            try {
                mixpanel.track(event, properties)
            } catch (error) {
                console.warn(`Failed to track event: ${event}`, error)
            }
        }
    },
    identify: (id: string) => {
        if (mixpanelInitialized) {
            try {
                mixpanel.identify(id)
            } catch (error) {
                console.warn(`Failed to identify user: ${id}`, error)
            }
        }
    },
    setPeopleProperties: (properties: Record<string, any>) => {
        if (mixpanelInitialized) {
            try {
                mixpanel.people.set(properties)
            } catch (error) {
                console.warn('Failed to set people properties', error)
            }
        }
    },
}

export default Mixpanel
