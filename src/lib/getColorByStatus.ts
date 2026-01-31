import { TasksStatusConfig, type TaskStatusType } from "~/constants/tasksStatus";

export function getColorByStatus(status: TaskStatusType) {
    switch (status) {
        case TasksStatusConfig.DONE.value:
            return "text-green-600"
            break
        case TasksStatusConfig.HOLDING.value:
            return "text-blue-600"
            break
        case TasksStatusConfig.IN_PROGRESS.value:
            return "text-yellow-600"
            break
        case TasksStatusConfig.PENDING.value:
            return "text-gray-600"
            break
        default:
            return "text-black"
            break
    }
}