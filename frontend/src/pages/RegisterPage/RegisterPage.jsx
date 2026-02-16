import {React, useState, useEffect} from "react"
import { Col, Container, Row, Form, Button } from "react-bootstrap"
import { Link } from 'react-router-dom'
import {checkPasswordComplexity} from "../../utilities/checkPassword"
import { checkEmail } from "../../utilities/checkEmail"
import { REGISTER_URL } from "../../constants/urls"
import axsios from "axios"

function RegisterPage() {
    const [username, setUsername ] = useState("")
    const [email, setEmail ] = useState("")
    const [password, setPassword ] = useState("")
    const [confirmPassword, setConfirmPassword ] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    var isFormValid = (username && email && password &&
                       (password === confirmPassword) &&
                       checkEmail(email));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");
    }

    useEffect(() => {
        const error = checkPasswordComplexity(password, confirmPassword);
        setPasswordError(error);

        if (loading) {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const body = JSON.stringify({ username, email, password });
            axsios.post(REGISTER_URL, body, config)
                .then(response => {
                    setSuccessMessage("Verification email sent successfully!");
                    setLoading(false);
                })
                .catch(error => {
                    setErrorMessage("There was an error during registration.");
                    setLoading(false);
                });
        }
    }, [password, confirmPassword, loading]);
    
    if (loading) {
        return (
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col className="text-center">
                        <h1>Loading...</h1>
                    </Col>
                </Row>
            </Container>
        );
    }

    if (successMessage) {
        return (
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col className="text-center">
                        <h1>{successMessage}</h1>
                        <p>A verification email has been sent to your email address. Please check your inbox and click the link to verify your account.</p>
                    </Col>
                </Row>
            </Container>
        );
    }
    else if (errorMessage) {
        return (
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col className="text-center">
                        <h1>{errorMessage}</h1>
                        <p>There was an error during registration. Please try again later.</p>
                    </Col>
                </Row>
            </Container>
        );
    }
    return (
    <Container className="mt-5">
        <Row className="justify-content-center">
            <h1>Welcome to the Sign-Up Page</h1>
            <p>Please fill in the form to create an account.</p>
            <Col className="text-center">
                <Form className="d-flex flex-column align-items-center" onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicUsername" className="mb-3 w-50">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter username"
                         value={username} onChange={(e) => setUsername(e.target.value)} />
                    </Form.Group>

                    <Form.Group controlId="formBasicEmail" className="mb-3 w-50">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" 
                        value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>
                    
                    <Form.Group controlId="formBasicPassword" className="mb-3 w-50">
                        <Form.Label>Enter Password</Form.Label>
                        <Form.Control type="password" placeholder="password" 
                        value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>

                    <Form.Group controlId="formBasicConfirmPassword" className="mb-3 w-50">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" placeholder="Confirm Password" 
                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        {password && confirmPassword && passwordError && passwordError.length > 0 && (
                                <Form.Text className="text-danger">
                                    {passwordError.map((error, index) => (
                                        <div key={index}>{error}</div>
                                    ))}
                                </Form.Text>
                            )}
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-50" disabled={!isFormValid}>
                        Sign up
                    </Button>
                </Form>
            </Col>
        </Row>
        <Row className="justify-content-center mt-3">
            <Col className="text-center">
                <p>Already have an account? <Link to="/login">Login here</Link></p>
            </Col>
        </Row>
    </Container>
  )
}

export default RegisterPage