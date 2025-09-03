
declare global {
  interface Window {
    __ENV__?: {
      NEXT_PUBLIC_TELEGRAM_WEBHOOK_URL?: string;
      NEXT_PUBLIC_GA_ID?: string;
    };
    gtag?: (...args: any[]) => void;
    bus?: {
      emit: (...args: any[]) => void;
      on: (...args: any[]) => void;
      off: (...args: any[]) => void;
    };
    analytics?: {
      eventBus: {
        emit: (...args: any[]) => void;
        on: (...args: any[]) => void;
        off: (...args: any[]) => void;
      };
    };
  }
}

export {};
