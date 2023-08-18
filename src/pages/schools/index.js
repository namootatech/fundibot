import Head from "next/head";
import Navigation from "@/components/nav";
import styled from "styled-components";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "@/components/footer";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from "react-device-detect";
import BsCard from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import schoolsData from "@/data/schools.json";
import provinces from "@/data/provinces.json";
import { Form, Pagination, Row, Table, Col } from "react-bootstrap";
import {
  uniq,
  assoc,
  sortBy,
  identity,
  prop,
  map,
  compose,
  indexOf,
  findIndex,
  propEq,
} from "ramda";

import Fuse from "fuse.js";

const sortStrings = sortBy(identity);

const addId = (items) => items.map((s, i) => assoc("id", i, s));

const sortByName = sortBy(prop("name"));

const sortByNameWithId = compose(addId, sortByName);

const originalSchools = schoolsData
  .sort((a, b) => parseInt(b.registrationDate) - parseInt(a.registrationDate))
  .map((s) => assoc("name", s.name.toLowerCase(), s));

const options = {
  includeScore: true,
  minMatchCharLength: 3,
  threshold: 0.5,
  distance: 50,
  keys: ["name"],
};

const fuse = new Fuse(originalSchools, options);

const StyledMain = styled.main`
  height: auto;
  width: 100vw;
  background: #f4f4f4;
  padding-top: 10rem;
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

const getProvinceName = (id) => provinces.find((p) => p.code === id)?.name;

export default function Home(props) {
  const [pageSchools, setPageSchools] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [schools, setSchools] = useState(
    originalSchools.map((s, i) => assoc("id", i, s))
  );
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [filterValue, setFilterValue] = useState(null);
  const [schoolName, setSchoolName] = useState(null);
  const [filterOpened, setFilterOpened] = useState(false);

  const toggleFilterOpened = () => {
    setFilterOpened(!filterOpened);
  };

  const pages = Object.keys([
    ...Array(Math.round(schools.length / pageSize)),
  ]).map((i) => parseInt(i) + 1);

  console.log(pages);

  useEffect(() => {
    setPageSchools(schools.slice(page * pageSize - pageSize, page * pageSize));
  }, [schools]);

  useEffect(() => {
    if (setSelectedFilter) {
      setPage(1);
    }
  }, [selectedFilter]);
  const viewPage = (p) => {
    setPageSchools(schools.slice(p * pageSize - pageSize, p * pageSize));
    setPage(p);
  };

  const changePageSize = (e) => {
    console.log("chaning page size", e.target.value);
    const newSize = e.target.value;
    setPageSize(newSize);
    setPageSchools(schools.slice(page * newSize - newSize, page * newSize));
  };

  const filterByProvince = (e) => {
    const prov = e.target.value;
    const newSchools = originalSchools.filter((s) => s.province === prov);
    setSchools(sortByNameWithId(newSchools));
    setSelectedFilter("province");
    setFilterValue(getProvinceName(prov) ? getProvinceName(prov) : prov);
  };

  const filterByYear = (e) => {
    const yr = e.target.value;
    const newSchools = originalSchools.filter((s) => s.registrationDate === yr);
    setSchools(sortByNameWithId(newSchools));
    setSelectedFilter("year");
    setFilterValue(yr);
  };

  const filterByCity = (e) => {
    const cty = e.target.value;
    const newSchools = originalSchools.filter((s) => s.city === cty);
    setSchools(sortByNameWithId(newSchools));
    setSelectedFilter("city");
    setFilterValue(cty);
  };

  const seacrh = (val) => {
    const result = fuse.search(val);
    console.log("result", result);
    setSchools(sortByNameWithId(result));
    setSelectedFilter("school name");
    setFilterValue(val);
  };

  const debounceSearch = (func, delay) => {
    let debounceTimer;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const years = uniq(originalSchools.map((s) => s.registrationDate));
  const cities = sortBy(identity, uniq(originalSchools.map((s) => s.city)));
  return (
    <div>
      <Head>
        <title>
          Explore Your Educational Journey with Fundi Bot - Find the Best
          Colleges & Courses
        </title>
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
              <h1 className="display-4">Schools </h1>
              <p className="lead my-4">
                Find a list of all the registered schools in South Africa
              </p>
              <Mobile>
                <Button
                  variant="primary"
                  className="my-4"
                  onClick={toggleFilterOpened}
                  size="sm"
                >
                  {filterOpened ? "Close Filters" : "Open Filters"}
                </Button>
              </Mobile>
            </div>
            {filterOpened && (
              <Mobile>
                <div className="d-flex flex-column">
                  <Col md={2} xs={12} className="py-3">
                    <Form.Label>Select Page Size</Form.Label>
                    <Form.Control
                      as="select"
                      onChange={changePageSize}
                      selected={pageSize}
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </Form.Control>
                  </Col>
                  <Col md={3} xs={12} className="py-3">
                    <Form.Label>Search school</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter school name"
                      onChange={(e) => {
                        setSchoolName(e.target.value);
                        debounceSearch(seacrh(e.target.value), 300);
                      }}
                    />
                  </Col>
                  <Col md={3} xs={12} className="py-3">
                    <Form.Label>Find by city</Form.Label>
                    <Form.Control type="text" placeholder="Enter school name" />
                  </Col>
                  <Col md={2} xs={12} className="py-3">
                    <Form.Label>Filter by province</Form.Label>
                    <Form.Control as="select" onChange={filterByProvince}>
                      {provinces.map((p) => (
                        <option value={p.code}>{p.name}</option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2} xs={12} className="py-3">
                    <Form.Label>Filter by year</Form.Label>
                    <Form.Control as="select" onChange={filterByYear}>
                      {years.map((y) => (
                        <option value={y}>{y}</option>
                      ))}
                    </Form.Control>
                  </Col>
                </div>
              </Mobile>
            )}
            <Desktop>
              <div className="d-flex flex-row">
                <Col md={2} xs={12} className="bg-secondary text-light  p-3">
                  <Form.Label>Select Page Size</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={changePageSize}
                    selected={pageSize}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </Form.Control>
                </Col>
                <Col md={3} xs={12} className="bg-secondary text-light  p-3">
                  <Form.Label>Search school</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter school name"
                    onChange={(e) => {
                      setSchoolName(
                        e.target.value ? e.target.value.toLowerCase() : ""
                      );
                      debounceSearch(
                        seacrh(
                          e.target.value ? e.target.value.toLowerCase() : ""
                        ),
                        1000
                      );
                    }}
                    value={schoolName}
                  />
                </Col>
                <Col md={3} xs={12} className="bg-secondary text-light  p-3">
                  <Form.Label>Find by city</Form.Label>
                  <Form.Control as="select" onChange={filterByCity}>
                    {cities.map((y) => (
                      <option value={y}>{y}</option>
                    ))}
                  </Form.Control>
                </Col>
                <Col md={2} xs={12} className="bg-secondary text-light  p-3">
                  <Form.Label>Filter by province</Form.Label>
                  <Form.Control as="select" onChange={filterByProvince}>
                    {provinces.map((p) => (
                      <option value={p.code}>{p.name}</option>
                    ))}
                  </Form.Control>
                </Col>
                <Col md={2} xs={12} className="bg-secondary text-light p-3">
                  <Form.Label>Filter by year</Form.Label>
                  <Form.Control as="select" onChange={filterByYear}>
                    {years.map((y) => (
                      <option value={y}>{y}</option>
                    ))}
                  </Form.Control>
                </Col>
              </div>
            </Desktop>
            <div className="col-md-12 my-4">
              <div className="my-2 text-muted">
                {selectedFilter && (
                  <small>
                    Showing schools for the {selectedFilter} of {filterValue}
                  </small>
                )}
              </div>
              <Table bordered hover dark>
                <thead className="table-secondary">
                  <tr>
                    <th>Name</th>
                    <th>City</th>
                    <th>Province</th>
                    <th>Opened</th>
                  </tr>
                </thead>
                <tbody>
                  {pageSchools.map((s) => (
                    <tr>
                      <td style={{ textTransform: "capitalize" }}>
                        {" " + s?.name?.toLowerCase()}
                      </td>
                      <td style={{ textTransform: "capitalize" }}>
                        {s.city.toLowerCase()}
                      </td>
                      <td>
                        {getProvinceName(s.province)
                          ? getProvinceName(s.province)
                          : s.province}
                      </td>
                      <td>{s.registrationDate}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <Col md={4} xs={12}>
              <Pagination>
                <Pagination.First onClick={() => viewPage(1)} />
                <Pagination.Prev
                  onClick={() => viewPage(page - 1 === 0 ? 1 : page - 1)}
                />
                {pages.slice(page - 1, page + 3).map((p) => (
                  <Pagination.Item
                    className="table-dark"
                    linkClassName={page === p ? "bg-dark text-light" : ""}
                    active={page === p}
                    onClick={() => viewPage(p)}
                  >
                    {p}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => viewPage(page + 1)} />
                <Pagination.Last onClick={() => viewPage(pages.length)} />
              </Pagination>
            </Col>
          </div>
          <div className="col-md-6">
            <p> </p>
          </div>
        </Container>
      </StyledMain>
      <Footer />
    </div>
  );
}
