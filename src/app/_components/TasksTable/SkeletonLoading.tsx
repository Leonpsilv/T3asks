import {
    Card,
    CardContent,
    CardHeader,
} from "~/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "~/components/ui/table";
import { Skeleton } from "~/components/ui/skeleton";

interface TasksTableSkeletonProps {
    title: string;
    columnsCount: number;
    rows?: number;
}

export function TasksTableSkeleton({
    title,
    columnsCount,
    rows = 4,
}: TasksTableSkeletonProps) {
    return (
        <Card className="bg-white/60">
            <CardHeader className="pb-2">
                <Skeleton className="h-5 w-40" />
            </CardHeader>

            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {Array.from({ length: columnsCount }).map((_, i) => (
                                <TableCell key={i}>
                                    <Skeleton className="h-4 w-full" />
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {Array.from({ length: rows }).map((_, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {Array.from({ length: columnsCount }).map((_, colIndex) => (
                                    <TableCell key={colIndex}>
                                        <Skeleton className="h-4 w-full" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
