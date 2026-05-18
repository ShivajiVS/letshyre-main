import api from "./api";

const getMyApplications = async () => {
  try {
    const res = await api.get("/applications/");
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch applications" };
  }
};

export default {
  getMyApplications,
};
