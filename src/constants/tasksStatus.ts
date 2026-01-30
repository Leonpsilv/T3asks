export const TasksStatusConfig = {
    PENDING: {
        value: "pending", label: "Pendente"
    },
    HOLDING: {
        value: "holding", label: "Congelada"
    },
    IN_PROGRESS: {
        value: "in_progress", label: "Em progresso"
    },
    DONE: {
        value: "done", label: "Concluída"
    }
} as const;

export type TaskStatusType =
    typeof TasksStatusConfig[keyof typeof TasksStatusConfig]["value"];