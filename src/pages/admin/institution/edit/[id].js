import Head from "next/head";
import Navigation from "@/components/nav";
import styled from "styled-components";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import { Row } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Cookies from "js-cookie";
import Footer from "@/components/footer";
import FacultyModal from "@/components/modals/faculty/add";
import CampusModal from "@/components/modals/campus/add";
import ContactModal from "@/components/modals/acommodationContacts/add";
import institutionTypes from "@/data/institution_types.json";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { useRouter } from "next/router";
import {
  append,
  assocPath,
  concat,
  cond,
  equals,
  ifElse,
  join,
  pipe,
  slice,
  split,
  when,
  path,
} from "ramda";

const truncate = pipe(
  split(""),
  (a) => (a.length > 100 ? pipe(slice(0, 100), append("..."))(a) : a),
  join("")
);

const StyledMain = styled.main`
  height: auto;
  width: 100vw;
  background: #f3f3f3;
  padding-top: 10rem;
  overflow: auto;
`;

const Mobile = styled.div`
  display: none;
  @media (max-width: 968px) {
    display: block;
  }
`;

const Desktop = styled.div`
  display: none;
  @media (min-width: 969px) {
    display: block;
  }
`;

export const getServerSideProps = async ({ query }) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/university?id=${query.id}`
  );

  return {
    props: {
      university: response.data,
    },
  };
};

const InstitutionForm = ({ university }) => {
  // get logged in user from js-cookie
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
  const router = useRouter();

  const [showFacultyModal, setShowFacultyModal] = useState(false);
  const [showCampusModal, setShowCampusModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [editItems, setEditItems] = useState({
    faculties: null,
    campuses: null,
  });
  const [
    showAddAccommodationContactModal,
    setShowAddAccommodationContactModal,
  ] = useState(false);

  const handleCloseFacultyModal = () => setShowFacultyModal(false);
  const handleShowFacultyModal = () => setShowFacultyModal(true);

  const handleCloseCampusModal = () => setShowCampusModal(false);
  const handleShowCampusModal = () => setShowCampusModal(true);

  const handleCloseAddAccommodationContactModal = () =>
    setShowAddAccommodationContactModal(false);
  const handleShowAddAccommodationContactModal = () =>
    setShowAddAccommodationContactModal(true);

  const toggleModal = cond([
    [equals("faculties"), () => setShowFacultyModal(!showFacultyModal)],
    [equals("campuses"), () => setShowCampusModal(!showCampusModal)],
    [
      equals("accommodation-contacts"),
      () =>
        setShowAddAccommodationContactModal(!showAddAccommodationContactModal),
    ],
  ]);

  const editItem = (type, id) => {
    const itemPath = type.split("-");
    const itemsFromPath = path(itemPath, formData);
    const item = itemsFromPath.find((i) => i.id === id);

    setEditItems({
      ...editItems,
      [type]: item,
    });
    toggleModal(type);
  };

  const deleteItem = (type, id) => {
    const itemPath = type.split("-");
    const itemsFromPath = path(itemPath, formData);
    const itemsWitoutItem = itemsFromPath.filter(
      (typeItem) => typeItem.id !== id
    );
    const updatedFormData = assocPath(itemPath, itemsWitoutItem, formData);
    setFormData(updatedFormData);
  };

  const [formData, setFormData] = useState(
    university || {
      region: "",
      institution: "",
      campusImage: "",
      contact: {
        email: "",
        contactNumber: "",
        website: "",
      },
      type: "public_university",
      address: {
        street: "",
        suburb: "",
        city: "",
        postalCode: "",
        str: "",
      },
      faculties: [],
      campuses: [],
      accommodation: {
        isOffered: false,
        contacts: [],
        pricing: {
          isProvided: false,
          url: "",
        },
        url: "",
      },
      logo: "",
      description: "",
    }
  );

  const addOrEdit = (type) => (item) => {
    const itemPath = type.split("-");
    const itemsFromPath = path(itemPath, formData);
    const itemAlreadyExists = itemsFromPath.find((i) => i.id === item.id);
    const updatedItemList = itemsFromPath.map((dataItem) =>
      dataItem.id === item.id ? item : dataItem
    );
    const updatedFormData = assocPath(
      itemPath,
      itemAlreadyExists ? updatedItemList : [...itemsFromPath, item],
      formData
    );
    setFormData(updatedFormData);
    setEditItems((prevEditItems) => ({
      ...prevEditItems,
      [type]: null,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const path = name.split(".");
    setFormData((prevFormData) => {
      return assocPath(path, value, prevFormData);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Here, you can handle the form submission and perform any necessary actions with the formData
      console.log(formData);
      const data = {
        ...formData,
        modifiers: [
          ...formData.modifiers,
          {
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            date: new Date(),
          },
        ],
      };
      await axios.post(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/institution/update`,
        data
      );
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        { type: "success", message: "Institution updated successfully" },
      ]);
      setTimeout(() => {
        router.push("/admin");
      }, 2000);
    } catch (error) {
      console.log(error);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        { type: "error", message: error.message },
      ]);
    }
  };

  console.log(editItems);

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
        <div className="container my-5">
          <div className="d-flex flex-row">
            <div className="col-6">
              <h2 className="text-dark mb-4">Institution</h2>
            </div>
            <div className="col-6 d-flex flex-row justify-content-end align-items-center">
              <Button href="/admin" as={Link} variant="dark">
                Cancel
              </Button>
            </div>
          </div>
          <p className="lead text-muted">
            As a Data Provider, you play a crucial role in enriching FundiBot's
            database with valuable information about universities, colleges,
            faculties, campuses, and programs. Your contributions will empower
            students across the country to make informed decisions about their
            education and career paths. To get started, please fill in the
            details
          </p>
          <form onSubmit={handleSubmit}>
            <Card className="my-4">
              <Card.Body>
                <h4 className="my-4"> General </h4>
                <div className="row">
                  {/* Institution */}
                  <div className="mb-3 col-md-4">
                    <label htmlFor="institution" className="form-label">
                      Institution Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="institution"
                      name="institution"
                      value={formData.institution}
                      onChange={handleChange}
                    />
                  </div>
                  {/* Region */}
                  <div className="mb-3 col-md-4">
                    <label htmlFor="region" className="form-label">
                      Region
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                    />
                  </div>
                  {/* Type */}
                  <div className="mb-3 col-md-4">
                    <Form.Group controlId="exampleForm.SelectCustom">
                      <Form.Label>Institution Type</Form.Label>
                      <Form.Control as="select" custom>
                        {institutionTypes.map((type) => (
                          <option value={type.id}>{type.name}</option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card className="my-4">
              <Card.Body>
                <h4 className="my-4"> Description </h4>
                {/* Logo */}
                <div className="mb-3">
                  <label htmlFor="logo" className="form-label">
                    Logo
                  </label>
                  <p className="text-muted">
                    Please provide a link to the institution's logo image.
                  </p>
                  <input
                    type="text"
                    className="form-control"
                    id="logo"
                    name="logo"
                    value={formData.logo}
                    onChange={handleChange}
                  />
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                  />
                </div>
              </Card.Body>
            </Card>
            <Row>
              <Col md={6}>
                <Card className="my-4">
                  <Card.Body>
                    <h4 className="my-4"> Contact </h4>
                    <div className="row">
                      {/* Campus Image */}
                      <div className="mb-3 col-md-6">
                        <label htmlFor="campusImage" className="form-label">
                          Campus Image Link
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="campusImage"
                          name="campusImage"
                          value={formData.campusImage}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Contact Email */}
                      <div className="mb-3 col-md-6">
                        <label htmlFor="email" className="form-label">
                          Contact Email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="contact.email"
                          value={formData.contact.email}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Contact Number */}
                      <div className="mb-3 col-md-6">
                        <label htmlFor="contactNumber" className="form-label">
                          Contact Number
                        </label>
                        <input
                          type="tel"
                          className="form-control"
                          id="contactNumber"
                          name="contact.contactNumber"
                          value={formData.contact.contactNumber}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="website" className="form-label">
                          Website
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="website"
                          name="contact.website"
                          value={formData.contact.website}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Website */}
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="my-4">
                  <Card.Body>
                    <h4 className="my-4"> Address </h4>
                    <div className="row">
                      {/* Address Street */}
                      <div className="mb-3 col-md-6">
                        <label htmlFor="street" className="form-label">
                          Address Street
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="street"
                          name="address.street"
                          value={formData.address.street}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Address Suburb */}
                      <div className="mb-3 col-md-6">
                        <label htmlFor="suburb" className="form-label">
                          Address Suburb
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="suburb"
                          name="address.suburb"
                          value={formData.address.suburb}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Address City */}
                      <div className="mb-3 col-md-6">
                        <label htmlFor="city" className="form-label">
                          Address City
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="city"
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Address Postal Code */}
                      <div className="mb-3 col-md-6">
                        <label htmlFor="postalCode" className="form-label">
                          Address Postal Code
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="postalCode"
                          name="address.postalCode"
                          value={formData.address.postalCode}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col md="12" xs="12">
                <Card className="my-4">
                  <Card.Body>
                    <FacultyModal
                      show={showFacultyModal}
                      handleClose={() => toggleModal("faculties")}
                      handleAddFaculty={addOrEdit("faculties")}
                      edit={editItems.faculties}
                    />

                    <h4 className="my-4"> Faculties </h4>
                    <Button variant="primary" onClick={handleShowFacultyModal}>
                      Add Faculty
                    </Button>

                    <Table striped bordered hover dark className="mt-4">
                      <thead className="table-dark">
                        <tr>
                          <th>Faculty Name</th>
                          <th>Faculty Description</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.faculties.length > 0 &&
                          formData.faculties.map((faculty) => (
                            <tr>
                              <td>{faculty.name}</td>
                              <td>{truncate(faculty.description)}</td>
                              <td>
                                <Mobile>
                                  <Button
                                    variant="warning"
                                    size="sm"
                                    className="w-100"
                                    onClick={() =>
                                      editItem("faculties", faculty.id)
                                    }
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    className="w-100 my-1"
                                    onClick={() =>
                                      deleteItem("faculties", faculty.id)
                                    }
                                  >
                                    Delete
                                  </Button>
                                </Mobile>
                                <Desktop>
                                  <Button
                                    variant="warning"
                                    size="sm"
                                    onClick={() =>
                                      editItem("faculties", faculty.id)
                                    }
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="danger"
                                    className="mx-1"
                                    size="sm"
                                    onClick={() =>
                                      deleteItem("faculties", faculty.id)
                                    }
                                  >
                                    Delete
                                  </Button>
                                </Desktop>
                              </td>
                            </tr>
                          ))}
                        {formData.faculties.length === 0 && (
                          <tr colSpan="3">
                            <td colSpan="3" className="text-muted">
                              No faculties added yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card className="my-4">
                  <Card.Body>
                    <CampusModal
                      show={showCampusModal}
                      handleClose={() => toggleModal("campuses")}
                      handleAddCampus={addOrEdit("campuses")}
                      edit={editItems.campuses}
                    />
                    <h4 className="my-4"> Campuses </h4>
                    <Button variant="primary" onClick={handleShowCampusModal}>
                      Add Campus
                    </Button>

                    <Mobile>
                      {formData.campuses.length > 0 &&
                        formData.campuses.map((campus) => (
                          <Table bordered hover dark className="mt-4">
                            <tbody>
                              <tr>
                                <th className="table-dark"> Name</th>
                                <td>{campus.name}</td>
                              </tr>
                              <tr>
                                <th className="table-dark">Contact Number</th>
                                <td>{campus.contactNumber}</td>
                              </tr>
                              <tr>
                                <th className="table-dark">Email</th>
                                <td>{campus.email}</td>
                              </tr>
                              <tr>
                                <th className="table-dark">Address</th>
                                <td>{campus.address.str}</td>
                              </tr>
                              <tr>
                                <th className="table-dark">Actions</th>
                                <td>
                                  <Button
                                    variant="warning"
                                    size="sm"
                                    onClick={() =>
                                      editItem("campuses", campus.id)
                                    }
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="danger"
                                    className="mx-2"
                                    size="sm"
                                    onClick={() =>
                                      deleteItem("campuses", campus.id)
                                    }
                                  >
                                    Delete
                                  </Button>
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        ))}
                      <br />
                      {formData.campuses.length === 0 && (
                        <Table bordered hover dark className="mt-4">
                          <tbody>
                            <tr>
                              <td>No campuses added yet</td>
                            </tr>
                          </tbody>
                        </Table>
                      )}
                    </Mobile>

                    <Desktop>
                      <Table striped bordered hover dark className="mt-4">
                        <thead className="table-dark">
                          <tr>
                            <th> Name</th>
                            <th>Contact Number</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.campuses.length > 0 &&
                            formData.campuses.map((campus) => (
                              <tr>
                                <td>{campus.name}</td>
                                <td>{campus.contactNumber}</td>
                                <td>{campus.email}</td>
                                <td>{campus.address.str}</td>
                                <td>
                                  <Button
                                    variant="warning"
                                    size="sm"
                                    className="w-100"
                                    onClick={() =>
                                      editItem("campuses", campus.id)
                                    }
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="danger"
                                    className="my-2 w-100"
                                    size="sm"
                                    onClick={() =>
                                      deleteItem("campuses", campus.id)
                                    }
                                  >
                                    Delete
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          {formData.campuses.length === 0 && (
                            <tr colSpan="5">
                              <td colSpan="5" className="text-muted">
                                No campuses added yet.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </Desktop>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Card className="my-4">
              <Card.Body>
                <h4 className="my-4"> Accommodation </h4>
                <div className="mb-3">
                  <label
                    htmlFor="isAccommodationOffered"
                    className="form-label"
                  >
                    Does this institution offer accomodation?
                  </label>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="isAccommodationOffered"
                      name="accommodation.isOffered"
                      checked={formData.accommodation.isOffered}
                      onChange={(e) =>
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          accommodation: {
                            ...prevFormData.accommodation,
                            isOffered: e.target.checked,
                          },
                        }))
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor="isAccommodationOffered"
                    >
                      Yes, this institution offers accomodation
                    </label>
                  </div>

                  <ContactModal
                    show={showAddAccommodationContactModal}
                    handleClose={() => toggleModal("accommodation-contacts")}
                    handleAddContact={addOrEdit("accommodation-contacts")}
                    edit={editItems["accommodation-contacts"]}
                  />

                  {formData.accommodation.isOffered && (
                    <div className="my-5">
                      <h4>Contacts</h4>
                      <p className="text-muted">
                        Please add the contact details of the person(s) who
                        manage accommodation at this institution.
                      </p>
                      <Button
                        variant="primary"
                        onClick={handleShowAddAccommodationContactModal}
                      >
                        Add Contact
                      </Button>

                      <Mobile>
                        {formData.accommodation.contacts.length > 0 &&
                          formData.accommodation.contacts.map((contact) => (
                            <Table bordered hover dark className="mt-4">
                              <tbody>
                                <tr>
                                  <th className="table-dark"> Name</th>
                                  <td>{contact.name}</td>
                                </tr>
                                <tr>
                                  <th className="table-dark">Contact Number</th>
                                  <td>{contact.contactNumber}</td>
                                </tr>
                                <tr>
                                  <th className="table-dark">Email</th>
                                  <td>{contact.email}</td>
                                </tr>
                                <tr>
                                  <th className="table-dark">Actions</th>
                                  <td>
                                    <Button
                                      variant="warning"
                                      size="sm"
                                      onClick={() =>
                                        editItem(
                                          "accommodation-contacts",
                                          contact.id
                                        )
                                      }
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      variant="danger"
                                      className="mx-2"
                                      size="sm"
                                      onClick={() =>
                                        deleteItem(
                                          "accommodation-contacts",
                                          contact.id
                                        )
                                      }
                                    >
                                      Delete
                                    </Button>
                                  </td>
                                </tr>
                              </tbody>
                            </Table>
                          ))}
                        <br />
                        {formData.accommodation.contacts.length === 0 && (
                          <Table bordered hover dark className="mt-4">
                            <tbody>
                              <tr>
                                <td>No contacts added yet</td>
                              </tr>
                            </tbody>
                          </Table>
                        )}
                      </Mobile>

                      <Desktop>
                        <Table striped bordered hover dark className="mt-4">
                          <thead className="table-dark">
                            <tr>
                              <th>Name</th>
                              <th>Contact Number</th>
                              <th>Email</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {formData.accommodation.contacts.length > 0 &&
                              formData.accommodation.contacts.map((contact) => (
                                <tr>
                                  <td>{contact.name}</td>
                                  <td>{contact.contactNumber}</td>
                                  <td>{contact.email}</td>
                                  <td>
                                    <Button
                                      variant="warning"
                                      size="sm"
                                      onClick={() =>
                                        editItem(
                                          "accommodation-contacts",
                                          contact.id
                                        )
                                      }
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      variant="danger"
                                      className="mx-2"
                                      size="sm"
                                      onClick={() =>
                                        deleteItem(
                                          "accommodation-contacts",
                                          contact.id
                                        )
                                      }
                                    >
                                      Delete
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            {formData.accommodation.contacts.length === 0 && (
                              <tr colSpan="3">
                                <td colSpan="3" className="text-muted">
                                  No contacts added yet.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </Desktop>

                      {/* Accommodation Application URL */}
                      <div className="my-5">
                        <label
                          htmlFor="accommodationApplicationUrl"
                          className="form-label"
                        >
                          Accommodation Application URL
                        </label>
                        <p className="text-muted">
                          Please provide a link to the accommodation application
                          form.
                        </p>
                        <input
                          type="text"
                          className="form-control"
                          id="accommodationApplicationUrl"
                          name="accommodation.url"
                          value={formData.accommodation.url}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Accommodation Pricing */}
                      <div className="my-5">
                        <label
                          htmlFor="isAccommodationPricingProvided"
                          className="form-label"
                        >
                          Accommodation Pricing Provided
                        </label>
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="isAccommodationPricingProvided"
                            name="accommodation.pricing.isProvided"
                            checked={formData.accommodation.pricing.isProvided}
                            onChange={(e) =>
                              setFormData((prevFormData) => ({
                                ...prevFormData,
                                accommodation: {
                                  ...prevFormData.accommodation,
                                  pricing: {
                                    ...prevFormData.accommodation.pricing,
                                    isProvided: e.target.checked,
                                  },
                                },
                              }))
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor="isAccommodationPricingProvided"
                          >
                            Yes, Accommodation Pricing is Provided
                          </label>
                        </div>
                      </div>

                      {formData.accommodation.pricing.isProvided && (
                        <div className="my-3">
                          <label
                            htmlFor="accommodationPricingUrl"
                            className="form-label"
                          >
                            Accommodation Pricing URL
                          </label>
                          <p className="text-muted">
                            Please provide a link to the accommodation pricing
                            information.
                          </p>
                          <input
                            type="text"
                            className="form-control"
                            id="accommodationPricingUrl"
                            name="accommodation.pricing.url"
                            value={formData.accommodation.pricing.url}
                            onChange={handleChange}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>

            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </StyledMain>
      <Footer />
    </div>
  );
};

export default InstitutionForm;
