import Link from "next/link";
import Nav from "react-bootstrap/Nav";
import { useRouter } from "next/router";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

function Header() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.setItem("access_token", "");
    router.push("/login");
  };

  return (
    <Navbar expand="lg" className="bg-body-secondary">
      <Container fluid="lg" className="px-md-5 px-3">
        <Link class="navbar-brand" href="/">
          <b>Navbar</b>
        </Link>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav className="mt-md-0 mt-3">
            <Nav.Link as={Link} href="/addarticles" passHref>
              <Button variant="primary" className="me-2">
                Add Article
              </Button>
            </Nav.Link>
            <Nav.Link as={Link} href="/viewarticles" passHref>
              <Button variant="primary" className="me-2">
                View Article
              </Button>
            </Nav.Link>
            <Nav.Link as={Link} href="/addnews" passHref>
              <Button variant="primary" className="me-2">
                Add News
              </Button>
            </Nav.Link>
            <Nav.Link as={Link} href="/reportednews" passHref>
              <Button variant="primary" className="me-2">
                Reported News
              </Button>
            </Nav.Link>
            <Nav.Link as="div" onClick={handleLogout} className="pt-2">
              <Button variant="primary">Logout</Button>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
