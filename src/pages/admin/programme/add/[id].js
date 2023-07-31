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
import { isEmpty, isNil } from "ramda";
import Footer from "@/components/footer";
import { Row, Col, Card } from "react-bootstrap";
import { v4 as uuid4 } from "uuid";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

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

const getSubName = (sub) =>
  schoolSubjects.find((s) => s.code === sub)?.name || sub;

export const getServerSideProps = async ({ query }) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/institution?id=${query.id}`
  );

  const institution = response.data;
  console.log(query);
  return {
    props: {
      university: institution,
      faculty: institution.faculties.find((f) => f.id === query.faculty),
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

const AddSubjectModal = ({
  criteriaId,
  show,
  handleClose,
  handleAddSubject,
  passMark,
}) => {
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState(0);
  const [minimumMarks, setMinimumMarks] = useState(passMark);
  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  useEffect(() => {
    //set level based on pass mark
    const level = Object.entries(levelRanges).find(([level, range]) => {
      return isNaN(minimumMarks)
        ? false
        : minimumMarks >= range[0] && minimumMarks <= range[1];
    })[0];
    setLevel(level);
  }, [minimumMarks]);

  const saveDetails = () => {
    handleAddSubject({ id: subject, level, passMark: minimumMarks });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select subject</Modal.Title>
        <small>{criteriaId}</small>
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
            <Form.Label>Required Pass Mark</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter pass mark"
              onChange={(e) => setMinimumMarks(e.target.value)}
              value={minimumMarks}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Required Level</Form.Label>
            <Form.Control type="number" placeholder="" disabled value={level} />
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

export default function AddProgramme({ university, faculty }) {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [details, setDetails] = useState({});
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(Cookies.get("user") || "{}");

  const handleAddSubject = (subject) => {
    setSubjects([...subjects, subject]);
  };

  const handleClose = () => setShow(false);
  const toggleModal = (criteriaId) => () => {
    setDetails({
      ...details,
      criterias: details.criterias.map((criteria) => {
        if (criteria.id === criteriaId) {
          return {
            ...criteria,
            isShown: !criteria.isShown,
          };
        }
        return criteria;
      }),
    });
  };

  const updateCriteriaSubjects = (criteriaId, subject) => {
    console.log(subject, criteriaId);
    setDetails({
      ...details,
      criterias: details.criterias.map((criteria) => {
        if (criteria.id === criteriaId) {
          return {
            ...criteria,
            isShown: false,
            subjects: [...criteria.subjects, subject],
          };
        }
        return criteria;
      }),
    });
  };

  const updateCriteriaType = (criteriaId) => (e) => {
    setDetails({
      ...details,
      criterias: details.criterias.map((criteria) => {
        if (criteria.id === criteriaId) {
          return {
            ...criteria,
            type: e.target.value,
          };
        }
        return criteria;
      }),
    });
  };

  const updateCriteriaValue = (criteriaId) => (e) => {
    setDetails({
      ...details,
      criterias: details.criterias.map((criteria) => {
        if (criteria.id === criteriaId) {
          return {
            ...criteria,
            value: e.target.value,
          };
        }
        return criteria;
      }),
    });
  };

  const saveProgramme = (e) => {
    e.preventDefault();
    console.log(details);
    const newDetails = {
      ...details,
      careers: details.careers.split(","),
      faculty: faculty.id,
      institution: university._id,
      createdBy: {
        name: user.firstName + " " + user.lastName,
        id: user._id,
      },
      createdAt: new Date(),
    };
    axios
      .post(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/programme/add?id=${university._id}&faculty=${faculty.id}`,
        newDetails
      )
      .then((response) => {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          { type: "success", message: "Institution added successfully" },
        ]);
        setTimeout(() => {
          router.push("/admin");
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          { type: "error", message: error.message },
        ]);
      });
  };

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

      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 1031, position: "fixed" }}
      >
        {notifications.length > 0
          ? notifications.map((notification) => (
              <Toast
                onClose={() => setNotifications([])}
                show={true}
                delay={4000}
                autohide
                bg="light"
              >
                <Toast.Header>
                  <strong
                    className={
                      notification.type === "error"
                        ? "me-auto text-danger text-capitalize"
                        : "me-auto text-capitalize"
                    }
                  >
                    {notification.type}
                  </strong>
                </Toast.Header>
                <Toast.Body>{notification.message}</Toast.Body>
              </Toast>
            ))
          : null}
      </ToastContainer>

      <StyledMain>
        <Container>
          <div className="row w-100">
            <div className="col-md-6">
              <img src={university.logo} width="80%" height="80%" />
            </div>
            <div className="col-md-6 mb-4">
              <Form.Group className="my-4">
                <Form.Label>Programme name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter programme name"
                  value={details.name}
                  onChange={(e) =>
                    setDetails({ ...details, name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="my-4">
                <Form.Label>Programme code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter programme code"
                  value={details.code}
                  onChange={(e) =>
                    setDetails({ ...details, code: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="my-4">
                <Form.Label>SAQA ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter programme code"
                  value={details.saqaId}
                  onChange={(e) =>
                    setDetails({ ...details, saqaId: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="my-4">
                <Form.Label>Programme duration</Form.Label>
                <br />
                <Form.Text>Please provide the duration in months.</Form.Text>
                <Form.Control
                  type="number"
                  placeholder="Enter programme duration in months"
                  value={details.duration?.months}
                  onChange={(e) =>
                    setDetails({
                      ...details,
                      duration: { ...details.duration, months: e.target.value },
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="my-4">
                <Form.Label>
                  Which 4 careers could a student take after completing this
                  course?
                </Form.Label>
                <br />
                <Form.Text>
                  Please provide careers seperate by commas e.g Engineer, Maths
                  Teacher, Manager
                </Form.Text>
                <Form.Control
                  type="text"
                  placeholder="Enter careers"
                  value={details.careers}
                  onChange={(e) =>
                    setDetails({
                      ...details,
                      careers: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Programme Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="6"
                  placeholder="Enter description"
                  value={details.description}
                  onChange={(e) =>
                    setDetails({
                      ...details,
                      description: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>
            <div className="col-md-12 mb-4 card p-4">
              <div className="row">
                <div className="mb-4 mt-4 col-md-4 col-xs-12 card mx-4 text-dark bg-light">
                  <div className="card-body">
                    <h4>Weighted Point Score</h4>
                    <p className="lead">
                      Do this programme have a required weighted point score of
                      admission? If it does please enter it below
                    </p>
                    <Form.Group className="my-4">
                      <Form.Label>WPS</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter WPS"
                        value={details.wps}
                        onChange={(e) =>
                          setDetails({
                            ...details,
                            wps: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </div>
                </div>
                <div className=" mb-4 mt-4 col-md-3 col-xs-12 card mx-4 text-dark bg-light">
                  <div className="card-body">
                    <h4>Faculty Point Score</h4>
                    <p className="lead">
                      Do this programme have a required faculty point score of
                      admission? If it does please enter it below
                    </p>
                    <Form.Group className="my-4">
                      <Form.Label>FPS</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter FPS"
                        value={details.fps}
                        onChange={(e) =>
                          setDetails({
                            ...details,
                            fps: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </div>
                </div>
                <div className=" mb-4 mt-4 col-md-4 col-xs-12 card mx-4 text-dark bg-light">
                  <div className="card-body">
                    <h4>Application Point Score</h4>
                    <p className="lead">
                      Do this programme have a required application point score
                      of admission? If it does please enter it below
                    </p>
                    <Form.Group className="my-4">
                      <Form.Label>APS</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter WPS"
                        value={details.wps}
                        onChange={(e) =>
                          setDetails({
                            ...details,
                            wps: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </div>
                </div>
              </div>
              <div className=" mb-4 mt-4">
                <h4>Admission Criteria</h4>
                <p className="lead">
                  An institution could have eith possible or guaranteed
                  admission criterias or both{" "}
                  <b>
                    please only provide guaranteed admission detail criteria
                  </b>
                </p>
                <Button
                  onClick={(e) =>
                    setDetails({
                      ...details,
                      criterias: [
                        ...(details?.criterias || []),
                        { id: uuid4(), type: "all", value: "", subjects: [] },
                      ],
                    })
                  }
                >
                  {" "}
                  Add Criteria
                </Button>
              </div>

              {details?.criterias?.map((criteria) => (
                <Card className="my-3">
                  <Card.Body>
                    <Table stripped hover>
                      <thead className="table-dark">
                        <tr>
                          <td>Criteria</td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="table-secondary">
                          <td>
                            To qualify for this course the student must pass:{" "}
                            <Form.Control
                              size="sm"
                              as="select"
                              onChange={updateCriteriaType(criteria.id)}
                            >
                              <option value="all">All</option>
                              <option value="any">Any</option>
                            </Form.Control>
                          </td>
                        </tr>
                        <tr>
                          <td> of the below subjects with a minimum of</td>
                        </tr>
                        <tr>
                          <td>
                            <AddSubjectModal
                              criteriaId={criteria.id}
                              show={criteria.isShown}
                              handleClose={toggleModal(criteria.id)}
                              handleAddSubject={(subject) =>
                                updateCriteriaSubjects(criteria.id, subject)
                              }
                              passMark={criteria.value}
                            />
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={toggleModal(criteria.id)}
                            >
                              Add subject
                            </Button>
                          </td>
                        </tr>

                        {!isEmpty(criteria.subjects) &&
                          !isNil(criteria.subjects) && (
                            <tr>
                              <td colSpan={1}>
                                <Table stripped hover>
                                  <thead className="table-info">
                                    <tr>
                                      <td>Subject</td>
                                      <td>Level</td>
                                      <td> Action </td>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {criteria.subjects.map((subject) => (
                                      <tr>
                                        <td>{getSubName(subject.id)}</td>
                                        <td>{subject.level}</td>
                                        <td>
                                          <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() =>
                                              setDetails({
                                                ...details,
                                                criterias:
                                                  details.criterias.map((c) => {
                                                    if (c.id === criteria.id) {
                                                      return {
                                                        ...c,
                                                        subjects:
                                                          c.subjects.filter(
                                                            (sub) =>
                                                              sub.id !==
                                                              subject.id
                                                          ),
                                                      };
                                                    }
                                                    return c;
                                                  }),
                                              })
                                            }
                                          >
                                            Remove
                                          </Button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              </td>
                            </tr>
                          )}
                      </tbody>
                    </Table>
                  </Card.Body>
                  <Card.Footer>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() =>
                        setDetails({
                          ...details,
                          criterias: details.criterias.filter(
                            (c) => c.id !== criteria.id
                          ),
                        })
                      }
                    >
                      Remove Criteria
                    </Button>
                  </Card.Footer>
                </Card>
              ))}
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <Button
              variant="primary"
              className="my-4 mx-3"
              onClick={(e) => saveProgramme(e)}
            >
              Save programme
            </Button>
            <Button
              variant="dark"
              className="my-4"
              onClick={(e) => {
                console.log(details);
              }}
            >
              Cancel
            </Button>
            <br />
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
