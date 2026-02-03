import { TasksStatusConfig } from "~/constants/tasksStatus";

interface OldTask {
    startedAt?: Date | null;
    resolvedAt?: Date | null;
}

export function calculateTaskDates(
    status?: string,
    oldTask?: OldTask
) {
    const now = new Date();

    const startedAt =
        status &&
            status !== TasksStatusConfig.PENDING.value &&
            !oldTask?.startedAt
            ? now
            : undefined;

    const resolvedAt =
        status === TasksStatusConfig.DONE.value &&
            !oldTask?.resolvedAt
            ? now
            : undefined;

    return { startedAt, resolvedAt };
}
