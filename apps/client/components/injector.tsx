import { cloneElement, isValidElement } from "react";

export interface ClassNameInjectorProps {
    className?: string;
    children: React.ReactElement | null;
}

export interface StyleInjectorProps {
    style?: React.CSSProperties;
    children: React.ReactElement | null;
}

export interface EventHandlerInjectorProps extends React.DOMAttributes<Element> {
    children: React.ReactElement | null;
}

export const ClassNameInjector: React.FC<ClassNameInjectorProps> = props => {
    const { className, children, ...rest } = props;

    return isValidElement<ClassNameInjectorProps>(children)
        ? cloneElement<ClassNameInjectorProps>(children, {
              ...rest,
              className: cx(children.props.className, className),
          })
        : children;
};

export const StyleInjector: React.FC<StyleInjectorProps> = props => {
    const { style, children, ...rest } = props;

    return isValidElement<StyleInjectorProps>(children)
        ? cloneElement<StyleInjectorProps>(children, {
              ...rest,
              style: { ...children.props.style, ...style },
          })
        : children;
};

export const EventHandlerInjector: React.FC<EventHandlerInjectorProps> = props => {
    const { children, ...rest } = props;

    return isValidElement<EventHandlerInjectorProps>(children)
        ? cloneElement<EventHandlerInjectorProps>(children, rest)
        : children;
};
