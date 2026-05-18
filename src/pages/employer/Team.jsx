import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import teamDefault from "@/assets/team-img01.png";
import "./empSubSections.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function Team() {
  const sliderRef = useRef(null);
  const menuRef = useRef();

  const [team, setTeam] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const token = JSON.parse(localStorage.getItem("user"))?.access_token;

  // ================= FETCH =================
  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/user/v1/employer_team_members/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setTeam(data.data.results);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  // ================= INPUT =================
  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= ADD (FIXED) =================
  const handleAdd = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("All fields required");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/user/v1/employer_team_members/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: form.name,
          email: form.email,
          password: form.password, // ✅ ONLY THIS
          title: "Recruiter",
        }),
      });

      const data = await res.json();

      console.log("ADD RESPONSE:", data);

      if (res.ok && data.success) {
        alert("✅ Member Added");
        closePopup();
        fetchTeam();
      } else {
        const msg = data?.data
          ? Object.values(data.data).flat().join(", ")
          : data.message;

        alert(msg);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  // ================= EDIT =================
  const handleEdit = (m) => {
    setSelectedMember(m);
    setForm({ name: m.full_name, email: m.email, password: "" });
    setEditMode(true);
    setShowForm(true);
    setActiveMenu(null);
  };

  const handleUpdate = async () => {
    const res = await fetch(
      `${BASE_URL}/user/v1/employer_team_members/${selectedMember.id}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: form.name,
          email: form.email,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      closePopup();
      fetchTeam();
    }
  };

  // ================= DELETE =================
  const handleDelete = async (m) => {
    if (!window.confirm("Delete member?")) return;

    await fetch(`${BASE_URL}/user/v1/employer_team_members/${m.id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchTeam();
  };

  // ================= STATUS =================
  const handleToggleStatus = async (m) => {
    const newStatus = m.status === "Active" ? "Hold" : "Active";

    setTeam((prev) =>
      prev.map((x) => (x.id === m.id ? { ...x, status: newStatus } : x))
    );

    setActiveMenu(null);

    await fetch(`${BASE_URL}/user/v1/employer_team_members/${m.id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });
  };

  // ================= CLOSE =================
  const closePopup = () => {
    setShowForm(false);
    setEditMode(false);
    setForm({ name: "", email: "", password: "" });
  };

  return (
    <div className="team-section">
      <div className="team-header">
        <h2>Meet your team</h2>
        <button onClick={() => setShowForm(true)}>Add Member</button>
      </div>

      <div className="team-cards-wrapper">
        <button className="arrow left" onClick={() => sliderRef.current.scrollBy({ left: -300 })}>
          ❮
        </button>

        <div className="team-slider" ref={sliderRef}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            team.map((m, i) => (
              <motion.div key={m.id} className="team-card">
                <div
                  className="menu"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(activeMenu === i ? null : i);
                  }}
                >
                  ⋮
                </div>

                {activeMenu === i && (
                  <div className="dropdown" ref={menuRef}>
                    <p onClick={() => handleEdit(m)}>Edit</p>
                    <p onClick={() => handleDelete(m)}>Remove</p>
                    <p onClick={() => handleToggleStatus(m)}>
                      {m.status === "Active" ? "Hold" : "Activate"}
                    </p>
                  </div>
                )}

                <img src={teamDefault} />
                <h3>{m.full_name}</h3>
                <p>{m.title}</p>
                <span className={m.status}>{m.status}</span>
              </motion.div>
            ))
          )}
        </div>

        <button className="arrow right" onClick={() => sliderRef.current.scrollBy({ left: 300 })}>
          ❯
        </button>
      </div>

      {showForm && (
        <div className="emp-overlay">
          <div className="emp-modal">
            <h3>{editMode ? "Edit Member" : "Add Member"}</h3>

            <input
              name="name"
              value={form.name}
              onChange={handleInput}
              placeholder="Full Name"
            />

            <input
              name="email"
              value={form.email}
              onChange={handleInput}
              placeholder="Email"
            />

            {!editMode && (
              <input
                name="password"
                value={form.password}
                onChange={handleInput}
                placeholder="Password"
                type="password"
              />
            )}

            <button className="primary-btn" onClick={editMode ? handleUpdate : handleAdd}>
              {editMode ? "Update Member" : "Add Member"}
            </button>

            <button className="cancel-btn" onClick={closePopup}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}