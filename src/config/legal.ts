import { siteConfig } from './site';

/**
 * Business details used by the legal pages.
 * DRAFT DEFAULTS: the values marked CONFIRM are business decisions —
 * the founders should confirm (or change) them before launch.
 */
export const legal = {
  lastUpdated: '7 November 2026',
  brand: siteConfig.name,
  /** CONFIRM: registered business / company name, e.g. "breathEN Pvt. Ltd." */
  entityName: siteConfig.legalName,
  /** CONFIRM: registered address */
  address: 'Navi Mumbai, Maharashtra, India',
  /** CONFIRM: GSTIN, shown on policies when set */
  gstin: '',
  email: siteConfig.contact.email,
  phone: '+91 98192 50202',
  /** CONFIRM: grievance officer (required under DPDP / consumer rules) */
  grievanceOfficer: { name: '', email: siteConfig.contact.email },
  /** CONFIRM: courts with jurisdiction */
  jurisdiction: 'Mumbai, Maharashtra',
  shipping: {
    /** CONFIRM */
    dispatchDays: '1–2 business days',
    /** CONFIRM */
    deliveryDays: '5–7 business days',
  },
  returns: {
    /** CONFIRM: hours after delivery to report damage/defect */
    reportWithinHours: 48,
    /** CONFIRM */
    refundDays: '5–7 business days',
  },
} as const;

export const legalLinks = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms & Conditions' },
  { href: '/refund-policy', label: 'Refund & Cancellation' },
  { href: '/shipping-policy', label: 'Shipping Policy' },
] as const;
