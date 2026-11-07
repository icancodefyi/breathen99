/**
 * Display-side pricing constants.
 * The server (Cluster 2) owns the authoritative catalog; the client only
 * uses these values for rendering until the API takes over.
 */
export const pricing = {
  currency: 'INR',
  basePrice: 495,
  mrpPrice: 900,
  maxQty: 50,
  bulkTiers: [
    { min: 1, max: 3, discountPct: 0, label: '1–3 cans', note: 'Standard price' },
    { min: 4, max: 999, discountPct: 33, label: 'Buy 4 Get 2 Free', note: 'Pay ₹1,980 · Get 6 cans' },
  ],
} as const;
