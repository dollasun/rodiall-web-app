# Rodiall Customer Web App

Customer dashboard and onboarding flow for Rodiall devices, built with React + Vite.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Customer scenarios

Use the floating **scenario pill** (bottom-right) to preview each customer state. The selection persists in `localStorage`.

| Scenario | Dashboard | Purchase History | Storage | Repay+ Plus / Notifications / Settings |
| --- | --- | --- | --- | --- |
| **Active user** (device assigned & activated) | Full dashboard | Full history | Full storage | Work normally |
| **Device reserved** (profiling done, not yet activated) | Empty state + *Go for Device Activation* | Empty state + CTA | Empty state + CTA | Work normally |
| **New user** (account created, no profiling) | Empty state + *Complete Profiling* | Empty state (no CTA) | Empty state + *Complete Profiling* | Work normally |

*Go for Device Activation* opens the pickup ("You're All Set!") or home-delivery ("Delivery Requested!") modal. *Complete Profiling* opens the Rodiall onboarding flow at `/get-started`. Finishing a reservation moves the customer to the **Device reserved** state.

## Routes

- `/dashboard`, `/repay-plus`, `/purchase-history`, `/storage`, `/notifications`, `/settings`: customer dashboard
- `/get-started`: Rodiall profiling, device selection, pickup or delivery
- `/about`, `/logged-out`

## Notes

- All data is mock data (`src/data/mock.js`), and payments are simulated.
- Home delivery is available for Kampala-area addresses. Other areas show the "Coming Soon" frame.
- `vercel.json` rewrites all routes to `index.html` so SPA deep links work.
