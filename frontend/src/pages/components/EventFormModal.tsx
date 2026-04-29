import { X } from "lucide-react";
import EventForm from "../admin/EventForm";


const EventFormModal = ({ open, onClose, onSuccess, existingEvent, isEdit = false }: any) => {
  if (!open) return null;

  const handleClose = () => {
    onSuccess();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              {isEdit ? "Edit Event" : "New Event"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEdit ? "Update event details below" : "Fill in the details below to create an event"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 max-h-[80vh] overflow-y-auto">
          <EventForm isEdit={isEdit} existingEvent={existingEvent} onClose={handleClose} />
        </div>
      </div>
    </div>
  );
};

export default EventFormModal;