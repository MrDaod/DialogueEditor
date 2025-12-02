import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { MessageSquare } from 'lucide-react';

export type DialogueNodeData = {
  speaker: string;
  text: string;
  onChange?: (id: string, data: DialogueNodeData) => void;
};

export type DialogueNodeType = Node<DialogueNodeData, 'dialogue'>;

export function DialogueNode({ data, id }: NodeProps<DialogueNodeType>) {
  return (
    <div className="bg-white border-2 border-stone-400 rounded-md min-w-[280px] shadow-lg overflow-hidden">
      <div className="flex items-center bg-stone-100 p-2 border-b border-stone-300">
        <MessageSquare className="w-4 h-4 mr-2 text-stone-600" />
        <span className="text-sm font-bold text-stone-700">语言节点</span>
      </div>
      <div className="p-3 flex flex-col gap-3">
        <div>
          <label className="text-xs font-semibold text-stone-500 mb-1 block">对话人</label>
          <input 
            className="nodrag w-full border border-stone-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
            value={data.speaker}
            onChange={(evt) => data.onChange?.(id, { ...data, speaker: evt.target.value })}
            placeholder="例如：勇者"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-stone-500 mb-1 block">内容</label>
          <textarea 
            className="nodrag w-full border border-stone-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[80px] resize-none transition-all" 
            value={data.text}
            onChange={(evt) => data.onChange?.(id, { ...data, text: evt.target.value })}
            placeholder="输入对话内容..."
          />
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-stone-400 border-2 border-white" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-stone-400 border-2 border-white" />
    </div>
  );
}

