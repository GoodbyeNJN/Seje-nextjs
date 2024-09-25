import { animated, config, useReducedMotion, useTransition } from "@react-spring/web";
import { createPortal } from "react-dom";

import { useBoolean } from "./useBoolean";
import { useEventListener } from "./useEventListener";
import { useThrottleCallback } from "./useThrottleCallback";

interface Rect {
    left: number;
    top: number;
    width: number;
    height: number;
}

interface Animation {
    from: Rect;
    to: Rect;
}

export interface ModalContextValue {
    trigger: React.MutableRefObject<HTMLElement | null>;
    isModalVisible: boolean;
    isAnimating: boolean;
    showModal: (element: HTMLElement, component: React.ReactNode) => void;
    hideModal: () => void;
}

const defaultAnimation: Animation = {
    from: { left: 0, top: 0, width: 0, height: 0 },
    to: { left: 0, top: 0, width: 0, height: 0 },
};

const modalBodyPadding = 20;

const isImgElement = (element: HTMLElement): element is HTMLImageElement =>
    element.tagName === "IMG";

const calc = (trigger: HTMLElement) => {
    const boundingRect = trigger.getBoundingClientRect();

    let from;
    let isReady;
    {
        const { left, top, width, height } = boundingRect;

        isReady = Boolean(left || top || width || height);
        from = { left, top, width, height };
    }

    let to;
    {
        const windowWidth = window.innerWidth - modalBodyPadding * 2;
        const windowHeight = window.innerHeight - modalBodyPadding * 2;
        const windowRatio = windowWidth / windowHeight;

        const [contentWidth, contentHeight] = isImgElement(trigger)
            ? [trigger.naturalWidth, trigger.naturalHeight]
            : [boundingRect.width, boundingRect.height];
        const contentRatio = !contentHeight ? 1 : contentWidth / contentHeight;

        let [width, height, top, left] = [0, 0, 0, 0];
        if (windowRatio > contentRatio) {
            height = Math.min(windowHeight, contentHeight);
            width = height * contentRatio;
            left = (windowWidth - width) / 2 + modalBodyPadding;
            top = (windowHeight - height) / 2 + modalBodyPadding;
        } else {
            width = Math.min(windowWidth, contentWidth);
            height = width / contentRatio;
            left = (windowWidth - width) / 2 + modalBodyPadding;
            top = (windowHeight - height) / 2 + modalBodyPadding;
        }

        to = { left, top, width, height };
    }

    return { isReady, from, to };
};

const render = (children: React.ReactNode) =>
    import.meta.env.SSR ? null : createPortal(children, document.body);

export const useModal = (trigger: React.MutableRefObject<HTMLElement | null>) => {
    const shouldReduceMotion = useReducedMotion();
    const [isTriggerReady, toggleTriggerReady] = useBoolean(false);
    const [isModalVisible, toggleModalVisible] = useBoolean(false);
    const [isAnimating, toggleAnimating] = useBoolean(false);
    const [animation, setAnimation] = useState<Animation>(defaultAnimation);

    const update = useCallback(() => {
        if (!trigger.current) return;

        const { isReady, from, to } = calc(trigger.current);

        setAnimation({ from, to });
        toggleTriggerReady(isReady);
    }, [trigger, toggleTriggerReady]);

    const throttledUpdate = useThrottleCallback(update, 500);

    const showModal = useCallback(() => {
        throttledUpdate();

        toggleModalVisible(true);
        toggleAnimating(true);
    }, [throttledUpdate, toggleModalVisible, toggleAnimating]);

    const hideModal = useCallback(() => {
        toggleModalVisible(false);
        toggleAnimating(true);
    }, [toggleModalVisible, toggleAnimating]);

    const transitions = useTransition(isModalVisible && isTriggerReady, {
        from: { ...animation.from, opacity: 0 },
        enter: { ...animation.to, opacity: 0.7 },
        leave: { ...animation.from, opacity: 0 },
        config: { ...config.stiff, clamp: !isModalVisible },
        immediate: Boolean(shouldReduceMotion),
        onDestroyed: () => toggleAnimating(false),
    });

    const Modal: React.FC<React.PropsWithChildren> = useMemo(
        () => props =>
            render(
                transitions(
                    ({ opacity, ...rest }, animation) =>
                        animation && (
                            <>
                                <animated.div
                                    onClick={hideModal}
                                    className="fixed left-0 top-0 z-40 h-full w-full bg-seje-900"
                                    style={{ opacity }}
                                />

                                <animated.div
                                    onClick={hideModal}
                                    className="fixed z-50 flex items-center justify-center"
                                    style={rest}
                                >
                                    {props.children}
                                </animated.div>
                            </>
                        ),
                ),
            ),
        [transitions, hideModal],
    );

    useEventListener("resize", throttledUpdate);
    useEventListener("scroll", throttledUpdate);

    return {
        Modal,
        isVisible: isModalVisible || (!isModalVisible && isAnimating),
        showModal,
        hideModal,
    };
};
