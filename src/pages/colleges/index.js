import Head from "next/head";
import Navigation from "@/components/nav";
import styled from "styled-components";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import Footer from "@/components/footer";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from "react-device-detect";
import BsCard from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

const StyledMain = styled.main`
  height: auto;
  width: 100vw;
  background: #f4f4f4;
  padding-top: 10rem;
`;

const Container = styled.div`
  margin: 0rem 12rem;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  @media (max-width: 768px) {
    padding-left: 2rem;
    margin: 0rem 0rem;
  }
`;

const Card = styled.div`
  height: 250px !important;
  .card-body {
    padding: 0;
    padding-left: 1rem;
    padding-right: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    height: 100%;
    .card-section {
      width: 100%;
      height: 45%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: start;
    }
    .card-section-body {
      width: 100%;
      height: 35%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: start;
    }
    .card-section-footer {
      width: 100%;
      height: 20%;

      display: flex;
      flex-direction: column;
      justify-content: start;
      align-items: start;
    }
  }
  width: 95%;

  height: auto;
  margin-top: 3rem;

  border-radius: 10px;
  box-shadow: none;
  overflow: hidden;
  border: none;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: start;
  p {
    font-size: 0.75rem;
    margin-top: 0px;
    margin-right: 15px;
    margin-bottom: 5px;
    a {
      text-decoration: none;
      color: #495057;
    }
  }
  h3 {
    margin-top: 0px;
    margin-bottom: 0px;
    color: #636568;
    font-weight: 100;
    font-size: 0.8rem;
  }
  h2 {
    font-size: 1.2rem;
    margin-top: 0px;
    margin-bottom: 10px;
    font-weight: 400;
  }
`;

export const getServerSideProps = async ({ query }) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/colleges?page=0`
  );

  const colleges = response.data.institutions;
  const total = response.data.total;

  return {
    props: {
      colleges,
      total,
    },
  };
};

export default function Home(props) {
  const [page, setPage] = useState(0);
  const [colleges, setColleges] = useState(props.colleges);
  console.log("colleges", colleges);
  return (
    <div>
      <Head>
        <title>
          Explore Your Educational Journey with Fundi Bot - Find the Best
          Colleges & Courses
        </title>
        <meta
          name="description"
          content="Fundi Bot is your go-to platform for discovering top colleges and colleges. Explore a wide range of courses and unlock your academic potential today!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation />

      <StyledMain>
        <Container>
          <div className="row w-100">
            <div className="col-md-6">
              <h1 className="display-4">colleges </h1>
              <p className="lead">
                Fundi Bot is your go-to platform for discovering top colleges
                and colleges. Explore a wide range of courses and unlock your
                academic potential today!
              </p>
            </div>
            <div className="col-md-12">
              <div className="row">
                {colleges?.map((college) => (
                  <div className="col-md-6 col-xs-12 col-sm-12">
                    <BrowserView>
                      <Card className="card mb-4">
                        <img
                          src={college.campusImage}
                          width={200}
                          height={250}
                        />
                        <div className="card-body">
                          <div className="card-section">
                            <h2 className="card-title">
                              {college.institution}
                            </h2>
                            <h3>{college.address.str}</h3>
                          </div>
                          <div className="card-section-body">
                            <p className="card-text">
                              <strong>Contact Number: </strong>
                              <a href={`tel:${college.contact.contactNumber}`}>
                                {college.contact.contactNumber}
                              </a>
                            </p>
                            <p className="card-text">
                              <strong>Email: </strong>
                              <a href={`mailto:${college.contact.email}`}>
                                {college.contact.email}
                              </a>
                            </p>
                            <p className="card-text">
                              <strong>Wesbite: </strong>
                              <a href={college.contact.website}>
                                {college.contact.website}
                              </a>
                            </p>
                          </div>
                          <div className="card-section-footer">
                            <Button
                              variant="dark"
                              href={`/colleges/${college._id}`}
                            >
                              View More details
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </BrowserView>
                    <MobileView>
                      <BsCard className="my-4">
                        <BsCard.Img variant="top" src={college.campusImage} />
                        <BsCard.Body>
                          <BsCard.Title>{college.institution}</BsCard.Title>
                          <p className="card-text">
                            <strong>Contact Number: </strong>
                            <br />
                            <a href={`tel:${college.contact.contactNumber}`}>
                              {college.contact.contactNumber}
                            </a>
                          </p>
                          <p className="card-text">
                            <strong>Email: </strong>
                            <br />
                            <a href={`mailto:${college.contact.email}`}>
                              {college.contact.email}
                            </a>
                          </p>
                          <p className="card-text">
                            <strong>Wesbite: </strong>
                            <br />
                            <a href={college.contact.website}>
                              {college.contact.website}
                            </a>
                          </p>
                          <Button
                            variant="dark"
                            href={`/colleges/${college._id}`}
                          >
                            View More details
                          </Button>
                        </BsCard.Body>
                      </BsCard>
                    </MobileView>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <p> some other div</p>
          </div>
        </Container>
      </StyledMain>
      <Footer />
    </div>
  );
}

/*

                        

                        
                        */
