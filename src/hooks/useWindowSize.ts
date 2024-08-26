import { useEventListener } from "./useEventListener";
import { useSafeLayoutEffect } from "./useSafeLayoutEffect";

export interface Size {
    width: number;
    height: number;
}

export const useWindowSize = () => {
    const [size, setSize] = useState<Size>({ width: 0, height: 0 });

    const onResize = useCallback(
        () => setSize({ width: window.innerWidth, height: window.innerHeight }),
        [],
    );

    useEventListener("resize", onResize);

    useSafeLayoutEffect(() => {
        onResize();
    }, [onResize]);

    return size;
};
