import { Helmet } from "react-helmet-async";
import "./styles/about.css";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutWhatWeDo } from "@/components/about/AboutWhatWeDo";
import { AboutMissionVision } from "@/components/about/AboutMissionVision";
import { AboutWhy } from "@/components/about/AboutWhy";
import { AboutCommitment } from "@/components/about/AboutCommitment";

export function About() {
  return (
    <>
      <Helmet>
        <title>About Us | LetsHyre</title>
        <meta
          name="description"
          content="LetsHyre is an AI-powered hiring platform redefining the recruitment process with intelligent candidate screening and role-based AI interviews."
        />
      </Helmet>

      <main className="about-page-container">
        <div className="about-content-wrapper">
          <AboutHero />
          <AboutWhatWeDo />
          <AboutMissionVision />
          <AboutWhy />
          <AboutCommitment />
        </div>
      </main>
    </>
  );
}
