import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import CookieConsentBanner from './cookie-consent-banner'

describe('CookieConsentBanner', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should set cookie consent in localStorage on mount', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
    render(<CookieConsentBanner />)
    expect(setItemSpy).toHaveBeenCalledWith('cookie_consent_accepted', 'true')
    expect(localStorage.getItem('cookie_consent_accepted')).toBe('true')
  })
})
