# Notarix Admin Dashboard

React + Vite admin dashboard for Notarix operations, including authentication,
order management, users, documents, payments, messages, reports, support, and
settings.

## Deployment target

The final production target is **AWS** (S3 + CloudFront, or ECS static site behind ALB). The dashboard is currently hosted on **Vercel** as a temporary stand-in while the AWS pipeline is being set up — Vercel auto-builds from this directory and serves `dist/` from the edge. The `vercel.json` already configures the install + build commands.

When migrating from Vercel to AWS:

- Build with `npm run build` to produce `dist/`.
- Upload `dist/` to an S3 bucket configured for static hosting, fronted by CloudFront.
- Point `VITE_API_BASE_URL` (or equivalent env var) at the AWS-hosted backend origin.
- HTTPS via ACM cert on CloudFront; no code changes required.

## Scripts

- `npm run dev` starts the local Vite server.
- `npm run build` creates the production bundle in `dist`.
- `npm run preview` serves the production bundle locally.
- `npm run lint` runs ESLint.
