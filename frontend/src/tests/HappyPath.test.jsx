import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';


import App from '../App';

test('renders the app without crashing', async () => {
  render(<App />);
  const copyrightElement = await screen.findByText(/copyright/i);
  expect(copyrightElement).toBeInTheDocument();

  const loginButtonElement = await screen.findByRole('link', {name: /login/i});
  expect(loginButtonElement).toBeInTheDocument();

  userEvent.click(loginButtonElement);
  
  const loginPageElement = await screen.findByRole('heading', {name: /Sign-in/i});
  expect(loginPageElement).toBeInTheDocument();

  const emailInputElement = await screen.findByLabelText(/email/i);
  expect(emailInputElement).toBeInTheDocument();

  const passwordInputElement = await screen.findByLabelText(/password/i);
  expect(passwordInputElement).toBeInTheDocument();

  const submitButtonElement = await screen.findByRole('button', {name: /sign in/i});
  expect(submitButtonElement).toBeInTheDocument();
  expect(submitButtonElement).toBeDisabled();

  const registerLinkElement = await screen.findByRole('link', {name: /register/i});
  expect(registerLinkElement).toBeInTheDocument();
});