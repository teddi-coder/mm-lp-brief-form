import { useState, useEffect, useRef } from 'react';

const HEX_RE = /^#[0-9A-Fa-f]{6}$/;

function ColourField({ label, name, value, onChange, error }) {
  return (
    <div className="field-group">
      <label>{label}</label>
      <div className="colour-row">
        <input
          type="color"
          value={HEX_RE.test(value) ? value : '#000000'}
          onChange={e => onChange(name, e.target.value)}
        />
        <input
          type="text"
          className={error ? 'error' : ''}
          value={value}
          onChange={e => onChange(name, e.target.value)}
          placeholder="#CC0000"
          maxLength={7}
        />
      </div>
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

export default function Step3Brand({ fields, update, onBack, onSubmit, isSubmitting, submitError }) {
  const [errors, setErrors] = useState({});
  const [shaking, setShaking] = useState({});
  const [fontWarning, setFontWarning] = useState('');
  const fontDebounceRef = useRef(null);
  const loadedFontsRef = useRef(new Set());

  useEffect(() => {
    loadFont(fields.fontHeading);
    loadFont(fields.fontBody);
  }, []);

  function loadFont(fontName) {
    if (!fontName || loadedFontsRef.current.has(fontName)) return;
    const encoded = encodeURIComponent(fontName).replace(/%20/g, '+');
    const href = `https://fonts.googleapis.com/css2?family=${encoded}:wght@400;700&display=swap`;
    const existing = document.querySelector(`link[data-gfont="${fontName}"]`);
    if (existing) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.setAttribute('data-gfont', fontName);
    link.onerror = () => setFontWarning(`Font not found on Google Fonts — check the name.`);
    link.onload = () => { setFontWarning(''); loadedFontsRef.current.add(fontName); };
    document.head.appendChild(link);
  }

  function handleFontChange(name, value) {
    update(name, value);
    if (fontDebounceRef.current) clearTimeout(fontDebounceRef.current);
    fontDebounceRef.current = setTimeout(() => loadFont(value), 500);
  }

  function validate() {
    const e = {};
    ['brandPrimary','brandSecondary','brandAccent','brandBg','brandText'].forEach(k => {
      if (!HEX_RE.test(fields[k])) e[k] = 'Enter a valid hex colour (e.g. #CC0000)';
    });
    if (!fields.fontHeading) e.fontHeading = 'Required';
    if (!fields.fontBody) e.fontBody = 'Required';
    return e;
  }

  function handleSubmit() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      const s = {};
      Object.keys(e).forEach(k => { s[k] = true; });
      setShaking(s);
      setTimeout(() => setShaking({}), 400);
      return;
    }
    onSubmit();
  }

  const colourChange = (name, val) => {
    update(name, val);
    if (errors[name] && HEX_RE.test(val)) setErrors(p => ({ ...p, [name]: '' }));
  };

  return (
    <div className="form-card">
      <h2 className="form-card__title">Brand Details</h2>

      <ColourField label="Brand primary colour" name="brandPrimary" value={fields.brandPrimary} onChange={colourChange} error={errors.brandPrimary} />
      <ColourField label="Brand secondary colour" name="brandSecondary" value={fields.brandSecondary} onChange={colourChange} error={errors.brandSecondary} />
      <ColourField label="Brand accent colour" name="brandAccent" value={fields.brandAccent} onChange={colourChange} error={errors.brandAccent} />
      <ColourField label="Brand background colour" name="brandBg" value={fields.brandBg} onChange={colourChange} error={errors.brandBg} />
      <ColourField label="Brand text colour" name="brandText" value={fields.brandText} onChange={colourChange} error={errors.brandText} />

      <div className={`field-group${shaking['fontHeading'] ? ' shake' : ''}`}>
        <label htmlFor="fontHeading">Heading font</label>
        <input
          id="fontHeading"
          type="text"
          className={errors.fontHeading ? 'error' : ''}
          value={fields.fontHeading}
          onChange={e => { handleFontChange('fontHeading', e.target.value); if (errors.fontHeading) setErrors(p => ({ ...p, fontHeading: '' })); }}
          placeholder="e.g. Barlow Condensed"
        />
        <a href="https://fonts.google.com" target="_blank" rel="noopener noreferrer" className="font-link">Browse Google Fonts ↗</a>
        {errors.fontHeading && <span className="field-error">{errors.fontHeading}</span>}
      </div>

      <div className={`field-group${shaking['fontBody'] ? ' shake' : ''}`}>
        <label htmlFor="fontBody">Body font</label>
        <input
          id="fontBody"
          type="text"
          className={errors.fontBody ? 'error' : ''}
          value={fields.fontBody}
          onChange={e => { handleFontChange('fontBody', e.target.value); if (errors.fontBody) setErrors(p => ({ ...p, fontBody: '' })); }}
          placeholder="e.g. Inter"
        />
        {errors.fontBody && <span className="field-error">{errors.fontBody}</span>}
        {fontWarning && <span className="font-warning">{fontWarning}</span>}
      </div>

      {/* Live brand preview */}
      <div className="brand-preview">
        <div className="brand-preview__label">Live Preview</div>
        <div
          className="brand-preview__card"
          style={{ backgroundColor: HEX_RE.test(fields.brandBg) ? fields.brandBg : '#F8F8F8' }}
        >
          <div
            className="brand-preview__heading"
            style={{
              fontFamily: `'${fields.fontHeading}', Arial Narrow, Arial, sans-serif`,
              color: HEX_RE.test(fields.brandPrimary) ? fields.brandPrimary : '#CC0000',
            }}
          >
            Logbook Service Norwood
          </div>
          <div
            className="brand-preview__body"
            style={{
              fontFamily: `'${fields.fontBody}', Arial, sans-serif`,
              color: HEX_RE.test(fields.brandText) ? fields.brandText : '#1A1A1A',
            }}
          >
            Trusted local mechanics serving Norwood and surrounding suburbs. Book your service today.
          </div>
          <button
            className="brand-preview__btn"
            style={{ backgroundColor: HEX_RE.test(fields.brandPrimary) ? fields.brandPrimary : '#CC0000' }}
          >
            Call Now
          </button>
        </div>
      </div>

      <div className="form-nav">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <button className="btn-next btn-submit-full" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Brief'}
        </button>
      </div>
      {submitError && <div className="submit-error">{submitError}</div>}
    </div>
  );
}
