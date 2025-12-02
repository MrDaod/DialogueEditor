import { useState, useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';

export type MenuState = {
    id: string;
    top: number;
    left: number;
    right?: number;
    bottom?: number;
} | null;

export function useContextMenu() {
    const [menu, setMenu] = useState<MenuState>(null);

    const onPaneContextMenu = useCallback((event: React.MouseEvent | MouseEvent) => {
        event.preventDefault();

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

    const closeMenu = useCallback(() => {
        setMenu(null);
    }, []);

    return { menu, setMenu, onPaneContextMenu, closeMenu };
}

