import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { FlowSheet } from '../types/flow';

type FlowTabsProps = {
    sheets: FlowSheet[];
    activeSheetId: string;
    switchSheet: (id: string) => void;
    createNewSheet: () => void;
    closeSheet: (id: string) => void;
    updateSheetName: (id: string, name: string) => void;
};

export function FlowTabs({
    sheets,
    activeSheetId,
    switchSheet,
    createNewSheet,
    closeSheet,
    updateSheetName
}: FlowTabsProps) {
    const [editingSheetId, setEditingSheetId] = useState<string | null>(null);

    return (
        <div className="h-10 bg-stone-100 dark:bg-stone-900 flex items-end px-2 gap-1 border-b border-stone-200 dark:border-stone-800 overflow-x-auto scrollbar-hide">
            {sheets.map(sheet => (
                <div
                    key={sheet.id}
                    onClick={() => switchSheet(sheet.id)}
                    onDoubleClick={(e) => {
                        e.stopPropagation();
                        setEditingSheetId(sheet.id);
                    }}
                    className={`
                        group flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium cursor-pointer select-none min-w-[120px] max-w-[200px] border-t border-l border-r transition-all relative
                        ${activeSheetId === sheet.id 
                            ? 'bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-100 z-10 mb-[-1px] pb-2.5' 
                            : 'bg-stone-200 dark:bg-stone-800 border-transparent text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                        }
                    `}
                >
                    {editingSheetId === sheet.id ? (
                        <input
                            autoFocus
                            className="w-full bg-transparent border-none outline-none p-0 m-0"
                            value={sheet.name}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => updateSheetName(sheet.id, e.target.value)}
                            onBlur={() => setEditingSheetId(null)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') setEditingSheetId(null);
                            }}
                        />
                    ) : (
                        <span className="truncate flex-1">{sheet.name}</span>
                    )}
                    {sheets.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                closeSheet(sheet.id);
                            }}
                            className={`p-0.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 opacity-0 group-hover:opacity-100 transition-opacity ${activeSheetId === sheet.id ? 'opacity-100' : ''}`}
                        >
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </div>
            ))}
            <button
                onClick={createNewSheet}
                className="ml-1 p-1.5 text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-md mb-1"
                title="新建对话流"
            >
                <Plus className="w-4 h-4" />
            </button>
        </div>
    );
}

