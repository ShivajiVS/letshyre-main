import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addMemberSchema,
  editMemberSchema,
} from "../../../../schemas/employer/team.schema";
import { createPortal } from "react-dom";

export function TeamMemberModal({
  isOpen,
  onClose,
  onSubmit,
  memberToEdit,
  isPending,
}) {
  const isEditing = !!memberToEdit;
  const schema = isEditing ? editMemberSchema : addMemberSchema;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (isEditing && memberToEdit) {
        reset({
          full_name: memberToEdit.full_name || "",
          email: memberToEdit.email || "",
          password: "",
        });
      } else {
        reset({
          full_name: "",
          email: "",
          password: "",
        });
      }
    }
  }, [isOpen, isEditing, memberToEdit, reset]);

  if (!isOpen) return null;

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return createPortal(
    <div className="emp-overlay">
      <div className="emp-modal" style={{ width: "100%", maxWidth: "480px", padding: "32px", borderRadius: "24px" }}>
        <h3 style={{ marginBottom: "24px", fontSize: "22px", color: "#1e293b", fontWeight: "700" }}>
          {isEditing ? "Edit Member" : "Add Member"}
        </h3>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              {...register("full_name")}
              placeholder="e.g. Jane Doe"
              className={errors.full_name ? "input-error" : ""}
            />
            {errors.full_name && (
              <span className="form-error">{errors.full_name.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              {...register("email")}
              placeholder="e.g. jane@company.com"
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && (
              <span className="form-error">{errors.email.message}</span>
            )}
          </div>

          {!isEditing && (
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                {...register("password")}
                placeholder="Secure password"
                className={errors.password ? "input-error" : ""}
              />
              {errors.password && (
                <span className="form-error">{errors.password.message}</span>
              )}
            </div>
          )}

          <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
            <button
              type="button"
              className="emp-btn cancel-btn"
              onClick={onClose}
              disabled={isPending}
              style={{ flex: 1, background: "#f1f5f9", color: "#475569", border: "none", borderRadius: "12px", padding: "12px", fontWeight: "600", cursor: "pointer" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="emp-btn-primary"
              disabled={isPending}
              style={{ flex: 1 }}
            >
              {isPending
                ? "Saving..."
                : isEditing
                ? "Update Member"
                : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
