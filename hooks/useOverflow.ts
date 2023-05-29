import { useBoolean } from "./useBoolean";
import { useEventListener } from "./useEventListener";
import { useSafeLayoutEffect } from "./useSafeLayoutEffect";

export const useOverflow = (ref: React.RefObject<HTMLElement>) => {
    const [isOverflow, toggleOverflow] = useBoolean(false);

    const onResize = useCallback(() => {
        const element = ref.current;
        if (!element) {
            return;
        }

        const range = document.createRange();
        range.setStart(element, 0);
        range.setEnd(element, element.childNodes.length);

        const { width } = range.getBoundingClientRect();
        const padding =
            (parseInt(window.getComputedStyle(element).paddingLeft, 10) || 0) +
            (parseInt(window.getComputedStyle(element).paddingRight, 10) || 0);

        toggleOverflow(
            width + padding > element.offsetWidth || element.scrollWidth > element.offsetWidth,
        );
    }, [ref, toggleOverflow]);

    useEventListener("resize", onResize);

    useSafeLayoutEffect(() => {
        onResize();
    }, [onResize]);

    return isOverflow;
};
