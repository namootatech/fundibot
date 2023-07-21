import Head from "next/head";
import Navigation from "@/components/nav";
import styled from "styled-components";
import Image from "next/image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import axios from "axios";
import Spinner from 'react-bootstrap/Spinner';
import { useRouter } from "next/navigation";
import Footer from "@/components/footer";

const StyledMain = styled.main`
  height: 100vh;
  width: 100vw;
  background: #f8f8f9a6;
  padding-top: 10rem;
`;

export default function Register(props) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState([{}]);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/register/provider`,
      {
        firstName,
        lastName,
        email,
        password,
      }
    );
    const error = response.data.error;
    setLoading(false);
    if (error) {
      setErrors([...errors, error.msg]);
    } else {
      router.push("/admin/login");
    }
  };

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (emailRegex.test(email)) {
      setErrors(errors.filter((err) => err.param !== "email"));
    } else {
      setErrors([...errors, { param: "email", msg: "Invalid email" }]);
    }

    if (password === passwordConfirmation) {
      console.log(password);
      console.log(passwordRegex.test(password));
      if (passwordRegex.test(password)) {
        setErrors(errors.filter((err) => err.param !== "password"));
      } else {
        setErrors([
          ...errors,
          {
            param: "password",
            msg: "Password must be at least 8 characters long and contain at least one letter, one special character and one number",
          },
        ]);
      }
    } else {
      setErrors([
        ...errors,
        {
          param: "password",
          msg: "Password and password confirmation do not match",
        },
      ]);
    }
  }, [email, password, passwordConfirmation]);

  return (
    <>
      <Head>
        <title>Register | Fundi Bot</title>
        <meta
          name="description"
          content="Register as a data provider for Fundi Bot"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation />

      <StyledMain>
        <Container>
          <Row>
            <Col md="6">
              <h1 className="display-6 p-5">
                <strong>Join Our Mission: </strong>Empower Learners Nationwide
              </h1>
              <p className="lead p-5">
                At FundiBot, we believe in the power of knowledge and its
                ability to shape brighter futures. By becoming a data provider,
                you become an integral part of our mission to empower learners
                nationwide. Your contributions will enable students to access
                accurate, up-to-date, and comprehensive information, helping
                them make informed decisions about their educational journey.
              </p>
            </Col>
            <Col md="6">
              <div className="card">
                <div className="card-body">
                  <h1 className="card-title">Register</h1>
                  <Form>
                    <Form.Group controlId="formBasicFirstName">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter first name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group controlId="formBasicLastName">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control
                        isInvalid={errors.some((err) => err.param === "email")}
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.find((err) => err.param === "email")?.msg}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        isInvalid={errors.some(
                          (err) => err.param === "password"
                        )}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.find((err) => err.param === "password")?.msg}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formBasicPasswordConfirmation">
                      <Form.Label>Password Confirmation</Form.Label>
                      <Form.Control
                        isInvalid={errors.some(
                          (err) => err.param === "password"
                        )}
                        type="password"
                        placeholder="Password Confirmation"
                        value={passwordConfirmation}
                        onChange={(e) =>
                          setPasswordConfirmation(e.target.value)
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.find((err) => err.param === "password")?.msg}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form>
                  <br />
                  <Button variant="primary" type="submit" onClick={submit} className="mr-4">
                    Submit{" "}
                    {loading && (
                    <Spinner animation="border" size="sm" variant="light" />
                  )}
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </StyledMain>
      <Footer/>
    </>
    
  );
}
