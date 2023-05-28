"use client";

import { animated, config, useReducedMotion, useSpring, useTrail } from "react-spring";

import { useBoolean, useTheme } from "@/hooks";

const id = "moon-mask";
const size = 20;
const halfSize = size / 2;
const sunDotAngles = Array.from({ length: 6 }, (v, i) => i * 60);
const dotDistance = 8;

const getSunDotPositions = (index: number) => {
    const angle = sunDotAngles[index] || 0;
    const angleInRads = (angle / 180) * Math.PI;

    const cx = halfSize + dotDistance * Math.cos(angleInRads);
    const cy = halfSize + dotDistance * Math.sin(angleInRads);

    return { cx, cy };
};

export const DarkModeButton: React.FC = () => {
    const [isDarkMode, toggleDarkMode] = useBoolean(false);
    const { theme, toggle } = useTheme();
    const reducedMotion = useReducedMotion();
    const preferReducedMotion = Boolean(reducedMotion);

    const svgSpring = useSpring({
        transform: isDarkMode ? "rotate(40deg)" : "rotate(90deg)",
        immediate: preferReducedMotion,
    });
    const maskSpring = useSpring({
        cx: isDarkMode ? 10 : 25,
        cy: isDarkMode ? 2 : 0,
        config: { ...config.stiff, mass: 3.1 },
        immediate: preferReducedMotion,
    });
    const sunMoonSpring = useSpring({
        r: isDarkMode ? 9 : 5,
        immediate: preferReducedMotion,
    });

    const sunDotTrail = useTrail(sunDotAngles.length, {
        transform: isDarkMode ? 0 : 1,
        transformOrigin: "center center",
        config: { ...config.stiff, friction: 21 },
        immediate: isDarkMode || preferReducedMotion,
    });

    const onClick = useCallback(() => {
        toggle();
    }, [toggle]);

    useEffect(() => {
        toggleDarkMode(theme === "dark");
    }, [theme, toggleDarkMode]);

    return (
        <button onClick={onClick} className="h-5 w-5">
            <animated.svg viewBox={`0 0 ${size} ${size}`} style={svgSpring}>
                <mask id={id}>
                    <rect x="0" y="0" width={size} height={size} fill="#fff" />
                    <animated.circle {...maskSpring} r="8" fill="#000" />
                </mask>

                <animated.circle
                    cx={halfSize}
                    cy={halfSize}
                    fill="currentColor"
                    mask={`url(#${id})`}
                    {...sunMoonSpring}
                />

                <g>
                    {sunDotTrail.map(({ transform, ...props }, index) => (
                        <animated.circle
                            key={index}
                            r={1.5}
                            {...getSunDotPositions(index)}
                            fill="currentColor"
                            style={{
                                ...props,
                                transform: transform.to(t => `scale(${t})`),
                            }}
                        />
                    ))}
                </g>
            </animated.svg>
        </button>
    );
};
