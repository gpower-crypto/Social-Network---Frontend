const API_URL = 'http://127.0.0.1:8000/api/';

export const getUsers = async () => {
  const response = await fetch(`${API_URL}users/`);
  return response.json();
};
