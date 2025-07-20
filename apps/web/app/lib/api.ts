export async function fetchProfile() {
  const token = localStorage.getItem('auth_token');
  if (!token) throw new Error('No token found');

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) throw new Error('Backend URL not set');

  const res = await fetch(`${backendUrl}/account/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
  const error = await res.text(); // or res.json() if JSON
  console.error('Profile fetch error:', error);
  throw new Error('Failed to fetch profile');
}
  return res.json();
}
