import { Link } from 'react-router-dom'
import { Nav, Navbar, Container, Button } from 'react-bootstrap'

const Navigation = ( { username, handleLogout } ) => {
    return (
        <Navbar className="top-nav" variant="dark" bg="dark">
            <Container fluid>
            <Nav className="links">
                <Nav.Link as={Link} to="/">Blogs</Nav.Link>
                <Nav.Link as={Link} to="/users">Users</Nav.Link>
            </Nav>
            <div className="user-info">
                <Navbar.Text className="px-2">
                    <span>{username} logged in</span>
                </Navbar.Text>
                <Button onClick={handleLogout}>
                    Logout
                </Button>
            </div>
            </Container>
        </Navbar>
    )
}

export default Navigation