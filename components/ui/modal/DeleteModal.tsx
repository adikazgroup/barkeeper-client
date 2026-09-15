import { ReactNode } from "react";

import { DeleteIcon, LoaderIcon } from "@/components/icons/Icons";
import { Modal } from "@/components/ui/modal/Modal";

const TONES = {
  danger: {
    ring: "bg-danger/10",
    icon: "text-danger",
    confirm: "bg-danger text-danger-foreground hover:bg-danger/85",
  },
  primary: {
    ring: "bg-primary/10",
    icon: "text-primary",
    confirm: "bg-primary text-primary-foreground hover:bg-primary/85",
  },
} as const;

export interface DeleteModalProps<T = unknown> {
  title: string;
  text: string;
  deleteModal: boolean;
  setDeleteModal: (open: boolean) => void;
  selectedRow: T;
  handleDelete: (row: T) => void;
  isLoading?: boolean;
  zIndex?: string;
  /** `primary` for confirmations that aren't destructive. */
  tone?: keyof typeof TONES;
  icon?: ReactNode;
  confirmLabel?: string;
  loadingLabel?: string;
  cancelLabel?: string;
}

export default function DeleteModal<T = unknown>({
  title,
  text,
  deleteModal,
  setDeleteModal,
  selectedRow,
  handleDelete,
  isLoading,
  zIndex = "z-1000",
  tone = "danger",
  icon,
  confirmLabel = "Yes, Delete It!",
  loadingLabel = "Deleting...",
  cancelLabel = "No, Keep It!",
}: DeleteModalProps<T>) {
  const t = TONES[tone];

  return (
    <Modal
      open={deleteModal}
      onClose={() => setDeleteModal(false)}
      size="small"
      zIndex={zIndex}
      title={title}
    >
      <div className="flex flex-col items-center text-center">
        <div
          className={`size-[4.8rem] rounded-full center mb-5 ${t.ring} ${t.icon}`}
        >
          {icon ?? <DeleteIcon className="size-9" />}
        </div>

        <p className="text-muted-foreground text-sm">{text}</p>

        <div className="mt-6 flex w-full justify-end gap-3">
          <button
            type="button"
            onClick={() => setDeleteModal(false)}
            className="px-4 py-2 text-sm rounded-md bg-muted text-foreground hover:bg-accent font-medium cursor-pointer transition-colors"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={() => handleDelete(selectedRow)}
            disabled={isLoading}
            className={`px-4 py-2 text-sm rounded-md font-medium disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer transition-colors ${t.confirm}`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <LoaderIcon />
                {loadingLabel}
              </span>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
