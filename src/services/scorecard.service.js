import api from "./api";

const getScorecard = async () => {
  try {
    const res = await api.get("/scorecard/");
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch scorecard" };
  }
};

export default {
  getScorecard,
};
