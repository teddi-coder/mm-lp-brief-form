import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import StepIndicator from './components/StepIndicator.jsx';
import Step1Business from './components/Step1Business.jsx';
import Step2Campaign from './components/Step2Campaign.jsx';
import Step3Brand from './components/Step3Brand.jsx';
import ConfirmationScreen from './components/ConfirmationScreen.jsx';
import Guide from './pages/Guide.jsx';
import { WORKER_URL, MM_SECRET } from './config.js';

const INITIAL_FIELDS = {
  // Step 1
  workshopName: '', tradingName: '', phone: '', address: '',
  clientDomain: '', clientSlug: '', mapsEmbedUrl: '', mapsLink: '',
  // Step 2
  primaryService: '', supportingServices: '', suburb: '', serviceAreaRadius: '',
  keywordTheme: '', reviewCount: '', reviewRating: '', yearsInBusiness: '',
  certification: '', sp1: '', sp2: '', sp3: '', sp4: '', sp5: '',
  offer: '', ctaPreference: 'call', ga4MeasurementId: '',
  // Step 3
  brandPrimary: '#CC0000', brandSecondary: '#222222', brandAccent: '#F5A623',
  brandBg: '#F8F8F8', brandText: '#1A1A1A',
  fontHeading: 'Barlow Condensed', fontBody: 'Inter',
};

function toE164(display) {
  const digits = display.replace(/\D/g, '');
  if (!digits) return '';
  return '+61' + digits.slice(1);
}

export default function App() {
  const [step, setStep] = useState(1);
  const [fields, setFields] = useState(INITIAL_FIELDS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  function update(name, value) {
    setFields(prev => {
      const next = { ...prev, [name]: value };
      // Auto-generate slug from workshop name
      if (name === 'workshopName') {
        next.clientSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      }
      return next;
    });
  }

  function goNext() { setStep(s => s + 1); window.scrollTo(0, 0); }
  function goBack() { setStep(s => s - 1); window.scrollTo(0, 0); }

  async function handleSubmit() {
    setIsSubmitting(true);
    setSubmitError('');
    const payload = {
      workshopName: fields.workshopName,
      tradingName: fields.tradingName || fields.workshopName,
      phoneDisplay: fields.phone,
      phoneE164: toE164(fields.phone),
      address: fields.address,
      clientDomain: fields.clientDomain,
      clientSlug: fields.clientSlug,
      mapsEmbedUrl: fields.mapsEmbedUrl || '',
      mapsLink: fields.mapsLink || '',
      primaryService: fields.primaryService,
      supportingServices: fields.supportingServices,
      suburb: fields.suburb,
      serviceAreaRadius: fields.serviceAreaRadius,
      keywordTheme: fields.keywordTheme,
      reviewCount: fields.reviewCount,
      reviewRating: fields.reviewRating,
      yearsInBusiness: fields.yearsInBusiness,
      certification: fields.certification || '',
      sellingPoints: [fields.sp1, fields.sp2, fields.sp3, fields.sp4, fields.sp5].filter(Boolean),
      offer: fields.offer || '',
      ctaPreference: fields.ctaPreference,
      ga4MeasurementId: fields.ga4MeasurementId,
      brandPrimary: fields.brandPrimary,
      brandSecondary: fields.brandSecondary,
      brandAccent: fields.brandAccent,
      brandBg: fields.brandBg,
      brandText: fields.brandText,
      fontHeading: fields.fontHeading,
      fontBody: fields.fontBody,
    };

    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-MM-Secret': MM_SECRET },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSubmittedData({ workshopName: fields.workshopName, primaryService: fields.primaryService, suburb: fields.suburb, clientSlug: fields.clientSlug });
        setSubmitted(true);
      } else {
        setSubmitError("Something went wrong — the pipeline didn't start. Try again or contact Teddi.");
      }
    } catch {
      setSubmitError("Something went wrong — the pipeline didn't start. Try again or contact Teddi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function reset() {
    setFields(INITIAL_FIELDS);
    setStep(1);
    setSubmitted(false);
    setSubmittedData(null);
    setSubmitError('');
  }

  const formJSX = (
    <>
      <header className="header">
        <span className="header__wordmark">MM</span>
        <span className="header__title">New Landing Page Brief</span>
        <Link to="/guide" style={{ color: 'white', opacity: 0.6, fontSize: 13, textDecoration: 'none' }}
          onMouseEnter={e => e.currentTarget.style.opacity = 1}
          onMouseLeave={e => e.currentTarget.style.opacity = 0.6}
        >Guide</Link>
      </header>

      <div className="content">
        {submitted ? (
          <ConfirmationScreen data={submittedData} onReset={reset} />
        ) : (
          <>
            <StepIndicator current={step} total={3} labels={['Business', 'Campaign', 'Brand']} />
            {step === 1 && <Step1Business fields={fields} update={update} onNext={goNext} />}
            {step === 2 && <Step2Campaign fields={fields} update={update} onNext={goNext} onBack={goBack} />}
            {step === 3 && (
              <Step3Brand
                fields={fields}
                update={update}
                onBack={goBack}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submitError={submitError}
              />
            )}
          </>
        )}
      </div>
    </>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={formJSX} />
        <Route path="/guide" element={<Guide />} />
      </Routes>
    </BrowserRouter>
  );
}
