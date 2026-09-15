import { supabase } from "./supabase";

const submittingFormTypes = new Set<string>();

export const FORM_SUBMISSION_ERROR = "Unable to submit your form. Please try again.";
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mvkodbjw";

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function stringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

async function stableSubmissionId(formData: Record<string, unknown>) {
  const source = JSON.stringify({
    firstName: stringValue(formData.firstName),
    lastName: stringValue(formData.lastName),
    email: stringValue(formData.email).toLowerCase(),
    phone: stringValue(formData.phone),
    country: stringValue(formData.country),
    timeZone: stringValue(formData.timeZone),
    interests: stringArray(formData.interests),
    hours: stringValue(formData.hours),
    experience: stringValue(formData.experience),
    reason: stringValue(formData.reason),
    eligibility: stringArray(formData.eligibility),
  });
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(source));
  return `application-${Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

async function mirrorApplication(formData: Record<string, unknown>) {
  const eligibility = stringArray(formData.eligibility);
  const hasEligibility = (phrase: string) => eligibility.includes(phrase);
  const { error } = await supabase.from("applications").upsert({
    submission_id: await stableSubmissionId(formData),
    first_name: stringValue(formData.firstName),
    last_name: stringValue(formData.lastName),
    email: stringValue(formData.email),
    phone: stringValue(formData.phone),
    country: stringValue(formData.country),
    time_zone: stringValue(formData.timeZone),
    assignment_categories: stringArray(formData.interests).join(", "),
    weekly_hours: stringValue(formData.hours),
    previous_experience: stringValue(formData.experience),
    motivation: stringValue(formData.reason),
    age_18_plus: hasEligibility("I am at least 18 years old."),
    reliable_internet: hasEligibility("I have reliable internet access."),
    follows_instructions: hasEligibility("I can follow assignment instructions accurately."),
    agrees_policies: hasEligibility("I agree to Contributor Program policies."),
    understands_review: hasEligibility("I understand applications are reviewed before approval."),
  }, { onConflict: "submission_id", ignoreDuplicates: true });
  if (error) throw error;
}

export async function submitForm(formType: string, formData: Record<string, unknown>) {
  if (submittingFormTypes.has(formType)) throw new Error(FORM_SUBMISSION_ERROR);

  submittingFormTypes.add(formType);
  try {
    const submittedAt = new Date().toISOString();
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formData, formType, submittedAt }),
    });

    if (!response.ok) throw new Error("Form submission failed");

    if (formType === "application") {
      try {
        await mirrorApplication(formData);
      } catch (error) {
        console.error("Failed to save application to Supabase", error);
        throw new Error(FORM_SUBMISSION_ERROR);
      }
    }
  } catch {
    throw new Error(FORM_SUBMISSION_ERROR);
  } finally {
    submittingFormTypes.delete(formType);
  }
}
