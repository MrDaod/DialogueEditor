import { Handle, Position, NodeProps } from '@xyflow/react';
import { MessageSquare } from 'lucide-react';
import { DialogueNodeType } from '../types/flow';

export function DialogueNode({ data, id }: NodeProps<DialogueNodeType>) {
  return (
    <div className="bg-white dark:bg-stone-800 border-2 border-stone-400 dark:border-stone-600 rounded-md min-w-[280px] shadow-lg overflow-hidden transition-colors">
      <div className="flex items-center bg-stone-100 dark:bg-stone-900 p-2 border-b border-stone-300 dark:border-stone-700">
        <MessageSquare className="w-4 h-4 mr-2 text-stone-600 dark:text-stone-400" />
        <span className="text-sm font-bold text-stone-700 dark:text-stone-200">语言节点</span>
      </div>
      <div className="p-3 flex flex-col gap-3">
        <div>
          <label className="text-xs font-semibold text-stone-500 dark:text-stone-400 mb-1 block">对话人</label>
          <input
            className="nodrag w-full border border-stone-300 dark:border-stone-600 dark:bg-stone-700 dark:text-stone-100 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            value={data.speaker}
            onChange={(evt) => data.onChange?.(id, { ...data, speaker: evt.target.value })}
            placeholder="例如：勇者"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-stone-500 dark:text-stone-400 mb-1 block">内容</label>
          <textarea
            className="nodrag w-full border border-stone-300 dark:border-stone-600 dark:bg-stone-700 dark:text-stone-100 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[80px] resize-none transition-all"
            value={data.text}
            onChange={(evt) => data.onChange?.(id, { ...data, text: evt.target.value })}
            placeholder="输入对话内容..."
          />
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-stone-400 dark:bg-stone-500 border-2 border-white dark:border-stone-800"
      >
          {/* Hotspot for easier grabbing */}
          <div className="absolute inset-0 -m-2 rounded-full pointer-events-auto" />
      </Handle>
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-stone-400 dark:bg-stone-500 border-2 border-white dark:border-stone-800"
      >
          {/* Hotspot for easier grabbing */}
          <div className="absolute inset-0 -m-2 rounded-full pointer-events-auto" />
      </Handle>
    </div>
  );
}

