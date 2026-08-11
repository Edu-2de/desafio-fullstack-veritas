export const MOBILE_BREAKPOINT_QUERY = '(max-width: 639px)'

export function isMobileViewport(): boolean {
  return window.matchMedia(MOBILE_BREAKPOINT_QUERY).matches
}
