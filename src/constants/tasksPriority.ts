export const TasksPriorityConfig = {
    VERY_LOW: {
        value: "very_low", label: "Muito Baixa"
    },
    LOW: {
        value: "low", label: "Baixa"
    },
    MEDIUM: {
        value: "medium", label: "Média"
    },
    HIGH: {
        value: "high", label: "Alta"
    },
    VERY_HIGH: {
        value: "very_high", label: "Muito Alta"
    }
} as const;


export type TaskPriority =
    typeof TasksPriorityConfig[keyof typeof TasksPriorityConfig]["value"];
