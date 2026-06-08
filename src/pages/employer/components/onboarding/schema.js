import { z } from "zod";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_DOCUMENT_TYPES = [...ACCEPTED_IMAGE_TYPES, "application/pdf"];

// Helper to validate files
const fileSchema = (acceptedTypes) =>
  z
    .any()
    .refine((file) => file instanceof File, "File is required")
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => acceptedTypes.includes(file?.type),
      "Only .jpg, .jpeg, .png, .webp and .pdf formats are supported."
    );

const imageSchema = () => fileSchema(ACCEPTED_IMAGE_TYPES);
const documentSchema = () => fileSchema(ACCEPTED_DOCUMENT_TYPES);

export const employerOnboardingSchema = z.object({
  company_name: z.string().min(2, "Company name must be at least 2 characters").max(100),
  company_website: z.string().url("Must be a valid URL (e.g. https://example.com)"),
  company_description: z.string().min(10, "Please provide a brief description").max(1000),
  company_industry: z.string().min(1, "Please select an industry"),
  company_registration_number: z.string().min(5, "Registration number is required").max(50),
  gst_number: z.string().min(15, "Valid GST number is required").max(15, "Valid GST number is required"),
  pan_number: z.string().min(10, "Valid PAN number is required").max(10, "Valid PAN number is required"),
  company_address: z.string().min(5, "Full company address is required"),
  official_email: z.string().email("Valid official email is required"),

  // Files
  company_logo: imageSchema(),
  registration_certificate: documentSchema(),
  gst_certificate: documentSchema(),
  address_proof: documentSchema(),
  authorized_id_proof: documentSchema(),
  bank_proof: documentSchema(),
});

export const defaultValues = {
  company_name: "",
  company_website: "",
  company_description: "",
  company_industry: "",
  company_registration_number: "",
  gst_number: "",
  pan_number: "",
  company_address: "",
  official_email: "",
  
  // files are typically not set in defaultValues as strings, we manage them via React Hook Form Controller or custom register
};
