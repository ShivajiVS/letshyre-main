import React from "react";
import "./styles/testimonials.css";

export function Testimonials() {
  return (
    <section className="ts-section">
      <div className="ts-header">
        <h2>Trusted by Thousands</h2>
        <p>See what our users have to say about their experience</p>
      </div>

      <div className="ts-columns">
        {/* COLUMN 1 – Moves UP */}
        <div className="ts-column ts-column01">
          <div className="ts-column-inner ts-move-up ">
            <TestimonialCard
              name="Michael Rodriguez"
              role="HR Director, Global Solutions"
              stars={5}
              quote="Amazing platform! The AI interview helps us shortlist candidates 5× faster.
                 The insights are accurate and improve our hiring efficiency."
            />

            <TestimonialCard
              name="Anu Emmanuel"
              role="HR Director, Global Solutions"
              stars={4}
              quote="Great screening tool! It reduces our manual hiring work significantly.
                 The scoring system is reliable and easy to understand."
            />

            <TestimonialCard
              name="Anup Kher"
              role="HR Director, Global Solutions"
              stars={5}
              quote="The automation is next-level and removes screening bias completely.
                 A huge upgrade to our overall hiring workflow."
            />

            {/* DUPLICATE FOR LOOP */}
            <TestimonialCard
              name="Michael Rodriguez"
              role="HR Director, Global Solutions"
              stars={5}
              quote="Amazing platform! The AI interview helps us shortlist candidates 5× faster.
                 The insights are accurate and improve our hiring efficiency."
            />

            <TestimonialCard
              name="Anu Emmanuel"
              role="HR Director, Global Solutions"
              stars={4}
              quote="Great screening tool! It reduces our manual hiring work significantly.
                 The scoring system is reliable and easy to understand."
            />

            <TestimonialCard
              name="Anup Kher"
              role="HR Director, Global Solutions"
              stars={5}
              quote="The automation is next-level and removes screening bias completely.
                 A huge upgrade to our overall hiring workflow."
            />
          </div>
        </div>

        {/* COLUMN 2 – Moves DOWN */}
        <div className="ts-column ts-column02">
          <div className="ts-column-inner ts-move-down">
            <TestimonialCard
              name="Priya Sharma"
              role="Talent Lead, NexaTech"
              stars={5}
              quote="Love how fast and accurate the AI scoring is for our candidates.
                 It saves our team hours during peak hiring periods."
            />

            <TestimonialCard
              name="John Carter"
              role="Hiring Manager, DataCore"
              stars={4}
              quote="The insights from AI interviews are extremely helpful.
                 They give clarity on candidate strengths instantly."
            />

            <TestimonialCard
              name="Sarah Malik"
              role="HR Manager, InnovateHub"
              stars={5}
              quote="Very smooth experience! Helps us identify top talent quickly.
                 The system makes screening effortless and effective."
            />

            {/* DUPLICATE */}
            <TestimonialCard
              name="Priya Sharma"
              role="Talent Lead, NexaTech"
              stars={5}
              quote="Love how fast and accurate the AI scoring is for our candidates.
                 It saves our team hours during peak hiring periods."
            />

            <TestimonialCard
              name="John Carter"
              role="Hiring Manager, DataCore"
              stars={4}
              quote="The insights from AI interviews are extremely helpful.
                 They give clarity on candidate strengths instantly."
            />

            <TestimonialCard
              name="Sarah Malik"
              role="HR Manager, InnovateHub"
              stars={5}
              quote="Very smooth experience! Helps us identify top talent quickly.
                 The system makes screening effortless and effective."
            />
          </div>
        </div>

        {/* COLUMN 3 – Moves UP */}
        <div className="ts-column ts-column03">
          <div className="ts-column-inner ts-move-up">
            <TestimonialCard
              name="Deepak Verma"
              role="Recruiter, SkyBridge"
              stars={4}
              quote="Makes our hiring workflow faster and much more structured.
                 The AI insights help us shortlist candidates confidently."
            />

            <TestimonialCard
              name="Maria Lopez"
              role="HR Partner, VisionCorp"
              stars={5}
              quote="The automation saves our team several hours every week.
                 A reliable platform that simplifies complex screening tasks."
            />

            <TestimonialCard
              name="Sameer Khan"
              role="Talent Acquisition, CloudNova"
              stars={4}
              quote="Simple UI with powerful features that improve hiring decisions.
                 The unbiased evaluation is extremely valuable for us."
            />

            {/* DUPLICATE */}
            <TestimonialCard
              name="Deepak Verma"
              role="Recruiter, SkyBridge"
              stars={4}
              quote="Makes our hiring workflow faster and much more structured.
                 The AI insights help us shortlist candidates confidently."
            />

            <TestimonialCard
              name="Maria Lopez"
              role="HR Partner, VisionCorp"
              stars={5}
              quote="The automation saves our team several hours every week.
                 A reliable platform that simplifies complex screening tasks."
            />

            <TestimonialCard
              name="Sameer Khan"
              role="Talent Acquisition, CloudNova"
              stars={4}
              quote="Simple UI with powerful features that improve hiring decisions.
                 The unbiased evaluation is extremely valuable for us."
            />
          </div>
        </div>

        {/* COLUMN 4 – Moves DOWN */}
        <div className="ts-column ts-column04">
          <div className="ts-column-inner ts-move-down">
            <TestimonialCard
              name="Evelyn Parker"
              role="CEO, TalentWorks"
              stars={5}
              quote="One of the most reliable AI hiring tools we've used so far.
                 It brings clarity and consistency to our recruitment process."
            />

            <TestimonialCard
              name="Rohit Nair"
              role="HR Head, AlphaEdge"
              stars={4}
              quote="Offers high-quality analysis that our team depends on.
                 A solid platform for structured and data-driven hiring."
            />

            <TestimonialCard
              name="Sana Qureshi"
              role="Recruitment Specialist, FutureWave"
              stars={5}
              quote="Extremely helpful for high-volume hiring cycles.
                 Speeds up screening without compromising candidate quality."
            />

            {/* DUPLICATE */}
            <TestimonialCard
              name="Evelyn Parker"
              role="CEO, TalentWorks"
              stars={5}
              quote="One of the most reliable AI hiring tools we've used so far.
                 It brings clarity and consistency to our recruitment process."
            />

            <TestimonialCard
              name="Rohit Nair"
              role="HR Head, AlphaEdge"
              stars={4}
              quote="Offers high-quality analysis that our team depends on.
                 A solid platform for structured and data-driven hiring."
            />

            <TestimonialCard
              name="Sana Qureshi"
              role="Recruitment Specialist, FutureWave"
              stars={5}
              quote="Extremely helpful for high-volume hiring cycles.
                 Speeds up screening without compromising candidate quality."
            />
          </div>
        </div>

        {/* COLUMN 5 – Moves UP */}
        <div className="ts-column ts-column05">
          <div className="ts-column-inner ts-move-up">
            <TestimonialCard
              name="Akash Mehta"
              role="HR Analyst, WorkHive"
              stars={4}
              quote="Really impressive automation that reduces manual work.
                 It speeds up screening while delivering consistent results."
            />

            <TestimonialCard
              name="Julia Brown"
              role="People Ops, BrightPath"
              stars={5}
              quote="A reliable platform that's extremely easy to use every day.
                 The accuracy of evaluations is better than any tool we've tried."
            />

            <TestimonialCard
              name="Nishita Rao"
              role="TA Lead, BlueMatrix"
              stars={5}
              quote="Helped us scale hiring with far more confidence.
                 The AI-driven insights add tremendous value to our decisions."
            />

            {/* DUPLICATE */}
            <TestimonialCard
              name="Akash Mehta"
              role="HR Analyst, WorkHive"
              stars={4}
              quote="Really impressive automation that reduces manual work.
                 It speeds up screening while delivering consistent results."
            />

            <TestimonialCard
              name="Julia Brown"
              role="People Ops, BrightPath"
              stars={5}
              quote="A reliable platform that's extremely easy to use every day.
                 The accuracy of evaluations is better than any tool we've tried."
            />

            <TestimonialCard
              name="Nishita Rao"
              role="TA Lead, BlueMatrix"
              stars={5}
              quote="Helped us scale hiring with far more confidence.
                 The AI-driven insights add tremendous value to our decisions."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

const TestimonialCard = ({ name, role, stars, quote }) => {
  return (
    <article className="ts-card">
      <div className="ts-stars">
        {Array(stars)
          .fill(0)
          .map((_, i) => (
            <span key={i}>★</span>
          ))}
      </div>

      <p className="ts-quote">{quote}</p>

      <div className="ts-user">
        <div className="ts-avatar">
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")}
          {/* <img src="" alt="Ur-img" /> */}
        </div>

        <div className="ts-user-text">
          <div className="ts-user-name">{name}</div>
          <div className="ts-user-role">{role}</div>
        </div>
      </div>
    </article>
  );
};
