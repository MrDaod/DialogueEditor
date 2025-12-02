import React from 'react';
import { MessageSquare, Split, Trash2, Sun, Moon, Upload, Download } from 'lucide-react';

type ToolbarProps = {
    addDialogueNode: () => void;
    addChoiceNode: () => void;
    darkMode: boolean;
    toggleDarkMode: () => void;
    clearCanvas: () => void;
    onExport: () => void;
    triggerImport: () => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function Toolbar({
    addDialogueNode,
    addChoiceNode,
    darkMode,
    toggleDarkMode,
    clearCanvas,
    onExport,
    triggerImport,
    fileInputRef,
    onImport
}: ToolbarProps) {
    return (
        <div className="h-16 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex items-center px-6 justify-between shadow-sm z-10 shrink-0 transition-colors">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 mr-4">
                    <span className="text-2xl">🎮</span>
                    <h1 className="font-bold text-lg text-stone-800 dark:text-stone-100">游戏对话编辑器</h1>
                </div>

                <div className="h-8 w-px bg-stone-200 dark:bg-stone-700 mx-1"></div>

                <button
                    onClick={addDialogueNode}
                    className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-lg text-sm font-medium transition-all active:scale-95"
                >
                    <MessageSquare className="w-4 h-4"/>
                    语言节点
                </button>
                <button
                    onClick={addChoiceNode}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium transition-all active:scale-95"
                >
                    <Split className="w-4 h-4"/>
                    选项节点
                </button>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={toggleDarkMode}
                    className="p-2 text-stone-500 hover:text-stone-700 hover:bg-stone-100 dark:text-stone-400 dark:hover:text-stone-200 dark:hover:bg-stone-800 rounded-lg transition-colors"
                    title={darkMode ? "切换到亮色模式" : "切换到暗黑模式"}
                >
                    {darkMode ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}
                </button>

                <div className="h-6 w-px bg-stone-200 dark:bg-stone-700 mx-1"></div>

                <button
                    onClick={clearCanvas}
                    className="flex items-center gap-2 px-3 py-2 text-stone-500 hover:text-red-600 hover:bg-red-50 dark:text-stone-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-colors"
                >
                    <Trash2 className="w-4 h-4"/>
                    清空
                </button>

                <div className="h-6 w-px bg-stone-200 dark:bg-stone-700 mx-1"></div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onImport}
                    className="hidden"
                    accept=".json"
                />
                <button
                    onClick={triggerImport}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 rounded-lg text-sm font-medium transition-colors shadow-sm active:scale-95"
                >
                    <Upload className="w-4 h-4"/>
                    导入
                </button>
                <button
                    onClick={onExport}
                    className="flex items-center gap-2 px-4 py-2 bg-stone-900 dark:bg-stone-700 text-white hover:bg-stone-800 dark:hover:bg-stone-600 rounded-lg text-sm font-medium transition-colors shadow-md active:scale-95"
                >
                    <Download className="w-4 h-4"/>
                    导出
                </button>
            </div>
        </div>
    );
}

