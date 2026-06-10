import { Helmet } from "react-helmet-async";

import { Hero2 } from "@/components/landing/Hero2";
import { Assistance } from "@/components/landing/Assistance";
import { Candidate } from "@/components/landing/Candidate";
import { VideoSection } from "@/components/landing/Video-part";
import { ScoreCard } from "@/components/landing/ScoreCard";
import { QuestionArea } from "@/components/landing/QuestionArea";
import { Testimonials } from "@/components/landing/Testimonials";
import { HireCard } from "@/components/landing/HireCard";

/* ─── JSON-LD Structured Data ─── */
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "LetsHyre",
  url: "https://letshyre.com",
  logo: "https://letshyre.com/logo.png",
  sameAs: [
    "https://www.linkedin.com/company/letshyre",
    "https://twitter.com/letshyre",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Support",
    url: "https://letshyre.com",
    availableLanguage: "English",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "LetsHyre",
  url: "https://letshyre.com",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://letshyre.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "LetsHyre",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "AI-powered hiring platform that automates resume evaluation, AI interviews, and candidate verification for modern HR teams.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "120",
    bestRating: "5",
    worstRating: "1",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is LetsHyre?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "LetsHyre is an AI-powered hiring platform that automates resume screening, conducts AI interviews, and verifies candidates — helping HR teams hire notice-period talent 40% faster.",
      },
    },
    {
      "@type": "Question",
      name: "How does AI interviewing work on LetsHyre?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Candidates take a smart, AI-driven interview that evaluates their skills, communication, and role-fit in real time. Results are scored and verified so recruiters get pre-vetted profiles.",
      },
    },
    {
      "@type": "Question",
      name: "Is LetsHyre free for job seekers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Job seekers can sign up, complete their AI interview, and get matched with employers at no cost.",
      },
    },
  ],
};

export function Landing() {
  return (
    <>
      <Helmet>
        <title>
          LetsHyre — AI Hiring Platform for Notice-Period Talent | Smart
          Recruiting
        </title>
        <meta
          name="description"
          content="LetsHyre automates resume evaluation, AI-driven interviews, and candidate verification for modern HR teams. Hire notice-period talent 40% faster with 100% AI-verified profiles."
        />
        <meta
          name="keywords"
          content="AI hiring platform, AI recruitment, notice period talent, AI interviews, automated screening, resume evaluation, HR tech, smart recruiting, candidate verification, letshyre"
        />
        <meta name="author" content="LetsHyre" />
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />

        {/* ── Canonical (avoids www/non-www duplicate content) ── */}
        <link rel="canonical" href="https://letshyre.com/" />

        {/* ── Language & Geo ── */}
        <html lang="en" />
        <meta httpEquiv="content-language" content="en" />

        {/* ── Open Graph (Facebook, LinkedIn, etc.) ── */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="LetsHyre" />
        <meta
          property="og:title"
          content="LetsHyre — AI Hiring Platform for Notice-Period Talent"
        />
        <meta
          property="og:description"
          content="Automate resume screening, AI interviews, and candidate verification. Build your dream team 40% faster with LetsHyre."
        />
        <meta property="og:url" content="https://letshyre.com/" />
        <meta property="og:image" content="https://letshyre.com/og-cover.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="LetsHyre AI Hiring Platform" />
        <meta property="og:locale" content="en_US" />

        {/* ── Twitter Card ── */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@letshyre" />
        <meta
          name="twitter:title"
          content="LetsHyre — AI Hiring Platform for Notice-Period Talent"
        />
        <meta
          name="twitter:description"
          content="Automate resume screening, AI interviews, and candidate verification. Hire 40% faster with LetsHyre."
        />
        <meta
          name="twitter:image"
          content="https://letshyre.com/og-cover.png"
        />
        <meta name="twitter:image:alt" content="LetsHyre AI Hiring Platform" />

        {/* ── Additional SEO Signals ── */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="application-name" content="LetsHyre" />
        <link rel="alternate" href="https://www.letshyre.com/" hrefLang="en" />

        {/* ── Preconnect (performance = SEO signal) ── */}
        <link rel="preconnect" href="https://api.letshyre.com" />
        <link rel="dns-prefetch" href="https://api.letshyre.com" />

        {/* ── JSON-LD Structured Data ── */}
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(softwareSchema)}
        </script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <Hero2 />
      <Assistance />
      <Candidate />
      <VideoSection />
      <ScoreCard />
      <QuestionArea />
      <Testimonials />
      <HireCard />
    </>
  );
}
