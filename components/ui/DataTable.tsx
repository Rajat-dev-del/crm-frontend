import { cn } from "@/lib/utils/cn";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  /** Cell contents; defaults to "—" when it returns null/empty. */
  render: (row: T) => React.ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  loading?: boolean;
  emptyMessage?: string;
  /** Tailwind min-width so wide tables scroll sideways on phones, e.g. "min-w-3xl". */
  minWidthClass?: string;
};

/** Simple read-only table for list pages. Use a dedicated table when rows need selection or actions. */
export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  loading = false,
  emptyMessage = "Nothing here yet.",
  minWidthClass = "min-w-3xl",
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className={cn("w-full border-collapse", minWidthClass, loading && "opacity-60")} aria-busy={loading}>
        <thead>
          <tr className="border-b border-line">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn("px-3 py-3 text-left text-caption font-semibold uppercase tracking-wider text-muted", column.className)}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-3 py-16 text-center text-label font-normal text-muted">
                {loading ? "Loading…" : emptyMessage}
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={getRowKey(row)} className="border-b border-line text-label font-normal text-body last:border-0 hover:bg-surface-muted/60">
              {columns.map((column) => {
                const content = column.render(row);
                return (
                  <td key={column.key} className={cn("px-3 py-3.5", column.className)}>
                    {content === null || content === undefined || content === "" ? "—" : content}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
