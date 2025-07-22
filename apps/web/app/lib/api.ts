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

export async function joinRoom(slug: string, username: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/room/${slug}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('Join room error response:', text);
    throw new Error('Failed to join room');
  }

  return response.json();
}

export async function setTempUser(username: string, roomId: string, ttl = 3600) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) throw new Error('Backend URL not set');
  const response = await fetch(`${backendUrl}/user/temp-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, roomId, ttl }),
  });
  return response.json();
}

