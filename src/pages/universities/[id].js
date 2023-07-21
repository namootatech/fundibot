import Head from "next/head";
import Navigation from "@/components/nav";
import styled from "styled-components";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";

const StyledMain = styled.main`
  height: auto;
  width: 100vw;
  background: #f8f8f9;
  padding-top: 10rem;
`;

const Container = styled.div`
  margin: 0rem 12rem;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
`;

const Button = styled.button`
  background: #032248;
  color: white;
  border-radius: 10px;
  width: 9rem;
  height: 2.3rem;
  font-size: 12px;
  margin-bottom: 0.1rem;
  border: none;
  outline: none;
`;

export const getServerSideProps = async ({ query }) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/university?id=${query.id}`
  );

  return {
    props: {
      university: response.data,
    },
  };
};

export default function Home({ university }) {
  console.log(university);
  return (
    <>
      <Head>
        <title>{university.name} - FundiBot</title>
        <meta
          name="description"
          content="Fundi Bot is your go-to platform for discovering top universities and colleges. Explore a wide range of courses and unlock your academic potential today!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navigation />

      <StyledMain>
        <Container>
          <div className="row w-100">
            <div className="col-md-6">
              <img src={university.logo} width="80%" height="80%" />
            </div>
            <div className="col-md-6 mb-4">
              <h1 className="display-6">{university.name} </h1>
              <p className="lead">{university.description}</p>
            </div>
            <div className="col-md-12 mb-4">
              <h1 className="display-6 mb-4">Faculties </h1>
              <div className="row ">
                {university.faculties.map((faculty) => (
                  <div className="col-md-4 mb-3">
                    <div className="card h-100">
                      <div className="card-body">
                        <h5 className="card-title">{faculty.name}</h5>
                        <p className="card-text">{faculty.about}</p>
                      </div>
                      <div className="card-footer">
                        <Link
                          href={`/faculty/${faculty.id}?uni=${university._id}`}
                          className="card-link"
                        >
                          Browse Courses
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-md-12 mb-4">
              <h1 className="display-6 mb-4">Campuses </h1>
              <div className="row mt-4">
                {university.campuses.map((campus) => (
                  <div className="col-md-4 mb-3">
                    <div className="card h-100">
                      <div className="card-body">
                        <h5 className="card-title">{campus?.name}</h5>
                        <p className="card-text text-muted">
                          {campus?.address?.str}
                        </p>
                        <a
                          href={`tel:${campus?.contactNumber}`}
                          className="card-text"
                        >
                          {campus?.contactNumber}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-md-12 mb-4">
              <h1 className="display-6 mb-4">Accomodation </h1>
              <p>This university offers Accomodation? </p>
              {/* create a badge saying yes or no depending on accomodation.isOffered */}
              <h2>
                {university.accomodation?.isOffered ? (
                  <span class="badge bg-success">Yes</span>
                ) : (
                  <span class="badge bg-danger">No</span>
                )}
              </h2>
              {university.accomodation?.isOffered ? (
                <div className="mt-4">
                  <p>Accomodation Information </p>
                  <a className="btn btn-dark" href={university.accomodation?.link}>Open</a>
                </div>
              ) : (
                ""
              )}
              {university.accomodation?.pricing?.isProvided ? (
                <div className="mt-4 mb-4">
                  <p>Pricing Information</p>
                  <a className="btn btn-dark" href={university.accomodation?.pricing}>Open</a>
                </div>
              ) : (
                ""
              )}
              {university.accomodation?.isOffered ? 
                <div className="row mt-4">
                    <h3>Contacts</h3>
                    {university.accomodation.contacts.map(c => (
                        <div className="col-md-4 mt-3 mb-3">
                        <div className="card h-100">
                          <div className="card-body">
                            <h5 className="card-title">{c?.name}</h5>
                            <a
                              href={`tel:${c?.contactNumber}`}
                              className="card-text"
                            >
                              {c?.contactNumber}
                            </a>
                            <br/>
                            <a href={`mailto:${c?.email}`} className="card-text">
                                {c?.email}
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                : ""}

                   
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <p className="text-muted"> FundiBot by Midas Touch Technologies</p>
          </div>
          <br />
          <br />
        </Container>
      </StyledMain>
    </>
  );
}

/*

                        

                        
                        */
