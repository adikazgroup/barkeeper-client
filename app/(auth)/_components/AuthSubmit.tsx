import { ArrowRightIcon } from "@/components/icons/Icons";
import { Button } from "@/components/ui/button/Button";

/** The one call to action on every auth screen, so it looks the same on all. */
export function AuthSubmit({
  loading,
  loadingText,
  children,
}: {
  loading: boolean;
  loadingText: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="submit"
      fullWidth
      rounded="lg"
      loading={loading}
      loadingText={loadingText}
      endIcon={<ArrowRightIcon className="size-3.5" />}
      className="h-11 text-[14px] font-medium tracking-[-0.01em]"
    >
      {children}
    </Button>
  );
}
