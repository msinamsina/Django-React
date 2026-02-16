import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "../RegisterPage";
import { BrowserRouter } from "react-router-dom";

describe("Registration Page Submit Button", () => {
    beforeEach(() => {
    render(
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <RegisterPage />
        </BrowserRouter>
    );
    });

    test("submit button is disabled when required fields are empty", async () => {
        const submitButton = await screen.findByRole("button", { name: /sign up/i });
        expect(submitButton).toBeDisabled();
    });

    test("submit button is enabled when all required fields are filled with valid data", async () => {
        const user = await screen.findByRole("textbox", { name: /username/i });
        const emailInput = await screen.findByLabelText(/email address/i);
        const passwordInput = await screen.findByLabelText(/enter password/i);
        const confirmPasswordInput = await screen.findByLabelText(/confirm password/i);
        const submitButton = await screen.findByRole("button", { name: /sign up/i });

        expect(submitButton).toBeDisabled();
        await userEvent.type(user, "testuser");
        await userEvent.type(emailInput, "test@example.com");
        await userEvent.type(passwordInput, "Password123!");
        await userEvent.type(confirmPasswordInput, "Password123!");
        expect(submitButton).toBeEnabled();
    });

    test("submit button remains disabled if passwords do not match", async () => {
        const user = await screen.findByRole("textbox", { name: /username/i });
        const emailInput = await screen.findByLabelText(/email address/i);
        const passwordInput = await screen.findByLabelText(/enter password/i);
        const confirmPasswordInput = await screen.findByLabelText(/confirm password/i);
        const submitButton = await screen.findByRole("button", { name: /sign up/i });
        
        expect(submitButton).toBeDisabled();
        await userEvent.type(user, "testuser");
        await userEvent.type(emailInput, "test@example.com");
        await userEvent.type(passwordInput, "Password123!");
        await userEvent.type(confirmPasswordInput, "DifferentPassword123!");
        expect(submitButton).toBeDisabled();
    });
});