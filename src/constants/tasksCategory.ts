export const TasksCategoryConfig = {
    WORK: {
        value: "work", label: "Trabalho"
    },
    STUDIES: {
        value: "studies", label: "Estudos"
    },
    SOCIAL: {
        value: "social", label: "Social"
    },
    HEALTH_CARE: {
        value: "health_care", label: "Saúde e Cuidados"
    },
    OTHERS: {
        value: "others", label: "Outras"
    }
} as const;

export type TaskCategory =
    typeof TasksCategoryConfig[keyof typeof TasksCategoryConfig]["value"];