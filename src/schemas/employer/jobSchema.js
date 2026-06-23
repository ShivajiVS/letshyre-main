import { z } from "zod";

export const jobSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  work_type: z.string().min(1, "Work type is required"),
  employment_type: z.string().min(1, "Employment type is required"),
  industry_type: z.string().min(1, "Industry type is required"),
  customIndustry: z.string().optional(), // Will be conditionally required if industry_type is "other"

  must_have_skills: z.string().min(1, "Skills are required"),
  salary_range: z.string().min(1, "Salary range is required"),

  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),

  education: z.string().min(1, "Education is required"),
  specialization: z.string().min(1, "Specialization is required"),

  description: z.string().min(1, "Responsibilities are required"),
  job_description: z.string().min(1, "Job description is required"),

  experience_required: z.string().min(1, "Experience is required"),
  number_of_openings: z.union([z.string(), z.number()]).refine((val) => Number(val) > 0, "Must be at least 1"),
  application_deadline: z.string().min(1, "Deadline is required"),
}).superRefine((data, ctx) => {
  if (data.industry_type === "other" && (!data.customIndustry || data.customIndustry.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Custom industry is required",
      path: ["customIndustry"],
    });
  }
});
