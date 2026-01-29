export interface ITasks {
    id: string;
    code: number;
    title: string | null;
    description: string | null;
    status: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
    resolvedAt: Date | null;
    deadline: Date | null;
    priority: string | null;
    category: string | null;
}