import Head from "next/head";
import Navigation from "@/components/nav";
import styled from "styled-components";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import schoolSubjects from "@/data/south_african_hischool_subjects_json.json";
import { BsFillCheckSquareFill } from "react-icons/bs";
import { FaWindowClose } from "react-icons/fa";
import { isEmpty } from "ramda";
import Footer from "@/components/footer";
import Cookies from "js-cookie";

const StyledMain = styled.main`
  height: auto;
  width: 100vw;
  background: #f3f3f3;
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
  ul {
    padding-left: 0 !important;
  }
`;

export default function Home({ university, programme }) {
  const user = JSON.parse(Cookies.get("user") || "{}");
  return (
    <div>
      <Head>
        <title>Data provider - FundiBot</title>
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
          <div className="d-flex flex-column justify-content-center align-items-center w-100">
            <div className="col-md-10 mb-4">
              {user._id && (
                <Button variant="dark" href={`/admin/${user._id}`} mb="3">
                  Go to my dashbaord
                </Button>
              )}
              <br />
              <h1 className="display-4 my-4">Data Provider Guidelines</h1>
              <h2 className="display-6">Empowering Education with FundiBot</h2>
              <p className="lead my-4">
                Hello, valued Data Providers!
                <br />
                <br />
                Thank you for joining us on this exciting journey to empower
                learners worldwide through FundiBot. Your contributions are
                instrumental in enriching our platform with valuable
                information, ensuring students make informed decisions about
                their educational paths.
              </p>
            </div>
            <div className="col-md-10 mb-4">
              <h4 className=" mb-4 mt-4">Task Overview:</h4>
              <p className="lead">
                {" "}
                Your role as a Data Provider involves visiting various
                institution websites and gathering essential data to populate
                our database. Specifically, you'll be adding the following
                items:
              </p>
              <ol className="lead">
                <li>
                  <strong>University:</strong> For each university entry, you
                  will receive R100.
                </li>
                <li>
                  <strong>College:</strong> Adding each college entry will earn
                  you R120.
                </li>
                <li>
                  <strong>Faculty:</strong> For each faculty entry, you will be
                  rewarded with R50.
                </li>
                <li>
                  <strong>Programme:</strong> Adding each programme entry will
                  earn you R50.
                </li>
                <li>
                  <strong>Campus:</strong>
                  For each campus entry, you will be rewarded with R50.
                </li>
              </ol>
              <h4>Quality Matters:</h4>
              <p className="lead">
                We emphasize the importance of quality data collection. To
                ensure the best possible experience for our users, we encourage
                thorough research and attention to detail when adding
                information. Accurate and up-to-date data is key to helping
                students find the right educational paths.
              </p>
              <h4>Submitting Your Entries:</h4>
              <p className="lead">
                To add an entry to our database, simply click on the options
                dropdown in the menu bar and select the relevant option. You
                will be prompted to fill in the required information. Once
                you've completed the form, click on the "Submit" button to add
                your entry to our database. You will receive a confirmation
                email once your entry has been approved.
              </p>
              <h4>Join Our Educational Mission:</h4>
              <p className="lead">
                By becoming a Data Provider, you are directly contributing to
                the educational success of students around the world. Your
                dedication to empowering learners is a vital part of FundiBot's
                mission to shape brighter futures through knowledge. Thank you
                for being part of FundiBot's growth and impact. Together, let's
                revolutionize education and unlock the potential of countless
                students!
              </p>
              <p>Best regards, The FundiBot Team 🌟📚</p>
            </div>
          </div>

          <br />
          <br />
        </Container>
      </StyledMain>
      <Footer />
    </div>
  );
}

/*

                        

                        
                        */
