import React from 'react';
import {
    useNodesState,
    useEdgesState,
    NodeTypes,
    useReactFlow,
    addEdge,
    Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { DialogueNode } from '../nodes/DialogueNode';
import { ChoiceNode } from '../nodes/ChoiceNode';
import { DialogueNodeType, ChoiceNodeType } from '../types/flow';

import { useTheme } from '../hooks/useTheme';
import { useContextMenu } from '../hooks/useContextMenu';
import { useNodesLogic } from '../hooks/useNodesLogic';
import { useFlowEvents } from '../hooks/useFlowEvents';
import { useFlowSheets } from '../hooks/useFlowSheets';
import { useFlowIO } from '../hooks/useFlowIO';

import { Toolbar } from './Toolbar';
import { FlowTabs } from './FlowTabs';
import { FlowCanvas } from './FlowCanvas';
import { ContextMenu } from './ContextMenu';

const nodeTypes: NodeTypes = {
    dialogue: DialogueNode,
    choice: ChoiceNode,
};

const initialNodes: (DialogueNodeType | ChoiceNodeType)[] = [];
const initialEdges: any[] = [];

export function Flow() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const { screenToFlowPosition } = useReactFlow();
    
    const { darkMode, toggleDarkMode } = useTheme();
    const { menu, setMenu, onPaneContextMenu } = useContextMenu();
    
    const { onChange, addDialogueNode, addChoiceNode } = useNodesLogic(setNodes);
    
    const { 
        onConnect, 
        onConnectStart, 
        onConnectEnd, 
        onPaneClick,
        connectingNodeId,
        connectingHandleId
    } = useFlowEvents(setEdges, setMenu);

    const {
        sheets,
        activeSheetId,
        switchSheet,
        createNewSheet,
        closeSheet,
        updateSheetName
    } = useFlowSheets(setNodes, setEdges);

    const { 
        fileInputRef, 
        onExport, 
        onImport, 
        triggerImport 
    } = useFlowIO(setNodes, setEdges, sheets, activeSheetId, onChange);

    // Wrap addNode to use with menu
    const onMenuAdd = (type: 'dialogue' | 'choice') => {
        if (!menu) return;
        
        const position = screenToFlowPosition({
            x: menu.left,
            y: menu.top,
        });

        let newNode: DialogueNodeType | ChoiceNodeType;
        if (type === 'dialogue') {
            newNode = addDialogueNode(position);
        } else {
            newNode = addChoiceNode(position);
        }
        
        // Create connection if triggered by connection drag
        if (connectingNodeId.current) {
            const edge: Edge = {
                id: `e${connectingNodeId.current}-${newNode.id}`,
                source: connectingNodeId.current,
                target: newNode.id,
                sourceHandle: connectingHandleId.current,
            };
            setEdges((eds) => addEdge(edge, eds));
        }
        
        setMenu(null);
        connectingNodeId.current = null;
        connectingHandleId.current = null;
    };
    
    return (
        <div className="w-screen h-screen flex flex-col font-sans transition-colors bg-white dark:bg-stone-950">
            <Toolbar 
                addDialogueNode={() => addDialogueNode()}
                addChoiceNode={() => addChoiceNode()}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                clearCanvas={() => {
                    if (window.confirm('确定要清空画布吗？未保存的内容将丢失。')) {
                        setNodes([]);
                        setEdges([]);
                    }
                }}
                onExport={onExport}
                triggerImport={triggerImport}
                fileInputRef={fileInputRef}
                onImport={onImport}
            />
            
            <FlowTabs 
                sheets={sheets}
                activeSheetId={activeSheetId}
                switchSheet={switchSheet}
                createNewSheet={createNewSheet}
                closeSheet={closeSheet}
                updateSheetName={updateSheetName}
            />
            
            <FlowCanvas
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
                darkMode={darkMode}
            >
                <ContextMenu menu={menu} onMenuAdd={onMenuAdd} />
            </FlowCanvas>
        </div>
    );
}

