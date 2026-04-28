export default function ConfirmationScreen({ data, onReset }) {
  const { workshopName, primaryService, suburb, clientSlug } = data;
  return (
    <div className="form-card confirmation">
      <div className="confirmation__icon">✅</div>
      <h2 className="confirmation__heading">Brief Submitted</h2>
      <p className="confirmation__subheading">{workshopName} — {primaryService}, {suburb}</p>
      <p style={{ marginBottom: 32, color: 'var(--mm-grey-text)', lineHeight: 1.6 }}>
        The pipeline is running. You'll get a Slack notification with the preview URL and PR link in about 3 minutes.
      </p>

      <div className="confirmation__checklist">
        <h3>Before merging the PR</h3>
        {[
          <>Upload logo to <code>assets/images/{clientSlug}/logo.png</code> in the GitHub repo</>,
          <>Upload hero image to <code>assets/images/{clientSlug}/hero.jpg</code></>,
          <>Add GA4 + Google Ads conversion tags to <code>thank-you.html</code></>,
          <>Review copy on the Cloudflare preview URL (link in Slack)</>,
          <>Merge the PR to push live</>,
        ].map((item, i) => (
          <div key={i} className="checklist-item">
            <input type="checkbox" id={`check-${i}`} />
            <label htmlFor={`check-${i}`}>{item}</label>
          </div>
        ))}
      </div>

      <button className="btn-reset" onClick={onReset}>Submit another brief →</button>
    </div>
  );
}
