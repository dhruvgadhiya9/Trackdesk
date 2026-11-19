"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import {
  Button,
  buttonClass,
  DataTable,
  EmptyState,
  ErrorState,
  FilterSelect,
  KpiGrid,
  PageHeader,
  Pagination,
  SearchInput,
  TableSkeleton,
  Tabs,
  Modal,
  type Column,
  type Kpi,
} from "@trackdesk/ui";
import { useQuery } from "@/lib/useQuery";

export interface ListFilter<T> {
  label: string;
  get: (row: T) => string;
}

export interface ListScreenProps<T extends { id: string }> {
  crumbs: string[];
  title: string;
  subtitle?: string;
  entity: string;
  createHref?: string;
  createLabel?: string;
  headerActions?: ReactNode;
  kpis?: Kpi[];
  load: () => Promise<T[]>;
  columns: Column<T>[];
  search?: { placeholder: string; text: (row: T) => string };
  filters?: ListFilter<T>[];
  tabs?: { label: string; get: (row: T) => string; values: readonly string[] };
  rowHref?: (row: T) => string;
  editHref?: (row: T) => string;
  canDelete?: boolean;
  aside?: ReactNode;
  pageSize?: number;
}

const ALL = "All";

export function ListScreen<T extends { id: string }>(props: ListScreenProps<T>) {
  const {
    crumbs, title, subtitle, entity, createHref, createLabel, headerActions, kpis, load, columns,
    search, filters = [], tabs, rowHref, editHref, canDelete = true, aside, pageSize = 8,
  } = props;
  const router = useRouter();
  const { state, retry } = useQuery(load);
  const [query, setQuery] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [tab, setTab] = useState<string>(tabs?.values[0] ?? ALL);
  const [page, setPage] = useState(1);
  const [deleted, setDeleted] = useState<Set<string>>(new Set());
  const [confirm, setConfirm] = useState<T | null>(null);

  const rows = useMemo(() => (state.status === "success" ? state.data.filter((r) => !deleted.has(r.id)) : []), [state, deleted]);

  const filterOptions = useMemo(
    () => Object.fromEntries(filters.map((f) => [f.label, [ALL, ...new Set(rows.map(f.get))]])),
    [filters, rows],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (!q || !search || search.text(r).toLowerCase().includes(q)) &&
        filters.every((f) => (filterValues[f.label] ?? ALL) === ALL || f.get(r) === filterValues[f.label]) &&
        (!tabs || tab === tabs.values[0] || tabs.get(r) === tab),
    );
  }, [rows, query, search, filters, filterValues, tabs, tab]);

  const pageCount = Math.max(1, Math.ceil(visible.length / pageSize));
  const current = Math.min(page, pageCount);
  const pageRows = visible.slice((current - 1) * pageSize, current * pageSize);

  const actionColumn: Column<T> = {
    key: "_actions",
    header: "Actions",
    align: "right",
    render: (row) => (
      <span className="inline-flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        {rowHref && (
          <Link href={rowHref(row)} aria-label="View" title="View" className={buttonClass("ghost", "sm", "size-9 px-0")}>
            <Eye aria-hidden="true" className="size-4" />
          </Link>
        )}
        {editHref && (
          <Link href={editHref(row)} aria-label="Edit" title="Edit" className={buttonClass("ghost", "sm", "size-9 px-0")}>
            <Pencil aria-hidden="true" className="size-4" />
          </Link>
        )}
        {canDelete && (
          <Button variant="ghost" size="sm" className="size-9 px-0" aria-label="Delete" title="Delete" onClick={() => setConfirm(row)}>
            <Trash2 aria-hidden="true" className="size-4 text-danger-600" />
          </Button>
        )}
      </span>
    ),
  };
  const showActions = !!(rowHref || editHref || canDelete);

  const reset = () => {
    setQuery("");
    setFilterValues({});
    setPage(1);
  };

  return (
    <>
      <PageHeader
        crumbs={crumbs}
        title={title}
        subtitle={subtitle}
        actions={
          <>
            {headerActions}
            {createHref && (
              <Link href={createHref} className={buttonClass("primary")}>
                <Plus aria-hidden="true" className="size-4" />
                {createLabel ?? `Add ${entity}`}
              </Link>
            )}
          </>
        }
      />
      {kpis && <KpiGrid items={kpis} />}
      {tabs && (
        <Tabs
          label={`${title} views`}
          tabs={tabs.values}
          value={tab}
          onChange={(t) => {
            setTab(t);
            setPage(1);
          }}
        />
      )}
      {(search || filters.length > 0) && (
        <div className="flex flex-wrap items-center gap-2.5">
          {search && (
            <SearchInput
              placeholder={search.placeholder}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="max-w-[400px]"
            />
          )}
          {filters.map((f) => (
            <FilterSelect
              key={f.label}
              label={f.label}
              options={filterOptions[f.label] ?? [ALL]}
              value={filterValues[f.label] ?? ALL}
              onChange={(v) => {
                setFilterValues((s) => ({ ...s, [f.label]: v }));
                setPage(1);
              }}
            />
          ))}
        </div>
      )}
      <div className={aside ? "grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px]" : "flex flex-col gap-4"}>
        <div className="flex min-w-0 flex-col gap-4">
          {state.status === "loading" && <TableSkeleton />}
          {state.status === "error" && <ErrorState message={state.error} onRetry={retry} />}
          {state.status === "success" && rows.length === 0 && (
            <EmptyState
              title={`No ${entity.toLowerCase()}s yet`}
              message={`When you add ${entity.toLowerCase()}s they will appear here.`}
              action={createHref && <Link href={createHref} className={buttonClass("primary")}>{createLabel ?? `Add ${entity}`}</Link>}
            />
          )}
          {state.status === "success" && rows.length > 0 && visible.length === 0 && (
            <EmptyState
              title="No matching records"
              message="Try a different search or clear the filters."
              action={<Button variant="secondary" onClick={reset}>Clear filters</Button>}
            />
          )}
          {state.status === "success" && visible.length > 0 && (
            <>
              <DataTable
                caption={title}
                columns={showActions ? [...columns, actionColumn] : columns}
                rows={pageRows}
                rowKey={(r) => r.id}
                onRowClick={rowHref ? (r) => router.push(rowHref(r)) : undefined}
              />
              <Pagination page={current} pageCount={pageCount} total={visible.length} pageSize={pageSize} onPage={setPage} />
            </>
          )}
        </div>
        {aside}
      </div>
      <Modal
        open={!!confirm}
        title={`Delete ${entity.toLowerCase()}?`}
        onClose={() => setConfirm(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirm(null)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={() => {
                if (confirm) setDeleted((s) => new Set(s).add(confirm.id));
                setConfirm(null);
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="m-0 text-base text-ink-2">
          This removes the {entity.toLowerCase()} from the list. This action cannot be undone.
        </p>
      </Modal>
    </>
  );
}
