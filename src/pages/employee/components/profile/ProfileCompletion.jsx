import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

import ProfileStepper from "./ProfileStepper";
import StepIdentity from "./StepIdentity";
import StepJobPreferences from "./StepJobPreferences";
import StepPhoto from "./StepPhoto";
import StepResume from "./StepResume";
import StepReview from "./StepReview";

import pc_img01 from "@/assets/pc-img01.png";
import pc_img02 from "@/assets/pc-img02.png";

import "./ProfileCompletion.css";

function ProfileCompletion({ onComplete }) {
  const methods = useForm({
    mode: "onTouched",
    defaultValues: {
      /* STEP 1 */
      gender: "",
      dob: "",
      aadhar_number: "",
      profile_photo: null,
      location: "",
      address: "",

      /* STEP 2 */
      present_or_last_working_company: "",
      last_day_of_working: "",
      resignation_letter: null,
      experience_letter: null,
      present_offer: null,
      notice_period_proof_type: "",
      notice_period_proof: null,
      current_ctc: "",
      expected_ctc: "",
      preferred_industry: "",
      preferred_locations: [],
      preferred_locations_string: "", // Used for input string

      /* STEP 3 */
      resume: null,
      resume_id: "",
      job_id: "",
      selected_role: "",
      suggested_roles: [],
      parsed_resume_data: null,
    },
  });

  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const stepMeta = {
    1: {
      image: pc_img01,
      title: "Verify Your Identity",
      description:
        "Confirm your identity to ensure a secure and trusted interview process.",
    },
    2: {
      image: pc_img01,
      title: "Profile Photo",
      description: "Upload a clear, professional photo for your profile.",
    },
    3: {
      image: pc_img02,
      title: "Job Preferences",
      description:
        "Provide company details, salary expectations and preferences.",
    },
    4: {
      image: pc_img02, // Reusing as per original code
      title: "Upload Resume & Role",
      description:
        "Upload resume, get AI role suggestions and choose your role.",
    },
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleFinish = () => {
    localStorage.setItem("profileCompleted", "true");
    onComplete?.();
  };

  return (
    <FormProvider {...methods}>
      <div className="pc-card">
        <div className={`pc-card-inner ${step === 5 ? "pc-full-width" : ""}`}>
          {step !== 5 && (
            <div className="pc-left">
              <div className="pc-left-part-img">
                <img src={stepMeta[step].image} alt="Step Illustration" />
              </div>
              <h3 className="pc-left-header">{stepMeta[step].title}</h3>
              <p>{stepMeta[step].description}</p>
            </div>
          )}

          <div className="pc-right-box">
            <div className={`stepper-container ${step === 5 ? "stepper-center-wrapper" : ""}`}>
              <h2 className="pc-title" style={step === 5 ? { textAlign: "center" } : {}}>
                Profile Progress
              </h2>
              <ProfileStepper step={step} />
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && <StepIdentity key="step1" onNext={handleNext} />}
              {step === 2 && (
                <StepPhoto
                  key="step2"
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
              {step === 3 && (
                <StepJobPreferences
                  key="step3"
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
              {step === 4 && (
                <StepResume
                  key="step4"
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
              {step === 5 && (
                <StepReview
                  key="step5"
                  onBack={handleBack}
                  onFinish={handleFinish}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}

export default ProfileCompletion;
