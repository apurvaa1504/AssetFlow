export default function ConfirmationDialog({ open, title, description, confirmLabel = 'Confirm', tone = 'primary', onConfirm, onCancel }) {
  if (!open) return null;

  const confirmClasses = {
    primary: 'bg-primary hover:bg-primary-dark',
    danger: 'bg-danger hover:bg-[#A83323]',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
      <div className="w-full max-w-sm rounded-card border border-line bg-surface p-6 shadow-card">
        <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
        {description && <p className="mt-2 text-sm text-muted">{description}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-bg"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-md px-4 py-2 text-sm font-medium text-white ${confirmClasses[tone]}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
