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
import { useRouter } from "next/router";

const StyledMain = styled.main`
  height: 100vh;
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
        <div className="container mt-5">
          {/* if user is logged in route them to /admin/id else show them a meesaage to login */}
          <div className="row">
            <div className="col-md-12">
              <h1 className="text-center">Data provider</h1>
              <p className="text-center">
                Welcome to the data provider page. Here you can add, edit and
                delete data for the FundiBot platform.
              </p>
              {user._id ? (
                <div className="text-center">
                  <p> You are currently logged in As</p>
                  <pre>
                    <p>
                      Username: {user.firstName} {user.lastName}
                    </p>
                    <p>Email: {user.email}</p>
                  </pre>
                  <p>Click her to go to your personal dashbaord</p>
                  <Button href={`/admin/${user._id}`}>Go to dashboard</Button>
                </div>
              ) : (
                <div className="text-center">
                  <p>You are not logged in</p>
                  <p>Click here to login</p>
                  <Button href="/admin/login">Login</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </StyledMain>
      <Footer />
    </div>
  );
}

/*

                        

                        
                        */
