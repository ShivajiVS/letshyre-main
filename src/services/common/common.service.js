import api from "@/services/api";

/**
 * Subscribes an email to the Stay Updated newsletter.
 * @param {string} email - The user's email address.
 * @returns {Promise<Object>} The response data.
 */
export const subscribeToNewsletter = async (email) => {
  const response = await api.post("/commonapp/v1/stay_updated/", { email });
  return response.data;
};
