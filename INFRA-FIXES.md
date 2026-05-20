# Infrastructure Fixes — KV Slug Typo + DNS

Two manual actions required before end-to-end pipeline testing can proceed.

---

## Fix 1 — KV Slug Typo (Noranda)

**Current state:** The Noranda client config is stored in Cloudflare KV under the key
`client:noranda-service-cetre` (missing the second "c" in "centre"). The `workshopName`
and `tradingName` values also contain the typo ("Noranda Service Cetre").

**Confirmed via:** `GET https://mm-lp-pipeline.calm-thunder-d72d.workers.dev/clients`
returns `{"slug":"noranda-service-cetre","name":"Noranda Service Cetre"}`.

**Code impact:** Zero — `grep -rn "noranda-service-cetre"` across both
`mm-lp-brief-form` and `mm-lp-template` returned no results. No code changes required.

**Manual fix — two steps:**

### Step A — Write the corrected entry via the Worker API

Run this from a terminal where you have the `MM_WEBHOOK_SECRET` value:

```bash
curl -s -X POST \
  https://mm-lp-pipeline.calm-thunder-d72d.workers.dev/clients/noranda-service-centre \
  -H "Content-Type: application/json" \
  -H "X-MM-Secret: YOUR_MM_WEBHOOK_SECRET" \
  -d '{
    "workshopName": "Noranda Service Centre",
    "tradingName": "Noranda Service Centre",
    "phoneDisplay": "08 61505 872",
    "phoneE164": "+61861505872",
    "address": "2/3 Cobbler Pl, Mirrabooka WA 6061, Australia",
    "clientDomain": "https://services.mechanicsnoranda.com.au/",
    "clientSlug": "noranda-service-centre",
    "mapsEmbedUrl": "<iframe src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3388.203853124264!2d115.85904727612939!3d-31.873873274054063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2a32b0599ae713fb%3A0x362d5015636bf05a!2sNoranda%20Service%20Centre!5e0!3m2!1sen!2sth!4v1778043185730!5m2!1sen!2sth\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"></iframe>",
    "mapsLink": "https://maps.app.goo.gl/6aYYzykCvwRRkpmNA",
    "ga4MeasurementId": "G-8TCTK7X0SF",
    "reviewCount": "320",
    "reviewRating": "4.8",
    "yearsInBusiness": "15",
    "certification": "",
    "brandPrimary": "#CC0000",
    "brandSecondary": "#a7cd0c",
    "brandAccent": "#463b2b",
    "brandBg": "#F8F8F8",
    "brandText": "#1A1A1A",
    "fontHeading": "Barlow Condensed",
    "fontBody": "Inter"
  }'
```

Expected response: `OK`

### Step B — Delete the old typo'd key

The Worker API does not expose a DELETE endpoint. Use wrangler directly:

```bash
# From automation/worker/ in mm-lp-template repo, with wrangler authenticated:
wrangler kv key delete \
  --namespace-id=4254ed917fc245368ae5e57ea279aaf1 \
  "client:noranda-service-cetre"
```

### Verify

```bash
curl -s https://mm-lp-pipeline.calm-thunder-d72d.workers.dev/clients
# Expected: [{"slug":"noranda-service-centre","name":"Noranda Service Centre"}]

curl -s https://mm-lp-pipeline.calm-thunder-d72d.workers.dev/clients/noranda-service-centre
# Expected: full config JSON with corrected slug and name
```

---

## Fix 2 — DNS for mm-brief.mechanicmarketing.co

**Current state:** `dig mm-brief.mechanicmarketing.co` returns NXDOMAIN. No DNS record exists.

**Root cause:** `mechanicmarketing.co` nameservers are GoDaddy
(`ns47.domaincontrol.com` / `ns48.domaincontrol.com`). The Cloudflare API cannot
manage DNS here — changes must be made in the GoDaddy dashboard.

**Vercel project status:** `mm-lp-brief-form` (prj_bkBu50qZ4TH9oUc172YMYi3UJaAP)
has no custom domain attached. Two steps needed: add the domain in Vercel first,
then create the DNS record in GoDaddy.

### Step A — Add domain in Vercel

1. Go to vercel.com → mm-lp-brief-form project → Settings → Domains
2. Add `mm-brief.mechanicmarketing.co`
3. Vercel will show the required DNS record — it will be one of:
   - A CNAME record pointing to `cname.vercel-dns.com`, or
   - An A record pointing to `76.76.21.21`
   Copy the exact value Vercel shows.

### Step B — Create DNS record in GoDaddy

1. Log in to GoDaddy → Domains → mechanicmarketing.co → DNS
2. Add a new record:
   - **Type:** CNAME
   - **Name:** `mm-brief`
   - **Value:** `cname.vercel-dns.com` (or the value from Step A)
   - **TTL:** 600
3. Save. DNS propagation takes 5–30 minutes.

### Verify (run after propagation)

```bash
dig mm-brief.mechanicmarketing.co
# Expected: ANSWER section with CNAME to cname.vercel-dns.com

curl -s https://mm-brief.mechanicmarketing.co | head -20
# Expected: HTML containing "NEW LANDING PAGE BRIEF"
```

**As of 2026-05-20, this domain is not resolving. Do not attempt end-to-end pipeline
testing until both Fix 1 and Fix 2 are complete.**
