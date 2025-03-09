import mixpanel from 'mixpanel-browser'

mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN || '')

const Mixpanel = {
    track: (event: string, properties?: Record<string, any>) => {
        mixpanel.track(event, properties)
    },
    identify: (id: string) => {
        mixpanel.identify(id)
    },
    setPeopleProperties: (properties: Record<string, any>) => {
        mixpanel.people.set(properties)
    },
}

export default Mixpanel
