import { useRef, useCallback } from 'react';
import { useReactFlow, Edge } from '@xyflow/react';
import { exportFlow, importFlow } from '../utils/file';
import { FlowSheet } from '../types/flow';

export function useFlowIO(
    setNodes: (nodes: any[]) => void,
    setEdges: (edges: Edge[]) => void,
    sheets: FlowSheet[],
    activeSheetId: string,
    onChange: any
) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { getNodes, getEdges } = useReactFlow();

    const onExport = useCallback(() => {
        exportFlow(getNodes(), getEdges(), sheets, activeSheetId);
    }, [getNodes, getEdges, sheets, activeSheetId]);

    const onImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        importFlow(file, (nodes, edges) => {
            setNodes(nodes);
            setEdges(edges);
        }, onChange);
        
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, [setNodes, setEdges, onChange]);

    const triggerImport = () => fileInputRef.current?.click();

    return { fileInputRef, onExport, onImport, triggerImport };
}

