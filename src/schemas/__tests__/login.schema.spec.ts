import { loginSchema } from "../login.schema";

describe("loginSchema", () => {
    it("should pass with valid credentials", () => {
        const result = loginSchema.safeParse({
            email: "leo@test.com",
            password: "Aa1!aaaa",
        });

        expect(result.success).toBe(true);
    });

    it("should fail with invalid email", () => {
        const result = loginSchema.safeParse({
            email: "invalid",
            password: "Aa1!aaaa",
        });

        expect(result.success).toBe(false);
    });

    it("should fail with weak password", () => {
        const result = loginSchema.safeParse({
            email: "leo@test.com",
            password: "123",
        });

        expect(result.success).toBe(false);
    });
});
