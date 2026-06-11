import { z } from "zod";

export const employerProfileSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  location: z.string().min(1, "Please enter a location"),



  companySize: z.string().min(1, "Please select a company size"),

  industry: z.string().min(1, "Please select an industry"),

  linkedinUrl: z
    .string()
    .url("Please enter a valid LinkedIn URL")
    .regex(/linkedin\.com/, "Must be a LinkedIn URL")
    .optional()
    .or(z.literal("")),


  companyDescription: z
    .string()
    .max(500, "Description must be under 500 characters")
    .optional()
    .or(z.literal("")),

  companyLogo: z
    .any()
    .optional()
    .refine(
      (files) =>
        !files ||
        files.length === 0 ||
        (files[0] && files[0].size <= 5 * 1024 * 1024),
      "File size must be under 5MB"
    )
    .refine(
      (files) =>
        !files ||
        files.length === 0 ||
        (files[0] &&
          ["image/jpeg", "image/png", "image/svg+xml", "image/webp"].includes(
            files[0].type
          )),
      "Only JPG, PNG, SVG or WEBP allowed"
    ),
});
