"use client";

import NextImage from "next/image";
import { forwardRef } from "react";

import { useBoolean } from "@/hooks";

import { Modal } from "./modal";

import type { ImageProps as NextImageProps } from "next/image";

export type ImageProps = JSX.IntrinsicElements["img"] & {
    base64?: string;
};

export const Image = forwardRef<HTMLImageElement, ImageProps>((props, ref) => {
    const { src = "", alt = "", onClick, onError: onParentError, className, style, base64 } = props;

    const width = Number(props.width) || 0;
    const height = Number(props.height) || 0;
    const placeholder: Partial<NextImageProps> = base64
        ? { placeholder: "blur", blurDataURL: base64 }
        : {};

    const [isFailed, toggleFailed] = useBoolean(false);

    const onError = useCallback<React.ReactEventHandler<HTMLImageElement>>(
        event => {
            toggleFailed(true);
            onParentError?.(event);
        },
        [toggleFailed, onParentError],
    );

    return (
        <NextImage
            ref={ref}
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={cx(className, "mx-auto my-4 object-scale-down", { failed: isFailed })}
            style={style}
            onClick={isFailed ? undefined : onClick}
            onError={onError}
            {...placeholder}
        />
    );
});

export const ImageWithPreview: React.FC<ImageProps> = props => {
    const { ref: _ref, className, base64, ...rest } = props;

    const [isModalShow, toggleModalShow] = useBoolean(false);
    const [isAnimating, toggleAnimating] = useBoolean(false);
    const [isFailed, toggleFailed] = useBoolean(false);
    const ref = useRef<HTMLImageElement>(null);

    const invisible = isModalShow || (!isModalShow && isAnimating);

    const openModal = useCallback(() => {
        if (!ref.current) {
            return;
        }

        toggleModalShow(true);
        toggleAnimating(true);
    }, [toggleModalShow, toggleAnimating]);

    const onError = useCallback(() => {
        toggleFailed(true);
    }, [toggleFailed]);

    const closeModal = useCallback(() => {
        toggleModalShow(false);
    }, [toggleModalShow]);

    const onAnimationStart = useCallback(() => {
        toggleAnimating(true);
    }, [toggleAnimating]);

    const onAnimationEnd = useCallback(() => {
        toggleAnimating(false);
    }, [toggleAnimating]);

    return (
        <>
            <Image
                ref={ref}
                base64={base64}
                className={cx(className, !isFailed && "hover:cursor-zoom-in", { invisible })}
                onClick={openModal}
                onError={onError}
                {...rest}
            />

            <Modal
                show={isModalShow}
                onClick={closeModal}
                onAnimationStart={onAnimationStart}
                onAnimationEnd={onAnimationEnd}
                trigger={ref.current}
            >
                <Image className={cx(className, "hover:cursor-zoom-out")} {...rest} />
            </Modal>
        </>
    );
};
