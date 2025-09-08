// src/components/ui/ConfirmationModal.tsx
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="mt-2 text-sm text-gray-500">{message}</p>
        </div>
        <div className="flex justify-end space-x-3 bg-gray-50 px-6 py-3 rounded-b-lg">
          <button onClick={onClose} className="btn-secondary">
            Batal
          </button>
          <button onClick={onConfirm} className="btn-primary bg-red-600 hover:bg-red-700">
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}