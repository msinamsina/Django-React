import {Navbar, Container, Nav} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
// import Icon from '@fontawesome/react-fontawesome';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSignInAlt, faUser, faHome} from '@fortawesome/free-solid-svg-icons';


function Header() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <LinkContainer to="/">
            <Navbar.Brand> <FontAwesomeIcon icon={faHome} className="me-2"/> React Django base website</Navbar.Brand>
        </LinkContainer>
        <Nav className='ms-auto'>
            <LinkContainer to="/Login">
                <Nav.Link> <FontAwesomeIcon icon={faSignInAlt} className="me-2"/> Login</Nav.Link>
            </LinkContainer>
        </Nav>
      </Container>
    </Navbar>
  )
}

export default Header