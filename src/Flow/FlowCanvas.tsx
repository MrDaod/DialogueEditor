import React from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    BackgroundVariant,
    NodeTypes,
} from '@xyflow/react';
import { useTheme } from '../../hooks/useTheme';

type FlowCanvasProps = {
    nodes: any[];
    edges: any[];
    onNodesChange: any;
    onEdgesChange: any;
    onConnect: any;
    onConnectStart: any;
    onConnectEnd: any;
    onPaneClick: any;
    onPaneContextMenu: any;
    nodeTypes: NodeTypes;
    darkMode: boolean;
    children?: React.ReactNode;
};

export function FlowCanvas({
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onConnectStart,
    onConnectEnd,
    onPaneClick,
    onPaneContextMenu,
    nodeTypes,
    darkMode,
    children
}: FlowCanvasProps) {
    return (
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
            {children}
        </div>
    );
}

