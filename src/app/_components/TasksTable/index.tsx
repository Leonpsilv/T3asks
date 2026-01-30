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

export type ITasksTableColumn<T> = {
    key: keyof T;
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
}

export function TasksTable({
    title,
    tasks,
    emptyLabel,
    columns,
    defaultBodyCellsClassName = "text-left font-semibold",
    defaultHeaderCellsClassName = "text-left"
}: TasksTableProps) {
    return (
        <Card>
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
                                        const value = task[col.key];

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
        </Card>
    );
}
