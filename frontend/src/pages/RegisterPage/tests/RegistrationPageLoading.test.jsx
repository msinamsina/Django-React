import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event"
import { BrowserRouter } from "react-router-dom";

import RegisterPage from "../RegisterPage"

describe("Registration Page Loading State", () => {
    beforeEach(() => {
        render(
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <RegisterPage />
            </BrowserRouter>
        );
    });
    test("displays loading message when registration is in progress", async () => {
        const user = await screen.findByRole("textbox", { name: /username/i });
        const emailInput = await screen.findByLabelText(/email address/i);
        const passwordInput = await screen.findByLabelText(/enter password/i);
        const confirmPasswordInput = await screen.findByLabelText(/confirm password/i);
        const submitButton = await screen.findByRole("button", { name: /sign up/i });

        expect(submitButton).toBeDisabled();
        await userEvent.type(user, "testuser");
        await userEvent.type(emailInput, "testuser@example.com");
        await userEvent.type(passwordInput, "TestPassword123!");
        await userEvent.type(confirmPasswordInput, "TestPassword123!");
        expect(submitButton).toBeEnabled();
        userEvent.click(submitButton);

        const loadingMessageElement = await screen.findByRole('heading', { name: /loading/i });
        expect(loadingMessageElement).toBeInTheDocument();
    });
});