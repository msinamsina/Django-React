import React from 'react'
import { Col, Container, Row, Form, Button} from 'react-bootstrap'
import { Link } from 'react-router-dom'

function LoginPage() {
  return (
    <Container className="mt-5">
        <Row className="justify-content-center">
            <h1>Welcome to the Sign-In Page</h1>
            <Col className="text-center">
                <p>Please enter your credentials to log in.</p>
                <Form className="d-flex flex-column align-items-center">
                    <Form.Group controlId="formBasicEmail" className="mb-3 w-50">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword" className="mb-3 w-50">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled className="w-50">
                        Sign In
                    </Button>
                </Form>
            </Col>
        </Row>
        <Row className="justify-content-center mt-3">
            <Col className="text-center">
                <p>Don't have an account? <Link to="/register">Register here</Link></p>
            </Col>
        </Row>
    </Container>
  )
}

export default LoginPage