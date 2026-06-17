import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
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
  const sliderRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Queries & Mutations
  const { data: teamMembers, isLoading, isError } = useTeamMembers();
  const { mutate: addMember, isPending: isAdding } = useAddTeamMember();
  const { mutate: updateMember, isPending: isUpdating } = useUpdateTeamMember();
  const { mutate: deleteMember } = useDeleteTeamMember();

  // Scroll visibility effect
  useEffect(() => {
    const handleScroll = () => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        setShowLeftArrow(scrollLeft > 0);
        // Using Math.ceil to avoid floating point precision issues at the end of scroll
        setShowRightArrow(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
      }
    };

    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener("scroll", handleScroll);
      // Check initial state once data loads
      handleScroll();
    }

    window.addEventListener("resize", handleScroll);

    return () => {
      if (slider) slider.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [teamMembers]);

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

  const addTeamMember = (formData) => {
    if (memberToEdit) {
      updateMember(
        { id: memberToEdit.id, data: formData },
        {
          onSuccess: (res) => {
            if (res.success) {
              handleCloseModal();
              toast.success("Member updated successfully");
            } else toast.error(res.message || "Failed to update member");
          },
          onError: (err) => {
            const res = err.response?.data;
            const msg =
              res?.data && Object.keys(res.data).length > 0
                ? Object.values(res.data).flat().join(", ")
                : res?.message || "Failed to update member";
            toast.error(msg);
          },
        },
      );
    } else {
      const newMemberData = { ...formData, title: "Recruiter" };
      addMember(newMemberData, {
        onSuccess: (res) => {
          if (res.success) {
            handleCloseModal();
            toast.success("Member added successfully");
          } else {
            const msg =
              res?.data && Object.keys(res.data).length > 0
                ? Object.values(res.data).flat().join(", ")
                : res.message || "Failed to add member";
            toast.error(msg);
          }
        },
        onError: (err) => {
          const res = err.response?.data;
          const msg =
            res?.data && Object.keys(res.data).length > 0
              ? Object.values(res.data).flat().join(", ")
              : res?.message || "Failed to add member";
          toast.error(msg);
        },
      });
    }
  };

  const handleToggleStatus = (member) => {
    const newStatus = member.status === "Active" ? "Hold" : "Active";
    updateMember(
      { id: member.id, data: { status: newStatus } },
      {
        onSuccess: () => toast.success(`Status updated to ${newStatus}`),
        onError: (err) => {
          const res = err.response?.data;
          const msg = res?.message || "Failed to toggle status";
          toast.error(msg);
        },
      },
    );
  };

  const handleDelete = (member) => {
    if (
      window.confirm(`Are you sure you want to remove ${member.full_name}?`)
    ) {
      deleteMember(member.id, {
        onSuccess: () => toast.success("Member removed successfully"),
        onError: (err) => {
          const res = err.response?.data;
          const msg = res?.message || "Failed to remove member";
          toast.error(msg);
        },
      });
    }
  };

  const getScrollAmount = () => {
    if (sliderRef.current) {
      // On mobile devices (<= 768px), scroll by exactly the container's width (one card)
      if (window.innerWidth <= 768) {
        return sliderRef.current.clientWidth;
      }
      return 300; // Default for larger screens
    }
    return 300;
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -getScrollAmount(),
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: getScrollAmount(),
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="team-container">
      <div className="team-header-centered">
        <h2 className="team-title">Meet your team</h2>
        <p className="team-subtitle">
          See who is already here and bring new members into the fold.
        </p>
        <button
          className="emp-btn-black add-member-btn"
          onClick={handleOpenAddModal}
        >
          Add member
        </button>
      </div>

      {isError && (
        <div
          style={{
            color: "#ef4444",
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          Failed to load team members. Please try again.
        </div>
      )}

      {isLoading ? (
        <div className="team-slider-wrapper">
          <div className="team-slider">
            {Array.from({ length: 4 }).map((_, i) => (
              <TeamSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : teamMembers && teamMembers.length > 0 ? (
        <div className="team-slider-wrapper">
          <button
            className={`slider-arrow left ${showLeftArrow ? "visible" : "hidden"}`}
            onClick={scrollLeft}
            aria-label="Scroll left"
            style={{
              opacity: showLeftArrow ? 1 : 0,
              pointerEvents: showLeftArrow ? "auto" : "none",
            }}
          >
            ❮
          </button>

          <div className="team-slider" ref={sliderRef}>
            {teamMembers.map((member, index) => (
              <TeamCard
                key={member.id}
                member={member}
                index={index}
                onEdit={handleOpenEditModal}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>

          <button
            className={`slider-arrow right ${showRightArrow ? "visible" : "hidden"}`}
            onClick={scrollRight}
            aria-label="Scroll right"
            style={{
              opacity: showRightArrow ? 1 : 0,
              pointerEvents: showRightArrow ? "auto" : "none",
            }}
          >
            ❯
          </button>
        </div>
      ) : (
        <EmptyTeamState onAdd={handleOpenAddModal} />
      )}

      <TeamMemberModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={addTeamMember}
        memberToEdit={memberToEdit}
        isPending={isAdding || isUpdating}
      />
    </div>
  );
}
