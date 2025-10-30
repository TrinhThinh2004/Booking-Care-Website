export async function apiRegister(payload: { email: string; password: string; firstName?: string; lastName?: string }) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.message || 'Register failed')
  return json
}

export async function apiLogin(email: string, password: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.message || 'Login failed')
  return json
}

export async function apiVerify(token: string) {
  const res = await fetch('/api/auth/verify', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.message || 'Verify failed')
  return json
}

export default { apiRegister, apiLogin, apiVerify }
