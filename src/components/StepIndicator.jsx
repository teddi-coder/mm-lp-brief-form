export default function StepIndicator({ current, total, labels }) {
  return (
    <div className="step-indicator">
      {Array.from({ length: total }, (_, i) => {
        const n = i + 1;
        const status = n < current ? 'complete' : n === current ? 'active' : 'upcoming';
        return (
          <div key={n} style={{ display: 'flex', alignItems: 'center', flex: n < total ? 1 : 'none' }}>
            <div className="step-indicator__item">
              <div className={`step-indicator__circle ${status}`}>
                {status === 'complete' ? '✓' : n}
              </div>
              <span className={`step-indicator__label ${status}`}>{labels[i]}</span>
            </div>
            {n < total && <div className={`step-indicator__line ${status === 'complete' ? 'complete' : ''}`} />}
          </div>
        );
      })}
    </div>
  );
}
