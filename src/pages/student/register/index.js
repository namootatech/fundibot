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
import Spinner from "react-bootstrap/Spinner";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer";
import InputGroup from "react-bootstrap/InputGroup";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";

const StyledMain = styled.main`
  height: auto
  width: 100vw;
  background: #f3f3f3f0;
  padding-top: 10rem;
  padding-bottom: 10rem;
`;

const DesktopParagraph = styled.span`
  display: none;
  @media (min-width: 969px) {
    display: block;
  }
`;

const Mobile = styled.div`
  display: none;
  @media (max-width: 968px) {
    display: block;
  }
`;

const Desktop = styled.div`
  display: none;
  @media (min-width: 969px) {
    display: block;
  }
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
  const [showPass, setShowPass] = useState(false);

  const toggleShowPass = () => setShowPass(!showPass);

  const submit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/register/student`,
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
      router.push("/student/login");
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
      console.log(password, "matches", passwordConfirmation);
      if (passwordRegex.test(password)) {
        console.log("password passes regex");
        setErrors(errors.filter((err) => err.param !== "password"));
      } else {
        console.log("password does not pass regex");
        setErrors([
          {
            param: "password",
            msg: "Password must be at least 8 characters long and contain at least one letter, one special character and one number",
          },
        ]);
      }
    } else {
      console.log(password, "does not match", passwordConfirmation);
      setErrors([
        {
          param: "password",
          msg: "Password and password confirmation do not match",
        },
      ]);
    }
  }, [email, password, passwordConfirmation]);

  return (
    <div>
      <Head>
        <title>Learner | Signup | Fundi Bot</title>
        <meta
          name="description"
          content="By becoming a part of FundiBot, you'll gain access to personalized learning recommendations, course insights, and the latest updates from institutions across the country."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation />

      <StyledMain>
        <Container>
          <Row>
            <Col md="6" sm="12" xs="12" className="p-3">
              <Desktop>
                <h1 className="display-6 px-5">
                  <strong>Learner </strong>| Signup
                </h1>
                <p className="lead p-5">
                  Welcome to FundiBot, where you can take the first step towards
                  accessing a world of educational opportunities.
                  <DesktopParagraph className="py-3">
                    By becoming a part of FundiBot, you'll gain access to
                    personalized learning recommendations, course insights, and
                    the latest updates from institutions across the country.
                  </DesktopParagraph>
                </p>
              </Desktop>
              <Mobile>
                <h1 className="display-6 px-2">
                  <strong>Join the FundiBot Community!</strong>
                </h1>
                <p className="lead p-2">
                  Welcome to the student registration page, where you can take
                  the first step towards accessing a world of educational
                  opportunities.
                  <DesktopParagraph className="py-3">
                    By becoming a part of FundiBot, you'll gain access to
                    personalized learning recommendations, course insights, and
                    the latest updates from institutions across the country.
                  </DesktopParagraph>
                </p>
              </Mobile>
            </Col>
            <Col md="6" sm="12" xs="12" className="p-3">
              <div className="card">
                <div className="card-body">
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
                    <Form.Label>Password Confirmation</Form.Label>
                    <InputGroup className="mb-3">
                      <Form.Control
                        isInvalid={errors.some(
                          (err) => err.param === "password"
                        )}
                        type={showPass ? "text" : "password"}
                        placeholder="Password Confirmation"
                        value={passwordConfirmation}
                        onChange={(e) =>
                          setPasswordConfirmation(e.target.value)
                        }
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
                  <br />
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={submit}
                    className="mr-4"
                  >
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
      <Footer />
    </div>
  );
}
