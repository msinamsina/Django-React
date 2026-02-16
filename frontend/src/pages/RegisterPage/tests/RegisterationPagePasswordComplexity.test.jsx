import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterPage from '../RegisterPage';
import { BrowserRouter } from 'react-router-dom';

describe('Password Complexity Validation', () => {
  beforeEach(() => {
    render(
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <RegisterPage />
      </BrowserRouter>
    );
  });

  const passwordTestCases = [
    { password: 'Short1!', error: /password must be at least 8 characters long/i, description: 'too short' },
    { password: 'lowercase1!', error: /password must contain at least one uppercase letter/i, description: 'no uppercase' },
    { password: 'UPPERCASE1!', error: /password must contain at least one lowercase letter/i, description: 'no lowercase' },
    { password: 'NoNumber!', error: /password must contain at least one number/i, description: 'no number' },
    { password: 'NoSpecial1', error: /password must contain at least one special character/i, description: 'no special' },
  ];

  test.each(passwordTestCases)(
    'displays error for password with $description',
    async ({ password, error }) => {
      const passwordInput = await screen.findByLabelText(/enter password/i);
      const confirmPasswordInput = await screen.findByLabelText(/confirm password/i);

      await userEvent.type(passwordInput, password);
      await userEvent.type(confirmPasswordInput, password);
      
      expect(await screen.findByText(error)).toBeInTheDocument();
    }
  );

  test('displays no error message in initial state', async () => {
    expect(await screen.queryByText(/Password must be at least 8 characters long/i)).not.toBeInTheDocument();
    expect(await screen.queryByText(/Password must contain at least one uppercase letter/i)).not.toBeInTheDocument();
    expect(await screen.queryByText(/Password must contain at least one lowercase letter/i)).not.toBeInTheDocument();
    expect(await screen.queryByText(/Password must contain at least one number/i)).not.toBeInTheDocument();
    expect(await screen.queryByText(/Password must contain at least one special character/i)).not.toBeInTheDocument();
    expect(await screen.queryByText(/Passwords do not match/i)).not.toBeInTheDocument();
  });

  test('accepts a strong password', async () => {
    const user = await screen.findByRole('textbox', { name: /username/i });
    const emailInput = await screen.findByLabelText(/email address/i);
    const passwordInput = await screen.findByLabelText(/enter password/i);
    const confirmPasswordInput = await screen.findByLabelText(/confirm password/i);
    const submitButton = await screen.findByRole('button', {name: /sign up/i});

    expect(submitButton).toBeDisabled();
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(user, 'testuser');

    expect(submitButton).toBeDisabled();
    // Enter a strong password
    await userEvent.type(passwordInput, 'Str0ngP@ssw0rd!');
    await userEvent.type(confirmPasswordInput, 'Str0ngP@ssw0rd!');

    // Check that no error message is displayed
    expect(await screen.queryByText(/password must be at least 8 characters long/i)).not.toBeInTheDocument();
    expect(await screen.queryByText(/password must contain at least one uppercase letter/i)).not.toBeInTheDocument();
    expect(await screen.queryByText(/password must contain at least one lowercase letter/i)).not.toBeInTheDocument();
    expect(await screen.queryByText(/password must contain at least one number/i)).not.toBeInTheDocument();
    expect(await screen.queryByText(/password must contain at least one special character/i)).not.toBeInTheDocument();
    expect(await screen.queryByText(/passwords do not match/i)).not.toBeInTheDocument();
    expect(submitButton).toBeEnabled();
  });
});