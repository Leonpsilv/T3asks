"use client";

import {
    flexRender,
    type ColumnDef,
    type Table as TanstackTable
} from "@tanstack/react-table";

import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "~/components/ui/table";
import { cn } from "~/lib/utils";

interface DataTableProps<TData> {
    columns: ColumnDef<TData>[];
    table: TanstackTable<TData>
    isLoading?: boolean;
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    pageSize?: number;
    emptyMessage?: string | React.ReactNode;
}

export function DataTable<TData>({
    columns,
    table,
    isLoading = false,
    page,
    totalPages,
    onPageChange,
    pageSize = 10,
    emptyMessage = "Nenhum registro encontrado",
}: DataTableProps<TData>) {

    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((group) => (
                        <TableRow key={group.id}>
                            {group.headers.map((header) => (
                                <TableCell
                                    key={header.id}
                                    className={cn(
                                        "text-white",
                                        header.column.getCanSort() && "cursor-pointer select-none"
                                    )}
                                    onClick={
                                        header.column.getCanSort()
                                            ? header.column.getToggleSortingHandler()
                                            : undefined
                                    }
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                    {{
                                        asc: " ▲",
                                        desc: " ▼",
                                    }[header.column.getIsSorted() as string] ?? null}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        Array.from({ length: pageSize }).map((_, rowIndex) => (
                            <TableRow key={`skeleton-row-${rowIndex}`}>
                                {columns.map((_, colIndex) => (
                                    <TableCell key={`skeleton-cell-${colIndex}`}>
                                        <Skeleton className="h-4 w-full" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell className="text-white" key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="text-center text-muted-foreground text-white"
                            >
                                {emptyMessage}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <div className="flex gap-2 items-center justify-end">
                <Button
                    onClick={() => onPageChange(Math.max(page - 1, 1))}
                    disabled={page === 1}
                >
                    <ArrowBigLeft />
                </Button>

                <span className="text-white">
                    Página {page} de {totalPages}
                </span>

                <Button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages}
                >
                    <ArrowBigRight />
                </Button>
            </div>
        </div>
    );
}
