import { useState } from 'react';

export default function Step0ClientSelect({ clients, onSelect, onEditClient }) {
  const [selected, setSelected] = useState('');

  const selectedName = selected && selected !== '__new__'
    ? clients.find(c => c.slug === selected)?.name
    : null;

  return (
    <div className="form-card">
      <h2 className="form-card__title">Who are you building for?</h2>

      <div className="field-group">
        <label htmlFor="client-select">Client</label>
        <select
          id="client-select"
          value={selected}
          onChange={e => setSelected(e.target.value)}
        >
          <option value="">Select...</option>
          <option value="__new__">New client — fill in all details</option>
          {clients.map(c => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {selectedName && (
        <button
          className="btn-edit-client"
          onClick={() => onEditClient(selected)}
        >
          Edit {selectedName} details →
        </button>
      )}

      <div className="form-nav form-nav--single">
        <button
          className="btn-next"
          disabled={!selected}
          onClick={() => onSelect(selected === '__new__' ? null : selected)}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
