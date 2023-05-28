"use client";

import NextImage from "next/image";

import { useBoolean } from "@/hooks";
import { isFunction, isObject } from "@/utils/type";
import { isFullUrl, joinPathnameWithBasePath } from "@/utils/url";

import { Modal } from "./modal";

import type { ImageProps as NextImageProps } from "next/image";

export type ImageProps = JSX.IntrinsicElements["img"] & {
    base64?: string;
};

export const Image = React.forwardRef<HTMLImageElement, ImageProps>((props, ref) => {
    const { src = "", alt = "", onClick, className, style, base64 } = props;
    const url = isFullUrl(src) ? src : joinPathnameWithBasePath(src);
    const width = Number(props.width) || 0;
    const height = Number(props.height) || 0;
    const placeholder: Partial<NextImageProps> = base64
        ? { placeholder: "blur", blurDataURL: base64 }
        : {};

    const [error, setError] = useState(false);

    const onError = useCallback(() => {
        setError(true);
    }, []);

    const onLoadingComplete = useCallback(
        (element: HTMLImageElement) => {
            if (isFunction(ref)) {
                ref(element);
            } else if (isObject(ref)) {
                ref.current = element;
            }
        },
        [ref],
    );

    return (
        <NextImage
            src={error ? "" : url}
            alt={alt}
            width={width}
            height={height}
            className={cx(className, { error })}
            style={style}
            onClick={error ? undefined : onClick}
            onError={onError}
            onLoadingComplete={onLoadingComplete}
            {...placeholder}
        />
    );
});

export const ImageWithPreview: React.FC<ImageProps> = props => {
    const { src, alt, className, style, width, height, base64 } = props;

    const [isModalShow, toggleModalShow] = useBoolean(false);
    const [isAnimating, toggleAnimating] = useBoolean(false);
    const ref = useRef<HTMLImageElement>(null);

    const common = useMemo(
        () => ({ src, alt, style, width, height, base64 }),
        [src, alt, style, width, height, base64],
    );
    const invisible = isModalShow || (!isModalShow && isAnimating);

    const openModal = useCallback(() => {
        if (!ref.current) {
            return;
        }

        toggleModalShow(true);
        toggleAnimating(true);
    }, [toggleModalShow, toggleAnimating]);

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
                className={cx(className, "my-4 mx-auto object-scale-down hover:cursor-zoom-in", {
                    invisible,
                })}
                onClick={openModal}
                {...common}
            />

            <Modal
                show={isModalShow}
                onClick={closeModal}
                onAnimationStart={onAnimationStart}
                onAnimationEnd={onAnimationEnd}
                trigger={ref.current}
            >
                <Image className={cx(className, "hover:cursor-zoom-out")} {...common} />
            </Modal>
        </>
    );
};
