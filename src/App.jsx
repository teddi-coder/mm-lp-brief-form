import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import StepIndicator from './components/StepIndicator.jsx';
import Step0ClientSelect from './components/Step0ClientSelect.jsx';
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
  const [step, setStep] = useState(null); // null = loading
  const [fields, setFields] = useState(INITIAL_FIELDS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Client config store state
  const [availableClients, setAvailableClients] = useState([]);
  const [useStoredConfig, setUseStoredConfig] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null); // slug or null

  useEffect(() => {
    async function loadClients() {
      try {
        const res = await fetch(`${WORKER_URL}/clients`);
        if (res.ok) {
          const data = await res.json();
          const clients = data.clients || [];
          setAvailableClients(clients);
          // Show Step 0 only if stored clients exist
          setStep(clients.length > 0 ? 0 : 1);
        } else {
          setStep(1);
        }
      } catch {
        setStep(1);
      }
    }
    loadClients();
  }, []);

  function update(name, value) {
    setFields(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'workshopName') {
        next.clientSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      }
      return next;
    });
  }

  function goNext() { setStep(s => s + 1); window.scrollTo(0, 0); }
  function goBack() { setStep(s => s - 1); window.scrollTo(0, 0); }

  // Step 0 handlers
  async function handleClientSelect(slug) {
    if (slug === null) {
      // New client — full form
      setUseStoredConfig(false);
      setSelectedClient(null);
      setStep(1);
    } else {
      // Returning client — load config and skip to Step 2
      try {
        const res = await fetch(`${WORKER_URL}/clients/${slug}`);
        if (res.ok) {
          const config = await res.json();
          // Map stored config onto fields (phone is stored as phoneDisplay)
          setFields(prev => ({
            ...prev,
            workshopName: config.workshopName || '',
            tradingName: config.tradingName || '',
            phone: config.phoneDisplay || '',
            address: config.address || '',
            clientDomain: config.clientDomain || '',
            clientSlug: config.clientSlug || slug,
            mapsEmbedUrl: config.mapsEmbedUrl || '',
            mapsLink: config.mapsLink || '',
            ga4MeasurementId: config.ga4MeasurementId || '',
            reviewCount: config.reviewCount || '',
            reviewRating: config.reviewRating || '',
            yearsInBusiness: config.yearsInBusiness || '',
            certification: config.certification || '',
            brandPrimary: config.brandPrimary || prev.brandPrimary,
            brandSecondary: config.brandSecondary || prev.brandSecondary,
            brandAccent: config.brandAccent || prev.brandAccent,
            brandBg: config.brandBg || prev.brandBg,
            brandText: config.brandText || prev.brandText,
            fontHeading: config.fontHeading || prev.fontHeading,
            fontBody: config.fontBody || prev.fontBody,
          }));
        }
      } catch {
        // Proceed anyway — user can fill in campaign fields
      }
      setUseStoredConfig(true);
      setSelectedClient(slug);
      setStep(2);
    }
    window.scrollTo(0, 0);
  }

  async function handleEditClient(slug) {
    // Load stored config into all fields and go to full form (Step 1)
    try {
      const res = await fetch(`${WORKER_URL}/clients/${slug}`);
      if (res.ok) {
        const config = await res.json();
        setFields(prev => ({
          ...prev,
          workshopName: config.workshopName || '',
          tradingName: config.tradingName || '',
          phone: config.phoneDisplay || '',
          address: config.address || '',
          clientDomain: config.clientDomain || '',
          clientSlug: config.clientSlug || slug,
          mapsEmbedUrl: config.mapsEmbedUrl || '',
          mapsLink: config.mapsLink || '',
          ga4MeasurementId: config.ga4MeasurementId || '',
          reviewCount: config.reviewCount || '',
          reviewRating: config.reviewRating || '',
          yearsInBusiness: config.yearsInBusiness || '',
          certification: config.certification || '',
          brandPrimary: config.brandPrimary || prev.brandPrimary,
          brandSecondary: config.brandSecondary || prev.brandSecondary,
          brandAccent: config.brandAccent || prev.brandAccent,
          brandBg: config.brandBg || prev.brandBg,
          brandText: config.brandText || prev.brandText,
          fontHeading: config.fontHeading || prev.fontHeading,
          fontBody: config.fontBody || prev.fontBody,
        }));
      }
    } catch {
      // Proceed with empty fields
    }
    setUseStoredConfig(false);
    setSelectedClient(slug);
    setStep(1);
    window.scrollTo(0, 0);
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    setSubmitError('');

    let payload;
    if (useStoredConfig) {
      // Returning client — send only campaign fields + stored config pointer
      payload = {
        useStoredConfig: true,
        clientSlug: selectedClient,
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
      };
    } else {
      // New client — send full payload
      payload = {
        useStoredConfig: false,
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
    }

    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-MM-Secret': MM_SECRET },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const workshopName = useStoredConfig
          ? (availableClients.find(c => c.slug === selectedClient)?.name ?? selectedClient)
          : fields.workshopName;
        setSubmittedData({
          workshopName,
          primaryService: fields.primaryService,
          suburb: fields.suburb,
          clientSlug: useStoredConfig ? selectedClient : fields.clientSlug,
        });
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
    setUseStoredConfig(false);
    setSelectedClient(null);
    setSubmitted(false);
    setSubmittedData(null);
    setSubmitError('');
    setStep(availableClients.length > 0 ? 0 : 1);
  }

  // Step indicator config
  const newClientLabels = ['Client', 'Business', 'Campaign', 'Brand'];
  const returningLabels = ['Client', 'Campaign'];

  function stepIndicatorProps() {
    if (useStoredConfig) {
      // returning client: steps 0 and 2 map to indicator positions 1 and 2
      const pos = step === 0 ? 1 : 2;
      return { current: pos, total: 2, labels: returningLabels };
    }
    // new client: step 0=1, 1=2, 2=3, 3=4
    const pos = step === 0 ? 1 : step + 1;
    return { current: pos, total: 4, labels: newClientLabels };
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
        {step === null ? (
          <div className="loading-state">Loading...</div>
        ) : submitted ? (
          <ConfirmationScreen data={submittedData} onReset={reset} />
        ) : (
          <>
            <StepIndicator {...stepIndicatorProps()} />
            {step === 0 && (
              <Step0ClientSelect
                clients={availableClients}
                onSelect={handleClientSelect}
                onEditClient={handleEditClient}
              />
            )}
            {step === 1 && <Step1Business fields={fields} update={update} onNext={goNext} />}
            {step === 2 && (
              <Step2Campaign
                fields={fields}
                update={update}
                onNext={useStoredConfig ? handleSubmit : goNext}
                onBack={goBack}
                useStoredConfig={useStoredConfig}
                selectedClientName={useStoredConfig ? availableClients.find(c => c.slug === selectedClient)?.name : null}
                isSubmitting={isSubmitting}
                submitError={submitError}
              />
            )}
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
