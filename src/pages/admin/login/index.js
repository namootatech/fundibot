import Head from "next/head";
import Navigation from "@/components/nav";
import styled from "styled-components";
import Image from "next/image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";
import Spinner from 'react-bootstrap/Spinner';

import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import Footer from "@/components/footer";

const StyledMain = styled.main`
  height: 100vh;
  width: 100vw;
  background: #f8f8f9a6;
  padding-top: 10rem;
`;

export default function Register(props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([{}]);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const toggleShowPass = () => setShowPass(!showPass);

  const submit = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/login/provider`,
        {
          email,
          password,
        }
      );
      console.log("Setting cookie", response.data);
      Cookies.set("user", JSON.stringify(response.data), { expires: 1 });
      router.push("/");
    } catch (axiosError) {
      setLoading(false);
      const error = axiosError.response.data.error;
      console.log(error);

      setErrors([
        ...errors,
        { param: "email", msg: error.message },
        { param: "password", msg: error.message },
      ]);
    }
  };

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      setErrors(errors.filter((err) => err.param !== "email"));
    } else {
      setErrors([...errors, { param: "email", msg: "Invalid email" }]);
    }
  }, [email]);

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
          <Row className="d-flex flex-column align-items-center justify-content-center">
            <Col md="6">
              <div className="card">
                <div className="card-body">
                  <h1 className="card-title">We Value Your Expertise</h1>
                  <p className="card-text ">
                    As a data provider, you play a crucial role in enriching the
                    education ecosystem by creating and editing essential
                    database information for institutions, courses, and
                    colleges. Your expertise and commitment are invaluable to
                    us. We deeply appreciate the time and effort you invest in
                    creating a richer and more inclusive education platform.
                  </p>
                  <Form>
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
                    <Form.Label>Password</Form.Label>
                    <InputGroup className="mb-3">
                      <Form.Control
                        isInvalid={errors.some(
                          (err) => err.param === "password"
                        )}
                        type={showPass ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      
                      <InputGroup.Text
                        id="basic-addon2"
                        onClick={toggleShowPass}
                      >
                        {showPass ? <BsEyeSlashFill /> : <BsEyeFill />}
                      </InputGroup.Text>
                      <Form.Control.Feedback type="invalid">
                      {errors.find((err) => err.param === "password")?.msg}
                    </Form.Control.Feedback>
                    </InputGroup>
                    
                  </Form>
                  <Button variant="primary" type="submit" onClick={submit} className="mr-4">
                    Submit{" "}
                    {loading && (
                    <Spinner animation="border" size="sm" variant="light" />
                  )}
                  </Button>
                  {" "}
                  
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
