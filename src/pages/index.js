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

const navItems = [
  { name: "Institutions", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "Schools", href: "/schools" },
];

export const getServerSideProps = async () => {
  console.log("Making request to: ", `${process.env.NEXT_SITE_URL}/api/institutions`)
  const institutions = await axios.get(
    `${process.env.NEXT_SITE_URL}/api/institutions`
  );
  console.log("Institutions: ", institutions.data)
  return {
    props: {
      institutions: institutions.data,
    },
  };
};

const CollapsibleTableRow = ({ institution, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <Fragment>
      <tr>
        <td>{index}</td>
        <td>{institution.institution}</td>
        <td>{institution.region}</td>
        <td>
          <Button
            variant="primary"
            size="sm"
            href={`/edit/institution/${institution._id}`}
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
            {/* two by two grid showing institution information such as name, address, contact number, email, website, region etc */}
            <Row>
              <Col md={12} className="mb-3">
                <Card>
                  <Card.Header>About</Card.Header>

                  <Card.Body>
                    <img
                      src={institution.logoUrl}
                      width={200}
                      className="mb-3"
                    />
                    <Card.Text>{institution.bio}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card>
                  <Card.Header>Main Campus Address</Card.Header>
                  <Card.Body>
                    <Card.Text>{institution?.address?.street}</Card.Text>
                    <Card.Text>{institution?.address?.suburb}</Card.Text>
                    <Card.Text>{institution?.address?.city}</Card.Text>
                    <Card.Text>{institution?.address?.province}</Card.Text>
                    <Card.Text>{institution?.address?.country}</Card.Text>
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
                          <a href={`mailto:${institution.contact?.email}`}>
                            {institution.contact?.email}
                          </a>
                        </Card.Text>
                        <Card.Text>
                          <AiFillPhone />{" "}
                          <a href={`tel:${institution.contact?.phone}`}>
                            {institution.contact?.phone}
                          </a>
                        </Card.Text>
                        <Card.Text>
                          <BsGlobeEuropeAfrica />{" "}
                          <a
                            href={institution.contact?.website}
                            target="_blank"
                          >
                            {institution.contact?.website}
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
                              <a href={institution.socials?.facebookUrl}>
                                <AiFillFacebook />
                              </a>
                            </Col>
                            <Col md={1}>
                              <a href={institution.socials?.twitterUrl}>
                                <AiFillTwitterCircle />
                              </a>
                            </Col>
                            <Col md={1}>
                              <a href={institution.socials?.instagramUrl}>
                                <AiFillInstagram />
                              </a>
                            </Col>
                            <Col md={1}>
                              <a href={institution.socials?.linkedinUrl}>
                                <AiFillLinkedin />
                              </a>
                            </Col>
                            <Col md={1}>
                              <a href={institution.socials?.youtubeUrl}>
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
  const [institutions, setInstitutions] = useState(props.institutions);
  const [search, setSearch] = useState("");
  const fuse = new Fuse(institutions, {
    includeScore: false,
    keys: ["institution", "region"],
  });

  const runSearch = (e) => {
    setSearch(e.target.value);
    if (e.target.value.length > 0) {
      const results = fuse.search(e.target.value);
      setInstitutions(results.map((r) => r.item));
    } else {
      setInstitutions(props.institutions);
    }
  };

  const clearSearch = () => {
    setSearch("");
    setInstitutions(props.institutions);
  };

  return (
    <>
      <Head>
        <title>Explore Your Educational Journey with Fundi Bot - Find the Best Colleges & Courses</title>
        <meta
          name="description"
          content="Fundi Bot is your go-to platform for discovering top universities and colleges. Explore a wide range of courses and unlock your academic potential today!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="float-add d-flex flex-column justify-content-centern align-items-center">
        <small>Can't find your institution? Click here to add it</small>
        <Button href="/add/institution" className="mt-3 w-25" size="sm">
          Add{" "}
        </Button>
      </div>
      <main style={{ background: "#dadfdf" }}>
        <div className="d-flex flex-column justify-content-center align-items-center">
          <Image src="/logo.png" width="200" height="100" />
          <p>Find Your Future: Explore Colleges & Courses!</p>
        </div>

        <Row className="d-flex flex-row justify-content-center">
          <Col md={10}>
            <Row className="d-flex flex-row justify-content-center">
              <Col md={10}>
                <Card
                  style={{ width: "100%", background: "none", border: "none" }}
                  className="mb-3 text-center"
                >
                  <div className="d-flex flex-row w-100 justify-content-center">
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

                  <div className="d-flex flex-row w-100 justify-content-center">
                    <Col md={12} xs={11}>
                      <Form.Control
                        type="text"
                        placeholder="Search"
                        value={search}
                        onChange={runSearch}
                        className="mr-2"
                      />
                    </Col>
                  </div>
                </Card>

                <Table striped bordered hover className="w-100 h-100">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Institution</th>
                      <th>Region</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {institutions.map((c, index) => (
                      <CollapsibleTableRow
                        key={index}
                        institution={c}
                        index={index + 1}
                      />
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Col>
        </Row>
      </main>
    </>
  );
}
