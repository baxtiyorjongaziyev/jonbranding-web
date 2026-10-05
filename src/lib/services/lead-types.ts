import { type SubmitFormData } from '@/lib/validation/submit-form';

export type CleanLeadData = Omit<SubmitFormData, 'companyWebsite' | 'turnstileToken'>;

export interface LeadData extends CleanLeadData {
  eventId: string;
  clientIp: string;
  userAgent: string;
  fbp?: string;
  fbc?: string;
}

export interface AmoCrmLeadResult {
  ok: boolean;
  skipped?: boolean;
  queued?: boolean;
  leadId?: number | null;
  contactId?: number | null;
  merged?: boolean;
  error?: string;
}

export interface AmoCrmErrorShape {
  status?: number;
  message?: string;
  detail?: string;
  type?: string;
}
