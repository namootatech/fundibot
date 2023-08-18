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
import { flatten, isEmpty } from "ramda";
import Footer from "@/components/footer";

const StyledMain = styled.main`
  min-height: 100vh;
  width: 100vw;
  background: #f3f3f3;
  padding-top: 10rem;
`;

const universityInstitutionTypes = [
  "university",
  "public_university",
  "public_university_of_technology",
  "private_university",
  "private_university_of_technology",
  "private_higher_education_institution",
  "public_higher_education_institution",
];

const collegeInstitutionTypes = ["public_college", "private_college"];

export const getServerSideProps = async ({ query }) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/institutions/get-by-creator?creator=${query.id}&page=0`
  );

  return {
    props: {
      institutions: response.data.institutions,
      programmes: response.data.programmes,
    },
  };
};

export default function Home({ institutions, programmes }) {
  const [activeTab, setActiveTab] = useState("universities");

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const [universities, setUniversities] = useState(
    institutions.filter((institution) =>
      universityInstitutionTypes.includes(institution.type)
    )
  );

  const [colleges, setColleges] = useState(
    institutions.filter((institution) =>
      collegeInstitutionTypes.includes(institution.type)
    )
  );

  const [programs, setPrograms] = useState(programmes || []);

  return (
    <div>
      <Head>
        <title>Data provider - FundiBot</title>
        <meta
          name="description"
          content="Fundi Bot is your go-to platform for discovering top universities and colleges. Explore a wide range of courses and unlock your academic potential today."
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
              <div className="col-md-3 col-xs-12 col-sm-12 my-3">
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
              <div className="col-md-3 col-xs-12 col-sm-1 my-3">
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
              <div className="col-md-3 col-xs-12 col-sm-1 my-3">
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
                        {university.institution}
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
                          {college.institution}
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
              <div className="my-4">
                <h3 className="text-dark my-4">Programmes</h3>
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
                  <div className="lead text-muted">
                    <p className="text-muted">
                      You have not added any program entries yet.
                    </p>
                  </div>
                )}
                <div className="lead text-muted my-4">
                  <p className="lead my-4">
                    You can add programmes to the following faculties on these
                    universities
                  </p>
                  {institutions.length > 0 ? (
                    <Table borderless>
                      <thead>
                        <tr>
                          <th>Institution</th>
                          <th>Faculties</th>
                        </tr>
                      </thead>
                      <tbody>
                        {institutions.map((i) => (
                          <tr key={i.id}>
                            <td>{i.institution}</td>
                            <td>
                              <Table>
                                <thead>
                                  <tr>
                                    <th>Name</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {i.faculties.map((faculty) => (
                                    <tr key={faculty.id}>
                                      <td>{faculty.name}</td>
                                      <td>
                                        <Button
                                          href={`/admin/programme/add/${i._id}?faculty=${faculty.id}`}
                                          variant="outline-primary"
                                        >
                                          Add Programme
                                        </Button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <p className="text-muted">
                      You have not added any university entries yet.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <br />
      </StyledMain>
      <Footer />
    </div>
  );
}

/*

                        

                        
                        */
