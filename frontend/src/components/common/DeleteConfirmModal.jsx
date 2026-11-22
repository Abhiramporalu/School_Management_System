import React from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  title = 'Confirm Permanent Deletion',
  entityName,
  entityType = 'Record',
  entityDetails = null,
  warningText = 'This action will permanently remove this record from the database, revoke system login credentials, and clear associated allocations. This operation cannot be reversed.',
  confirmButtonText = 'Yes, Permanently Delete',
  isDeleting = false,
  onConfirm,
  onClose
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-red-100 text-xs space-y-4">
        {/* Modal Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">Admin Safety Gate</span>
              <h3 className="font-extrabold text-base text-slate-900 leading-tight">{title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Target Entity Summary Box */}
        <div className="p-3.5 bg-red-50/70 rounded-2xl border border-red-200/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-red-700">{entityType} Target</span>
            {entityDetails?.id && (
              <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded text-slate-700 border border-red-200">
                {entityDetails.id}
              </span>
            )}
          </div>
          <p className="font-extrabold text-sm text-slate-900">{entityName}</p>
          {entityDetails?.subtitle && (
            <p className="text-[11px] text-slate-600">{entityDetails.subtitle}</p>
          )}
          {entityDetails?.meta && (
            <p className="text-[10px] font-mono text-slate-500">{entityDetails.meta}</p>
          )}
        </div>

        {/* Warning text */}
        <p className="text-slate-600 leading-relaxed text-[11px]">
          {warningText}
        </p>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md shadow-red-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>{confirmButtonText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
