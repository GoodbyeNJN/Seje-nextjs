"use client";

import { animated, config, useReducedMotion, useTransition } from "@react-spring/web";
import { createContext, use } from "react";
import { createPortal } from "react-dom";

import { useBoolean } from "client/hooks/useBoolean";
import { useEventListener } from "client/hooks/useEventListener";
import { throttle } from "utils/throttle";

interface Rect {
    left: number;
    top: number;
    width: number;
    height: number;
}

interface Animation {
    isReady: boolean;
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
    isReady: false,
    from: { left: 0, top: 0, width: 0, height: 0 },
    to: { left: 0, top: 0, width: 0, height: 0 },
};

const ModalContext = createContext<ModalContextValue>({
    trigger: { current: null },
    isModalVisible: false,
    isAnimating: false,
    showModal: () => {},
    hideModal: () => {},
});

const modalBodyPadding = 20;
const calcModalChildrenRect = (rect: Rect): Rect => {
    const windowWidth = window.innerWidth - modalBodyPadding * 2;
    const windowHeight = window.innerHeight - modalBodyPadding * 2;
    const windowRatio = windowWidth / windowHeight;

    const [contentWidth, contentHeight] = [rect.width, rect.height];
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

    return { left, top, width, height };
};

const render = (children: React.ReactNode) =>
    import.meta.env.SSR ? null : createPortal(children, document.body);

// 控制弹窗的显示与隐藏
export const useModal = (ref: React.MutableRefObject<HTMLElement | null>) => {
    const {
        trigger,
        isModalVisible,
        isAnimating,
        showModal: _showModal,
        hideModal,
    } = use(ModalContext);

    const [isVisible, toggleVisible] = useBoolean(false);

    const showModal = useCallback(
        (component: React.ReactNode) => {
            ref.current && _showModal(ref.current, component);
        },
        [ref, _showModal],
    );

    useEffect(() => {
        if (trigger.current !== ref.current) return;

        toggleVisible(isModalVisible || (!isModalVisible && isAnimating));
    }, [trigger, ref, toggleVisible, isModalVisible, isAnimating]);

    return { isVisible, showModal, hideModal };
};

// 弹窗的包裹组件，统一管理弹窗的动画效果
export const ModalContainer: React.FC<React.PropsWithChildren> = props => {
    const shouldReduceMotion = useReducedMotion();
    const [isModalVisible, toggleModalVisible] = useBoolean(false);
    const [isAnimating, toggleAnimating] = useBoolean(false);
    const [animation, setAnimation] = useState<Animation>(defaultAnimation);
    const trigger = useRef<HTMLElement | null>(null);
    const children = useRef<React.ReactNode>(null);

    const update = throttle(() => {
        if (!trigger.current) return;

        const element = trigger.current;
        const { left, top, width, height } = element.getBoundingClientRect();

        const rect = { left, top, width, height };
        if (element.tagName === "IMG") {
            rect.width = (element as unknown as HTMLImageElement).naturalWidth;
            rect.height = (element as unknown as HTMLImageElement).naturalHeight;
        }

        const isReady = Boolean(left || top || width || height);
        const from = { left, top, width, height };
        const to = calcModalChildrenRect(rect);

        setAnimation({ isReady, from, to });
    }, 100);

    const showModal = useCallback(
        (element: HTMLElement, component: React.ReactNode) => {
            trigger.current = element;
            children.current = component;
            update();

            toggleModalVisible(true);
        },
        [update, toggleModalVisible],
    );

    const hideModal = useCallback(() => {
        toggleModalVisible(false);
    }, [toggleModalVisible]);

    const transitions = useTransition(isModalVisible && animation.isReady, {
        from: { ...animation.from, opacity: 0 },
        enter: { ...animation.to, opacity: 0.7 },
        leave: { ...animation.from, opacity: 0 },
        config: { ...config.stiff, clamp: !isModalVisible },
        immediate: Boolean(shouldReduceMotion),
        onStart: () => toggleAnimating(true),
        onDestroyed: () => toggleAnimating(false),
    });

    useEventListener("resize", update);
    useEventListener("scroll", update);

    const value = useMemo<ModalContextValue>(
        () => ({
            trigger,
            isModalVisible,
            isAnimating,
            showModal,
            hideModal,
        }),
        [trigger, isModalVisible, isAnimating, showModal, hideModal],
    );

    return (
        <ModalContext.Provider value={value}>
            {props.children}

            {render(
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
                                    {children.current}
                                </animated.div>
                            </>
                        ),
                ),
            )}
        </ModalContext.Provider>
    );
};
