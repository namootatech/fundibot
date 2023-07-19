import Head from "next/head";

import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Image from "next/image";
import { TABLE_PAGE_SIZE } from "@/constants";
import { all, is, mapAccum, range, reduce, set } from "ramda";
import Navigation from "@/components/nav";
import styled from "styled-components";

const StyledMain = styled.main`
  height: 100vh;
  width: 100vw;
  background: #032248a1;
`;

const HeroHead = styled.h1`
font-size: 82px;
font-weight: 600;
color: white;
margin-bottom: 1.5rem;
`;

const HeroSubHead = styled.h3`
  font-size: 50px;
  font-weight: 400;
  color: white;
`;

const Hero = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const StyledInputContainer = styled.div`
  margin-top: 3rem;
  width: 1450px;
  height: 157px;
  background: white;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const StyledInput = styled.input`
  margin: 0px 20px;
  margin-top: 5px;
  width: 85%;
  height: 90%;
  font-size: 42px;
  border: none;
  outline:none;
  padding-left: 10px;
  &::placeholder {
    color: #c2c2c2;
  }
`;

const StyledButton = styled.button`
  background: #eef1f5;
  width: 15%;
  height: 100%;
  border: 2px solid #eef1f5;
  color: #65717e;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  font-size: 52px;
  font-weight: 900;
`;

const LinkButtonContainer = styled.div`
  margin-top: 3rem;
  width: 1050px;
  height: 107px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const LinkButton = styled.a`
  width: 300px;
  height: 100px;
  border-radius: 10px;
  background-color: #fff;
  color: #032248;
  margin-right: 52px;
  text-decoration: none;
  font-size: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const navItems = [
  { name: "Universities", href: "/universities" },
  { name: "Colleges", href: "/universities" },
  { name: "Courses", href: "/courses" },
  { name: "Schools", href: "/schools" },
];

export const getServerSideProps = async () => {
  // console.log(
  //   "Making request to: ",
  //   `${process.env.NEXT_PUBLIC_SITE_URL}/api/institutions`
  // );
  // const response = await axios.get(
  //   `${process.env.NEXT_PUBLIC_SITE_URL}/api/institutions?page=0`
  // );
  const { institutions, total } = { institutions: [], total: 10 };
  return {
    props: {
      institutions,
      total,
    },
  };
};

export default function Home(props) {
  const [institutions, setInstitutions] = useState(props.institutions);
  const [loadedPages, setLoadedPages] = useState([0]);
  const [pageBeingLoaded, setPageBeingLoaded] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const makeRequest = async (page) => {
    console.log(
      "Making request to: ",
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/institutions?page=${page}`
    );
    const results = await axios.get(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/institutions?page=${page}`
    );
    const { institutions, total } = results.data;
    return institutions;
  };

  const loadMorePages = async () => {
    if (isLoading) return;
    const pagesToLoad = range(
      1,
      Math.floor(props.total / TABLE_PAGE_SIZE + 1)
    ).filter((p) => !loadedPages.includes(p));
    const allInstitutions = reduce(
      async (current, p) => {
        setPageBeingLoaded(p);
        setIsLoading(true);
        const data = await current;
        const fetchedInstitutions = await makeRequest(p);
        return [...data, ...fetchedInstitutions];
      },
      [],
      pagesToLoad
    );
    console.log(allInstitutions);
    Promise.resolve(allInstitutions).then((data) => {
      console.log("All institutions", data);
      setInstitutions([...institutions, ...data]);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    setIsLoading(true);
    // loadMorePages();
  }, []);

  return (
    <>
      <Head>
        <title>
          Explore Your Educational Journey with Fundi Bot - Find the Best
          Colleges & Courses
        </title>
        <meta
          name="description"
          content="Fundi Bot is your go-to platform for discovering top universities and colleges. Explore a wide range of courses and unlock your academic potential today!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation />

      <StyledMain>
        <Hero>
          <HeroHead>Discover your path</HeroHead>
          <HeroSubHead>with personalized learning recommendations</HeroSubHead>
          <StyledInputContainer>
            <StyledInput placeholder="Search for institution or course e.g Bsc Geology" />
            <StyledButton>GO</StyledButton>
          </StyledInputContainer>
          <LinkButtonContainer>
            {navItems.map((n) => (
              <LinkButton href={n.href}>{n.name}</LinkButton>
            ))}
          </LinkButtonContainer>
        </Hero>
      </StyledMain>
    </>
  );
}

/* 

console.log(institutions)
   

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
import { mergeAll, set } from "ramda";

<div className="float-add d-flex flex-column justify-content-centern align-items-center">
        <small>Can't find your institution? Click here to add it</small>
        <Button href="/add/institution" className="mt-3 w-25" size="sm">
          Add{" "}
        </Button>
      </div> */
/* 
  const runSearch = (e) => {
    setPage(currentSearchPage);
    setSearch(e.target.value);
    if (e.target.value.length > 0) {
      makeSearchRequest(e.target.value, currentSearchPage);
      setInstitutions(results.map((r) => r.item));
    } else {
      setInstitutions(props.institutions);
    }
  };
 const clearSearch = () => {
    setSearch("");
    setInstitutions(props.institutions);
  };
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

                    
                */
