import React from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Navbar,
  Nav,
} from "react-bootstrap";

const SaaSLandingPage = () => {
  return (
    <>
      {/* Navbar */}
      <Navbar bg="light" expand="lg" className="py-3 shadow-sm">
        <Container>
          <Navbar.Brand href="#home">SaaSBrand</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#features">Features</Nav.Link>
              <Nav.Link href="#pricing">Pricing</Nav.Link>
              <Nav.Link href="#testimonials">Testimonials</Nav.Link>
              <Button variant="primary" className="ms-3">
                Get Started
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <div className="bg-light text-center py-5">
        <Container>
          <h1 className="display-4 fw-bold">Simplify Your Workflow</h1>
          <p className="lead mt-3">
            The best SaaS platform to manage your tasks efficiently and grow
            your business.
          </p>
          <Link to="/qr">
            <Button variant="primary" size="lg" className="mt-3">
              Start Free Trial
            </Button>
          </Link>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5" id="features">
        <h2 className="text-center fw-bold mb-4">Features</h2>
        <Row className="g-4">
          <Col md={4}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <Card.Title>Feature One</Card.Title>
                <Card.Text>
                  Streamline your workflow with our intuitive interface.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <Card.Title>Feature Two</Card.Title>
                <Card.Text>
                  Collaborate seamlessly with your team in real-time.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <Card.Title>Feature Three</Card.Title>
                <Card.Text>
                  Analyze your performance with detailed insights.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Pricing Section */}
      <div className="bg-light py-5" id="pricing">
        <Container>
          <h2 className="text-center fw-bold mb-4">Pricing</h2>
          <Row className="g-4">
            <Col md={4}>
              <Card className="shadow-sm border-0">
                <Card.Body className="text-center">
                  <Card.Title>Basic</Card.Title>
                  <h3>$9/month</h3>
                  <Card.Text>Great for individuals starting out.</Card.Text>
                  <Button variant="primary">Choose Plan</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="shadow-sm border-0">
                <Card.Body className="text-center">
                  <Card.Title>Pro</Card.Title>
                  <h3>$29/month</h3>
                  <Card.Text>Perfect for small teams and businesses.</Card.Text>
                  <Button variant="primary">Choose Plan</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="shadow-sm border-0">
                <Card.Body className="text-center">
                  <Card.Title>Enterprise</Card.Title>
                  <h3>Contact Us</h3>
                  <Card.Text>Custom solutions for enterprises.</Card.Text>
                  <Button variant="primary">Contact Us</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Testimonials Section */}
      <Container className="py-5" id="testimonials">
        <h2 className="text-center fw-bold mb-4">What Our Customers Say</h2>
        <Row className="g-4">
          <Col md={4}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <Card.Text>
                  "This platform has revolutionized how we manage tasks."
                </Card.Text>
                <Card.Footer className="text-muted">- Jane Doe</Card.Footer>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <Card.Text>
                  "Amazing features and incredible customer support!"
                </Card.Text>
                <Card.Footer className="text-muted">- John Smith</Card.Footer>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <Card.Text>
                  "Highly recommend it to anyone looking for efficiency."
                </Card.Text>
                <Card.Footer className="text-muted">- Sarah Brown</Card.Footer>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <footer className="bg-dark text-light py-4">
        <Container>
          <Row>
            <Col className="text-center">
              <p className="mb-0">© 2025 SaaSBrand. All rights reserved.</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default SaaSLandingPage;
