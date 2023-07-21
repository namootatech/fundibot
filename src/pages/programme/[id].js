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

const getSubName = (sub) =>
  schoolSubjects.find((s) => s.code === sub)?.name || sub;

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

const levelRanges = {
  1: [0, 30],
  2: [30, 39],
  3: [40, 49],
  4: [50, 59],
  5: [60, 69],
  6: [70, 79],
  7: [80, 100],
};

const AddSubjectModal = ({ show, handleClose, handleAddSubject }) => {
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState(0);
  const [passMark, setPassMark] = useState(50);

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const handlePassMarkChange = (e) => {
    setPassMark(e.target.value);
  };

  useEffect(() => {
    //set level based on pass mark
    const level = Object.entries(levelRanges).find(([level, range]) => {
      return passMark >= range[0] && passMark <= range[1];
    })[0];
    setLevel(level);
  }, [passMark]);

  const saveDetails = () => {
    handleAddSubject({ id: subject, level, passMark });
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select subject</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Subject</Form.Label>
            <Form.Control
              as="select"
              onChange={handleSubjectChange}
              value={subject}
            >
              <option value="">Select subject</option>
              {schoolSubjects.map((sub) => (
                <option value={sub.code}>{sub.name}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Pass Mark</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter pass mark"
              onChange={handlePassMarkChange}
              value={passMark}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={saveDetails}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default function Home({ university, programme }) {
  const [show, setShow] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [studentQualifies, setStudentQualifies] = useState(false);

  const handleAddSubject = (subject) => {
    setSubjects([...subjects, subject]);
  };

  const handleClose = () => setShow(false);
  const toggleModal = () => setShow(!show);
  console.log(programme);

  const guranteedAdmissionCriteria = programme.subjectCriteria.find(
    (c) => c.type === "guaranteed"
  ).subjects;
  console.log("guranteedAdmissionCriteria", guranteedAdmissionCriteria);
  const meetsSubjectCriteria = (criteria) => {
    console.log("-----");
    console.log(
      "Checking criteria: select",
      criteria.select,
      "from",
      criteria.from,
      "level",
      criteria.level
    );
    const requiredNumOfSubjects = criteria.select;
    const subjectOptions = criteria.from;
    const requiredSubjectLevel = criteria.level;
    const studentHasAnyRequiredSubjects =
      subjects.filter((s) => subjectOptions.includes(s.id)).length >=
      requiredNumOfSubjects;
    const studentHasRequiredSubjectLevel =
      subjects.filter(
        (s) => subjectOptions.includes(s.id) && s.level >= requiredSubjectLevel
      ).length >= requiredNumOfSubjects;
    console.log("qualifying subjects");
    console.log(
      subjects.filter(
        (s) => subjectOptions.includes(s.id) && s.level >= requiredSubjectLevel
      )
    );
    return studentHasAnyRequiredSubjects && studentHasRequiredSubjectLevel;
  };

  useEffect(() => {
    console.log(subjects);
    const criteriaEvaluation = guranteedAdmissionCriteria.map((c) =>
      meetsSubjectCriteria(c)
    );
    console.log("criteriaEvaluation", criteriaEvaluation);
    setStudentQualifies(criteriaEvaluation.every((c) => c === true));
  }, [subjects]);

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
              {!isEmpty(subjects) && (
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
                      <div className="col-md-6 mt-4">
                        <p className="text-center mt-4">
                          To qualify for this course, you need to meet the
                          following criteria:
                        </p>
                        <ul>
                          {guranteedAdmissionCriteria.map((c, index) => (
                            <Table stripped bordered size="sm">
                              <thead className="table-dark">
                                <tr>
                                  <th>Criteria {index + 1}</th>
                                </tr>
                              </thead>
                              <thead className="table-secondary">
                                <tr>
                                  <th>
                                    {c.select} of these subjects at level{" "}
                                    {c.level} and above
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {c.from.map((s) => (
                                  <tr>
                                    <td>{getSubName(s)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          ))}
                        </ul>
                      </div>
                      <div className="col-md-6 mt-4">
                        <p className="text-center mt-4">
                          Based on the subject you entered, here's how you match
                          up:
                        </p>
                        <ul>
                          {guranteedAdmissionCriteria.map((c, index) => (
                            <Table stripped bordered size="sm">
                              <thead className="table-dark">
                                <tr>
                                  <th>Criteria {index + 1}</th>
                                </tr>
                              </thead>
                              {subjects.filter(
                                (s) =>
                                  c.from.includes(s.id) && s.level >= c.level
                              ).length >= c.select ? (
                                <tr className="table-success">
                                  <td>
                                    {subjects
                                      .filter(
                                        (s) =>
                                          c.from.includes(s.id) &&
                                          s.level >= c.level
                                      )
                                      .map((s) => (
                                        <p>
                                          <BsFillCheckSquareFill
                                            size="1.5rem"
                                            color="green"
                                          />{" "}
                                          {getSubName(s.id)} at level {s.level}
                                        </p>
                                      ))}
                                  </td>
                                </tr>
                              ) : (
                                <tr>
                                  <td>
                                    <FaWindowClose size="2rem" color="red" />
                                    None
                                  </td>
                                </tr>
                              )}
                            </Table>
                          ))}
                        </ul>
                      </div>
                      <div className="col-md-12 text-center mt-4">
                        <p>
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
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <p className="text-muted"> FundiBot by Midas Touch Technologies</p>
          </div>
          <br />
          <br />
        </Container>
      </StyledMain>
      <Footer/>
    </>
  );
}

/*

                        

                        
                        */
