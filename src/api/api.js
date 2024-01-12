const API_URL = `${process.env.REACT_APP_API}/api/";

export const getUsers = async () => {
  const response = await fetch(`${API_URL}users/`);
  return response.json();
};
