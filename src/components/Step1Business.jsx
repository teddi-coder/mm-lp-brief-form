import { useState, useRef } from 'react';

const PHONE_RE = /^(0[2-9]\d{8}|04\d{8})$/;
const SLUG_RE = /^[a-z0-9-]+$/;

export default function Step1Business({ fields, update, onNext }) {
  const [errors, setErrors] = useState({});
  const [shaking, setShaking] = useState({});
  const firstErrorRef = useRef(null);

  function validate() {
    const e = {};
    if (!fields.workshopName || fields.workshopName.length < 2) e.workshopName = 'Required (min 2 characters)';
    const phoneDigits = fields.phone.replace(/\D/g, '');
    if (!PHONE_RE.test(phoneDigits)) e.phone = 'Enter a valid Australian phone number (e.g. 08 9123 4567 or 0412 345 678)';
    if (!fields.address) e.address = 'Required';
    if (!fields.clientDomain || !fields.clientDomain.includes('.')) e.clientDomain = 'Enter a valid domain (e.g. accelerateauto.com.au)';
    if (!fields.clientSlug || !SLUG_RE.test(fields.clientSlug)) e.clientSlug = 'Slug must be lowercase letters, numbers, and hyphens only';
    return e;
  }

  function handleNext() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      const newShaking = {};
      Object.keys(e).forEach(k => { newShaking[k] = true; });
      setShaking(newShaking);
      setTimeout(() => setShaking({}), 400);
      setTimeout(() => {
        const el = document.querySelector('.field-group input.error, .field-group textarea.error');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
      return;
    }
    onNext();
  }

  function field(name, label, props = {}, hint = '') {
    return (
      <div className={`field-group${shaking[name] ? ' shake' : ''}`} key={name}>
        <label htmlFor={name}>{label}{props.required === false ? <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: 'var(--mm-grey-text)' }}> (optional)</span> : ''}</label>
        <input
          id={name}
          className={errors[name] ? 'error' : ''}
          value={fields[name]}
          onChange={e => { update(name, e.target.value); if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' })); }}
          {...props}
        />
        {errors[name] && <span className="field-error">{errors[name]}</span>}
        {hint && <span className="field-hint">{hint}</span>}
      </div>
    );
  }

  return (
    <div className="form-card">
      <h2 className="form-card__title">Business Details</h2>

      {field('workshopName', 'Workshop name', { type: 'text', placeholder: 'e.g. Accelerate Auto' })}
      {field('tradingName', 'Trading name', { type: 'text', placeholder: 'Leave blank if same as workshop name', required: false })}
      {field('phone', 'Phone number', { type: 'tel', placeholder: 'e.g. 08 9123 4567' })}
      {field('address', 'Address', { type: 'text', placeholder: 'Full street address' })}
      {field('clientDomain', 'Client domain', { type: 'text', placeholder: 'e.g. accelerateauto.com.au' })}

      <div className={`field-group${shaking['clientSlug'] ? ' shake' : ''}`}>
        <label htmlFor="clientSlug">Client slug</label>
        <input
          id="clientSlug"
          type="text"
          className={errors.clientSlug ? 'error' : ''}
          value={fields.clientSlug}
          onChange={e => { update('clientSlug', e.target.value); if (errors.clientSlug) setErrors(prev => ({ ...prev, clientSlug: '' })); }}
          placeholder="e.g. accelerate-auto"
        />
        {errors.clientSlug && <span className="field-error">{errors.clientSlug}</span>}
        {fields.clientSlug && (
          <div className="slug-preview">Preview: assets/images/{fields.clientSlug}/logo.png</div>
        )}
      </div>

      {field('mapsEmbedUrl', 'Google Maps embed URL', { type: 'text', placeholder: 'Paste from Google Maps → Share → Embed', required: false })}
      {field('mapsLink', 'Google Maps link', { type: 'text', placeholder: 'Direct Google Maps URL', required: false })}

      <div className="form-nav">
        <span />
        <button className="btn-next" onClick={handleNext}>Next →</button>
      </div>
    </div>
  );
}
