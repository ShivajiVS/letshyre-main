import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import Candidate from "@/components/landing/Candidate";
import Video_section from "@/components/landing/Video-part";
import TestimonialsSection from "@/components/landing/Testimonials";
import HireCard from "@/components/landing/hireCard";

import { Assistance } from "@/components/landing/Assistance";
import { ScoreCard } from "@/components/landing/ScoreCard";
import { QuestionArea } from "@/components/landing/Question_Area";

import Footer from "@/components/landing/Footer";
import Hero2 from "@/components/landing/hero2";

export function Landing() {
  return (
    <>
      <Navbar />
      <Hero2 />
      {/* <Hero /> */}
      <Assistance />
      <Candidate />
      <Video_section />
      <ScoreCard />
      <QuestionArea />
      <TestimonialsSection />
      <HireCard />
      <Footer />
    </>
  );
}
