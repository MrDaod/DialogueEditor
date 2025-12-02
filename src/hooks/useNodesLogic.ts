import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { DialogueNodeType, ChoiceNodeType } from '../types/flow';

export function useNodesLogic(
    setNodes: React.Dispatch<React.SetStateAction<(DialogueNodeType | ChoiceNodeType)[]>>
) {
    const { screenToFlowPosition } = useReactFlow();

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
                        onChange, 
                    },
                };
            })
        );
    }, [setNodes]);

    const addDialogueNode = useCallback((position?: { x: number, y: number }) => {
        const id = `node-${Date.now()}`;
        const pos = position || { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 };
        
        const newNode: DialogueNodeType = {
            id,
            type: 'dialogue',
            position: pos,
            data: { speaker: '', text: '', onChange },
        };
        setNodes((nds) => nds.concat(newNode));
        return newNode;
    }, [setNodes, onChange]);

    const addChoiceNode = useCallback((position?: { x: number, y: number }) => {
        const id = `node-${Date.now()}`;
        const pos = position || { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 };

        const newNode: ChoiceNodeType = {
            id,
            type: 'choice',
            position: pos,
            data: { options: [{ id: `opt-${Date.now()}`, text: '' }], onChange },
        };
        setNodes((nds) => nds.concat(newNode));
        return newNode;
    }, [setNodes, onChange]);

    return { onChange, addDialogueNode, addChoiceNode };
}

