import { useCallback, useRef } from 'react';
import { useReactFlow, addEdge, Connection, Edge, OnConnectStart, OnConnectEnd } from '@xyflow/react';
import { MenuState } from './useContextMenu';

export function useFlowEvents(
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
    setMenu: React.Dispatch<React.SetStateAction<MenuState>>
) {
    const connectingNodeId = useRef<string | null>(null);
    const connectingHandleId = useRef<string | null>(null);
    const skipNextPaneClick = useRef(false);

    const onConnect = useCallback(
        (params: Connection) => {
            setEdges((eds) => addEdge(params, eds));
            connectingNodeId.current = null;
            connectingHandleId.current = null;
        },
        [setEdges],
    );

    const onConnectStart: OnConnectStart = useCallback((_, { nodeId, handleId }) => {
        connectingNodeId.current = nodeId;
        connectingHandleId.current = handleId;
    }, []);

    const onConnectEnd: OnConnectEnd = useCallback(
        (event) => {
            if (!connectingNodeId.current) return;

            const target = event.target as Element;
            const isTargetNode = target.closest('.react-flow__node');
            const isTargetHandle = target.closest('.react-flow__handle');

            if (!isTargetNode && !isTargetHandle) {
                skipNextPaneClick.current = true;
                const { clientX, clientY } = 'changedTouches' in event ? (event as any).changedTouches[0] : event;

                setMenu({
                    id: 'context-menu',
                    top: clientY,
                    left: clientX,
                });
            }
        },
        [setMenu],
    );

    const onPaneClick = useCallback(() => {
        if (skipNextPaneClick.current) {
            skipNextPaneClick.current = false;
            return;
        }
        setMenu(null);
        connectingNodeId.current = null;
        connectingHandleId.current = null;
    }, [setMenu]);

    return {
        onConnect,
        onConnectStart,
        onConnectEnd,
        onPaneClick,
        connectingNodeId,
        connectingHandleId,
    };
}

