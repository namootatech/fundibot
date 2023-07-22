import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import axios from "axios";
import Fuse from "fuse.js";
import Form from "react-bootstrap/Form";
import { Fragment, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  AiFillFacebook,
  AiFillTwitterCircle,
  AiFillInstagram,
  AiFillLinkedin,
  AiFillYoutube,
  AiFillPhone,
  AiFillMail,
  AiFillEyeInvisible,
  AiFillEye,
} from "react-icons/ai";

import { FaPencilAlt } from "react-icons/fa";
import { BsGlobeEuropeAfrica } from "react-icons/bs";
import { uniq } from "ramda";

const navItems = [
  { name: "Intitutions", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "Schools", href: "/schools" },
];

export const getServerSideProps = async () => {
  const courses = await axios.get(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/courses`
  );
  return {
    props: {
      courses: courses.data,
    },
  };
};

const CollapsibleTableRow = ({ course, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <Fragment>
      <tr>
        <td>{index}</td>
        <td>{course.name}</td>
        <td>{course.institution.institution}</td>
        <td>
          <Button
            variant="primary"
            size="sm"
            href={`/edit/course/${course._id}`}
            className="mr-3"
            style={{ marginRight: "5px" }}
          >
            <FaPencilAlt />
          </Button>
          <Button
            className="ml-3"
            variant="secondary"
            size="sm"
            onClick={() => setOpen(!open)}
          >
            {open ? <AiFillEyeInvisible /> : <AiFillEye />}
          </Button>
        </td>
      </tr>
      {open && (
        <tr>
          <td colSpan="4">
            {/* two by two grid showing course information such as name, address, contact number, email, website, region etc */}
            <Row>
              <Col md={12} className="mb-3">
                <Card>
                  <Card.Header>About</Card.Header>

                  <Card.Body>
                    <img src={course.logoUrl} width={200} className="mb-3" />
                    <Card.Text>{course.bio}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card>
                  <Card.Header>Main Campus Address</Card.Header>
                  <Card.Body>
                    <Card.Text>{course?.address?.street}</Card.Text>
                    <Card.Text>{course?.address?.suburb}</Card.Text>
                    <Card.Text>{course?.address?.city}</Card.Text>
                    <Card.Text>{course?.address?.province}</Card.Text>
                    <Card.Text>{course?.address?.country}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Row>
                  <Col md={12} className="mb-3">
                    <Card>
                      <Card.Header>Contact</Card.Header>
                      <Card.Body>
                        <Card.Text>
                          <AiFillMail />{" "}
                          <a href={`mailto:${course.contact?.email}`}>
                            {course.contact?.email}
                          </a>
                        </Card.Text>
                        <Card.Text>
                          <AiFillPhone />{" "}
                          <a href={`tel:${course.contact?.phone}`}>
                            {course.contact?.phone}
                          </a>
                        </Card.Text>
                        <Card.Text>
                          <BsGlobeEuropeAfrica />{" "}
                          <a href={course.contact?.website} target="_blank">
                            {course.contact?.website}
                          </a>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={12}>
                    <Card>
                      <Card.Header>Socials</Card.Header>
                      <Card.Body>
                        <Card.Text>
                          <Row>
                            <Col md={1}>
                              <a href={course.socials?.facebookUrl}>
                                <AiFillFacebook />
                              </a>
                            </Col>
                            <Col md={1}>
                              <a href={course.socials?.twitterUrl}>
                                <AiFillTwitterCircle />
                              </a>
                            </Col>
                            <Col md={1}>
                              <a href={course.socials?.instagramUrl}>
                                <AiFillInstagram />
                              </a>
                            </Col>
                            <Col md={1}>
                              <a href={course.socials?.linkedinUrl}>
                                <AiFillLinkedin />
                              </a>
                            </Col>
                            <Col md={1}>
                              <a href={course.socials?.youtubeUrl}>
                                <AiFillYoutube />
                              </a>
                            </Col>
                          </Row>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
          </td>
        </tr>
      )}
    </Fragment>
  );
};

export default function Home(props) {
  const [courses, setcourses] = useState(props.courses);
  const [search, setSearch] = useState("");
  const fuse = new Fuse(courses, {
    includeScore: false,
    keys: ["name", "institution.institution"],
  });

  const runSearch = (e) => {
    setSearch(e.target.value);
    if (e.target.value.length > 0) {
      const results = fuse.search(e.target.value);
      setcourses(results.map((r) => r.item));
    } else {
      setcourses(props.courses);
    }
  };

  const clearSearch = () => {
    setSearch("");
    setcourses(props.courses);
  };

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ background: "#dadfdf" }}>
        <div className="d-flex flex-column justify-content-center align-items-center">
          <Image src="/logo.png" width="400" height="200" />
          <div>Find Your Future: Explore Colleges & Courses!</div>
        </div>

        <Row className="d-flex flex-row justify-content-center">
          <Col md={10}>
            <Row className="d-flex flex-row justify-content-center">
              <Col md={10}>
                <Card
                  style={{ width: "100%", background: "none", border: "none" }}
                  className="mb-3"
                >
                  <div className="d-flex flex-row w-100">
                    {navItems.map((item, index) => (
                      <Fragment key={index}>
                        <a
                          href={item.href}
                          key={index}
                          className="mb-3 mr-3 btn btn-link"
                        >
                          {item.name}
                        </a>
                      </Fragment>
                    ))}
                  </div>

                  <div className="d-flex flex-row w-100">
                    <Col md={12}>
                      <Form.Control
                        type="text"
                        placeholder="Search"
                        value={search}
                        onChange={runSearch}
                        className="mr-2"
                      />
                    </Col>
                    <br />
                  </div>
                  <small className="text-muted mt-3">
                    Found {courses.length} courses from{" "}
                    {uniq(courses.map((c) => c.institution.institution)).length}{" "}
                    Institutions
                  </small>
                </Card>

                <Table striped bordered hover className="w-100 h-100">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>course</th>
                      <th>Institution</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((c, index) => (
                      <CollapsibleTableRow
                        key={index}
                        course={c}
                        index={index}
                      />
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Col>
        </Row>
      </main>
    </div>
  );
}
