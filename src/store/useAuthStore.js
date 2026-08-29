import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Seeded demo accounts for Clean America Dallas
const DEMO_USERS = [
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
        const found = get().users.find(u => u.email === email && u.password === password);
        if (!found) return { error: 'Invalid email or password' };
        set({ user: found });
        return { success: true, role: found.role };
      },

      register: (data) => {
        const exists = get().users.find(u => u.email === data.email);
        if (exists) return { error: 'Email already registered' };
        const newUser = { id: `c${Date.now()}`, ...data };
        set(s => ({ users: [...s.users, newUser] }));
        return { success: true };
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
    { name: 'cleanamerica-auth' }
  )
);
