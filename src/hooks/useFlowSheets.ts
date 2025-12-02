import { useState } from 'react';
import { useReactFlow, Edge } from '@xyflow/react';
import { FlowSheet, DialogueNodeType, ChoiceNodeType } from '../types/flow';

const initialNodes: (DialogueNodeType | ChoiceNodeType)[] = [];
const initialEdges: Edge[] = [];

export function useFlowSheets(
    setNodes: (nodes: (DialogueNodeType | ChoiceNodeType)[]) => void,
    setEdges: (edges: Edge[]) => void
) {
    const [sheets, setSheets] = useState<FlowSheet[]>([
        { id: 'default', name: '流程 1', nodes: initialNodes, edges: initialEdges }
    ]);
    const [activeSheetId, setActiveSheetId] = useState('default');
    const { getNodes, getEdges } = useReactFlow();

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

    const closeSheet = (id: string) => {
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

    const updateSheetName = (id: string, newName: string) => {
        setSheets(prev => prev.map(sheet =>
            sheet.id === id ? { ...sheet, name: newName } : sheet
        ));
    };

    return {
        sheets,
        activeSheetId,
        switchSheet,
        createNewSheet,
        closeSheet,
        updateSheetName
    };
}

