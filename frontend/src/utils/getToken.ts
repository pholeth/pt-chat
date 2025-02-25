
export const getTokenHeader = () => {
  const token = sessionStorage.getItem("access_token");

  return token ? {
    Authorization: `Bearer ${token}`,
  } : {}
}