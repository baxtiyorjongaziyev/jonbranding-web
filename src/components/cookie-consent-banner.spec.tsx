import { fireEvent, render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next/navigation', () => ({ usePathname: () => '/' }))

import CookieConsentBanner from './cookie-consent-banner'

function clearConsentCookie() {
  document.cookie = 'cookie_consent_accepted=; path=/; max-age=0'
}

describe('CookieConsentBanner', () => {
  beforeEach(() => {
    localStorage.clear()
    clearConsentCookie()
    vi.clearAllMocks()
  })

  it('does not record consent or fire the accept event before a choice', () => {
    const listener = vi.fn()
    window.addEventListener('cookie-consent-accepted', listener)
    render(<CookieConsentBanner />)

    expect(screen.getByRole('dialog')).toBeTruthy()
    expect(document.cookie).not.toContain('cookie_consent_accepted=true')
    expect(localStorage.getItem('cookie_consent_accepted')).toBeNull()
    expect(listener).not.toHaveBeenCalled()
    window.removeEventListener('cookie-consent-accepted', listener)
  })

  it('records acceptance and notifies the analytics loader', () => {
    const listener = vi.fn()
    window.addEventListener('cookie-consent-accepted', listener)
    render(<CookieConsentBanner />)

    fireEvent.click(screen.getByText('Qabul qilish'))

    expect(document.cookie).toContain('cookie_consent_accepted=true')
    expect(listener).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('dialog')).toBeNull()
    window.removeEventListener('cookie-consent-accepted', listener)
  })

  it('persists rejection and stays hidden on the next mount', () => {
    const { unmount } = render(<CookieConsentBanner />)
    fireEvent.click(screen.getByText('Rad etish'))
    expect(document.cookie).toContain('cookie_consent_accepted=false')
    unmount()

    render(<CookieConsentBanner />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('reopens when cookie settings are requested', () => {
    document.cookie = 'cookie_consent_accepted=false; path=/'
    render(<CookieConsentBanner />)
    expect(screen.queryByRole('dialog')).toBeNull()

    fireEvent(window, new CustomEvent('open-cookie-settings'))
    expect(screen.getByRole('dialog')).toBeTruthy()
  })
})
