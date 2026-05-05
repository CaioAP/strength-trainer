'use client';

import { useState } from 'react';
import { X, FileText, ChevronRight, Check } from 'lucide-react';

interface PlanAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: any[];
  onAssign: (templateId: string) => void;
  isLoading: boolean;
}

export default function PlanAssignmentModal({
  isOpen,
  onClose,
  templates,
  onAssign,
  isLoading
}: PlanAssignmentModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-brand-surface border border-gray-800 rounded-lg shadow-elevated flex flex-col max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-200">
        <header className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-800/20">
          <div>
            <h3 className="text-xl font-bold text-white">Assign Template</h3>
            <p className="text-[10px] text-text-subtle uppercase font-black tracking-widest mt-1">Pick a starting plan</p>
          </div>
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="p-1 text-text-subtle hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {templates.map((template) => (
            <div 
              key={template.id}
              onClick={() => !isLoading && setSelectedId(template.id)}
              className={`p-4 rounded-lg border transition-all cursor-pointer flex justify-between items-center ${
                selectedId === template.id 
                ? 'bg-brand-primary/10 border-brand-primary' 
                : 'bg-brand-secondary border-gray-800 hover:border-gray-700'
              }`}
            >
              <div>
                <h4 className="font-bold text-white text-sm">{template.name}</h4>
                <p className="text-[10px] text-text-subtle mt-1 line-clamp-1">{template.description || 'Standard template'}</p>
              </div>
              {selectedId === template.id && (
                <div className="w-6 h-6 bg-brand-primary rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-black" />
                </div>
              )}
            </div>
          ))}

          {templates.length === 0 && (
            <div className="text-center py-12 opacity-50">
              <FileText className="w-8 h-8 mx-auto mb-3 text-gray-700" />
              <p className="text-xs text-text-subtle uppercase font-black tracking-widest">No templates found</p>
            </div>
          )}
        </div>

        <footer className="p-4 bg-gray-800/20 border-t border-gray-800 flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 px-4 bg-brand-secondary text-white font-bold rounded-md uppercase text-xs border border-gray-800 hover:bg-gray-800 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => selectedId && onAssign(selectedId)}
            disabled={isLoading || !selectedId}
            className="flex-1 py-3 px-4 bg-brand-primary text-black font-bold rounded-md uppercase text-xs transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-subtle active:scale-95"
          >
            {isLoading && <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />}
            Confirm
          </button>
        </footer>
      </div>
    </div>
  );
}
