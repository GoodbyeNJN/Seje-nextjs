import { useLayoutEffect } from "react";

export const useSafeLayoutEffect = import.meta.env.SSR ? useEffect : useLayoutEffect;
