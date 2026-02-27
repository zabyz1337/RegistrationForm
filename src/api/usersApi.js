const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export async function checkUsernameAvailable(username) {
  const res = await fetch(
    `${BASE_URL}/users?username=${encodeURIComponent(username)}`,
  );

  if (!res.ok) return true;

  const data = await res.json();
  return Array.isArray(data) ? data.length === 0 : true;
}

export async function createUser(payload) {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
}
