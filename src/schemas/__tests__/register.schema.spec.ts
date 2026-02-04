import { registerSchema } from "../register.schema";

describe("registerSchema", () => {
    it("should pass with valid data", () => {
        const result = registerSchema.safeParse({
            name: "Leonardo",
            email: "leo@test.com",
            password: "Aa1!aaaa",
            confirmPassword: "Aa1!aaaa",
        });

        expect(result.success).toBe(true);
    });

    it("should fail if passwords do not match", () => {
        const result = registerSchema.safeParse({
            name: "Leo",
            email: "leo@test.com",
            password: "Aa1!aaaa",
            confirmPassword: "Aa1!bbbb",
        });

        expect(result.success).toBe(false);
    });

    it("should fail with invalid email", () => {
        const result = registerSchema.safeParse({
            name: "Leo",
            email: "invalid-email",
            password: "Aa1!aaaa",
            confirmPassword: "Aa1!aaaa",
        });

        expect(result.success).toBe(false);
    });

    it("should fail if password does not meet complexity rules", () => {
        const result = registerSchema.safeParse({
            name: "Leo",
            email: "leo@test.com",
            password: "aaaaaa",
            confirmPassword: "aaaaaa",
        });

        expect(result.success).toBe(false);
    });
});
