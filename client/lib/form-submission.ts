const FORMSPREE_ENDPOINT = "https://formspree.io/f/mvkodbjw";
const submittingFormTypes = new Set<string>();

export const FORM_SUBMISSION_ERROR = "Unable to submit your form. Please try again.";

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
        await fetch("/api/applications/mirror", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, applicationId: crypto.randomUUID(), submittedAt }),
        });
      } catch {
        // Keep the existing Formspree submission successful if the internal copy is temporarily unavailable.
      }
    }
  } catch {
    throw new Error(FORM_SUBMISSION_ERROR);
  } finally {
    submittingFormTypes.delete(formType);
  }
}
