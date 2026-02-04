import { TasksStatusConfig } from "~/constants/tasksStatus";
import { calculateTaskDates } from "../taskDates.service";
import { createTask, deleteTask, updateTask } from "../taskForms.service";

jest.mock("../taskDates.service");

describe("TaskFormsService", () => {
    describe("createTask", () => {
        it("should create a task with calculated dates", async () => {
            const db = {
                insert: jest.fn().mockReturnValue({
                    values: jest.fn(),
                }),
            } as any;

            (calculateTaskDates as jest.Mock).mockReturnValue({
                startedAt: new Date(),
                resolvedAt: undefined,
            });

            await createTask(db, "user-1", {
                title: "Task",
                status: TasksStatusConfig.IN_PROGRESS.value,
            });

            expect(db.insert).toHaveBeenCalled();
        });

        it("should call calculateTaskDates with status", async () => {
            const db = {
                insert: jest.fn().mockReturnValue({
                    values: jest.fn(),
                }),
            } as any;

            (calculateTaskDates as jest.Mock).mockReturnValue({
                startedAt: undefined,
                resolvedAt: undefined,
            });

            await createTask(db, "user-1", {
                title: "Task",
                status: TasksStatusConfig.IN_PROGRESS.value,
            });


            expect(calculateTaskDates).toHaveBeenCalledWith(
                TasksStatusConfig.IN_PROGRESS.value
            );
        });

        it("should insert task with correct values", async () => {
            const valuesMock = jest.fn();

            const db = {
                insert: jest.fn().mockReturnValue({
                    values: valuesMock,
                }),
            } as any;

            const startedAt = new Date();

            (calculateTaskDates as jest.Mock).mockReturnValue({
                startedAt,
                resolvedAt: undefined,
            });

            await createTask(db, "user-1", {
                title: "Task",
                status: TasksStatusConfig.IN_PROGRESS.value,
            });

            expect(valuesMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    userId: "user-1",
                    title: "Task",
                    startedAt,
                })
            );
        });
    });

    describe("updateTask", () => {
        it("should update task when it exists", async () => {
            const oldTask = { startedAt: null, resolvedAt: null };

            const whereMock = jest.fn();

            const db = {
                select: jest.fn().mockReturnValue({
                    from: jest.fn().mockReturnValue({
                        where: jest.fn().mockResolvedValue([oldTask]),
                    }),
                }),
                update: jest.fn().mockReturnValue({
                    set: jest.fn().mockReturnValue({
                        where: whereMock,
                    }),
                }),
            } as any;

            (calculateTaskDates as jest.Mock).mockReturnValue({
                startedAt: new Date(),
                resolvedAt: undefined,
            });

            await updateTask(db, "user-1", {
                id: "task-1",
                title: "Updated",
                status: TasksStatusConfig.IN_PROGRESS.value,
            } as any);

            expect(db.update).toHaveBeenCalled();
            expect(calculateTaskDates).toHaveBeenCalledWith(
                TasksStatusConfig.IN_PROGRESS.value,
                oldTask
            );
        });

        it("should throw NOT_FOUND if task does not exist", async () => {
            const db = {
                select: jest.fn().mockReturnValue({
                    from: jest.fn().mockReturnValue({
                        where: jest.fn().mockResolvedValue([]),
                    }),
                }),
            } as any;

            await expect(
                updateTask(db, "user-1", { id: "x", title: "Test" } as any)
            ).rejects.toThrow("Task not found");
        });
    });

    describe("deleteTask", () => {
        it("should set deletedAt when deleting task", async () => {
            const setMock = jest.fn().mockReturnValue({ where: jest.fn() });

            const db = {
                select: jest.fn().mockReturnValue({
                    from: jest.fn().mockReturnValue({
                        where: jest.fn().mockResolvedValue([{ id: "1" }]),
                    }),
                }),
                update: jest.fn().mockReturnValue({
                    set: setMock,
                }),
            } as any;

            await deleteTask(db, "user-1", "task-1");

            expect(setMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    deletedAt: expect.any(Date),
                })
            );
        });

        it("should throw NOT_FOUND when deleting non-existing task", async () => {
            const db = {
                select: jest.fn().mockReturnValue({
                    from: jest.fn().mockReturnValue({
                        where: jest.fn().mockResolvedValue([]),
                    }),
                }),
            } as any;

            await expect(
                deleteTask(db, "user-1", "task-1")
            ).rejects.toThrow("Task not found");
        });
    });
});
