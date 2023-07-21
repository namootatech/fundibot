// create a  Nav component

import React, { Fragment } from "react";
import { Link } from "next/router";
import { Nav, Navbar } from "react-bootstrap";
import Image from "next/image";
import styled from "styled-components";
import { useState } from "react";
import Cookies from "js-cookie";
import { isEmpty, isNil } from "ramda";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NavDropdown from "react-bootstrap/NavDropdown";
import { BsLinkedin } from "react-icons/bs";
import { BsInstagram } from "react-icons/bs";
import { BsTwitter } from "react-icons/bs";
import { BsFacebook } from "react-icons/bs";

const Footer = () => {
  return (
    <div class="d-flex flex-column h-100">
      <section class="hero text-white py-5 flex-grow-1">
        <div class="container py-4">
          <div class="row">
            <div class="col-lg-6">
              <h1 class="display-4">Education Advocates</h1>
              <p class="lead text-light">
                We believe in the transformative power of education and its
                ability to shape a brighter future for individuals and society
                as a whole. As education advocates, we are driven by the desire
                to make quality information accessible to all students, ensuring
                they can make informed decisions about their academic pursuits.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer class="w-100 py-4 flex-shrink-0">
        <div class="container py-4">
          <div class="row gy-4 gx-5">
            <div class="col-lg-4 col-md-6">
              <h5 class="h1 text-white">FUNDIBOT</h5>
              <p class="small text-light">
                FundiBot is your dedicated educational companion, providing
                personalized learning recommendations, interactive quizzes, and
                progress tracking for high school students. Our mission is to
                empower learners nationwide on their educational journey
              </p>
              <p class="small text-light mb-0">
                &copy; Copyrights. All rights reserved.{" "}
                <a class="text-primary" href="#">
                  fundibot.touch.net.za
                </a>
              </p>
            </div>
            <div class="col-lg-2 col-md-6">
              <h5 class="text-white mb-3">Quick links</h5>
              <ul class="list-unstyled text-light">
                <li className="mb-2 text-light">
                  <a href="/">Home</a>
                </li>
                <li className="mb-2 text-light">
                  <a href="/about">About</a>
                </li>
                <li className="mb-2 text-light">
                  <a href="/admin/register">Provider Signup</a>
                </li>
                <li className="mb-2 text-light">
                  <a href="/admin/login">Provider Login</a>
                </li>
              </ul>
            </div>
            <div class="col-lg-2 col-md-6">
              <h5 class="text-white mb-3">Midas Touch</h5>
              <ul class="list-unstyled text-light">
                <li className="mb-2">
                  <a href="https://touch.net.za">www.touch.net.za</a>
                </li>
                <li className="mb-2">
                  <a href="mailto:aya@touch.net.za">aya@youch.net.za</a>
                </li >
                <li className="mb-2">
                  <a href="tel:0672023083">+27 67 202 3083</a>
                </li>
                <li className="mb-2">
                  <a href="#">Contribute</a>
                </li>
              </ul>
            </div>
            <div class="col-lg-4 col-md-6">
              <h5 class="text-white mb-3">Connect with us</h5>
              <p class="small text-light">
              Stay updated on the latest educational news, inspiring stories, and platform updates by following us on social media.
              </p>
                <ul class="list-inline mb-0">
                    <li class="list-inline-item">
                        <a href="https://www.facebook.com/FundiBot-100105632233622">
                            <BsFacebook />
                        </a>
                    </li>
                    <li class="list-inline-item">
                        <a href="https://twitter.com/FundiBot">
                            <BsTwitter />
                        </a>
                    </li>
                    <li class="list-inline-item">
                        <a href="https://www.instagram.com/fundibot/">
                           <BsInstagram />
                        </a>
                    </li>
                    <li class="list-inline-item">
                        <a href="https://www.linkedin.com/company/fundibot">
                            <BsLinkedin />  
                        </a>
                    </li>
                </ul>

            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
