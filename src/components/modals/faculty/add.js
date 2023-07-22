import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";

const AddFacultyModal = ({ show, handleClose, handleAddFaculty }) => {
  const [faculty, setFacultyName] = useState("");
  const [description, setdescription] = useState("");

  const handleFacultyChange = (e) => {
    setFacultyName(e.target.value);
  };

  const handledescriptionChange = (e) => {
    setdescription(e.target.value);
  };

  const saveDetails = () => {
    handleAddFaculty({ name: faculty, description });
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select faculty</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              onChange={handleFacultyChange}
              value={faculty}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="textarea"
              placeholder="Enter short bio"
              onChange={handledescriptionChange}
              value={description}
              rows="6"
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

export default AddFacultyModal;
