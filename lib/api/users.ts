interface GetUsersParams {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}

interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
}

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
}

export async function getUsers(params?: GetUsersParams) {
  const queryParams = new URLSearchParams();
  
  if (params) {
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.role) queryParams.append('role', params.role);
    if (params.search) queryParams.append('search', params.search);
  }

  const url = `/api/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const res = await fetch(url, { 
    cache: 'no-store' 
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch users')
  }

  const data = await res.json()
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch users')
  }
  
  return data.data
}

export async function createUser(userData: CreateUserData) {
  const formData = new FormData()
  Object.entries(userData).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value)
    }
  })

  const res = await fetch('/api/users', {
    method: 'POST',
    body: formData
  })

  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Failed to create user')
  return data.data
}

export async function updateUser(id: number, userData: UpdateUserData) {
  const formData = new FormData()
  Object.entries(userData).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value)
    }
  })

  const res = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    body: formData
  })

  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Failed to update user')
  return data.data
}

export async function deleteUser(id: number) {
  const res = await fetch(`/api/users/${id}`, {
    method: 'DELETE'
  })

  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Failed to delete user')
  return data.data
}

export async function getUserById(id: number) {
  const res = await fetch(`/api/users/${id}`, {
    cache: 'no-store'
  })

  const data = await res.json()
  if (!data.success) throw new Error(data.message || 'Failed to get user')
  return data.data
}