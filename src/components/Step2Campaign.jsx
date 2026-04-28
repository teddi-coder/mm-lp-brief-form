import { useState } from 'react';

const GA4_RE = /^G-[A-Z0-9]+$/;

export default function Step2Campaign({ fields, update, onNext, onBack }) {
  const [errors, setErrors] = useState({});
  const [shaking, setShaking] = useState({});

  function validate() {
    const e = {};
    if (!fields.primaryService) e.primaryService = 'Required';
    if (!fields.supportingServices) e.supportingServices = 'Required';
    if (!fields.suburb) e.suburb = 'Required';
    if (!fields.serviceAreaRadius) e.serviceAreaRadius = 'Required';
    if (!fields.keywordTheme) e.keywordTheme = 'Required';
    if (!fields.reviewCount) e.reviewCount = 'Required';
    const rating = parseFloat(fields.reviewRating);
    if (!fields.reviewRating || rating < 1 || rating > 5) e.reviewRating = 'Enter a rating between 1.0 and 5.0';
    if (!fields.yearsInBusiness) e.yearsInBusiness = 'Required';
    if (!fields.sp1) e.sp1 = 'Required';
    if (!fields.sp2) e.sp2 = 'Required';
    if (!fields.sp3) e.sp3 = 'Required';
    if (!fields.ctaPreference) e.ctaPreference = 'Select one';
    if (!fields.ga4MeasurementId || !GA4_RE.test(fields.ga4MeasurementId)) e.ga4MeasurementId = 'Must be in format G-XXXXXXXXXX';
    return e;
  }

  function handleNext() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      const s = {};
      Object.keys(e).forEach(k => { s[k] = true; });
      setShaking(s);
      setTimeout(() => setShaking({}), 400);
      setTimeout(() => {
        const el = document.querySelector('.field-group input.error, .field-group textarea.error');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
      return;
    }
    onNext();
  }

  function inp(name, label, props = {}, optional = false) {
    const isError = !!errors[name];
    return (
      <div className={`field-group${shaking[name] ? ' shake' : ''}`}>
        <label htmlFor={name}>{label}{optional && <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: 'var(--mm-grey-text)' }}> (optional)</span>}</label>
        <input
          id={name}
          className={isError ? 'error' : ''}
          value={fields[name]}
          onChange={e => { update(name, e.target.value); if (errors[name]) setErrors(p => ({ ...p, [name]: '' })); }}
          {...props}
        />
        {isError && <span className="field-error">{errors[name]}</span>}
      </div>
    );
  }

  return (
    <div className="form-card">
      <h2 className="form-card__title">Campaign Details</h2>

      {inp('primaryService', 'Primary service', { type: 'text', placeholder: 'e.g. Logbook Servicing' })}
      {inp('supportingServices', 'Supporting services', { type: 'text', placeholder: 'e.g. Tyres, Brakes, Batteries' })}
      {inp('suburb', 'Target suburb', { type: 'text', placeholder: 'e.g. Norwood' })}
      {inp('serviceAreaRadius', 'Service area radius', { type: 'text', placeholder: 'e.g. 15km' })}
      {inp('keywordTheme', 'Google Ads keyword theme', { type: 'text', placeholder: 'e.g. logbook service Norwood' })}

      <div className="field-row">
        {inp('reviewCount', 'Google review count', { type: 'number', placeholder: '847', min: 0 })}
        {inp('reviewRating', 'Google review rating', { type: 'number', placeholder: '4.9', min: 1, max: 5, step: 0.1 })}
      </div>

      <div className="field-row">
        {inp('yearsInBusiness', 'Years in business', { type: 'number', placeholder: '20', min: 0 })}
        {inp('certification', 'Certification / award', { type: 'text', placeholder: 'e.g. RAA Approved Repairer' }, true)}
      </div>

      <div className="field-group">
        <label>Key selling points <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: 'var(--mm-grey-text)' }}>(points 1–3 required)</span></label>
        <div className="selling-points">
          {['sp1','sp2','sp3','sp4','sp5'].map((key, i) => (
            <div key={key} className={shaking[key] ? 'shake' : ''}>
              <input
                type="text"
                className={errors[key] ? 'error' : ''}
                placeholder={`Selling point ${i + 1}${i >= 3 ? ' (optional)' : ''}`}
                value={fields[key]}
                onChange={e => { update(key, e.target.value); if (errors[key]) setErrors(p => ({ ...p, [key]: '' })); }}
              />
              {errors[key] && <span className="field-error">{errors[key]}</span>}
            </div>
          ))}
        </div>
      </div>

      {inp('offer', 'Offer / hook', { type: 'text', placeholder: 'e.g. Free 10-point inspection with every logbook service' }, true)}

      <div className={`field-group${shaking['ctaPreference'] ? ' shake' : ''}`}>
        <label>CTA preference</label>
        <div className="radio-group">
          {[
            { val: 'call', label: 'Call only' },
            { val: 'form', label: 'Form only' },
            { val: 'both', label: 'Both' },
          ].map(({ val, label }) => (
            <label key={val}>
              <input
                type="radio"
                name="ctaPreference"
                value={val}
                checked={fields.ctaPreference === val}
                onChange={() => { update('ctaPreference', val); if (errors.ctaPreference) setErrors(p => ({ ...p, ctaPreference: '' })); }}
              />
              {label}
            </label>
          ))}
        </div>
        {errors.ctaPreference && <span className="field-error">{errors.ctaPreference}</span>}
      </div>

      {inp('ga4MeasurementId', 'GA4 Measurement ID', { type: 'text', placeholder: 'G-XXXXXXXXXX' })}

      <div className="form-nav">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <button className="btn-next" onClick={handleNext}>Next →</button>
      </div>
    </div>
  );
}
