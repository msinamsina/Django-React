import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "../RegisterPage";
import { BrowserRouter } from "react-router-dom";

describe("Registration Page Email Validation", () => {
    beforeEach(() => {
        render(
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <RegisterPage />
            </BrowserRouter>
        );
    });
    
    const emailTestCases = [
        { email: 'plainaddress', description: 'missing @ and domain' },
        { email: '@missingusername.com', description: 'missing username' },
        { email: 'username@.com', description: 'missing domain name' },
        { email: 'username@com', description: 'missing dot in domain' },
        { email: 'username@domain..com', description: 'double dot in domain' },
    ];

    test.each(emailTestCases)(
        'displays error for $description ($email)',
        async ({ email }) => {
            const usernameInput = await screen.findByRole("textbox", { name: /username/i });
            const emailInput = await screen.findByLabelText(/email address/i);
            const passwordInput = await screen.findByLabelText(/enter password/i);
            const confirmPasswordInput = await screen.findByLabelText(/confirm password/i);
            const submitButton = await screen.findByRole("button", { name: /sign up/i });

            
            expect(submitButton).toBeDisabled();
            await userEvent.type(usernameInput, "testuser");
            await userEvent.type(emailInput, email);
            await userEvent.type(passwordInput, "Password123!");
            await userEvent.type(confirmPasswordInput, "Password123!");
            expect(submitButton).toBeDisabled();
        }
    );

    test('displays no error message in initial state', async () => {
        expect(await screen.queryByText(/invalid email address/i)).not.toBeInTheDocument();
    });
    
    test('accepts a valid email address', async () => {
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
});