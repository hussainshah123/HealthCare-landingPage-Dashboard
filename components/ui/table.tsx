import { cx } from "./cx";
import { EmptyState, ErrorState, Spinner } from "./states";

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  className?: string;
}

export function Table<T>({
  columns,
  rows,
  rowKey,
  loading,
  error,
  onRetry,
  emptyTitle = "Nothing here yet",
  emptyDescription,
  onRowClick,
}: {
  columns: Column<T>[];
  rows: T[] | undefined;
  rowKey: (row: T) => string;
  loading?: boolean;
  error?: Error;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: T) => void;
}) {
  if (error && !rows?.length) return <ErrorState error={error} onRetry={onRetry} />;
  if (loading && !rows) return <Spinner />;
  if (!rows || rows.length === 0) {
    return loading ? <Spinner /> : <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className={cx("relative overflow-x-auto", loading && "opacity-60")}>
      {error && <p className="px-4 py-2 text-xs text-rose-700">Refresh failed: {error.message}</p>}
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={cx(
                  "px-4 py-2.5 text-left text-xs font-semibold tracking-wide whitespace-nowrap text-slate-500 uppercase",
                  c.className,
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className={cx("align-middle", onRowClick && "cursor-pointer hover:bg-slate-50")}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((c) => (
                <td key={c.key} className={cx("px-4 py-3 text-slate-700", c.className)}>
                  {c.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
