import { Fragment, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import schoolSubjects from "@/data/south_african_hischool_subjects_json.json";
import { BsFillCheckSquareFill } from "react-icons/bs";
import { FaWindowClose } from "react-icons/fa";
import { isEmpty, isNil } from "ramda";
import { v4 as uuid4 } from "uuid";

export const getSubName = (sub) =>
  schoolSubjects.find((s) => s.code === sub)?.name || sub;

const levelRanges = {
  1: [0, 30],
  2: [30, 39],
  3: [40, 49],
  4: [50, 59],
  5: [60, 69],
  6: [70, 79],
  7: [80, 100],
};

export const AddSubjectModal = ({ show, handleClose, handleAddSubject }) => {
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
    handleAddSubject({ id: subject, level, passMark, uid: uuid4() });
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

export const SelectSubjectModal = ({
  show,
  handleClose,
  handleSelectSubject,
  subjects,
}) => {
  const [subject, setSubject] = useState("");

  const handleSubjectChange = (e) => {
    const subjectId = e.target.value;
    const subject = subjects.find((s) => s.id === subjectId);
    setSubject(subject);
  };

  const saveDetails = () => {
    handleSelectSubject(subject);
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
              value={subject.id}
            >
              <option value="">Select subject</option>
              {subjects.map((sub) => (
                <option value={sub.id}>{getSubName(sub.id)}</option>
              ))}
            </Form.Control>
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

export const RenderAllSubjects = ({
  criteria,
  subjects,
  isOrBlock,
  subjectsWithoutCriteria,
  updateCriteriaToMatchSelectedSubject,
  updateSubject,
}) => {
  const [show, setShow] = useState(false);

  const handleSelectSubject = (oldSubject) => (subject) => {
    updateCriteriaToMatchSelectedSubject(oldSubject, subject, criteria);
  };

  return criteria.subjects.map((sub) => {
    let studentSubject = subjects.find((s) => s.id === sub.id);
    const acquiredLevel = !isNil(studentSubject) ? studentSubject.level : 0;
    const levelMatches = acquiredLevel >= sub.level;

    return (
      <Fragment>
        <SelectSubjectModal
          show={show}
          handleClose={() => setShow(false)}
          handleSelectSubject={handleSelectSubject(sub)}
          subjects={subjectsWithoutCriteria}
        />
        <tr
          className={
            levelMatches
              ? `${isOrBlock ? "or-block" : ""} table-success text-white`
              : `${isOrBlock ? "or-block" : ""}  text-white table-danger`
          }
        >
          <td>
            {levelMatches ? (
              <BsFillCheckSquareFill className="text-success mx-4" />
            ) : (
              <FaWindowClose className="text-danger mx-4" />
            )}
            {getSubName(isNil(studentSubject) ? sub.id : studentSubject.id)}
            {sub.id === "any-000" && (
              <Button size="sm" className="mx-4" onClick={() => setShow(true)}>
                Select
              </Button>
            )}
          </td>
          <td>{acquiredLevel}</td>
          <td>{sub.level}</td>
        </tr>
      </Fragment>
    );
  });
};

export const RenderAnySubjects = ({
  criteria,
  subjects,
  subjectsWithoutCriteria,
  updateSubject,
  updateCriteriaToMatchSelectedSubject,
}) => {
  const subjectsThatAreInCriteria = subjects.filter(
    (s) => criteria.subjects.find((c) => c.id === s.id) !== undefined
  );
  if (isEmpty(subjectsThatAreInCriteria)) {
    return (
      <RenderAllSubjects
        criteria={criteria}
        subjects={subjects}
        subjectsWithoutCriteria={subjectsWithoutCriteria}
        updateSubject={updateSubject}
        updateCriteriaToMatchSelectedSubject={
          updateCriteriaToMatchSelectedSubject
        }
        isOrBlock={true}
      />
    );
  }
  return subjectsThatAreInCriteria.map((sub) => {
    const levelMatches =
      sub.level >= criteria.subjects.find((c) => c.id === sub.id).level;
    if (!sub.hasBeenAssesed) {
      updateSubject({ ...sub, hasBeenAssesed: true });
    }
    return (
      <tr
        className={
          levelMatches
            ? "or-block table-success text-white"
            : "or-block text-white table-danger"
        }
      >
        <td>
          {levelMatches ? (
            <BsFillCheckSquareFill className="text-success mx-4" />
          ) : (
            <FaWindowClose className="text-danger mx-4" />
          )}
          {getSubName(sub.id)}
        </td>
        <td>{sub.level}</td>
        <td>{criteria.subjects.find((c) => c.id === sub.id).level}</td>
      </tr>
    );
  });
};
