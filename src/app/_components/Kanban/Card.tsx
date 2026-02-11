import type { ITasks } from "~/app/_types/tasks.types";
import { Card, CardContent } from "~/components/ui/card";
import { format } from "date-fns";

interface TaskCardProps {
    task: ITasks;
}

export function TaskCard({ task }: TaskCardProps) {
    return (
        <Card className="cursor-pointer transition hover:shadow-md">
            <CardContent className="p-4 space-y-2">
                <div className="text-sm text-muted-foreground">
                    #{task.code}
                </div>

                <h3 className="font-medium">
                    {task.title}
                </h3>

                {task.deadline && (
                    <p className="text-xs text-muted-foreground">
                        Prazo: {format(new Date(task.deadline), "dd/MM/yyyy")}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
