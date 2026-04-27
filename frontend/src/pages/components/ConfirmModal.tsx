type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  danger?: boolean;
};

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure?",
  confirmLabel = "Confirm",
  danger = false,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-2xl shadow-2xl w-96 p-6 animate-in zoom-in-95 duration-150">
        <h2 className="text-lg font-bold text-slate-800 mb-2">{title}</h2>
        <p className="mb-6 text-sm text-slate-500 leading-relaxed">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-sm font-semibold text-white transition ${
              danger
                ? "bg-red-500 hover:bg-red-600"
                : "bg-emerald-500 hover:bg-emerald-600"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;