"use client";

import throttle from "lodash.throttle";
import { createPortal } from "react-dom";
import { animated, config, useReducedMotion, useTransition } from "react-spring";

import { isServerEnv } from "@/utils/env";

export interface ModalProps extends React.PropsWithChildren {
    show: boolean;
    onClick: () => void;
    onAnimationStart: () => void;
    onAnimationEnd: () => void;
    trigger?: HTMLElement | null;
}

interface Rect {
    left: number;
    top: number;
    width: number;
    height: number;
}

interface AnimationRect {
    start: Rect;
    end: Rect;
}

const initAnimationRect: AnimationRect = {
    start: { left: 0, top: 0, width: 0, height: 0 },
    end: { left: 0, top: 0, width: 0, height: 0 },
};

const isImageElement = (element: HTMLElement): element is HTMLImageElement =>
    element.tagName === "IMG";

const getAnimationRect = (element: HTMLElement): AnimationRect => {
    const rect = element.getBoundingClientRect();
    const start = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };

    const padding = 20;

    const windowWidth = window.innerWidth - padding * 2;
    const windowHeight = window.innerHeight - padding * 2;
    const windowRatio = windowWidth / windowHeight;

    const [contentWidth, contentHeight] = isImageElement(element)
        ? [element.naturalWidth, element.naturalHeight]
        : [rect.width, rect.height];
    const contentRatio = !contentHeight ? 1 : contentWidth / contentHeight;

    let [left, top, width, height] = [0, 0, 0, 0];
    if (windowRatio > contentRatio) {
        height = Math.min(windowHeight, contentHeight);
        width = height * contentRatio;
        left = (windowWidth - width) / 2 + padding;
        top = (windowHeight - height) / 2 + padding;
    } else {
        width = Math.min(windowWidth, contentWidth);
        height = width / contentRatio;
        left = (windowWidth - width) / 2 + padding;
        top = (windowHeight - height) / 2 + padding;
    }

    const end = { left, top, width, height };

    return { start, end };
};

const render = (children: React.ReactNode) =>
    isServerEnv ? null : createPortal(children, document.body);

export const Modal: React.FC<ModalProps> = props => {
    const { show, trigger, onClick, onAnimationStart, onAnimationEnd, children } = props;

    const [rect, setRect] = useState<AnimationRect>(initAnimationRect);
    const reducedMotion = useReducedMotion();
    const preferReducedMotion = Boolean(reducedMotion);

    const isRectReady = useMemo(() => {
        const { left, top, width, height } = rect.start;
        return Boolean(left || top || width || height);
    }, [rect]);

    const transitions = useTransition(show && isRectReady, {
        from: { ...rect.start, opacity: 0 },
        enter: { ...rect.end, opacity: 0.7 },
        leave: { ...rect.start, opacity: 0 },
        config: { ...config.stiff, clamp: !show },
        immediate: preferReducedMotion,
        onDestroyed: onAnimationEnd,
    });

    const onModalClick = useCallback(() => {
        onClick();
        onAnimationStart();
    }, [onAnimationStart, onClick]);

    const update = useMemo(
        () =>
            throttle(() => {
                trigger && setRect(getAnimationRect(trigger));
            }, 300),
        [trigger],
    );

    useEffect(() => {
        update();

        window.addEventListener("resize", update);
        window.addEventListener("scroll", update);

        return () => {
            window.removeEventListener("resize", update);
            window.removeEventListener("scroll", update);
        };
    }, [update]);

    const modal = transitions(
        ({ opacity, ...rest }, animation) =>
            animation && (
                <>
                    <animated.div
                        onClick={onModalClick}
                        className="bg-seje-900 fixed top-0 left-0 z-40 h-full w-full"
                        style={{ opacity }}
                    />

                    <animated.div
                        onClick={onModalClick}
                        className="fixed z-50 flex items-center justify-center"
                        style={rest}
                    >
                        {children}
                    </animated.div>
                </>
            ),
    );

    return render(modal);
};
