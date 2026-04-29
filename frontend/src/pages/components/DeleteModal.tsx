const DeleteModal = ({ open, onClose, onConfirm }: any) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded">

        <h2 className="text-lg font-bold">Delete Event?</h2>

        <div className="flex gap-2 mt-4">
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2"
          >
            Delete
          </button>

          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};