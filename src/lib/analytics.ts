declare global {
  interface Window {
    umami?: {
      track: (eventName: string) => void
    }
  }
}

export function trackEvent(eventName: string) {
  window.umami?.track(eventName)
}
