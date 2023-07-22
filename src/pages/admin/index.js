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
  const [activeTab, setActiveTab] = useState("universities");

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };
  // Sample data (replace with your actual data)
  const [universities, setUniversities] = useState([
    { id: 1, name: "University A", location: "City X" },
    { id: 2, name: "University B", location: "City Y" },
    // Add more university entries here
  ]);

  const [colleges, setColleges] = useState([
    { id: 1, name: "College X", universityId: 1 },
    { id: 2, name: "College Y", universityId: 2 },
    // Add more college entries here
  ]);

  const [campuses, setCampuses] = useState([
    { id: 1, name: "Campus A", collegeId: 1 },
    { id: 2, name: "Campus B", collegeId: 2 },
    // Add more campus entries here
  ]);

  const [programs, setPrograms] = useState([]);
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
          <div className="container mt-5 h-100">
            <h2 className="text-dark mb-4">Dashboard</h2>
            <div className="row mb-4">
              <div className="col-md-3 col-xs-12 col-sm-12">
                <button
                  type="button"
                  className={`btn btn-outline-dark btn-block w-100 ${
                    activeTab === "universities" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("universities")}
                >
                  Universities
                </button>
              </div>
              <div className="col-md-3 col-xs-12 col-sm-1">
                <button
                  type="button"
                  className={`btn btn-outline-dark btn-block w-100 ${
                    activeTab === "colleges" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("colleges")}
                >
                  Colleges
                </button>
              </div>
              <div className="col-md-3 col-xs-12 col-sm-1">
                <button
                  type="button"
                  className={`btn btn-outline-dark btn-block  w-100 ${
                    activeTab === "campuses" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("campuses")}
                >
                  Campuses
                </button>
              </div>
              <div className="col-md-3 col-xs-12 col-sm-1">
                <button
                  type="button"
                  className={`btn btn-outline-dark btn-block w-100 ${
                    activeTab === "programs" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("programs")}
                >
                  Programs
                </button>
              </div>
            </div>

            {/* Render the appropriate content based on the activeTab state */}
            {activeTab === "universities" && (
              <div>
                <h3 className="text-dark">Universities</h3>
                <div className="mb-3">
                  <Link
                    href="/admin/institution/add"
                    className="btn btn-success"
                  >
                    Add University
                  </Link>
                </div>
                {universities.length > 0 ? (
                  <ul className="list-group">
                    {universities.map((university) => (
                      <li
                        key={university.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {university.name}
                        <div>
                          <button className="btn btn-sm btn-outline-primary mx-1">
                            Edit
                          </button>
                          <button className="btn btn-sm btn-outline-danger mx-1">
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">
                    You have not added any university entries yet.
                  </p>
                )}
              </div>
            )}

            {activeTab === "colleges" && (
              <div>
                <h3 className="text-dark">Colleges</h3>
                <div className="mb-3">
                  <Link
                    href="/admin/institution/add"
                    className="btn btn-success"
                  >
                    Add College
                  </Link>
                </div>
                <ul className="list-group mb-4">
                  {colleges.length > 0 ? (
                    <ul className="list-group">
                      {colleges.map((college) => (
                        <li
                          key={college.id}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          {college.name}
                          <div>
                            <button className="btn btn-sm btn-outline-primary mx-1">
                              Edit
                            </button>
                            <button className="btn btn-sm btn-outline-danger mx-1">
                              Delete
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted">
                      You have not added any college entries yet.
                    </p>
                  )}
                </ul>
              </div>
            )}

            {activeTab === "campuses" && (
              <div>
                <h3 className="text-dark">Campuses</h3>
                <div className="mb-3">
                  <a href="#addUniversity" className="btn btn-success">
                    Add Campus
                  </a>
                </div>
                {campuses.length > 0 ? (
                  <ul className="list-group">
                    {campuses.map((campus) => (
                      <li
                        key={campus.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {campus.name}
                        <div>
                          <button className="btn btn-sm btn-outline-primary mx-1">
                            Edit
                          </button>
                          <button className="btn btn-sm btn-outline-danger mx-1">
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">
                    You have not added any campus entries yet.
                  </p>
                )}
              </div>
            )}

            {activeTab === "programs" && (
              <div>
                <h3 className="text-dark">Programme</h3>
                <div className="mb-3">
                  <a href="#addUniversity" className="btn btn-success">
                    Add Programme
                  </a>
                </div>
                {programs.length > 0 ? (
                  <ul className="list-group">
                    {programs.map((program) => (
                      <li
                        key={program.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {program.name}
                        <div>
                          <button className="btn btn-sm btn-outline-primary mx-1">
                            Edit
                          </button>
                          <button className="btn btn-sm btn-outline-danger mx-1">
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">
                    You have not added any program entries yet.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </StyledMain>
      <Footer />
    </div>
  );
}

/*

                        

                        
                        */
