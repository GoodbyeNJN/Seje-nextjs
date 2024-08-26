"use client";

import { useBoolean } from "hooks";
import NextImage from "next/image";

import { useModal } from "./Modal";

import type { ImageProps as NextImageProps } from "next/image";

// mdx 插件处理时额外添加的属性
type ImageProps = JSX.IntrinsicElements["img"] &
    (
        | { type?: "local"; base64?: never }
        | { type?: "remote"; width: number; height: number; base64?: string }
    );

// 普通图片
export const Image: React.FC<ImageProps> = props => {
    const { type, src = "", alt = "", width, height, className, style, base64 } = props;

    const [isFailed, toggleFailed] = useBoolean(false);

    const rest: NextImageProps =
        type === "local"
            ? { src, alt, style }
            : type === "remote"
              ? { src, alt, style, width, height, placeholder: "blur", blurDataURL: base64 }
              : { src, alt };

    const onError: React.ReactEventHandler<HTMLImageElement> = () => {
        toggleFailed(true);
    };

    return (
        <NextImage
            className={cx("mx-auto my-4 object-scale-down", { failed: isFailed }, className)}
            onError={onError}
            {...rest}
        />
    );
};

// 带大图预览模式的图片
export const ImageWithPreview: React.FC<ImageProps> = props => {
    const { type, src = "", alt = "", width, height, className, style, base64 } = props;

    const [isFailed, toggleFailed] = useBoolean(false);
    const ref = useRef<HTMLImageElement>(null);
    const { visible, showModal } = useModal(ref);

    const rest: NextImageProps =
        type === "local"
            ? { src, alt, style }
            : type === "remote"
              ? { src, alt, style, width, height, placeholder: "blur", blurDataURL: base64 }
              : { src, alt };

    const onError: React.ReactEventHandler<HTMLImageElement> = () => {
        toggleFailed(true);
    };

    const openModal = () => {
        showModal(<NextImage className={cx("hover:cursor-zoom-out", className)} {...rest} />);
    };

    return (
        <NextImage
            ref={ref}
            className={cx(
                "mx-auto my-4 object-scale-down",
                !isFailed && "hover:cursor-zoom-in",
                { invisible: visible, failed: isFailed },
                className,
            )}
            onClick={isFailed ? undefined : openModal}
            onError={onError}
            {...rest}
        />
    );
};
