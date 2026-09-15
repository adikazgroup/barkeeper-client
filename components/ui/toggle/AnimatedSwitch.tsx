"use client";

import { cn } from "@/lib/utils";
import { CheckIcon, XIcon } from "@/components/icons/Icons";
import { Switch, SwitchThumb, SwitchIcon } from "./switch-primitive";

export type AnimatedSwitchVariant =
  "primary" | "success" | "danger" | "warning" | "secondary";
export type AnimatedSwitchSize = "sm" | "md" | "lg";

export interface AnimatedSwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  variant?: AnimatedSwitchVariant;
  size?: AnimatedSwitchSize;
  showIcons?: boolean;
  className?: string;
  id?: string;
  "aria-label"?: string;
}

const SIZE: Record<
  AnimatedSwitchSize,
  { track: string; thumb: string; icon: string }
> = {
  sm: { track: "h-5 w-8 p-0.5", thumb: "size-4", icon: "size-2.5" },
  md: { track: "h-6 w-10 p-0.5", thumb: "size-5", icon: "size-3" },
  lg: { track: "h-7 w-12 p-1", thumb: "size-5", icon: "size-3.5" },
};

const TRACK_VARIANT: Record<AnimatedSwitchVariant, string> = {
  primary: "data-[state=checked]:bg-primary",
  success: "data-[state=checked]:bg-success",
  danger: "data-[state=checked]:bg-danger",
  warning: "data-[state=checked]:bg-warning",
  secondary: "data-[state=checked]:bg-secondary",
};

export function AnimatedSwitch({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  variant = "primary",
  size = "sm",
  showIcons = false,
  className,
  id,
  "aria-label": ariaLabel,
}: AnimatedSwitchProps) {
  const dims = SIZE[size];

  return (
    <Switch
      id={id}
      aria-label={ariaLabel}
      checked={checked}
      defaultChecked={defaultChecked}
      onChange={onCheckedChange}
      disabled={disabled}
      className={cn(
        "relative inline-flex items-center rounded-full bg-input",
        "transition-colors duration-200 ease-out",
        "justify-start data-[state=checked]:justify-end",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:pointer-events-none",
        dims.track,
        TRACK_VARIANT[variant],
        className,
      )}
    >
      {showIcons && (
        <>
          <SwitchIcon
            position="left"
            className={cn(
              "absolute left-1 text-primary-foreground pointer-events-none",
              dims.icon,
            )}
          >
            <CheckIcon className="w-full h-full" />
          </SwitchIcon>
          <SwitchIcon
            position="right"
            className={cn(
              "absolute right-1 text-muted-foreground pointer-events-none",
              dims.icon,
            )}
          >
            <XIcon className="w-full h-full" />
          </SwitchIcon>
        </>
      )}

      <SwitchThumb
        pressedAnimation={{ scaleX: 1.25 }}
        className={cn("rounded-full bg-white shadow-md", dims.thumb)}
      />
    </Switch>
  );
}

AnimatedSwitch.displayName = "AnimatedSwitch";
