import React, {useCallback, useRef, useState, useEffect} from 'react';
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
    BackgroundVariant,
    OnConnectStart,
    OnConnectEnd,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import {DialogueNode, DialogueNodeType} from './nodes/DialogueNode';
import {ChoiceNode, ChoiceNodeType} from './nodes/ChoiceNode';
import {Download, Upload, MessageSquare, Split, Trash2, Sun, Moon, Plus, X} from 'lucide-react';

const nodeTypes: NodeTypes = {
    dialogue: DialogueNode,
    choice: ChoiceNode,
};

type FlowSheet = {
    id: string;
    name: string;
    nodes: (DialogueNodeType | ChoiceNodeType)[];
    edges: Edge[];
};

const initialNodes: (DialogueNodeType | ChoiceNodeType)[] = [];
const initialEdges: Edge[] = [];

function Flow() {
    const [sheets, setSheets] = useState<FlowSheet[]>([
        { id: 'default', name: '流程 1', nodes: initialNodes, edges: initialEdges }
    ]);
    const [activeSheetId, setActiveSheetId] = useState('default');

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const {getNodes, getEdges, screenToFlowPosition} = useReactFlow();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Context Menu State
    const [menu, setMenu] = useState<{
        id: string;
        top: number;
        left: number;
        right?: number;
        bottom?: number;
    } | null>(null);

    // Connection Source State
    const connectingNodeId = useRef<string | null>(null);
    const connectingHandleId = useRef<string | null>(null);

    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const toggleDarkMode = () => setDarkMode(!darkMode);

    const onConnect = useCallback(
        (params: Connection) => {
            setEdges((eds) => addEdge(params, eds));
            // Clear connection attempt info
            connectingNodeId.current = null;
            connectingHandleId.current = null;
        },
        [setEdges],
    );

    const onConnectStart: OnConnectStart = useCallback((_, {nodeId, handleId}) => {
        connectingNodeId.current = nodeId;
        connectingHandleId.current = handleId;
    }, []);

    const skipNextPaneClick = useRef(false);

    const onConnectEnd: OnConnectEnd = useCallback(
        (event) => {
            if (!connectingNodeId.current) return;

            const target = event.target as Element;

            // 检查是否落在已有的节点或句柄上
            // 如果不是，则认为是在空白处松开，弹出创建菜单
            const isTargetNode = target.closest('.react-flow__node');
            const isTargetHandle = target.closest('.react-flow__handle');

            if (!isTargetNode && !isTargetHandle) {
                skipNextPaneClick.current = true;
                const {clientX, clientY} = 'changedTouches' in event ? event.changedTouches[0] : event;

                setMenu({
                    id: 'context-menu',
                    top: clientY,
                    left: clientX,
                });
            }
        },
        [],
    );

    const onPaneContextMenu = useCallback((event: React.MouseEvent | MouseEvent) => {
        event.preventDefault();

        // Calculate position for the menu
        let clientX, clientY;
        
        if ('changedTouches' in event) {
            const touch = (event as any).changedTouches[0];
            clientX = touch.clientX;
            clientY = touch.clientY;
        } else {
            clientX = (event as MouseEvent).clientX;
            clientY = (event as MouseEvent).clientY;
        }

        setMenu({
            id: 'context-menu',
            top: clientY,
            left: clientX,
        });
    }, []);

    const onPaneClick = useCallback(() => {
        if (skipNextPaneClick.current) {
            skipNextPaneClick.current = false;
            return;
        }

        setMenu(null);
        connectingNodeId.current = null;
        connectingHandleId.current = null;
    }, []);

    const onMenuAdd = useCallback((type: 'dialogue' | 'choice') => {
        if (!menu) return;

        const position = screenToFlowPosition({
            x: menu.left,
            y: menu.top,
        });

        const id = `node-${Date.now()}`;
        let newNode: DialogueNodeType | ChoiceNodeType;

        if (type === 'dialogue') {
            newNode = {
                id,
                type: 'dialogue',
                position,
                data: {speaker: '', text: '', onChange},
            };
        } else {
            newNode = {
                id,
                type: 'choice',
                position,
                data: {options: [{id: `opt-${Date.now()}`, text: ''}], onChange},
            };
        }

        setNodes((nds) => nds.concat(newNode));

        // Create connection if triggered by connection drag
        if (connectingNodeId.current) {
            const edge: Edge = {
                id: `e${connectingNodeId.current}-${id}`,
                source: connectingNodeId.current,
                target: id,
                sourceHandle: connectingHandleId.current,
            };
            setEdges((eds) => addEdge(edge, eds));
        }

        setMenu(null);
        connectingNodeId.current = null;
        connectingHandleId.current = null;
    }, [menu, screenToFlowPosition, setNodes, setEdges]);

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
            position: {x: 100 + Math.random() * 200, y: 100 + Math.random() * 200},
            data: {speaker: '', text: '', onChange},
        };
        setNodes((nds) => nds.concat(newNode));
    };

    const addChoiceNode = () => {
        const id = `node-${Date.now()}`;
        const newNode: ChoiceNodeType = {
            id,
            type: 'choice',
            position: {x: 100 + Math.random() * 200, y: 100 + Math.random() * 200},
            data: {options: [{id: `opt-${Date.now()}`, text: ''}], onChange},
        };
        setNodes((nds) => nds.concat(newNode));
    };

    const onExport = useCallback(() => {
        const nodesToExport = getNodes().map(n => ({
            ...n,
            data: {...n.data, onChange: undefined}
        }));
        const edgesToExport = getEdges();

        const flowData = {
            nodes: nodesToExport,
            edges: edgesToExport
        };

        const jsonString = JSON.stringify(flowData, null, 2);
        const blob = new Blob([jsonString], {type: 'application/json'});
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
        if (window.confirm('确定要清空画布吗？未保存的内容将丢失。')) {
            setNodes([]);
            setEdges([]);
        }
    }

    // Tab Management
    const switchSheet = (targetId: string) => {
        if (targetId === activeSheetId) return;

        // Save current state
        setSheets(prev => prev.map(sheet =>
            sheet.id === activeSheetId
                ? { ...sheet, nodes: getNodes() as any, edges: getEdges() }
                : sheet
        ));

        // Load new state
        const targetSheet = sheets.find(s => s.id === targetId);
        if (targetSheet) {
            setNodes(targetSheet.nodes);
            setEdges(targetSheet.edges);
            setActiveSheetId(targetId);
        }
    };

    const createNewSheet = () => {
        // Save current state first
        setSheets(prev => prev.map(sheet =>
            sheet.id === activeSheetId
                ? { ...sheet, nodes: getNodes() as any, edges: getEdges() }
                : sheet
        ));

        const newId = `sheet-${Date.now()}`;
        const newSheet: FlowSheet = {
            id: newId,
            name: `流程 ${sheets.length + 1}`,
            nodes: [],
            edges: []
        };
        setSheets(prev => [...prev, newSheet]);
        setNodes([]);
        setEdges([]);
        setActiveSheetId(newId);
    };

    const closeSheet = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (sheets.length <= 1) return;

        if (window.confirm('确定要关闭此页签吗？未保存的内容将丢失。')) {
            const newSheets = sheets.filter(s => s.id !== id);
            setSheets(newSheets);
            
            if (id === activeSheetId) {
                const lastSheet = newSheets[newSheets.length - 1];
                setNodes(lastSheet.nodes);
                setEdges(lastSheet.edges);
                setActiveSheetId(lastSheet.id);
            }
        }
    };

    return (
        <div className="w-screen h-screen flex flex-col font-sans transition-colors bg-white dark:bg-stone-950">
            {/* Toolbar */}
            <div
                className="h-16 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex items-center px-6 justify-between shadow-sm z-10 shrink-0 transition-colors">
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
                        onClick={() => fileInputRef.current?.click()}
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

            {/* Tabs Bar */}
            <div className="h-10 bg-stone-100 dark:bg-stone-900 flex items-end px-2 gap-1 border-b border-stone-200 dark:border-stone-800 overflow-x-auto scrollbar-hide">
                {sheets.map(sheet => (
                    <div
                        key={sheet.id}
                        onClick={() => switchSheet(sheet.id)}
                        className={`
                            group flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium cursor-pointer select-none min-w-[120px] max-w-[200px] border-t border-l border-r transition-all relative
                            ${activeSheetId === sheet.id 
                                ? 'bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-100 z-10 mb-[-1px] pb-2.5' 
                                : 'bg-stone-200 dark:bg-stone-800 border-transparent text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                            }
                        `}
                    >
                        <span className="truncate flex-1">{sheet.name}</span>
                        {sheets.length > 1 && (
                            <button
                                onClick={(e) => closeSheet(e, sheet.id)}
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
                    title="新建流程"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            {/* Editor */}
            <div className="flex-1 bg-stone-50 dark:bg-stone-950 transition-colors relative">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onConnectStart={onConnectStart}
                    onConnectEnd={onConnectEnd}
                    onPaneClick={onPaneClick}
                    onPaneContextMenu={onPaneContextMenu}
                    nodeTypes={nodeTypes}
                    fitView
                    defaultEdgeOptions={{
                        type: 'smoothstep',
                        animated: true,
                        style: {stroke: darkMode ? '#a8a29e' : '#78716c', strokeWidth: 2}
                    }}
                    proOptions={{hideAttribution: true}}
                >
                    <Background color={darkMode ? "#44403c" : "#e5e5e5"} gap={20} variant={BackgroundVariant.Dots}/>
                    <Controls
                        className="!bg-white dark:!bg-stone-800 !border !border-stone-200 dark:!border-stone-700 !shadow-md !rounded-lg overflow-hidden [&>button]:!border-b-stone-200 dark:[&>button]:!border-b-stone-700 [&>button]:!fill-stone-600 dark:[&>button]:!fill-stone-400 hover:[&>button]:!bg-stone-50 dark:hover:[&>button]:!bg-stone-700"/>
                    <MiniMap
                        className="!bg-white dark:!bg-stone-800 !border !border-stone-200 dark:!border-stone-700 !shadow-md !rounded-lg overflow-hidden"
                        maskColor={darkMode ? "rgba(28, 25, 23, 0.7)" : "rgba(245, 245, 244, 0.7)"}
                        nodeColor={(n) => {
                            if (n.type === 'choice') return darkMode ? '#3b82f6' : '#60a5fa';
                            return darkMode ? '#57534e' : '#a8a29e';
                        }}
                    />
                </ReactFlow>
                {menu && (
                    <div
                        style={{
                            top: menu.top,
                            left: menu.left,
                        }}
                        className="fixed z-50 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg shadow-xl overflow-hidden flex flex-col w-40 p-1 animate-in fade-in zoom-in-95 duration-100"
                    >
                        <div
                            className="text-xs font-semibold text-stone-500 dark:text-stone-400 px-3 py-2 uppercase tracking-wider">
                            创建节点
                        </div>
                        <button
                            onClick={() => onMenuAdd('dialogue')}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700/50 rounded-md transition-colors text-left"
                        >
                            <MessageSquare className="w-4 h-4"/>
                            语言节点
                        </button>
                        <button
                            onClick={() => onMenuAdd('choice')}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700/50 rounded-md transition-colors text-left"
                        >
                            <Split className="w-4 h-4"/>
                            选项节点
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function App() {
    return (
        <ReactFlowProvider>
            <Flow/>
        </ReactFlowProvider>
    );
}
