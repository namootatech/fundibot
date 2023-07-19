import Head from "next/head";
import Navigation from "@/components/nav";
import styled from "styled-components";

const StyledMain = styled.main`
  height: 100vh;
  width: 100vw;
  background: #032248a1;
`;

const HeroHead = styled.h1`
font-size: 82px;
font-weight: 600;
color: white;
margin-bottom: 1.5rem;
`;

const HeroSubHead = styled.h3`
  font-size: 50px;
  font-weight: 400;
  color: white;
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
  margin-top: 3rem;
  width: 1450px;
  height: 157px;
  background: white;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const StyledInput = styled.input`
  margin: 0px 20px;
  margin-top: 5px;
  width: 85%;
  height: 90%;
  font-size: 42px;
  border: none;
  outline:none;
  padding-left: 10px;
  &::placeholder {
    color: #c2c2c2;
  }
`;

const StyledButton = styled.button`
  background: #eef1f5;
  width: 15%;
  height: 100%;
  border: 2px solid #eef1f5;
  color: #65717e;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  font-size: 52px;
  font-weight: 900;
`;

const LinkButtonContainer = styled.div`
  margin-top: 3rem;
  width: 1050px;
  height: 107px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const LinkButton = styled.a`
  width: 300px;
  height: 100px;
  border-radius: 10px;
  background-color: #fff;
  color: #032248;
  margin-right: 52px;
  text-decoration: none;
  font-size: 30px;
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
        <Hero>
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
        </Hero>
      </StyledMain>
    </>
  );
};