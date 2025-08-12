import React from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = 'Confirmar acción',
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'default',
  loading = false,
  onConfirm,
  onCancel
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm animate-fadeIn" onClick={onCancel} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scaleIn">
        <div className="px-6 pt-6 pb-4">
          <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
            {variant === 'danger' && (
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M4.93 4.93l14.14 14.14M12 2a10 10 0 100 20 10 10 0 000-20z" /></svg>
            )}
            {title}
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{message}</p>
        </div>
        <div className="px-6 pb-6 pt-2 flex flex-col sm:flex-row-reverse gap-3 bg-slate-50/60 border-t border-slate-200">
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex justify-center items-center px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-emerald-500 disabled:opacity-50 ${variant==='danger' ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
          >
            {loading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            )}
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="inline-flex justify-center items-center px-5 py-2.5 rounded-lg text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-400 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
      <style>{`
        .animate-fadeIn{animation:fadeIn .25s ease-out;}
        .animate-scaleIn{animation:scaleIn .25s ease-out;}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes scaleIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
      `}</style>
    </div>
  );
};

export default ConfirmDialog;
