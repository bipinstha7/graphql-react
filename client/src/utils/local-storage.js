export function getLocalStorage() {
  return (
    localStorage.getItem("eventy-token") &&
    JSON.parse(localStorage.getItem("eventy-token"))
  );
}

export function removeLocalStorage() {
  localStorage.removeItem("eventy-token");
}
