import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Seeded demo accounts for Clean America Dallas
export const DEMO_USERS = [
  { id: 'a1', email: 'admin@cleanamericadallas.com', password: 'admin123', role: 'admin', name: 'Admin Operations', phone: '+1 214-555-0100' },
  { id: 'w1', email: 'john@cleanamericadallas.com', password: 'worker123', role: 'worker', name: 'John Miller', phone: '+1 214-555-0192', vehicle: 'Master Plumber • TX Lic #4920', rating: 4.9, jobsDone: 142, available: true },
  { id: 'w2', email: 'david@cleanamericadallas.com', password: 'worker123', role: 'worker', name: 'David Smith', phone: '+1 214-555-0238', vehicle: 'Licensed HVAC Tech • TX Lic #8831', rating: 4.8, jobsDone: 98, available: true },
  { id: 'w3', email: 'michael@cleanamericadallas.com', password: 'worker123', role: 'worker', name: 'Michael Davis', phone: '+1 214-555-0371', vehicle: 'Master Electrician • TX Lic #1029', rating: 4.9, jobsDone: 210, available: false },
  { id: 'c1', email: 'customer@cleanamericadallas.com', password: 'cust123', role: 'customer', name: 'Sarah Connor', phone: '+1 214-555-8832' },
];

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      users: DEMO_USERS,

      login: (email, password) => {
        const inputEmail = (email || '').trim().toLowerCase();
        const inputPass = (password || '').trim();

        // Check against store users or fallback to DEMO_USERS
        let found = get().users.find(u => u.email.toLowerCase() === inputEmail && u.password === inputPass);

        if (!found) {
          found = DEMO_USERS.find(u => u.email.toLowerCase() === inputEmail && u.password === inputPass);
        }

        if (!found) {
          return { error: 'Invalid email or password. Please try demo credentials.' };
        }

        set({ user: found });
        return { success: true, role: found.role };
      },

      register: (data) => {
        const inputEmail = (data.email || '').trim().toLowerCase();
        const exists = get().users.find(u => u.email.toLowerCase() === inputEmail);
        if (exists) return { error: 'Email already registered' };

        const newUser = {
          id: `c${Date.now()}`,
          email: inputEmail,
          password: data.password.trim(),
          role: data.role || 'customer',
          name: data.name || 'Customer',
          phone: data.phone || '+1 214-555-0000',
        };

        set(s => ({ users: [...s.users, newUser], user: newUser }));
        return { success: true, role: newUser.role };
      },

      logout: () => set({ user: null }),

      updateWorkerAvailability: (workerId, available) => {
        set(s => ({
          users: s.users.map(u => u.id === workerId ? { ...u, available } : u),
          user: s.user?.id === workerId ? { ...s.user, available } : s.user,
        }));
      },

      getWorkers: () => get().users.filter(u => u.role === 'worker'),
      getCustomers: () => get().users.filter(u => u.role === 'customer'),
    }),
    {
      name: 'cleanamerica-auth-v4',
      version: 4,
    }
  )
);
