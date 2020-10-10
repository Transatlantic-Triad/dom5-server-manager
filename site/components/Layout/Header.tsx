import React from 'react';
import Link from 'next/link';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

export default function Header(): JSX.Element {
  return (
    <Navbar bg="light" expand="sm">
      <Container>
        <Link passHref href="/">
          <Navbar.Brand>BD5M</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Link passHref href="/list">
              <Nav.Link>List games</Nav.Link>
            </Link>
            <Link passHref href="/new_game">
              <Nav.Link>New game</Nav.Link>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
