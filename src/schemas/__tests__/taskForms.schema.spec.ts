import { taskFormSchema, updateTaskSchema } from "../task.schema";
import { TasksStatusConfig } from "~/constants/tasksStatus";
import { TasksPriorityConfig } from "~/constants/tasksPriority";
import { TasksCategoryConfig } from "~/constants/tasksCategory";

describe("taskFormSchema", () => {
    it("should pass with valid minimal data", () => {
        const result = taskFormSchema.safeParse({
            title: "Valid title",
        });

        expect(result.success).toBe(true);
    });

    it("should fail if title is too short", () => {
        const result = taskFormSchema.safeParse({
            title: "ab",
        });

        expect(result.success).toBe(false);
    });

    it("should fail if description exceeds max length", () => {
        const result = taskFormSchema.safeParse({
            title: "Valid title",
            description: "a".repeat(501),
        });

        expect(result.success).toBe(false);
    });

    it("should accept valid enums", () => {
        const result = taskFormSchema.safeParse({
            title: "Task",
            status: TasksStatusConfig.IN_PROGRESS.value,
            priority: TasksPriorityConfig.HIGH.value,
            category: TasksCategoryConfig.WORK.value,
        });

        expect(result.success).toBe(true);
    });

    it("should fail with invalid enum values", () => {
        const result = taskFormSchema.safeParse({
            title: "Task",
            status: "INVALID_STATUS",
        });

        expect(result.success).toBe(false);
    });
});

describe("updateTaskSchema", () => {
    it("should fail if id is not a valid uuid", () => {
        const result = updateTaskSchema.safeParse({
            id: "123",
            title: "Valid title",
        });

        expect(result.success).toBe(false);
    });

    it("should pass with valid uuid and title", () => {
        const result = updateTaskSchema.safeParse({
            id: crypto.randomUUID(),
            title: "Updated title",
        });

        expect(result.success).toBe(true);
    });
});
