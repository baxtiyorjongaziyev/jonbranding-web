import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import TrademarkCalculator from './trademark-calculator';

// Mock matchMedia since react-hook-form/radix-ui components may use it
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver for Radix UI components in jsdom
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = MockResizeObserver;

// Mock fetch global
global.fetch = vi.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true }),
  })
) as any;

const mockTranslations = {
  formTitle: "Ma'lumotlarni kiriting",
  brandNameLabel: "Brend nomi",
  brandNamePlaceholder: "Masalan: MyBrand",
  yourNameLabel: "Ismingiz",
  yourNamePlaceholder: "To'liq ismingizni kiriting",
  phoneLabel: "Telefon raqamingiz",
  phonePlaceholder: "+998901234567",
  classCountLabel: "Faoliyat turlari (klasslar) soni",
  classCountMax: "Maks. 45",
  decreaseClassCount: "Klasslar sonini kamaytirish",
  increaseClassCount: "Klasslar sonini ko'paytirish",
  personTypeLabel: "Shaxs turi",
  personTypeOptions: [
    { value: "jismoniy", label: "Jismoniy shaxs" },
    { value: "yuridik", label: "Yuridik shaxs" }
  ],
  speedLabel: "Ko'rib chiqish tezligi",
  speedOptions: [
    { value: "oddiy", label: "Oddiy (7 oy)", labelShort: "Oddiy" },
    { value: "tez", label: "Tezlashtirilgan (1.5 oy)", labelShort: "Tez" }
  ],
  expertCheckLabel: "Qo'shimcha ekspert tekshiruvi",
  expertCheckOptions: [
    { value: "ha", label: "Yoqilgan" },
    { value: "yoq", label: "O'chirilgan" }
  ],
  activityLabel: "Faoliyat turlari (ixtiyoriy)",
  activityPlaceholder: "Masalan: dizayn, qurilish...",
  submitButton: "Patentga buyurtma berish",
  submittingButton: "Yuborilmoqda...",
  successMessage: "✅ Buyurtma qabul qilindi!",
  tryAgainButton: "Qayta hisoblash",
  summaryTitle: "Xarajatlar tafsiloti",
  totalCostTitle: "Umumiy xarajat",
  currency: "so'm",
  classLabel: "klass",
  expertCheckLabelShort: "Ekspert+",
  totalCostNote: "Barcha bojlar qo'shilgan",
  error_brand: "Iltimos, brend nomini kiriting.",
  error_name: "Iltimos, ismingizni kiriting.",
  error_phone: "Iltimos, to'g'ri telefon raqamini kiriting.",
  privacyPolicyText: "Men Maxfiylik siyosati shartlarini qabul qilaman",
  error_privacy: "Siz maxfiylik siyosatini qabul qilishingiz kerak.",
  success_toast_title: "Muvaffaqiyatli!",
  success_toast_desc: "Sizning so'rovingiz qabul qilindi.",
  error_toast_title: "Xatolik!"
};

describe('TrademarkCalculator form submission', () => {
  it('allows form submission when all required fields including brand name are filled', async () => {
    render(<TrademarkCalculator translations={mockTranslations} />);

    // Get input fields
    const brandInput = screen.getByLabelText(/Brend nomi/i);
    const nameInput = screen.getByLabelText(/Ismingiz/i);
    const phoneInput = screen.getByLabelText(/Telefon raqamingiz/i);
    const privacyCheckbox = screen.getByRole('checkbox');
    const submitButton = screen.getByRole('button', { name: /Patentga buyurtma berish/i });

    // Fill the inputs
    fireEvent.change(brandInput, { target: { value: 'Apple' } });
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(phoneInput, { target: { value: '+998901234567' } });
    
    // Check privacy policy
    fireEvent.click(privacyCheckbox);

    // Submit the form
    fireEvent.click(submitButton);

    // Assert fetch was called (form successfully validated and submitted)
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/submit-form', expect.any(Object));
      expect(screen.getByText(/✅ Buyurtma qabul qilindi!/i)).toBeInTheDocument();
    });
  });
});
