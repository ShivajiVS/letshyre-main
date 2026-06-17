import React, { useState } from "react";
import "./styles/team.css";

import {
  useTeamMembers,
  useAddTeamMember,
  useUpdateTeamMember,
  useDeleteTeamMember,
} from "../../hooks/employer/useTeam";

import { TeamCard } from "./components/teams/TeamCard";
import { TeamMemberModal } from "./components/teams/TeamMemberModal";
import { TeamSkeleton } from "./components/teams/TeamSkeleton";
import { EmptyTeamState } from "./components/teams/EmptyTeamState";

export function Team() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState(null);

  // Queries & Mutations
  const { data: teamMembers, isLoading, isError } = useTeamMembers();
  const { mutate: addMember, isPending: isAdding } = useAddTeamMember();
  const { mutate: updateMember, isPending: isUpdating } = useUpdateTeamMember();
  const { mutate: deleteMember } = useDeleteTeamMember();

  // Handlers
  const handleOpenAddModal = () => {
    setMemberToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member) => {
    setMemberToEdit(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMemberToEdit(null);
  };

  const handleFormSubmit = (formData) => {
    if (memberToEdit) {
      updateMember(
        { id: memberToEdit.id, data: formData },
        {
          onSuccess: (res) => {
            if (res.success) handleCloseModal();
            else alert(res.message || "Failed to update member");
          },
        }
      );
    } else {
      const newMemberData = { ...formData, title: "Recruiter" };
      addMember(newMemberData, {
        onSuccess: (res) => {
          if (res.success) handleCloseModal();
          else {
            const msg = res?.data
              ? Object.values(res.data).flat().join(", ")
              : res.message || "Failed to add member";
            alert(msg);
          }
        },
      });
    }
  };

  const handleToggleStatus = (member) => {
    const newStatus = member.status === "Active" ? "Hold" : "Active";
    updateMember(
      { id: member.id, data: { status: newStatus } },
      {
        onError: () => alert("Failed to toggle status"),
      }
    );
  };

  const handleDelete = (member) => {
    if (window.confirm(`Are you sure you want to remove ${member.full_name}?`)) {
      deleteMember(member.id, {
        onError: () => alert("Failed to remove member"),
      });
    }
  };

  return (
    <div className="team-container">
      <div className="team-header">
        <h2>Meet your team</h2>
        <button className="emp-btn-primary" onClick={handleOpenAddModal}>
          + Add Member
        </button>
      </div>

      {isError && (
        <div style={{ color: "#ef4444", marginBottom: "16px" }}>
          Failed to load team members. Please try again.
        </div>
      )}

      {isLoading ? (
        <div className="team-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <TeamSkeleton key={i} />
          ))}
        </div>
      ) : teamMembers && teamMembers.length > 0 ? (
        <div className="team-grid">
          {teamMembers.map((member) => (
            <TeamCard
              key={member.id}
              member={member}
              onEdit={handleOpenEditModal}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      ) : (
        <EmptyTeamState onAdd={handleOpenAddModal} />
      )}

      <TeamMemberModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        memberToEdit={memberToEdit}
        isPending={isAdding || isUpdating}
      />
    </div>
  );
}