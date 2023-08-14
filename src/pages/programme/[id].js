import Head from "next/head";
import Navigation from "@/components/nav";
import styled from "styled-components";
import Image from "next/image";
import { Fragment, use, useEffect, useState } from "react";
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
import { insert, isEmpty, isNil, pipe, remove, set } from "ramda";
import Footer from "@/components/footer";
import {
  RenderAllSubjects,
  RenderAnySubjects,
  AddSubjectModal,
  getSubName,
} from "@/components/programme";

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

export default function Home(props) {
  const [show, setShow] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [studentQualifies, setStudentQualifies] = useState(false);
  const [programme, setProgramme] = useState(props.programme);
  const university = props.university;

  const handleAddSubject = (subject) => {
    setSubjects([...subjects, subject]);
  };

  const handleClose = () => setShow(false);
  const toggleModal = () => setShow(!show);

  const meetsSubjectCriteria = (criteria) => {
    console.log("criteria", criteria);
    const subjectsThatMeetCriteria = subjects.filter((s) =>
      criteria.subjects.some((c) => c.id === s.id && s.level >= c.level)
    );
    console.log("subjectsThatMeetCriteria", subjectsThatMeetCriteria);
    return (
      subjectsThatMeetCriteria.length >=
      (criteria.type === "any" ? 1 : criteria.subjects.length)
    );
  };

  const studentQualifiesForProgramme = () => {
    const criteriaThatHaveBeenMet = programme.criterias.filter((c) =>
      meetsSubjectCriteria(c)
    );
    console.log("criteriaThatHaveBeenMet", criteriaThatHaveBeenMet);
    console.log("programme.criterias", programme.criterias);

    setStudentQualifies(
      criteriaThatHaveBeenMet.length === programme.criterias.length
    );
    console.log(
      "studentQualifies",
      criteriaThatHaveBeenMet.length === programme.criterias.length
    );
  };

  const updateCriteriaToMatchSelectedSubject = (
    oldSubject,
    newSubject,
    criteria
  ) => {
    const subjectToUpdate = criteria.subjects.find(
      (s) => s.id === oldSubject.id
    );
    const newSubjectToUpdate = {
      ...subjectToUpdate,
      id: newSubject.id,
      hasBeenAssesed: true,
    };
    const index = criteria.subjects.findIndex((s) => s.id === oldSubject.id);
    const newSubjects =
      index > 0
        ? pipe(
            remove(index, index),
            insert(index, newSubjectToUpdate)
          )(criteria.subjects)
        : pipe(
            remove(0, 1),
            insert(index, newSubjectToUpdate)
          )(criteria.subjects);

    const newCriteria = { ...criteria, subjects: newSubjects };
    setProgramme({
      ...programme,
      criterias: programme.criterias.map((c) => {
        if (c.id === criteria.id) {
          return newCriteria;
        }
        return c;
      }),
    });
  };

  const updateSubject = (subject) => {
    const newSubjects = subjects.map((s) => {
      if (s.id === subject.id) {
        return subject;
      }
      return s;
    });
    setSubjects(newSubjects);
  };

  useEffect(() => {
    studentQualifiesForProgramme();
  }, [subjects]);

  const subjectsWithoutCriteria = subjects.filter((s) => !s.hasBeenAssesed);
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
              <h1 className="display-6">{programme.name} </h1>
              <p className="lead">{programme.description}</p>
            </div>
            <div className="col-md-12 mb-4 card p-4">
              <h4 className=" mb-4 mt-4">Do I qualify for this course? </h4>
              <p>
                {" "}
                Discover if you're a perfect fit for this course! Simply enter
                your subjects below, and we'll check if you meet the
                requirements. It's like having your own personal course advisor
                right at your fingertips!
              </p>
              <small
                className="text-muted mb-4 mt-1"
                style={{ fontSize: "10px" }}
              >
                <i>
                  * Please note that the results provided on this page are based
                  on the information you enter and may not be 100% accurate. We
                  recommend consulting the official university prospectus or
                  study guide for the most up-to-date and comprehensive course
                  requirements. This tool is designed to assist you in your
                  course selection journey, but always double-check with the
                  official sources for complete accuracy.
                </i>
              </small>
              <div className="col-2">
                <Button variant="primary" onClick={toggleModal}>
                  Add subject
                </Button>
              </div>
              <AddSubjectModal
                show={show}
                handleClose={handleClose}
                handleAddSubject={handleAddSubject}
              />

              <div className="row ">
                <div className="col-md-12 mt-4">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Level</th>
                        <th>Pass Mark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.map((sub) => (
                        <tr>
                          <td>{getSubName(sub.id)}</td>
                          <td>{sub.level}</td>
                          <td>{sub.passMark}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <div className="row mt-4">
                    <div className="col-md-12 mt-4">
                      <p className="text-center mt-4">
                        Based on the subject you entered, here's how you match
                        up:
                      </p>
                      <ul>
                        <Table stripped bordered size="sm">
                          <thead>
                            <tr>
                              <th>Subject</th>
                              <th>Your Level</th>
                              <th>Required Level</th>
                            </tr>
                          </thead>
                          {programme.criterias.map((criteria, index) => (
                            <tbody>
                              {criteria.type === "all" ? (
                                <RenderAllSubjects
                                  criteria={criteria}
                                  subjects={subjects}
                                  subjectsWithoutCriteria={
                                    subjectsWithoutCriteria
                                  }
                                  updateSubject={updateSubject}
                                  updateCriteriaToMatchSelectedSubject={
                                    updateCriteriaToMatchSelectedSubject
                                  }
                                />
                              ) : (
                                <RenderAnySubjects
                                  criteria={criteria}
                                  subjects={subjects}
                                  subjectsWithoutCriteria={
                                    subjectsWithoutCriteria
                                  }
                                  updateSubject={updateSubject}
                                  updateCriteriaToMatchSelectedSubject={
                                    updateCriteriaToMatchSelectedSubject
                                  }
                                />
                              )}
                            </tbody>
                          ))}
                        </Table>
                      </ul>
                    </div>
                    <div className="col-md-12 text-center mt-4">
                      <div>
                        <strong>
                          Based on the information you entered, you{" "}
                          {studentQualifies ? (
                            <h1>
                              <span className="mt-3 mb-3 lead badge badge-lg bg-success">
                                QUALIFY
                              </span>
                            </h1>
                          ) : (
                            <h3>
                              <span className="mt-3 mb-3 lead badge badge-lg bg-danger">
                                DO NOT QUALIFY
                              </span>
                            </h3>
                          )}{" "}
                          for this course!
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
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

export const getServerSideProps = async ({ query }) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/programme?id=${query.id}&uni=${query.uni}`
  );

  const { institution, programme } = response.data;
  console.log(query);
  return {
    props: {
      university: institution,
      programme,
    },
  };
};
