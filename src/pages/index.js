import Head from "next/head";
import Navigation from "@/components/nav";
import styled from "styled-components";
import Image from "next/image";
import Footer from "@/components/footer";

const StyledMain = styled.main`
  height: 100vh;
  width: 100vw;
  background: #212529eb;
  margin-top: 6rem;
  @media (max-width: 768px) {
    padding-top: 10rem;
  }
`;

const HeroHead = styled.h1`
  font-size: 3rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1.5rem;
  @media (max-width: 768px) {
        font-size: 1.5rem;
  }
`;

const HeroSubHead = styled.h3`
  font-size: 1.5rem;
  font-weight: 400;
  color: white;
  @media (max-width: 768px) {
        font-size: .7rem;
  }
`;

const Hero = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const StyledInputContainer = styled.div`
  margin-top: 1rem;
    width: 50rem;
    height: 5rem;
  background: white;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  @media (max-width: 768px) {
            width: 80vw;
    height: 4rem;
  }
`;

const StyledInput = styled.input`
  margin: 0px 10px;
  margin-top: 5px;
  width: 85%;
  height: 90%;
  font-size: 22px;
  border: none;
  outline: none;
  padding-left: 10px;
  &::placeholder {
    color: rgba(230, 230, 230, 1);
  }
  @media (max-width: 768px) {
    margin-left: 0;
    width: 70%;
  }
`;

const StyledButton = styled.button`
background: #12c085;
width: 10%;
height: 70%;
border: 4px solid #12c085;
color: #eee;
font-size: 16px;
font-weight: 900;
border-radius: 10px;
@media (max-width: 768px) {
  width: 20% !important;
  border-radius: 10px !important;
}
`;

const LinkButtonContainer = styled.div`
  width: 1050px;
  height: 107px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  @media (max-width: 768px) {
    width: 100%;
    height: 35vh;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    margin-top: 40px;
    margin-bottom: 40px;
  }
`;

const LinkButton = styled.a`
width: 8rem;
height: 3rem;
border-radius: 10px;
border: 3px solid #fff;
color: #fff;
margin-right: 25px;
text-decoration: none;
font-size: 1rem;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
`;

const navItems = [
  { name: "Universities", href: "/universities" },
  { name: "Colleges", href: "/universities" },
  { name: "Courses", href: "/courses" },
  { name: "Schools", href: "/schools" },
];

export default function Home(props) {
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
        <div className="d-flex flex-column justify-content-center align-items-center w-100 h-100" >
          <Image src="/icon.png" width={150} height={150} />
          <HeroHead>Discover your path</HeroHead>
          <HeroSubHead>with personalized learning recommendations</HeroSubHead>
          <StyledInputContainer>
            <StyledInput placeholder="Search for institution or course e.g Bsc Geology" />
            <StyledButton>GO</StyledButton>
          </StyledInputContainer>
          <LinkButtonContainer>
            {navItems.map((n) => (
              <LinkButton href={n.href}>{n.name}</LinkButton>
            ))}
          </LinkButtonContainer>
        </div>
        
      </StyledMain>
      <Footer />
      
    </>
  );
}
