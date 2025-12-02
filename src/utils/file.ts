import { Edge } from '@xyflow/react';
import { DialogueNodeType, ChoiceNodeType, FlowSheet } from '../types/flow';

export const exportFlow = (nodes: any[], edges: Edge[], sheets: FlowSheet[], activeSheetId: string) => {
    const nodesToExport = nodes.map(n => ({
        ...n,
        data: {...n.data, onChange: undefined}
    }));

    const flowData = {
        nodes: nodesToExport,
        edges: edges
    };

    const currentSheet = sheets.find(s => s.id === activeSheetId);
    const fileName = currentSheet ? `${currentSheet.name}.json` : 'game-dialogue.json';

    const jsonString = JSON.stringify(flowData, null, 2);
    const blob = new Blob([jsonString], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
};

export const importFlow = (file: File, callback: (nodes: any[], edges: Edge[]) => void, onChange: any) => {
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
                callback(restoredNodes, flowData.edges);
            }
        } catch (err) {
            console.error('Failed to parse JSON', err);
            alert('导入失败：文件格式错误');
        }
    };
    reader.readAsText(file);
};

