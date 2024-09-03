"use client";

import NextImage from "next/image";

import { useBoolean } from "client/hooks/useBoolean";

import { useModal } from "./Modal";

import type { ImageProps as NextImageProps } from "next/image";

type HTMLImageProps = JSX.IntrinsicElements["img"];

// mdx 插件处理时额外添加的属性
export interface ImageProps extends HTMLImageProps {
    type?: "local" | "remote";
    base64?: string;
}

// 普通图片
export const Image: React.FC<ImageProps> = props => {
    const { type, src = "", alt = "", className, style, base64 } = props;

    const [isFailed, toggleFailed] = useBoolean(false);

    const width = typeof props.width === "string" ? parseInt(props.width, 10) : props.width;
    const height = typeof props.height === "string" ? parseInt(props.height, 10) : props.height;
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
    const { type, src = "", alt = "", className, style, base64 } = props;

    const [isFailed, toggleFailed] = useBoolean(false);
    const ref = useRef<HTMLImageElement>(null);
    const { isVisible, showModal } = useModal(ref);

    const width = typeof props.width === "string" ? parseInt(props.width, 10) : props.width;
    const height = typeof props.height === "string" ? parseInt(props.height, 10) : props.height;
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

    return isFailed ? (
        <NextImage
            className={cx(
                "relative mx-auto my-4 rounded-md border-2 border-dashed border-seje-border object-scale-down",
                "before:block before:h-full before:w-full before:bg-seje-border",
                "after:absolute after:bottom-2 after:left-0 after:w-full after:overflow-hidden after:overflow-ellipsis after:whitespace-nowrap after:text-center after:text-base after:text-seje-comment after:content-[attr(alt)]",
                "before:[mask-image:--icon-load-failed] before:[mask-position:center] before:[mask-repeat:no-repeat] before:[mask-size:clamp(theme(width.4),theme(width.32),100%)_auto]",
                className,
            )}
            {...rest}
        />
    ) : (
        <NextImage
            ref={ref}
            className={cx(
                "mx-auto my-4 object-scale-down hover:cursor-zoom-in",
                { invisible: isVisible },
                className,
            )}
            onClick={openModal}
            onError={onError}
            {...rest}
        />
    );
};
