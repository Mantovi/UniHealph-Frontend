export const getUserUniversityId = () : number | null => {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }

  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    return decodedToken.universityId || null;
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return null;
  }
};
