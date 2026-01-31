import { Edit, Trash, View } from "lucide-react";
import type { ITasks } from "~/app/_types/tasks.types";
import { cn } from "~/lib/utils";

interface TaskActionsProps {
    task: ITasks | undefined;
    onView: (task: ITasks | undefined) => void;
}

export function TaskActions({
    task,
    onView,
}: TaskActionsProps) {
    return (
        <div className="flex justify-center gap-2">
            <button onClick={() => onView(task)}>
                <View
                    className={cn(
                        "size-5 cursor-pointer text-gray-700 hover:text-gray-500/50"
                    )}
                />
            </button>
        </div>
    );
}
