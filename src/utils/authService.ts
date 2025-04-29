
// Type definitions for authentication
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

// Check if user is logged in
export const isAuthenticated = (): boolean => {
  const user = localStorage.getItem('user');
  return !!user;
};

// Get current user
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Login function
export const login = (email: string, password: string): User | null => {
  // Get users from localStorage
  const usersStr = localStorage.getItem('users');
  const users: { email: string, password: string, name: string, id: string, role: 'admin' | 'user' }[] = 
    usersStr ? JSON.parse(usersStr) : [];
  
  // Find user
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Store in localStorage (don't store password)
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  }
  
  return null;
};

// Register function
export const register = (name: string, email: string, password: string): User | null => {
  // Get existing users
  const usersStr = localStorage.getItem('users');
  const users: { email: string, password: string, name: string, id: string, role: 'admin' | 'user' }[] = 
    usersStr ? JSON.parse(usersStr) : [];
  
  // Check if user already exists
  if (users.some(u => u.email === email)) {
    return null;
  }
  
  // Create new user
  const newUser = {
    id: Date.now().toString(),
    email,
    password,
    name,
    role: 'user' as const,
  };
  
  // Add to users array
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  // Login the user
  const { password: _, ...userWithoutPassword } = newUser;
  localStorage.setItem('user', JSON.stringify(userWithoutPassword));
  
  return userWithoutPassword;
};

// Logout function
export const logout = (): void => {
  localStorage.removeItem('user');
};
