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
  
  const loginPageElement = await screen.findByRole('heading', {name: /sign-in/i});
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

  userEvent.click(registerLinkElement);

  const registerPageElement = await screen.findByRole('heading', {name: /sign-up/i});
  expect(registerPageElement).toBeInTheDocument();

  const nameInputElement = await screen.findByLabelText(/username/i);
  expect(nameInputElement).toBeInTheDocument();
  
  const emailRegisterInputElement = await screen.findByLabelText(/email/i);
  expect(emailRegisterInputElement).toBeInTheDocument();

  const passwordRegisterInputElement = await screen.findByLabelText(/enter password/i);
  expect(passwordRegisterInputElement).toBeInTheDocument();

  const confirmPasswordInputElement = await screen.findByLabelText(/confirm password/i);
  expect(confirmPasswordInputElement).toBeInTheDocument();

  const registerSubmitButtonElement = await screen.findByRole('button', {name: /sign up/i});
  expect(registerSubmitButtonElement).toBeInTheDocument();
  expect(registerSubmitButtonElement).toBeDisabled();

  const loginLinkElement = await screen.findByRole('link', {name: /login here/i});
  expect(loginLinkElement).toBeInTheDocument();


  userEvent.clear(nameInputElement);
  userEvent.clear(emailRegisterInputElement);
  userEvent.clear(passwordRegisterInputElement);
  userEvent.clear(confirmPasswordInputElement);

  userEvent.type(nameInputElement, 'testuser');
  userEvent.type(emailRegisterInputElement, 'testuser@example.com');
  userEvent.type(passwordRegisterInputElement, 'password123');
  userEvent.type(confirmPasswordInputElement, 'password123');

  expect(registerSubmitButtonElement).toBeEnabled();

});