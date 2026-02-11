import type { ITasks } from "~/app/_types/tasks.types";
import { TaskCard } from "./Card";

interface TaskColumnProps {
    status: string;
    label: string;
    tasks: ITasks[];
}

export function TaskColumn({ status, label, tasks }: TaskColumnProps) {
    return (
        <div className="flex min-w-[300px] flex-col rounded-xl bg-muted/40 p-4">
            <h2 className="mb-4 text-lg font-semibold">
                {label} ({tasks.length})
            </h2>

            <div className="flex flex-col gap-3">
                {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </div>
        </div>
    );
}
