import { useLayoutEffect } from "react";

import { isServerEnv } from "@/utils/env";

export const useSafeLayoutEffect = isServerEnv ? useEffect : useLayoutEffect;
