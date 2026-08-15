import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  title: string;
  body: string;
  cancel: string;
  confirm: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog(props: ConfirmDialogProps) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={props.onCancel}>
      <section className="confirm-card" role="dialog" aria-modal="true" aria-labelledby="confirm-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="icon-button confirm-card__close" onClick={props.onCancel} aria-label={props.cancel} data-tv-focus><X /></button>
        <span className="confirm-card__icon"><AlertTriangle /></span>
        <h2 id="confirm-title">{props.title}</h2>
        <p>{props.body}</p>
        <div className="confirm-card__actions">
          <button className="button button--ghost" onClick={props.onCancel} data-tv-focus>{props.cancel}</button>
          <button className="button button--danger" onClick={props.onConfirm} data-tv-focus>{props.confirm}</button>
        </div>
      </section>
    </div>
  );
}
