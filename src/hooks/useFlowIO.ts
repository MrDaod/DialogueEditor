import { useCallback, useState, useEffect } from 'react';
import { useReactFlow, Edge } from '@xyflow/react';
import { FlowSheet } from '../types/flow';

export function useFlowIO(
    setNodes: (nodes: any[]) => void,
    setEdges: (edges: Edge[]) => void,
    sheets: FlowSheet[],
    activeSheetId: string,
    onChange: any,
    updateSheetFileName: (id: string, fileName: string) => void,
    createSheetWithData: (name: string, fileName: string, nodes: any[], edges: any[]) => void
) {
    const { getNodes, getEdges } = useReactFlow();
    const [dirHandle, setDirHandle] = useState<FileSystemDirectoryHandle | null>(null);

    // @ts-ignore
    const onSetDirectory = useCallback(async () => {
        try {
            // @ts-ignore
            const handle = await window.showDirectoryPicker();
            setDirHandle(handle);
        } catch (err) {
            console.error('Failed to select directory:', err);
        }
    }, []);

    // @ts-ignore
    const saveCurrentSheet = useCallback(async () => {
        if (!dirHandle) {
            alert('请先设置保存目录');
            await onSetDirectory();
            if (!dirHandle) return; // User cancelled
        }

        // Need to re-check dirHandle as it might have been set in the previous await block?
        // Actually, state update is async, so we might need to rely on the handle returned or updated state.
        // But for simplicity in this flow, let's assume if dirHandle was null, user set it.
        // However, standard way is to just return if null and let user click again or chain it.
        // Let's try to use the state. If it's null, we prompt.

        // Re-get handle from state? No, closure.
        // We can't easily await state update in same callback.
        // So we will rely on the user clicking save again or use a ref if we really want.
        // For now: simple check.
    }, [dirHandle, onSetDirectory]);

    // Actual save logic
    const saveFile = useCallback(async (handle: FileSystemDirectoryHandle) => {
        try {
            const nodesToExport = getNodes().map(n => ({
                ...n,
                data: {...n.data, onChange: undefined}
            }));
            const edgesToExport = getEdges();

            const flowData = {
                nodes: nodesToExport,
                edges: edgesToExport
            };

            const currentSheet = sheets.find(s => s.id === activeSheetId);
            if (!currentSheet) return;

            const targetFileName = `${currentSheet.name}.json`;
            
            // If the file name has changed, try to delete the old file
            if (currentSheet.fileName && currentSheet.fileName !== targetFileName) {
                try {
                    await handle.removeEntry(currentSheet.fileName);
                } catch (e) {
                    console.warn('Could not remove old file:', e);
                }
            }

            const fileHandle = await handle.getFileHandle(targetFileName, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(JSON.stringify(flowData, null, 2));
            await writable.close();
            
            // Update the sheet's tracked filename
            updateSheetFileName(activeSheetId, targetFileName);
            
            // Optional: visual feedback
            console.log('Saved to', targetFileName);
        } catch (err) {
            console.error('Failed to save file:', err);
            alert('保存失败，请检查目录权限');
        }
    }, [getNodes, getEdges, sheets, activeSheetId, updateSheetFileName]);

    const onSave = useCallback(async () => {
        if (!dirHandle) {
             try {
                // @ts-ignore
                const handle = await window.showDirectoryPicker();
                setDirHandle(handle);
                await saveFile(handle);
            } catch (err) {
                // User cancelled or error
                return;
            }
        } else {
            await saveFile(dirHandle);
        }
    }, [dirHandle, saveFile]);

    const onLoad = useCallback(async () => {
        if (!dirHandle) {
             try {
                // @ts-ignore
                const handle = await window.showDirectoryPicker();
                setDirHandle(handle);
                // Don't auto load, just set dir? Or maybe prompt file picker from that dir?
                // Requirement says: "change import/export to save/load, user needs to set dir first".
                // So Load should probably pick a file from the configured dir.
                // Let's proceed to pick file.

                // We can't easily "pick file from dir" using standard file picker restricted to that dir handle in web.
                // But we can show a UI to list files? Or just use standard showOpenFilePicker?
                // Window.showOpenFilePicker can take a startIn option.

                // Let's use showOpenFilePicker for loading, optionally starting in dirHandle.
             } catch (err) {
                 return;
             }
        }

        try {
            // @ts-ignore
            const [fileHandle] = await window.showOpenFilePicker({
                startIn: dirHandle || undefined,
                types: [{
                    description: 'JSON Files',
                    accept: {'application/json': ['.json']}
                }]
            });

            const file = await fileHandle.getFile();
            const content = await file.text();
            const flowData = JSON.parse(content);

            if (flowData.nodes && flowData.edges) {
                const restoredNodes = flowData.nodes.map((n: any) => ({
                    ...n,
                    data: {
                        ...n.data,
                        onChange
                    }
                }));
                
                // Create a new sheet with the loaded data
                const sheetName = file.name.replace(/\.json$/i, '');
                createSheetWithData(sheetName, file.name, restoredNodes, flowData.edges);
            }
        } catch (err) {
            if ((err as any).name !== 'AbortError') {
                console.error('Failed to load file:', err);
                alert('加载失败');
            }
        }
    }, [dirHandle, createSheetWithData, onChange]);

    // Keyboard shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                onSave();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onSave]);

    return { onSave, onLoad, onSetDirectory, hasDirectory: !!dirHandle };
}


