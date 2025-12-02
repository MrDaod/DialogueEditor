import React from 'react';
import { MessageSquare, Split } from 'lucide-react';
import { MenuState } from '../../hooks/useContextMenu';

type ContextMenuProps = {
    menu: MenuState;
    onMenuAdd: (type: 'dialogue' | 'choice') => void;
};

export function ContextMenu({ menu, onMenuAdd }: ContextMenuProps) {
    if (!menu) return null;

    return (
        <div
            style={{
                top: menu.top,
                left: menu.left,
            }}
            className="fixed z-50 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg shadow-xl overflow-hidden flex flex-col w-40 p-1 animate-in fade-in zoom-in-95 duration-100"
        >
            <div className="text-xs font-semibold text-stone-500 dark:text-stone-400 px-3 py-2 uppercase tracking-wider">
                创建节点
            </div>
            <button
                onClick={() => onMenuAdd('dialogue')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700/50 rounded-md transition-colors text-left"
            >
                <MessageSquare className="w-4 h-4" />
                语言节点
            </button>
            <button
                onClick={() => onMenuAdd('choice')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700/50 rounded-md transition-colors text-left"
            >
                <Split className="w-4 h-4" />
                选项节点
            </button>
        </div>
    );
}

