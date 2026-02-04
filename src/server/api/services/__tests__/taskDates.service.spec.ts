import { calculateTaskDates } from "../taskDates.service";
import { TasksStatusConfig } from "~/constants/tasksStatus";

describe("calculateTaskDates", () => {
    it("should set startedAt when status is not PENDING", () => {
        const now = new Date("2025-01-01");
        jest.setSystemTime(now);

        const result = calculateTaskDates(
            TasksStatusConfig.IN_PROGRESS.value
        );

        expect(result.startedAt).toEqual(now);
        expect(result.resolvedAt).toBeUndefined();
    });

    it("should set resolvedAt when status is DONE", () => {
        const now = new Date("2025-01-02");
        jest.setSystemTime(now);

        const result = calculateTaskDates(
            TasksStatusConfig.DONE.value
        );

        expect(result.startedAt).toEqual(now);
        expect(result.resolvedAt).toEqual(now);
    });

    it("should not override startedAt if oldTask already has startedAt", () => {
        const now = new Date("2025-01-03");
        jest.setSystemTime(now);

        const oldTask = {
            startedAt: new Date("2024-12-01"),
        };

        const result = calculateTaskDates(
            TasksStatusConfig.IN_PROGRESS.value,
            oldTask
        );

        expect(result.startedAt).toEqual(oldTask.startedAt);
    });

    it("should not override resolvedAt if oldTask already has resolvedAt", () => {
        const oldTask = {
            resolvedAt: new Date("2024-12-01"),
        };

        const result = calculateTaskDates(
            TasksStatusConfig.DONE.value,
            oldTask
        );

        expect(result.resolvedAt).toEqual(oldTask.resolvedAt);
    });

    it("should not set any date when status is PENDING", () => {
        const result = calculateTaskDates(
            TasksStatusConfig.PENDING.value
        );

        expect(result.startedAt).toBeUndefined();
        expect(result.resolvedAt).toBeUndefined();
    });

});
