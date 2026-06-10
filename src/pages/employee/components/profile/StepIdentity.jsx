import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";

const multiplication = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];

const permutation = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

function validAadhaar(a) {
  if (!/^\d{12}$/.test(a)) return false;
  if (/^(\d)\1+$/.test(a)) return false;
  let c = 0;
  const digits = a.split("").reverse().map(Number);
  for (let i = 0; i < digits.length; i++) {
    c = multiplication[c][permutation[i % 8][digits[i]]];
  }
  return c === 0;
}

const validateAge = (dob) => {
  if (!dob) return false;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age >= 18;
};

function StepIdentity({ onNext }) {
  const {
    register,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useFormContext();

  const [citySuggestions, setCitySuggestions] = useState([]);

  const location = watch("location");
  const aadhaar = watch("aadhar_number");

  useEffect(() => {
    if (!location || location.length < 2) {
      setCitySuggestions([]);
      return;
    }
    const delay = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://geodb-free-service.wirefreethought.com/v1/geo/cities?limit=5&namePrefix=${location}`
        );
        if (!res.ok) return;
        const data = await res.json();
        setCitySuggestions(data.data || []);
      } catch (e) {
        console.log(e);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [location]);

  const handleAadhaarChange = (e) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 12) return;
    v = v.replace(/(\d{4})(\d{0,4})(\d{0,4})/, (_, a, b, c) =>
      [a, b, c].filter(Boolean).join("-")
    );
    setValue("aadhar_number", v, { shouldValidate: true });
  };

  const handleContinue = async () => {
    const isValid = await trigger([
      "gender",
      "dob",
      "location",
      "address",
      "aadhar_number",
    ]);
    if (!isValid) return;
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="pc-step-content"
    >
      <style>{`
        .city-list {
          position: absolute;
          background: #ffffff;
          border: 1px solid var(--pc-border);
          border-radius: var(--pc-radius-sm);
          width: 100%;
          max-height: 200px;
          overflow-y: auto;
          z-index: 10;
          box-shadow: var(--pc-shadow-hover);
          margin-top: 4px;
        }
        .city-item {
          padding: 10px 16px;
          cursor: pointer;
          font-size: 14px;
        }
        .city-item:hover {
          background: #f1f5f9;
        }
      `}</style>

      <div className="form-grid">
        <div className="form-group">
          <label>Gender *</label>
          <select
            className="pc-select"
            {...register("gender", { required: "Gender is required" })}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className="field-error">{errors.gender.message}</p>}
        </div>

        <div className="form-group">
          <label>Date of Birth *</label>
          <input
            type="date"
            className="pc-input"
            {...register("dob", {
              required: "Date of Birth is required",
              validate: (val) => validateAge(val) || "Must be at least 18 years old",
            })}
          />
          {errors.dob && <p className="field-error">{errors.dob.message}</p>}
        </div>

        <div className="form-group" style={{ position: "relative" }}>
          <label>Location *</label>
          <input
            className="pc-input"
            placeholder="e.g. Mumbai, India"
            {...register("location", { required: "Location is required" })}
          />
          {citySuggestions.length > 0 && (
            <div className="city-list">
              {citySuggestions.map((city, i) => (
                <div
                  key={i}
                  className="city-item"
                  onClick={() => {
                    setValue("location", `${city.city}, ${city.country}`, {
                      shouldValidate: true,
                    });
                    setCitySuggestions([]);
                  }}
                >
                  {city.city}, {city.country}
                </div>
              ))}
            </div>
          )}
          {errors.location && <p className="field-error">{errors.location.message}</p>}
        </div>

        <div className="form-group">
          <label>Aadhaar Number *</label>
          <input
            className="pc-input"
            placeholder="XXXX-XXXX-XXXX"
            value={aadhaar}
            onChange={handleAadhaarChange}
          />
          <input
            type="hidden"
            {...register("aadhar_number", {
              required: "Aadhaar is required",
              validate: (val) => {
                const raw = val.replace(/\D/g, "");
                if (raw.length !== 12 || !validAadhaar(raw)) {
                  return "Invalid Aadhaar number";
                }
                return true;
              },
            })}
          />
          {errors.aadhar_number && (
            <p className="field-error">{errors.aadhar_number.message}</p>
          )}
        </div>
      </div>

      <div className="form-group">
        <label>Full Address *</label>
        <textarea
          className="pc-textarea"
          placeholder="Enter your complete residential address..."
          {...register("address", {
            required: "Address is required",
            minLength: { value: 10, message: "Address must be at least 10 characters long" },
          })}
        />
        {errors.address && <p className="field-error">{errors.address.message}</p>}
      </div>

      <div className="pc-actions" style={{ justifyContent: "flex-end" }}>
        <button className="btn-primary" onClick={handleContinue}>
          Continue <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    </motion.div>
  );
}

export default StepIdentity;
