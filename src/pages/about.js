import Head from "next/head";
import Navigation from "@/components/nav";
import styled from "styled-components";
import Footer from "@/components/footer";

const StyledMain = styled.main`
  height: auto;
  width: 100vw;
  background: #fff;
  padding-top: 20rem;
  .entry {
    font-size: 50px;
    font-weight: 100;
    margin-top: 2rem;
  }
  p {
    font-size: 45px;
    font-weight: 100;
    margin-top: 3rem;
    color: #042248;
  }
  h1 {
    font-size: 10rem;
    color: #042248;
  }
  h2 {
    font-size: 5rem;
    color: #042248;
  }
`;

const Container = styled.div`
  margin: 0rem 12rem;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
`;

const Button = styled.button`
  background: #032248;
  color: white;
  border-radius: 10px;
  width: 15rem;
  height: 4rem;
  font-size: 16px;
  margin-bottom: 2rem;
`;

export default function About(props) {
  return (
    <>
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
        <div className="container">
          <div className="row w-100">
            <div className="col-md-12">
              <h1>Empowering Education, Enriching Lives</h1>
              <p className="entry">
                Welcome to FundiBot, where innovation meets education, and
                learning knows no bounds! Founded with a passion for
                transforming the way students access higher education
                information, FundiBot is on a mission to empower learners
                nationwide and enrich their academic journeys.
              </p>
              <p>
                Our platform is designed to help you find the right university
                or college for your needs. We provide detailed information on
                each institution, including their location, contact details,
                courses offered, and more. You can also use our search filters
                to narrow down your options and find the perfect fit.
              </p>
              <br />
              <br />
              <h2>Our Vision</h2>
              <p>
                Our Vision At FundiBot, we envision a world where education is
                accessible, personalized, and empowering for every learner. We
                believe that knowledge should not be confined to the pages of
                textbooks but should thrive in a dynamic, interactive, and
                inclusive learning ecosystem. Our vision is to revolutionize the
                educational landscape, making educational exploration enjoyable,
                effortless, and inspiring.
              </p>
              <br />
              <br />
              <h2>Our Mission</h2>
              <p>
                Our mission is simple yet profound: to guide and support
                learners at every stage of their education journey. We strive to
                provide learners with comprehensive, up-to-date, and accurate
                information about higher education institutions, courses, and
                programs. FundiBot is not just an AI-powered chatbot; it's your
                trusted ally, dedicated to nurturing your growth and helping you
                make informed decisions about your future.
              </p>{" "}
              <br />
              <h2>Empowering Student Journeys</h2>
              <p>
                At the heart of FundiBot lies a deep understanding of the
                challenges students face when navigating the world of higher
                education. With the support and expertise of Ilithiyana
                Academics, FundiBot has been tailored to provide valuable
                insights and personalized guidance, ensuring that students make
                informed decisions about their academic pursuits.
              </p>
              <br />
              <br />
              <h2>Our Tech Innovators</h2>
              <p>
                At FundiBot, we are proud to be backed by the expertise and
                dedication of the Midas Touch Technologies team, a dynamic tech
                solutions entity based in the heart of the Eastern Cape.
                Together, we form a dynamic alliance that blends cutting-edge
                technology with a passion for transforming education.
                <br />
                <br />
                Midas Touch Technologies is home to a team of brilliant tech
                innovators who are driven by a shared vision to create
                meaningful solutions that make a difference. With a wealth of
                experience and a keen eye for innovation, our tech wizards bring
                to life the seamless user experience that powers FundiBot.
              </p>
              <br />
              <br />
              <br />
              <h2>Unlock Your Educational Potential with FundiBot!</h2>
              <br/>
              <br/>
            </div>
          </div>
          <div className="col-md-6">
          </div>
        </div>
      </StyledMain>
      <Footer />
    </>
  );
}
