import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import VerificationPage from "../VerificationPage";

describe("VerificationPage", () => {
    test("renders the verification page with the incorrect token error message", async () => {
        const testParam = "test123";

        render(
            <MemoryRouter initialEntries={[`/verifyEmail/${testParam}`]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Routes>
                    <Route path="/verifyEmail/:token" element={<VerificationPage />} />
                </Routes>
            </MemoryRouter>
        );
        const headingElement = screen.getByRole("heading", { name: /verification page/i });
        expect(headingElement).toBeInTheDocument();
        const errorMessageElement = await screen.findByText(/An error occurred while verifying your email/i);
        expect(errorMessageElement).toBeInTheDocument();
        
    });

    test("renders the verification page with the loading message", async () => {
        const testParam = "token";

        render(
            <MemoryRouter initialEntries={[`/verifyEmail/${testParam}`]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Routes>
                    <Route path="/verifyEmail/:token" element={<VerificationPage />} />
                </Routes>
            </MemoryRouter>
        );
        const headingElement = screen.getByRole("heading", { name: /verification page/i });
        expect(headingElement).toBeInTheDocument();
        const loadingMessageElement = await screen.findByText(/Loading.../i);
        expect(loadingMessageElement).toBeInTheDocument();
    });

    test("renders the verification page with correct token", async () => {
        const testParam = "valid-token";

        render(
            <MemoryRouter initialEntries={[`/verifyEmail/${testParam}`]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Routes>
                    <Route path="/verifyEmail/:token" element={<VerificationPage />} />
                </Routes>
            </MemoryRouter>
        );
        const headingElement = screen.getByRole("heading", { name: /verification page/i });
        expect(headingElement).toBeInTheDocument();
        const loadingMessageElement = await screen.findByText(/email verified successfully/i);
        expect(loadingMessageElement).toBeInTheDocument();
    });
});