import { Link } from 'react-router-dom';
import '../styles/guide.css';

const PIPELINE_NODES = [
  { label: 'Brief Form', sub: 'mm-brief.mechanicmarketing.co' },
  { label: 'Cloudflare Worker', sub: 'mm-lp-pipeline' },
  { label: 'Claude API', sub: '16 copy sections' },
  { label: 'GitHub PR', sub: 'mm-lp-[clientslug]' },
  { label: 'Slack Notif', sub: 'preview URL + PR link' },
  { label: 'Merge → Live', sub: 'Cloudflare Pages' },
];

export default function Guide() {
  return (
    <div>
      {/* Header */}
      <header className="guide-header">
        <Link to="/" className="guide-header__wordmark">Mechanic Marketing</Link>
        <span className="guide-header__title">Landing Page Pipeline — Guide</span>
      </header>

      {/* Hero */}
      <section className="guide-hero">
        <h1 className="guide-hero__heading">Landing Page Pipeline</h1>
        <p className="guide-hero__desc">
          Everything Guy needs to build and deploy client Google Ads landing pages — from brief form to live URL in under 10 minutes.
        </p>
      </section>

      {/* Pipeline diagram */}
      <div className="pipeline-diagram">
        <div className="pipeline-diagram__inner">
          {PIPELINE_NODES.map((node, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div className="pipeline-node">
                <span className="pipeline-node__label">{node.label}</span>
                <span className="pipeline-node__sub">{node.sub}</span>
              </div>
              {i < PIPELINE_NODES.length - 1 && (
                <span className="pipeline-arrow">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="guide-body">

        {/* Section 1 — Guy's Workflow */}
        <section className="guide-section">
          <h2 className="guide-section__heading">
            Guy's Workflow
            <span className="time-badge">~10 min</span>
          </h2>

          {[
            {
              tag: { text: 'Start here', cls: 'orange' },
              heading: 'Open the brief form',
              body: (
                <>
                  <p>Go to <strong>mm-brief.mechanicmarketing.co</strong>.</p>
                  <p><strong>Returning client:</strong> Select the client from the dropdown — you'll skip straight to campaign fields (service, suburb, keyword theme). Takes about 2 minutes. Business and brand details are loaded automatically from the stored config.</p>
                  <p><strong>New client:</strong> Select "New client" and fill in the full 3-step form (business details, campaign details, brand colours/fonts). Takes about 5 minutes. Have these ready: phone number, Google review count + rating, target suburb, primary service, Google Ads keyword theme, and hex codes for the brand colours.</p>
                </>
              ),
            },
            {
              tag: { text: 'Automated', cls: 'black' },
              heading: 'Pipeline runs (~3 min)',
              body: (
                <p>After you hit Submit, the Cloudflare Worker takes over — it calls Claude to generate copy, populates the HTML template, creates a branch on the client's GitHub repo, opens a PR, and posts to Slack. You don't need to do anything.</p>
              ),
            },
            {
              tag: { text: 'Action required', cls: 'orange' },
              heading: 'Check Slack notification',
              body: (
                <p>You'll receive a Slack message with a preview URL and a PR link. Open the preview URL and check the page on desktop and mobile (resize your browser or use Chrome DevTools → device toolbar). The Slack message also includes a pre-merge checklist — don't skip it.</p>
              ),
            },
            {
              tag: { text: 'Action required', cls: 'orange' },
              heading: 'Upload logo + hero image',
              body: (
                <>
                  <p>Open the client's GitHub repo (<code>teddi-coder/mm-lp-[clientslug]</code>) and upload files to the right paths. You can drag and drop directly in the GitHub UI — no command line needed.</p>
                  <code className="code-block">
                    Logo →  assets/images/[clientslug]/logo.png{'\n'}
                    Hero →  assets/images/[clientslug]/hero.jpg
                  </code>
                  <p style={{ marginTop: 8 }}><strong>Important — images must be downloaded locally first.</strong> Do not reference images by copying a URL from the client's website. Most workshop sites hotlink-block images served to other domains, which causes broken placeholders on the live page.</p>
                  <p>Compress everything before uploading — nothing over 200kb. Use <strong>squoosh.app</strong> (free, browser-based). Every image needs a descriptive <code>alt</code> attribute. Set <code>loading="eager"</code> on the hero image and <code>loading="lazy"</code> on everything else.</p>
                  <p>If the client doesn't have images yet, the page uses a solid brand colour background as fallback — that's fine. Do not use random stock images as placeholders. Merge and add real images later.</p>
                </>
              ),
            },
            {
              tag: { text: 'Action required', cls: 'orange' },
              heading: 'Add conversion tags to thank-you.html',
              body: (
                <>
                  <p>Open the PR on GitHub. Edit <code>thank-you.html</code> and replace the two conversion tag placeholders — one for GA4 and one for Google Ads. These are clearly labelled in the file.</p>
                  <p>Without these, Google Ads will report zero conversions even when leads come in. Find the Google Ads conversion tag values in: Google Ads → Tools → Conversions → [conversion action] → Tag setup.</p>
                </>
              ),
            },
            {
              tag: { text: 'Final step', cls: 'orange' },
              heading: 'Review copy, then merge the PR',
              body: (
                <p>Read through the generated copy on the preview URL. The Claude output is ~90% right — check that the suburb, service, and selling points sound accurate for this client. Tweak anything that needs it directly in the PR file editor (click the pencil icon on the file in the PR). When you're happy: open the PR on GitHub and click <strong>Merge pull request</strong>. Cloudflare Pages deploys to the live URL automatically within 30 seconds.</p>
              ),
            },
          ].map((step, i) => (
            <div key={i} className="step-card">
              <div className="step-number">{i + 1}</div>
              <div className="step-content">
                {step.tag && <span className={`step-tag ${step.tag.cls}`}>{step.tag.text}</span>}
                <div className="step-heading">{step.heading}</div>
                <div className="step-body">{step.body}</div>
              </div>
            </div>
          ))}
        </section>

        {/* Section 2 — Repos + Services */}
        <section className="guide-section">
          <h2 className="guide-section__heading">Repos + Services</h2>

          <div className="repo-grid">
            {[
              { name: 'teddi-coder/mm-lp-template', desc: 'Master HTML template. 13 blocks, both hero variants. Maintained by Teddi — don\'t edit directly for client builds.' },
              { name: 'teddi-coder/mm-lp-brief-form', desc: 'The React brief form deployed on Vercel. Source of the form at mm-brief.mechanicmarketing.co.' },
              { name: 'teddi-coder/mm-lp-[clientslug]', desc: 'One repo per client. Auto-created by the pipeline on first submission. e.g. mm-lp-accelerate-auto.' },
            ].map((r, i) => (
              <div key={i} className="repo-card">
                <span className="repo-name">{r.name}</span>
                <span className="repo-desc">{r.desc}</span>
              </div>
            ))}
          </div>

          {[
            { badge: 'CF', cls: 'cf', name: 'Cloudflare Worker — mm-lp-pipeline', url: 'https://mm-lp-pipeline.calm-thunder-d72d.workers.dev', desc: 'Orchestrates copy generation, template population, GitHub PR, and Slack notification.' },
            { badge: 'V', cls: 'v', name: 'Vercel — Brief Form', url: 'teddi-coder/mm-lp-brief-form', desc: 'Env vars: VITE_WORKER_URL + VITE_MM_SECRET. Auto-deploys on push to main.' },
            { badge: 'CF', cls: 'cf', name: 'Cloudflare Pages — per client', url: 'One project per client repo', desc: 'Branch pushes create preview URLs. Merges to main deploy live.' },
          ].map((s, i) => (
            <div key={i} className="service-row">
              <span className={`service-badge ${s.cls}`}>{s.badge}</span>
              <div className="service-info">
                <div className="service-name">{s.name}</div>
                <div className="service-url">{s.url}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#666', marginTop: 4 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </section>

        {/* Section 3 — Secrets */}
        <section className="guide-section">
          <h2 className="guide-section__heading">Where Secrets Live</h2>

          <div className="secrets-grid">
            {[
              { name: 'ANTHROPIC_API_KEY', desc: 'Cloudflare Worker secret. Rotate at console.anthropic.com if compromised.' },
              { name: 'GITHUB_TOKEN', desc: 'Cloudflare Worker secret. PAT (classic) with repo scope on teddi-coder account.' },
              { name: 'SLACK_WEBHOOK_URL', desc: 'Cloudflare Worker secret. From api.slack.com → your MM Slack app → Incoming Webhooks.' },
              { name: 'MM_WEBHOOK_SECRET', desc: 'Cloudflare Worker secret AND Vercel env var (as VITE_MM_SECRET). Must match — if you rotate one, rotate both.' },
            ].map((s, i) => (
              <div key={i} className="secret-card">
                <span className="secret-name">{s.name}</span>
                <span className="secret-desc">{s.desc}</span>
              </div>
            ))}
          </div>

          <div className="alert-box">
            <strong>To update a Cloudflare Worker secret:</strong> run <code>wrangler secret put [SECRET_NAME]</code> from <code>automation/worker/</code> — enter the new value when prompted. To update Vercel env vars: Vercel dashboard → Project → Settings → Environment Variables.
          </div>
        </section>

        {/* Section 4 — Troubleshooting */}
        <section className="guide-section">
          <h2 className="guide-section__heading">If Something Goes Wrong</h2>

          {[
            {
              heading: 'No Slack notification after submitting',
              body: 'The Worker failed silently. Check the Cloudflare dashboard → Workers → mm-lp-pipeline → Logs for errors. Most likely cause: the GitHub token has expired or the Anthropic API key needs rotating.',
            },
            {
              heading: 'Slack shows a failure message',
              body: 'The message includes which step failed and the error text. If it says "generate-copy" — Anthropic API issue. If it says "github" — token or repo permissions issue. If it says "notify" — the Slack webhook URL is wrong.',
            },
            {
              heading: 'Copy looks completely wrong for the client',
              body: 'Edit the HTML file directly in the PR on GitHub before merging — click the pencil icon on the file. You can also re-submit the form with corrected details and a new PR will be opened.',
            },
            {
              heading: 'Preview URL isn\'t live yet',
              body: 'Cloudflare Pages takes 1–2 minutes to build after the branch is pushed. Wait a moment and refresh. If it\'s still not live after 5 minutes, check the Cloudflare Pages dashboard for the client\'s project — there may be a build error logged there.',
            },
          ].map((item, i) => (
            <div key={i} className="step-card">
              <div className="step-number amber">{i + 1}</div>
              <div className="step-content">
                <div className="step-heading">{item.heading}</div>
                <div className="step-body"><p>{item.body}</p></div>
              </div>
            </div>
          ))}
        </section>

        {/* Section 5 — New Client Setup */}
        <section className="guide-section">
          <h2 className="guide-section__heading">Before First Submission for a New Client</h2>

          {[
            'Connect client\'s domain to Cloudflare (add site in Cloudflare dashboard)',
            'Create a new Cloudflare Pages project connected to teddi-coder/mm-lp-[clientslug] — the pipeline auto-creates the repo, but you need to connect it to Pages manually (Settings → Connect to GitHub)',
            'Set the custom domain on the Cloudflare Pages project (e.g. ads.clientdomain.com.au)',
            'Have the client\'s GA4 Measurement ID ready (needed in the brief form)',
            'Have the client\'s Google Ads conversion action set up before the page goes live',
          ].map((item, i) => (
            <div key={i} className="checklist-row">
              <div className="checklist-box" />
              <span className="checklist-text">{item}</span>
            </div>
          ))}

          <div className="alert-box" style={{ marginTop: 16 }}>
            <strong>If a client needs a booking widget instead of a call/form CTA:</strong> Option A — use a Tally embed iframe in the hero form slot (swap the hero variant in the HTML). Option B — Podium booking request integration: form submits to a Worker, creates a Podium thread, sends an automated text to the customer. Option B replicates the Core Diesel pattern and requires a Worker build per client. Contact Teddi to set up Option B.
          </div>

          <div className="alert-box" style={{ marginTop: 12 }}>
            <strong>Note on the workflow doc:</strong> The workflow doc currently references <code>github.com/mechanicmarketing/mm-lp-template</code> as the clone URL. Until the org is created and the repo is transferred, the correct URL is <code>github.com/teddi-coder/mm-lp-template</code>. Do a find-and-replace before sharing the doc with anyone new.
          </div>
        </section>

      </div>
    </div>
  );
}
