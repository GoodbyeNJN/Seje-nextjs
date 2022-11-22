import { Modal } from "client/components";
import { useBoolean } from "client/hooks";
import NextImage, { type ImageProps as NextImageProps } from "next/image";
import { getAbsolutePath, isFullUrl, isFunction, isObject } from "share/utils";

export type ImageProps = JSX.IntrinsicElements["img"] & {
    "data-url"?: string;
};

export const Image = forwardRef<HTMLImageElement, ImageProps>((props, ref) => {
    const { src = "", alt = "", onClick, className, style, "data-url": dataUrl } = props;
    const url = isFullUrl(src) ? src : getAbsolutePath(src);
    const width = Number(props.width) || 0;
    const height = Number(props.height) || 0;
    const placeholder: Partial<NextImageProps> = dataUrl
        ? { placeholder: "blur", blurDataURL: dataUrl }
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
            // TODO: replace with ref
            onLoadingComplete={onLoadingComplete}
            {...placeholder}
        />
    );
});

export const ImageWithPreview: React.FC<ImageProps> = props => {
    const { src, alt, className, style, width, height, "data-url": dataUrl } = props;

    const [isModalShow, toggleModalShow] = useBoolean(false);
    const [isAnimating, toggleAnimating] = useBoolean(false);
    const ref = useRef<HTMLImageElement>(null);

    const common = useMemo(
        () => ({ src, alt, style, width, height, "data-url": dataUrl }),
        [src, alt, style, width, height, dataUrl],
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
