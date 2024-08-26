"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import React, { createContext } from "react";
import { createPortal } from "react-dom";

import { throttle } from "@/utils/fn";
import { useBoolean, useEventListener } from "hooks";

import type { Transition } from "framer-motion";

interface Rect {
    left: number;
    top: number;
    width: number;
    height: number;
}

export interface ModalContextValue {
    trigger: React.MutableRefObject<HTMLElement | null>;
    isModalVisible: boolean;
    showModal: (ref: HTMLElement, node: React.ReactNode) => void;
    hideModal: () => void;
}

const ModalContext = createContext<ModalContextValue>({
    trigger: { current: null },
    isModalVisible: false,
    showModal: () => {},
    hideModal: () => {},
});

const defaultRect: Rect = { left: 0, top: 0, width: 0, height: 0 };
const modalBodyPadding = 20;

const triggers = new WeakSet<HTMLElement>();

const isImageElement = (element: HTMLElement): element is HTMLImageElement =>
    element.tagName === "IMG";

const getAnimationRect = (element?: HTMLElement | null): [Rect, Rect] => {
    if (!element) {
        return [defaultRect, defaultRect];
    }

    const rect = element.getBoundingClientRect();

    const windowWidth = window.innerWidth - modalBodyPadding * 2;
    const windowHeight = window.innerHeight - modalBodyPadding * 2;
    const windowRatio = windowWidth / windowHeight;

    const [contentWidth, contentHeight] = isImageElement(element)
        ? [element.naturalWidth, element.naturalHeight]
        : [rect.width, rect.height];
    const contentRatio = !contentHeight ? 1 : contentWidth / contentHeight;

    let [left, top, width, height] = [0, 0, 0, 0];
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

    const start: Rect = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
    const end: Rect = { left, top, width, height };

    return [start, end];
};

const getTransition = (
    shouldReduceMotion: boolean | null,
    defaultTransition?: Transition | null,
): Transition | undefined => {
    if (shouldReduceMotion) {
        return { duration: 0 };
    }

    if (R.isNullish(defaultTransition)) {
        return undefined;
    } else if (defaultTransition) {
        return defaultTransition;
    }

    return { type: "spring", stiffness: 210, damping: 20 };
};

const render = (children: React.ReactNode) =>
    import.meta.env.SSR ? null : createPortal(children, document.body);

// 控制弹窗的显示与隐藏
export const useModal = (ref: React.MutableRefObject<HTMLElement | null>) => {
    const { trigger, isModalVisible, showModal: _showModal, hideModal } = useContext(ModalContext);

    const [visible, toggleVisible] = useBoolean(false);

    const showModal = useCallback(
        (node: React.ReactNode) => {
            ref.current && _showModal(ref.current, node);
        },
        [_showModal, ref],
    );

    useEffect(() => {
        if (trigger.current === ref.current) {
            toggleVisible(isModalVisible);
        }
    }, [trigger, ref, isModalVisible, toggleVisible]);

    useEffect(() => {
        const { current: trigger } = ref;
        trigger && triggers.add(trigger);

        return () => {
            trigger && triggers.delete(trigger);
        };
    }, [ref]);

    return { visible, showModal, hideModal };
};

// 弹窗的包裹组件，统一管理弹窗的动画效果
export const ModalContainer: React.FC<React.PropsWithChildren> = props => {
    const { children } = props;

    const shouldReduceMotion = useReducedMotion();
    const [isModalVisible, toggleModalVisible] = useBoolean(false);
    const [isModalShow, toggleModalShow] = useBoolean(false);
    const [animationRect, setAnimationRect] = useState<[Rect, Rect]>(getAnimationRect());
    const trigger = useRef<HTMLElement | null>(null);
    const body = useRef<React.ReactNode>(null);

    const update = throttle(() => {
        if (trigger.current) {
            setAnimationRect(getAnimationRect(trigger.current));
        }
    }, 300);

    const showModal = useCallback(
        (ref: HTMLElement, node: React.ReactNode) => {
            trigger.current = ref;
            body.current = node;
            update();

            toggleModalShow(true);
            toggleModalVisible(true);
        },
        [update, toggleModalShow, toggleModalVisible],
    );

    const hideModal = useCallback(() => {
        toggleModalShow(false);
    }, [toggleModalShow]);

    const onAnimationComplete = (definition: string) => {
        if (definition === "animate") {
            toggleModalVisible(true);
        } else if (definition === "exit") {
            toggleModalVisible(false);
        }
    };

    useEventListener("resize", update);
    useEventListener("scroll", update);

    const value = useMemo<ModalContextValue>(
        () => ({
            trigger,
            isModalVisible,
            showModal,
            hideModal,
        }),
        [trigger, isModalVisible, showModal, hideModal],
    );

    return (
        <ModalContext.Provider value={value}>
            {children}

            {render(
                <AnimatePresence>
                    {isModalShow && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: 0.7,
                                    transition: getTransition(shouldReduceMotion, null),
                                }}
                                exit={{
                                    opacity: 0,
                                    transition: getTransition(shouldReduceMotion, null),
                                }}
                                onClick={hideModal}
                                className="fixed left-0 top-0 z-40 h-full w-full bg-seje-900"
                            />

                            <motion.div
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                variants={{
                                    initial: { ...animationRect[0] },
                                    animate: {
                                        ...animationRect[1],
                                        transition: getTransition(shouldReduceMotion),
                                    },
                                    exit: {
                                        ...animationRect[0],
                                        transition: getTransition(shouldReduceMotion, null),
                                    },
                                }}
                                onClick={hideModal}
                                onAnimationComplete={onAnimationComplete}
                                className="fixed z-50 flex items-center justify-center"
                            >
                                {body.current}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>,
            )}
        </ModalContext.Provider>
    );
};
