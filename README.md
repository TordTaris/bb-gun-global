# BB GUN GLOBAL

Premium, mobile-first informational platform for BB Gun and airsoft replica category references, approved venue discovery, member access and partner submissions.

## Current release scope
- Premium Black & Gold responsive interface
- BB Gun category catalogue: Pistol, Rifle, SMG and Sniper-style replica references
- Search and category filters
- Supabase email authentication
- Partner application submission for signed-in members
- Directory displays only published, compliance-approved venue records
- PWA manifest and service worker
- No cart, checkout, payments, orders, rental booking or fulfilment

## Compliance boundary
This release is information- and membership-only. Transactions must remain disabled. The platform does not confirm that a product or activity is lawful in any jurisdiction and does not provide legal advice. Country-specific review, local authority requirements, age/eligibility checks, partner verification and safety review must be completed before any future regulated functionality is considered.

## Architecture
- Source: GitHub repository `TordTaris/bb-gun-global`, branch `main`
- Frontend: static HTML, CSS and JavaScript
- Backend: Supabase project for authentication and reviewed directory/partner data
- Hosting target: GitHub Pages (deployment status must be checked in repository Settings → Pages and Actions)

## Security
- Only the Supabase publishable/anon client key may be used in browser code.
- Never place service-role keys, database passwords or private secrets in this repository.
- Supabase Row Level Security must remain enabled for every exposed table.
- Do not treat a partner submission or a signed-in account as compliance approval.

## Local preview
Open `index.html` through a local static server. Supabase sign-in and database functions require network access and valid project configuration.
