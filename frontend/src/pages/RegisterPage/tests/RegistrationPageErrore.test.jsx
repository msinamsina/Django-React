import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterPage from '../RegisterPage';
import { BrowserRouter } from 'react-router-dom';

describe('Registration Page Error Handling', () => {
    beforeEach(() => {
        render(
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <RegisterPage />
            </BrowserRouter>
        );
    });

    test('displays error message on registration failure', async () => {
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
        userEvent.click(submitButton);

        const errorMessageElement = await screen.findByRole('heading', { name: /there was an error during registration/i });
        expect(errorMessageElement).toBeInTheDocument();

        expect(screen.getByText(/please try again later/i)).toBeInTheDocument();
    });
});