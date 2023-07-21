// create a  Nav component

import React, { Fragment } from "react";
import { Link } from "next/router";
import { Nav, Navbar } from "react-bootstrap";
import Image from "next/image";
import styled from "styled-components";
import { useState } from "react";
import Cookies from "js-cookie";
import { isEmpty, isNil } from "ramda";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NavDropdown from "react-bootstrap/NavDropdown";

const StyledSpan = styled.span`
  font-family: "Bebas Neue", sans-serif;
  margin-left: 1rem;
  margin-right: 1rem;
  text-transform: uppercase;
  font-weight: bold;
  color: #032248;
  font-size: 18px;
`;

const LoginButton = styled.button`
font-family: "Bebas Neue",sans-serif;
background: #032248;
color: white;
border-radius: 10px;
width: 80%;
height: 40px;
text-transform: uppercase;
font-size: 16px;
font-weight: bold;
border: none;
outline: none;
`;

const SignupButton = styled.button`
font-family: "Bebas Neue",sans-serif;
background: white;
color: #032248;
border-radius: 10px;
width: 80%;
height: 40px;
text-transform: uppercase;
font-size: 16px;
font-weight: bold;
border: none;
outline: none;
`;

const NavContainer = styled.div`
  position: fixed;
  width: 100%;
  z-index: 1;
`;

const exists = (i) => !isNil(i) && !isEmpty(i);
const Navigation = () => {
  const [user, setUser] = useState(null);

  const logout = () => {
    Cookies.remove("user");
    setUser(null);
  };

  if (!user) {
    console.log(Cookies.get("user"));
    const cookieUser = JSON.parse(Cookies.get("user") || "{}");
    if (exists(cookieUser)) setUser(cookieUser);
  }
  const isLoggedIn = user ? true : false;

  return (
    <NavContainer>
      <Navbar bg="white" expand="lg">
        <Navbar.Brand as={Link} href="/">
          <Image src="/lg.png" width={250} height={100} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Col md="8">
            <Row>
              <Col md="2">
                <Nav.Link as={Link} href="/about">
                  <StyledSpan>About Us</StyledSpan>
                </Nav.Link>
              </Col>
              <Col md="2">
                <Nav.Link as={Link} to="/schools">
                  <StyledSpan>Contact Us</StyledSpan>
                </Nav.Link>
              </Col>
            </Row>
          </Col>
          <Col md="4">
            <Row className="justify-content-end " >
              {isLoggedIn ? (
                <Col md="9">
                  <small className=" navbar-collapse collapse text-muted">Logged in as:</small>
                  <small className=" navbar-collapse collapse text-primary">{user.firstName} {user.lastName}</small>
                  <Navbar.Collapse className="">
                    <NavDropdown title="Options" id="collasible-nav-dropdown">
                      <NavDropdown.Item href="/university/add">
                        Add University
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/faculty/add">
                        Add Faculty
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/programme/add">
                        Add Programme
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item  onClick={logout}>
                        Logout
                      </NavDropdown.Item>
                    </NavDropdown>
                  </Navbar.Collapse>
                </Col>
              ) : (
                <Col md="6">
                  <Row >
                  <Col md="6">
                    <Nav.Link as={SignupButton} href="/schools">
                      Signup
                    </Nav.Link>
                  </Col>
                  <Col md="6">
                    <Nav.Link as={LoginButton} href="/schools">
                      Login
                    </Nav.Link>
                  </Col>
                  </Row>
                </Col>
              )}
            </Row>
          </Col>
        </Navbar.Collapse>
      </Navbar>
    </NavContainer>
  );
};

export default Navigation;
