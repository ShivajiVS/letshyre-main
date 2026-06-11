import React, { useState, useEffect } from "react";
import { useGetEmployerProfile, useUpdateKyc } from "../../hooks/employer/useEmployerProfile";
import { ProfileSkeleton } from "./components/profile/ProfileSkeleton";
import { ProfileBanner } from "./components/profile/ProfileBanner";
import { PrimaryDetails } from "./components/profile/PrimaryDetails";
import { CompanyDetails } from "./components/profile/CompanyDetails";
import { DocumentLinks } from "./components/profile/DocumentLinks";
import { EditProfileForm } from "./components/profile/EditProfileForm";

import "./styles/employer-profile.css";

export function EmployerProfile() {
  const [editProfile, setEditProfile] = useState(false);
  const [loggedUser, setLoggedUser] = useState(null);

  // Queries & Mutations
  const { data: profileData, isLoading, isError } = useGetEmployerProfile();
  const updateKycMutation = useUpdateKyc();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setLoggedUser(JSON.parse(user));
    }
  }, []);

  if (isLoading) {
    return (
      <main className="ep-page">
        <ProfileSkeleton />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="ep-page">
        <div className="ep-card">
          <h3 className="ep-heading" style={{ color: "red" }}>Error</h3>
          <p>Failed to load profile. Please try again later.</p>
        </div>
      </main>
    );
  }

  // Destructure from API response structure
  const profile = profileData || {};
  const kyc = profileData?.kyc || {};
  const stats = {
    openJobs: profileData?.open_jobs_posted || 0,
    totalJobs: profileData?.total_jobs_posted || 0,
  };

  return (
    <main className="ep-page">
      {!editProfile ? (
        <>
          <ProfileBanner 
            companyName={kyc?.company_name || loggedUser?.company_name}
            stats={stats}
            onEditClick={() => setEditProfile(true)}
          />
          <PrimaryDetails 
            profile={profile}
            kyc={kyc}
            loggedUser={loggedUser}
          />
          <CompanyDetails 
            kyc={kyc}
          />
          <DocumentLinks 
            kyc={kyc}
          />
        </>
      ) : (
        <EditProfileForm 
          profile={profile}
          kyc={kyc}
          onCancel={() => setEditProfile(false)}
          updateKycMutation={updateKycMutation}
        />
      )}
    </main>
  );
}
