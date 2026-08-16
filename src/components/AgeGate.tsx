import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { LEGAL_COPY } from '../legal/legalNotice';

export function AgeGate({ language, onAccept }: { language: 'ru' | 'en'; onAccept: () => void }) {
  const [confirmed, setConfirmed] = useState(false);
  const copy = LEGAL_COPY[language];
  return (
    <main className="age-gate" aria-labelledby="age-gate-title">
      <section className="age-gate__card">
        <span className="age-gate__icon" aria-hidden="true"><ShieldCheck /></span>
        <h1 id="age-gate-title">{copy.gateTitle}</h1>
        <p>{copy.gateBody}</p>
        <p>{copy.gateAdults}</p>
        <label className="age-gate__check">
          <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} autoFocus data-tv-focus />
          <span>{copy.checkbox}</span>
        </label>
        <button className="button button--primary button--wide" disabled={!confirmed} onClick={onAccept} data-tv-focus>{copy.continueLabel}</button>
      </section>
    </main>
  );
}
