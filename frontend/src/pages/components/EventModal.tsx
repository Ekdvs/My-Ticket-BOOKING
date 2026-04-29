import { useState } from "react";
import Axios from "../../utils/Axios";
import SummaryApi from "../../api/SummaryApi";
import toast from "react-hot-toast";
import ConfirmModal from "./ConfirmModal";

import {
  X, MapPin, Calendar, Edit3,
  Trash2, Power, Users, CheckCircle2, XCircle, Tag, Ticket,
  Coins
} from "lucide-react";
import EventForm from "../admin/EventForm";

const EventModal = ({ open, onClose, event }: any) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmToggle, setConfirmToggle] = useState(false);
  const [edit, setEdit] = useState(false);
  const [toggling, setToggling] = useState(false);

  if (!open || !event) return null;

  const deleteEvent = async () => {
    try {
      await Axios(SummaryApi.delete_event(event.id));
      toast.success("Event deleted.");
      setConfirmDelete(false);
      onClose();
    } catch {
      toast.error("Delete failed.");
    }
  };

  const toggleActive = async () => {
    setToggling(true);
    try {
      await Axios(SummaryApi.toggle_event(event.id));
      toast.success(`Event ${event.active ? "deactivated" : "activated"}.`);
      setConfirmToggle(false);
      onClose();
    } catch {
      toast.error("Toggle failed.");
    } finally {
      setToggling(false);
    }
  };

  const formattedDate = event.eventDateTime
    ? new Date(event.eventDateTime).toLocaleString("en-US", {
        weekday: "short", year: "numeric", month: "long",
        day: "numeric", hour: "2-digit", minute: "2-digit",
      })
    : "Date TBD";

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
          {/* ── EDIT MODE ─────────────────────────────── */}
          {edit ? (
            <div>
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-800">Edit Event</h2>
                <button onClick={() => setEdit(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
                  <X size={16} />
                </button>
              </div>
              <div className="px-6 py-5 max-h-[75vh] overflow-y-auto">
                <EventForm
                  isEdit
                  existingEvent={event}
                  onClose={() => { setEdit(false); onClose(); }}
                />
              </div>
            </div>
          ) : (
          /* ── VIEW MODE ──────────────────────────────── */
            <>
              {/* Hero Image */}
              <div className="relative h-48 bg-gradient-to-br from-violet-100 to-indigo-100">
                {event.imageUrls?.[0] ? (
                  <img
                    src={event.imageUrls[0]}
                    className="w-full h-full object-cover"
                    alt={event.title}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Calendar size={48} className="text-violet-300" />
                  </div>
                )}

                {/* Close */}
                <button onClick={onClose}
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all">
                  <X size={16} className="text-slate-600" />
                </button>

                {/* Status badge */}
                <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm
                  ${event.active ? "bg-emerald-500 text-white" : "bg-slate-500 text-white"}`}>
                  {event.active
                    ? <><CheckCircle2 size={12} /> Active</>
                    : <><XCircle size={12} /> Inactive</>}
                </div>

                {/* Category badge */}
                {event.category && (
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/40 text-white backdrop-blur-sm">
                    <Tag size={10} />
                    {event.category} · {event.subCategory?.replace(/_/g, " ")}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="px-6 pt-5 pb-6 space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 leading-tight">{event.title}</h2>
                  {event.description && (
                    <p className="text-sm text-slate-500 mt-1.5 leading-relaxed line-clamp-3">
                      {event.description}
                    </p>
                  )}
                </div>

                {/* Meta */}
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { icon: MapPin, label: "Venue", value: event.venue || event.location || "TBD" },
                    { icon:Coins, label: "Price", value: `LKR ${event.price}` },
                    { icon: Calendar, label: "Date", value: formattedDate },
                    { icon: Ticket, label: "Available", value: `${event.availableTickets ?? "–"} / ${event.totalTickets ?? "–"}` },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="bg-slate-50 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-slate-400 mb-0.5">
                        <Icon size={11} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-700 leading-snug">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setEdit(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                      border border-violet-200 text-violet-600 text-sm font-semibold
                      hover:bg-violet-50 transition-all"
                  >
                    <Edit3 size={14} /> Edit
                  </button>

                  <button
                    onClick={() => setConfirmToggle(true)}
                    disabled={toggling}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all
                      ${event.active
                        ? "border border-amber-200 text-amber-600 hover:bg-amber-50"
                        : "border border-emerald-200 text-emerald-600 hover:bg-emerald-50"}`}
                  >
                    <Power size={14} />
                    {event.active ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                      border border-red-200 text-red-500 text-sm font-semibold
                      hover:bg-red-50 transition-all"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={deleteEvent}
        title="Delete Event"
        message={`"${event.title}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete"
        danger
      />

      <ConfirmModal
        isOpen={confirmToggle}
        onClose={() => setConfirmToggle(false)}
        onConfirm={toggleActive}
        title={event.active ? "Deactivate Event" : "Activate Event"}
        message={`Are you sure you want to ${event.active ? "deactivate" : "activate"} "${event.title}"?`}
        confirmLabel={event.active ? "Deactivate" : "Activate"}
        danger={event.active}
      />
    </>
  );
};

export default EventModal;