
declare global {
  interface Window {
    __ENV__?: {
      NEXT_PUBLIC_TELEGRAM_WEBHOOK_URL?: string;
      NEXT_PUBLIC_GA_ID?: string;
      AIRTABLE_API_KEY?: string;
      AIRTABLE_BASE_ID?: string;
      AIRTABLE_TABLE_NAME_FAQ?: string;
      AIRTABLE_TABLE_NAME_TESTIMONIALS?: string;
      AIRTABLE_TABLE_NAME_BRANDS?: string;
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

declare module 'next/config' {
  interface PublicRuntimeConfig {
    AIRTABLE_API_KEY?: string;
    AIRTABLE_BASE_ID?: string;
    AIRTABLE_TABLE_NAME_FAQ?: string;
    AIRTABLE_TABLE_NAME_TESTIMONIALS?: string;
    AIRTABLE_TABLE_NAME_BRANDS?: string;
  }

  function getConfig(): {
    publicRuntimeConfig: PublicRuntimeConfig;
    serverRuntimeConfig: Record<string, unknown>;
  };

  export default getConfig;
}


export {};
