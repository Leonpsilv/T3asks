import type { ITasks } from "~/app/_types/tasks.types";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";
import { TasksTableSkeleton } from "./SkeletonLoading";

export type ITasksTableColumn<T> = {
    key: keyof T | string;
    label: string;
    headerClassName?: string;
    bodyClassName?: string;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
};

interface TasksTableProps {
    title: string;
    tasks?: ITasks[];
    emptyLabel: string;
    columns: ITasksTableColumn<ITasks>[];
    defaultBodyCellsClassName?: string;
    defaultHeaderCellsClassName?: string;
    isLoading?: boolean;
}

export function TasksTable({
    title,
    tasks,
    emptyLabel,
    columns,
    defaultBodyCellsClassName = "text-left font-semibold",
    defaultHeaderCellsClassName = "text-left",
    isLoading = false
}: TasksTableProps) {
    return (
        <>
            {isLoading
                ?
                <TasksTableSkeleton
                    title={title}
                    columnsCount={columns.length}
                />
                :
                <Card className="bg-white/60">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">{title}</CardTitle>
                    </CardHeader>

                    <CardContent>
                        {tasks?.length === 0 ? (
                            <p className="text-sm text-muted-foreground">{emptyLabel}</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {columns.map((col) => (
                                            <TableHead
                                                key={String(col.key)}
                                                className={col.headerClassName ?? defaultHeaderCellsClassName}
                                            >
                                                {col.label}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {tasks?.map((task) => (
                                        <TableRow key={task.id}>
                                            {columns.map((col) => {
                                                const value = task[col.key as keyof ITasks];

                                                return (
                                                    <TableCell
                                                        key={String(col.key)}
                                                        className={col.bodyClassName ?? defaultBodyCellsClassName}
                                                    >
                                                        {col.render
                                                            ? col.render(value, task)
                                                            : String(value ?? "—")}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>}
        </>
    );
}
