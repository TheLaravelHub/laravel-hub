import { useCallback } from 'react'
import Mixpanel from '@/lib/mixpanel'

const useClickTracker = (type: string, options: { [key: string]: any }) => {
    return useCallback(() => {
        Mixpanel.track(type, options)
    }, [type, options])
}

export default useClickTracker
