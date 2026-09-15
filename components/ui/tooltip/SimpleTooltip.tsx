"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";
import type {
  TooltipSide,
  TooltipAlign,
  TooltipSize,
  TooltipTriggerType,
} from "./Tooltip";

interface SimpleTooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: TooltipSide;
  align?: TooltipAlign;
  size?: TooltipSize;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  delayDuration?: number;
  contentClassName?: string;
  color?: string;
  trigger?: TooltipTriggerType;
  showArrow?: boolean;
}

export function SimpleTooltip({
  content,
  children,
  side = "top",
  align = "center",
  size = "md",
  icon,
  iconPosition = "right",
  delayDuration = 800,
  contentClassName,
  color,
  trigger = "hover",
  showArrow = true,
}: SimpleTooltipProps) {
  const sizeClasses: Record<TooltipSize, string> = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-xs",
    lg: "px-4 py-3 text-sm",
  };

  return (
    <Tooltip
      delayDuration={delayDuration}
      color={color}
      trigger={trigger}
      showArrow={showArrow}
    >
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent
        side={side}
        align={align}
        className={cn(sizeClasses[size], contentClassName)}
      >
        <div className="flex items-center gap-1.5">
          {icon && iconPosition === "left" && (
            <span className="inline-flex shrink-0">{icon}</span>
          )}
          {content}
          {icon && iconPosition === "right" && (
            <span className="inline-flex shrink-0">{icon}</span>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
