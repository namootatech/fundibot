import Head from "next/head";
import Navigation from "@/components/nav";
import styled from "styled-components";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import Footer from "@/components/footer";
import schoolSubjects from "@/data/south_african_hischool_subjects_json.json";
import Table from "react-bootstrap/Table";

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
`;

const Button = styled.button`
  background: #2b3035;
  color: white;
  border-radius: 10px;
  width: 9rem;
  height: 2.3rem;
  font-size: 12px;
  margin-bottom: 0.1rem;
  border: none;
  outline: none;
`;
const subNames = {
  "math-pure": "Mathematics",
  "eng-hl": "English Home Language",
  "eng-fal": "English First Additional Language",
  "af-hl": "Afrikaans Home Language",
  "af-fal": "Afrikaans First Additional Language",
  "zul-hl": "IsiZulu Home Language",
  "zul-fal": "IsiZulu First Additional Language",
  "xho-hl": "IsiXhosa Home Language",
  "xho-fal": "IsiXhosa First Additional Language",
  "physical-sci": "Physical Sciences",
  "life-sci": "Life Sciences",
  geo: "Geography",
  history: "History",
  "bus-studies": "Business Studies",
  acc: "Accounting",
  eco: "Economics",
  tour: "Tourism",
  cat: "Computer Applications Technology",
  it: "Information Technology",
  drama: "Dramatic Arts",
  music: "Music",
  art: "Visual Arts",
  dance: "Dance Studies",
  "life-ori": "Life Orientation",
  "phy-ed": "Physical Education",
  "rel-studies": "Religious Studies",
  agric: "Agricultural Sciences",
  "civil-tech": "Civil Technology",
  "mech-tech": "Mechanical Technology",
  "elec-tech": "Electrical Technology",
  "eng-tech": "Engineering Graphics and Design",
  hospitality: "Hospitality Studies",
};
const getSubName = (sub) =>
  schoolSubjects.find((s) => s.code === sub)?.name || sub;

export const getServerSideProps = async ({ query }) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/faculty?id=${query.id}&uni=${query.uni}`
  );

  const { institution, faculty, programmes } = response.data;
  console.log(query);
  return {
    props: {
      university: institution,
      faculty,
      programmes,
    },
  };
};

export default function Home({ university, faculty, programmes }) {
  return (
    <div>
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
              <h1 className="display-6">{faculty.name} </h1>
              <p className="lead">{faculty.about}</p>
            </div>
            <div className="col-md-12 mb-4">
              <h1 className="display-6 mb-4">Programmes </h1>
              <div className="row ">
                {programmes.map((p) => (
                  <div className="col-md-6 mb-3">
                    <div className="card h-100">
                      <div className="card-body">
                        <h5 className="card-title">{p.name}</h5>
                        <p className="card-text">{p.description}</p>
                        <h6 className="card-text"> How long does it take?</h6>
                        <p className="card-text text-muted">
                          Takes {p.duration.years} years to complete.
                        </p>
                        <h6 className="card-text">
                          {" "}
                          Which careers could this lead me to?{" "}
                        </h6>
                        <p className="card-text text-muted">
                          {p.careers.join(", ")}
                        </p>
                        <h6 className="card-text my-4">
                          {" "}
                          Which subjects do you need?{" "}
                        </h6>
                        {p.criterias.map((c) => (
                          <Table size="sm">
                            <thead>
                              <tr className="table-dark">
                                <th>
                                  {c?.type === "all"
                                    ? "All of these subjects"
                                    : "Any of these subjects at these levels"}
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              <Table>
                                <thead>
                                  <tr>
                                    <th colSpan={4}>Subject</th>
                                    <th colSpan={1}>Level</th>
                                    <th colSpan={1}>Minimum Pass Mark</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {c.subjects.map((sub, index) => (
                                    <tr>
                                      <td colSpan={4}>{getSubName(sub?.id)}</td>
                                      <td colSpan={1}>{sub?.level}</td>
                                      <td colSpan={1}>{sub?.passMark}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </tbody>
                          </Table>
                        ))}
                        <h6 className="card-text">
                          How many APS points do I need to qualify?
                        </h6>
                        <p className="card-text text-muted">
                          {p.aps} APS points
                        </p>
                      </div>
                      <div className="card-footer">
                        <Link
                          href={`/programme/${p._id}?uni=${university._id}`}
                          className="btn btn-dark"
                        >
                          See if you qualify
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <p className="text-muted"> FundiBot by Midas Touch Technologies</p>
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
