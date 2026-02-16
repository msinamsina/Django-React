import { rest } from "msw";
import { setupServer } from "msw/node";
import { REGISTER_URL } from "../constants/urls";

export const handlers = [
    rest.post(REGISTER_URL, async (req, res, ctx) => {
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
        if (req.body.username === "testuser" && 
            req.body.email === "testuser@example.com") {
            return res(
                ctx.status(200),
                ctx.json({ message: "Verification email sent successfully!" })
            );
        }
        return res(
            ctx.status(500),
            ctx.json({ error: "Registration failed" })
        );
    }),

];

export const server = setupServer(...handlers);