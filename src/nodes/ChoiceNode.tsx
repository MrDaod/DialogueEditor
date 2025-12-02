import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Split, Plus, X } from 'lucide-react';

export type ChoiceOption = {
  id: string;
  text: string;
}

export type ChoiceNodeData = {
  options: ChoiceOption[];
  onChange?: (id: string, data: ChoiceNodeData) => void;
}

export type ChoiceNodeType = Node<ChoiceNodeData, 'choice'>;

export function ChoiceNode({ data, id }: NodeProps<ChoiceNodeType>) {
  const addOption = () => {
    const newOption = { id: `opt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, text: '' };
    data.onChange?.(id, { ...data, options: [...data.options, newOption] });
  };

  const updateOption = (optionId: string, text: string) => {
    const newOptions = data.options.map(opt => 
      opt.id === optionId ? { ...opt, text } : opt
    );
    data.onChange?.(id, { ...data, options: newOptions });
  };

  const removeOption = (optionId: string) => {
    const newOptions = data.options.filter(opt => opt.id !== optionId);
    data.onChange?.(id, { ...data, options: newOptions });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-blue-400 dark:border-blue-600 rounded-md min-w-[280px] shadow-lg overflow-hidden transition-colors">
      <div className="flex items-center bg-blue-50 dark:bg-blue-950/50 p-2 border-b border-blue-200 dark:border-blue-800">
        <Split className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
        <span className="text-sm font-bold text-blue-700 dark:text-blue-300">选项节点</span>
      </div>
      
      <div className="p-3 flex flex-col gap-3">
        {data.options.map((option, index) => (
          <div key={option.id} className="relative">
             <label className="text-[10px] uppercase tracking-wider font-semibold text-blue-400 dark:text-blue-500 mb-0.5 block">选项 {index + 1}</label>
             <div className="relative">
               <input 
                  className="nodrag w-full border border-blue-200 dark:border-blue-700 dark:bg-slate-800 dark:text-blue-100 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500 pr-8 transition-all"
                  value={option.text}
                  onChange={(e) => updateOption(option.id, e.target.value)}
                  placeholder="输入选项内容..."
               />
               <button 
                  onClick={() => removeOption(option.id)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-blue-300 hover:text-red-500 dark:text-blue-600 dark:hover:text-red-400 p-0.5"
                  title="删除选项"
               >
                 <X className="w-3 h-3" />
               </button>
             </div>
             {/* Handle 对应每个选项 */}
             <Handle 
                type="source" 
                position={Position.Right} 
                id={option.id}
                className="!bg-blue-500 !w-3 !h-3 !border-2 !border-white dark:!border-slate-800 !right-[-7px] transition-transform hover:scale-125" 
                style={{ top: '70%' }} 
             >
                 {/* Hotspot for easier grabbing */}
                 <div className="absolute inset-0 -m-2 rounded-full pointer-events-auto" />
             </Handle>
          </div>
        ))}
        
        <button 
          className="nodrag flex items-center justify-center w-full border border-dashed border-blue-300 dark:border-blue-700 rounded p-2 text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-sm mt-1 font-medium"
          onClick={addOption}
        >
          <Plus className="w-4 h-4 mr-1" />
          添加选项
        </button>
      </div>
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3 bg-blue-400 dark:bg-blue-500 border-2 border-white dark:border-slate-800 transition-transform hover:scale-125"
      >
         {/* Hotspot for easier grabbing */}
         <div className="absolute inset-0 -m-2 rounded-full pointer-events-auto" />
      </Handle>
    </div>
  );
}

