# BB GUN GLOBAL

Mobile-first public directory preview for airsoft venues, supervised rental experiences and production partners.

## Current scope
- Premium responsive landing page
- Venue / rental / production discovery sections
- Informational compliance status
- Installable web-app shell and basic offline cache
- No live product checkout, payments, fulfilment, user accounts or regulated transactions

## Safety and compliance gate
Transactions must remain disabled until country-specific legal review, partner verification, age/eligibility checks, licensing requirements and transport/import/export restrictions have been assessed and approved. Do not place Supabase service-role or secret keys in client-side code.

## Deployment
Enable GitHub Pages in repository Settings → Pages → Deploy from a branch → `main` → `/ (root)`. This repository is a static frontend at this stage.

## Backend
The separate Supabase project is reserved for future backend integration. Authentication, database tables, RLS policies and partner workflows have not yet been connected or tested.