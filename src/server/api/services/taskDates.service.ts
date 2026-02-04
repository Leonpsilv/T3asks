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
    const oldStartedAt = oldTask?.startedAt
    const oldResolvedAt = oldTask?.resolvedAt

    const startedAt = oldStartedAt ??
        (status &&
            status !== TasksStatusConfig.PENDING.value
            ? now
            : undefined);

    const resolvedAt = oldResolvedAt ??
        (status === TasksStatusConfig.DONE.value
            ? now
            : undefined);

    return { startedAt, resolvedAt };
}
