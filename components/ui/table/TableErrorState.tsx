import { EmptyIcon, CircleXIcon } from "@/components/icons/Icons";

interface TableErrorStateProps {
  emptyMessage?: string;
  colSpan?: number;
  isError?: boolean;
}

const TableErrorState = ({
  emptyMessage,
  colSpan = 100,
  isError = false,
}: TableErrorStateProps) => {
  return (
    <tr>
      <td colSpan={colSpan}>
        <div className="flex flex-col items-center justify-center py-16 px-4 gap-3">
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-full ${
              isError ? "bg-danger/10" : "bg-muted"
            }`}
          >
            {isError ? (
              <CircleXIcon className="w-6 h-6 text-danger" />
            ) : (
              <EmptyIcon className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          <div className="text-center space-y-1">
            <p className="font-medium text-foreground">
              {isError
                ? "Something went wrong"
                : (emptyMessage ?? "No data found")}
            </p>
            <p className="text-sm text-muted-foreground">
              {isError
                ? "Failed to load data. Please try again later."
                : "Try adjusting your filters or search query."}
            </p>
          </div>
        </div>
      </td>
    </tr>
  );
};

export { TableErrorState };
