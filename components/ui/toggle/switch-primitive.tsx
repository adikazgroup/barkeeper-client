"use client";

import * as React from "react";
import {
  motion,
  useAnimationControls,
  type HTMLMotionProps,
} from "framer-motion";

import { getStrictContext } from "@/lib/get-strict-context";

type SwitchBag = { checked: boolean };

type SwitchContextType = {
  isChecked: boolean;
  isPressed: boolean;
};

const [SwitchProvider, useSwitch] =
  getStrictContext<SwitchContextType>("Switch");

type SwitchOwnProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  children?: React.ReactNode | ((bag: SwitchBag) => React.ReactNode);
};

type SwitchProps<TTag extends React.ElementType = typeof motion.button> = Omit<
  HTMLMotionProps<"button">,
  "children" | "onChange"
> &
  SwitchOwnProps & {
    as?: TTag;
  };

function Switch<TTag extends React.ElementType = typeof motion.button>(
  props: SwitchProps<TTag>,
) {
  const {
    as,
    checked,
    defaultChecked = false,
    onChange,
    disabled = false,
    children,
    onClick,
    ...rest
  } = props;

  const Component = (as ?? motion.button) as React.ElementType;

  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const isChecked = checked !== undefined ? checked : internalChecked;
  const [isPressed, setIsPressed] = React.useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      const next = !isChecked;
      if (checked === undefined) setInternalChecked(next);
      onChange?.(next);
    }
    (onClick as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(
      event,
    );
  };

  return (
    <Component
      type="button"
      role="switch"
      aria-checked={isChecked}
      aria-disabled={disabled}
      disabled={disabled}
      data-slot="switch"
      data-state={isChecked ? "checked" : "unchecked"}
      whileTap="tap"
      initial={false}
      onTapStart={() => setIsPressed(true)}
      onTapCancel={() => setIsPressed(false)}
      onTap={() => setIsPressed(false)}
      onClick={handleClick}
      {...rest}
    >
      <SwitchProvider value={{ isPressed, isChecked }}>
        {typeof children === "function"
          ? children({ checked: isChecked })
          : children}
      </SwitchProvider>
    </Component>
  );
}

type PressedAnimation =
  | HTMLMotionProps<"div">["animate"]
  | boolean
  | ReturnType<typeof useAnimationControls>;

type SwitchThumbProps<TTag extends React.ElementType = typeof motion.div> =
  Omit<HTMLMotionProps<"div">, "children"> & {
    as?: TTag;
    pressedAnimation?: PressedAnimation;
  };

function SwitchThumb<TTag extends React.ElementType = typeof motion.div>(
  props: SwitchThumbProps<TTag>,
) {
  const { isPressed, isChecked } = useSwitch();

  const {
    transition = { type: "spring", stiffness: 300, damping: 25 },
    pressedAnimation,
    as,
    ...rest
  } = props;

  const Component = (as ?? motion.div) as React.ElementType;

  return (
    <Component
      data-slot="switch-thumb"
      layout
      whileTap="tap"
      transition={transition}
      animate={isPressed ? pressedAnimation : undefined}
      {...(isChecked && { "data-checked": true })}
      {...rest}
    />
  );
}

type SwitchIconPosition = "left" | "right" | "thumb";

type SwitchIconProps<TTag extends React.ElementType = typeof motion.div> = Omit<
  HTMLMotionProps<"div">,
  "children"
> & {
  position: SwitchIconPosition;
  as?: TTag;
  children?: React.ReactNode;
};

function SwitchIcon<TTag extends React.ElementType = typeof motion.div>(
  props: SwitchIconProps<TTag>,
) {
  const {
    position,
    transition = { type: "spring", bounce: 0 },
    as: Component = motion.div,
    ...rest
  } = props;
  const { isChecked } = useSwitch();

  const isVisible = React.useMemo(() => {
    if (position === "right") return !isChecked;
    if (position === "left") return isChecked;
    if (position === "thumb") return true;
    return false;
  }, [position, isChecked]);

  return (
    <Component
      data-slot={`switch-${position}-icon`}
      animate={isVisible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      transition={transition}
      {...rest}
    />
  );
}

export {
  Switch,
  SwitchThumb,
  SwitchIcon,
  type SwitchProps,
  type SwitchThumbProps,
  type SwitchIconProps,
};
