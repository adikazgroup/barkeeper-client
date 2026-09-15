import { BadgeAlertIcon, CheckCircleIcon } from "@/components/icons/Icons";
import { cn } from "@/lib/utils";

/**
 * The one banner every form uses for whatever the backend said. Errors are
 * shown here rather than only as a toast, because the message often decides
 * what the customer does next ("Please verify your email") and a toast that has
 * already faded cannot be re-read.
 */
export function AuthAlert({
  tone = "error",
  children,
}: {
  tone?: "error" | "success";
  children: React.ReactNode;
}) {
  const Icon = tone === "error" ? BadgeAlertIcon : CheckCircleIcon;

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "mb-6 flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-[13px] backdrop-blur-sm",
        tone === "error"
          ? "border-danger/25 bg-danger/8 text-danger"
          : "border-primary/25 bg-primary/8 text-primary",
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <span className="leading-[1.7]">{children}</span>
    </div>
  );
}
