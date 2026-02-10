// Convert string to array if it's supposed to be array

export function normalizeArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value];
}

// Sanitize and prepare profile data from form

export function prepareProfileData(formData) {
  return {
    name: formData.name?.trim() || "",
    about: formData.about?.trim() || "",
    yearsExperience: parseInt(formData.yearsExperience) || 0,
    languages: normalizeArray(formData.languages),
    frameworksAndLibraries: normalizeArray(formData.frameworksAndLibraries),
    preferences: normalizeArray(formData.preferences),
    email: formData.email?.trim().toLowerCase() || "",
    phone: formData.phone?.trim() || "",
    links: normalizeArray(formData.links).filter((link) => link && link.trim()),
  };
}
