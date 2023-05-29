import { useSafeLayoutEffect } from "./useSafeLayoutEffect";

import type { RefObject } from "react";

type Hander<T extends Event> = (event: T) => void;
type Options = boolean | AddEventListenerOptions;

interface UseEventListener {
    // MediaQueryList Event based useEventListener interface
    <K extends keyof MediaQueryListEventMap>(
        eventName: K,
        handler: Hander<MediaQueryListEventMap[K]>,
        element: RefObject<MediaQueryList>,
        options?: Options,
    ): void;

    // Window Event based useEventListener interface
    <K extends keyof WindowEventMap>(
        eventName: K,
        handler: Hander<WindowEventMap[K]>,
        element?: undefined,
        options?: Options,
    ): void;

    // Document Event based useEventListener interface
    <K extends keyof DocumentEventMap>(
        eventName: K,
        handler: Hander<DocumentEventMap[K]>,
        element: RefObject<Document>,
        options?: Options,
    ): void;

    // Element Event based useEventListener interface
    <K extends keyof HTMLElementEventMap, T extends HTMLElement = HTMLDivElement>(
        eventName: K,
        handler: Hander<HTMLElementEventMap[K]>,
        element: RefObject<T>,
        options?: Options,
    ): void;
}

export const useEventListener: UseEventListener = <
    KM extends keyof MediaQueryListEventMap,
    KW extends keyof WindowEventMap,
    KD extends keyof DocumentEventMap,
    KH extends keyof HTMLElementEventMap,
    T extends HTMLElement = HTMLDivElement,
>(
    eventName: KW | KH | KM | KD,
    handler: Hander<
        | MediaQueryListEventMap[KM]
        | WindowEventMap[KW]
        | DocumentEventMap[KD]
        | HTMLElementEventMap[KH]
        | Event
    >,
    element: RefObject<T> | undefined,
    options?: Options,
    // eslint-disable-next-line max-params
) => {
    // Create a ref that stores handler
    const handlerRef = useRef(handler);

    useSafeLayoutEffect(() => {
        handlerRef.current = handler;
    }, [handler]);

    useEffect(() => {
        // Define the listening target
        const targetElement: T | Window = element?.current ?? window;

        if (!targetElement?.addEventListener) {
            return;
        }

        // Create event listener that calls handler function stored in ref
        const listener: typeof handler = event => handlerRef.current(event);

        targetElement.addEventListener(eventName, listener, options);

        // Remove event listener on cleanup
        return () => {
            targetElement.removeEventListener(eventName, listener, options);
        };
    }, [eventName, element, options]);
};
