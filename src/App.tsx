import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  NodeTypes,
  ReactFlowProvider,
  useReactFlow,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { DialogueNode, DialogueNodeType } from './nodes/DialogueNode';
import { ChoiceNode, ChoiceNodeType } from './nodes/ChoiceNode';
import { Download, Upload, MessageSquare, Split, Trash2 } from 'lucide-react';

const nodeTypes: NodeTypes = {
  dialogue: DialogueNode,
  choice: ChoiceNode,
};

const initialNodes: (DialogueNodeType | ChoiceNodeType)[] = [];
const initialEdges: Edge[] = [];

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { getNodes, getEdges } = useReactFlow();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onChange = useCallback((id: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id !== id) {
          return node;
        }
        return {
          ...node,
          data: {
            ...data,
            onChange, // Ensure onChange is kept
          },
        };
      })
    );
  }, [setNodes]);

  const addDialogueNode = () => {
    const id = `node-${Date.now()}`;
    // 计算中心位置或者随机位置，这里简单随机
    const newNode: DialogueNodeType = {
      id,
      type: 'dialogue',
      position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
      data: { speaker: '', text: '', onChange },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const addChoiceNode = () => {
    const id = `node-${Date.now()}`;
    const newNode: ChoiceNodeType = {
      id,
      type: 'choice',
      position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
      data: { options: [{ id: `opt-${Date.now()}`, text: '' }], onChange },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const onExport = useCallback(() => {
    const nodesToExport = getNodes().map(n => ({ 
      ...n, 
      data: { ...n.data, onChange: undefined } 
    }));
    const edgesToExport = getEdges();
    
    const flowData = {
      nodes: nodesToExport,
      edges: edgesToExport
    };
    
    const jsonString = JSON.stringify(flowData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'game-dialogue.json';
    link.click();
    URL.revokeObjectURL(url);
  }, [getNodes, getEdges]);

  const onImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const flowData = JSON.parse(content);
        
        if (flowData.nodes && flowData.edges) {
            const restoredNodes = flowData.nodes.map((n: any) => ({
                ...n,
                data: {
                    ...n.data,
                    onChange
                }
            }));
            setNodes(restoredNodes);
            setEdges(flowData.edges);
        }
      } catch (err) {
        console.error('Failed to parse JSON', err);
        alert('导入失败：文件格式错误');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [setNodes, setEdges, onChange]);

  const clearCanvas = () => {
      if(window.confirm('确定要清空画布吗？未保存的内容将丢失。')) {
          setNodes([]);
          setEdges([]);
      }
  }

  return (
    <div className="w-screen h-screen flex flex-col font-sans">
      {/* Toolbar */}
      <div className="h-16 bg-white border-b border-stone-200 flex items-center px-6 justify-between shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 mr-4">
                <span className="text-2xl">🎮</span>
                <h1 className="font-bold text-lg text-stone-800">游戏对话编辑器</h1>
            </div>
            
            <div className="h-8 w-px bg-stone-200 mx-1"></div>
            
            <button 
                onClick={addDialogueNode}
                className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-sm font-medium transition-all active:scale-95"
            >
                <MessageSquare className="w-4 h-4" />
                语言节点
            </button>
             <button 
                onClick={addChoiceNode}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-all active:scale-95"
            >
                <Split className="w-4 h-4" />
                选项节点
            </button>
        </div>
        
        <div className="flex items-center gap-3">
            <button 
                onClick={clearCanvas}
                className="flex items-center gap-2 px-3 py-2 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
            >
                <Trash2 className="w-4 h-4" />
                清空
            </button>
            
            <div className="h-6 w-px bg-stone-200 mx-1"></div>

            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={onImport} 
                className="hidden" 
                accept=".json"
            />
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 rounded-lg text-sm font-medium transition-colors shadow-sm active:scale-95"
            >
                <Upload className="w-4 h-4" />
                导入
            </button>
             <button 
                onClick={onExport}
                className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white hover:bg-stone-800 rounded-lg text-sm font-medium transition-colors shadow-md active:scale-95"
            >
                <Download className="w-4 h-4" />
                导出
            </button>
        </div>
      </div>
      
      {/* Editor */}
      <div className="flex-1 bg-stone-50">
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            defaultEdgeOptions={{ 
                type: 'smoothstep', 
                animated: true,
                style: { stroke: '#78716c', strokeWidth: 2 }
            }}
            proOptions={{ hideAttribution: true }}
        >
            <Background color="#e5e5e5" gap={20} variant={BackgroundVariant.Dots} />
            <Controls className="!bg-white !border !border-stone-200 !shadow-md !rounded-lg overflow-hidden" />
            <MiniMap 
                className="!bg-white !border !border-stone-200 !shadow-md !rounded-lg overflow-hidden" 
                maskColor="rgba(245, 245, 244, 0.7)"
                nodeColor={(n) => {
                    if (n.type === 'choice') return '#60a5fa';
                    return '#a8a29e';
                }}
            />
        </ReactFlow>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}

