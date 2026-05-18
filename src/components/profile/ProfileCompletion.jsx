import { useState } from "react";

import ProfileStepper from "./ProfileStepper";
import StepIdentity from "./StepIdentity";
import StepJobPreferences from "./StepJobPreferences";
import StepResume from "./StepResume";
import StepReview from "./StepReview";

import pc_img01 from "@/assets/pc-img01.png";
import pc_img02 from "@/assets/pc-img02.png";

import "./ProfileCompletion.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ProfileCompletion({ onComplete }) {

  const [profileData, setProfileData] = useState({
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

    current_ctc: "",
    expected_ctc: "",

    preferred_industry: "",
    preferred_locations: [],

    /* STEP 3 */
    resume: null,
    resume_url: "",
    resume_id: "",

    selected_role: "",
    suggested_roles: [],

    parsed_resume_data: {
      name: "",
      email: "",
      phone_number: "",
      skills: [],
      certifications: [],
      education: [],
      projects: [],
      experience: [],
    },

    is_profile_complete: false,
    profile_completion_score: 21,
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const totalSteps = 4;

  const stepMeta = {
    1: {
      image: pc_img01,
      title: "Verify Your Identity",
      description:
        "Confirm your identity to ensure a secure and trusted interview process.",
    },

    2: {
      image: pc_img02,
      title: "Job Preferences",
      description:
        "Provide company details, salary expectations and preferences.",
    },

    3: {
      image: pc_img02,
      title: "Upload Resume & Select Role",
      description:
        "Upload resume, get AI role suggestions and choose your role.",
    },
  };


  /*
  IMPORTANT:
  Children must send plain object
  */
  const updateProfileData = (updates) => {
    console.log("MERGING UPDATE:", updates);

    setProfileData((prev) => {
      // ✅ HANDLE FUNCTION UPDATES
      const resolvedUpdates =
        typeof updates === "function"
          ? updates(prev)
          : updates;

      const finalData = {
        ...prev,
        ...resolvedUpdates,
      };

      console.log("UPDATED PROFILE DATA:", finalData);

      return finalData;
    });
  };


  const saveDraft = async () => {
    try {
      console.log("draft saved");
    } catch(e){
      console.log(e);
    }
  };


  const handleNext = async () => {

    console.log("CURRENT PROFILE",profileData);

    if(step===1 || step===2){
      await saveDraft();
    }

    if(step<totalSteps){
      setStep(prev=>prev+1);
      return;
    }

    localStorage.setItem(
      "profileCompleted",
      "true"
    );

    onComplete?.();

  };


  const handleBack=()=>{
    if(step>1){
      setStep(prev=>prev-1);
    }
  };


  const handleFinalSubmit=async()=>{

    try{

      setLoading(true);

      const fd=new FormData();

      fd.append(
        "gender",
        profileData.gender
      );

      fd.append(
        "dob",
        profileData.dob
      );

      fd.append(
        "aadhar_number",
        profileData.aadhar_number
      );

      fd.append(
        "location",
        profileData.location
      );

      fd.append(
        "address",
        profileData.address
      );

      if(profileData.profile_photo){
        fd.append(
          "profile_photo",
          profileData.profile_photo
        );
      }

      fd.append(
        "present_or_last_working_company",
        profileData.present_or_last_working_company
      );

      fd.append(
        "last_day_of_working",
        profileData.last_day_of_working
      );

      fd.append(
        "current_ctc",
        profileData.current_ctc
      );

      fd.append(
        "expected_ctc",
        profileData.expected_ctc
      );

      fd.append(
        "preferred_industry",
        profileData.preferred_industry
      );

      fd.append(
        "preferred_locations",
        JSON.stringify(
          profileData.preferred_locations
        )
      );

      if(profileData.resignation_letter){
        fd.append(
          "resignation_letter",
          profileData.resignation_letter
        );
      }

      if(profileData.experience_letter){
        fd.append(
          "experience_letter",
          profileData.experience_letter
        );
      }

      if(profileData.present_offer){
        fd.append(
          "present_offer",
          profileData.present_offer
        );
      }

      if(profileData.resume){
        fd.append(
          "resume",
          profileData.resume
        );
      }

      fd.append(
        "role",
        profileData.selected_role
      );

      fd.append(
        "resume_id",
        profileData.resume_id
      );

      fd.append(
        "parsed_resume_data",
        JSON.stringify(
          profileData.parsed_resume_data
        )
      );

      fd.append(
        "profile_completion_score",
        100
      );

      fd.append(
        "is_profile_complete",
        true
      );
      
      fd.append(
        "education",
        JSON.stringify(profileData.parsed_resume_data.education || [])
      );

      fd.append(
        "experience",
        JSON.stringify(profileData.parsed_resume_data.experience || [])
      );

      fd.append(
        "projects",
        JSON.stringify(profileData.parsed_resume_data.projects || [])
      );

      fd.append(
        "skills",
        JSON.stringify(profileData.parsed_resume_data.skills || [])
      );

      fd.append(
        "certifications",
        JSON.stringify(profileData.parsed_resume_data.certifications || [])
      );

      const user = JSON.parse(localStorage.getItem("user")) || {};

      const res = await fetch(`${BASE_URL}/user/v1/candidate_profile/`, {
        method: "PATCH", // or POST if PATCH blocked
        headers: {
          Authorization: `Bearer ${user?.access_token}`,
        },
        body: fd,
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("API ERROR:", txt);
        throw new Error("Failed to save profile");
      }

      const data = await res.json();
      console.log("API SUCCESS:", data);

      console.log(
        "FINAL PROFILE SUBMIT",
        profileData
      );

      localStorage.setItem(
        "profileCompleted",
        "true"
      );

      onComplete?.();

    }catch(e){
      console.log(e);
      alert("Submission failed");
    }
    finally{
      setLoading(false);
    }

  };


  return(
    <div className="pc-card">

      <h2 className="pc-title">
        Profile Progress!
      </h2>

      <div
        className={`pc-card-inner ${
          step===4
          ? "pc-full-width"
          : ""
        }`}
      >

        {step!==4 && (
          <div className="pc-left">

            <div className="pc-left-part-img">
              <img
                src={stepMeta[step].image}
                alt=""
              />
            </div>

            <h3 className="pc-left-header">
              {stepMeta[step].title}
            </h3>

            <p>
              {stepMeta[step].description}
            </p>

          </div>
        )}


        <div className="pc-right-box">

          <ProfileStepper
            step={step}
          />


          {step===1 && (
            <StepIdentity
              profileData={profileData}
              setProfileData={updateProfileData}
              onNext={handleNext}
            />
          )}


          {step===2 && (
            <StepJobPreferences
              profileData={profileData}
              setProfileData={updateProfileData}
              onBack={handleBack}
              onNext={handleNext}
            />
          )}


          {step===3 && (
            <StepResume
              profileData={profileData}
              setProfileData={updateProfileData}
              onBack={handleBack}
              onNext={handleNext}
            />
          )}


          {step===4 && (
            <StepReview
              profileData={profileData}
              onBack={handleBack}
              onFinish={handleFinalSubmit}
              loading={loading}
            />
          )}

        </div>
      </div>
    </div>
  );

}

export default ProfileCompletion;