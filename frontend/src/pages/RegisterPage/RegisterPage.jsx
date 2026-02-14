import {React, useState} from "react"
import { Col, Container, Row, Form, Button } from "react-bootstrap"
import { Link } from 'react-router-dom'

function RegisterPage() {
    const [username, setUsername ] = useState("")
    const [email, setEmail ] = useState("")
    const [password, setPassword ] = useState("")
    const [confirmPassword, setConfirmPassword ] = useState("")
    var isFormValid = username && email && password && (password === confirmPassword)
    return (
    <Container className="mt-5">
        <Row className="justify-content-center">
            <h1>Welcome to the Sign-Up Page</h1>
            <p>Please fill in the form to create an account.</p>
            <Col className="text-center">
                <Form className="d-flex flex-column align-items-center">
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