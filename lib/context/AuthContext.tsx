'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { MOCK_USERS } from '../mock-data';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, fullName?: string, role?: UserRole, promo?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateRole: (role: UserRole) => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = () => {
    try {
      const savedUser = localStorage.getItem('ece_terroir_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      localStorage.removeItem('ece_terroir_user');
    }
  };

  useEffect(() => {
    refreshUser();
    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    fullName: string = 'Étudiant ECE',
    requestedRole: UserRole = 'visitor',
    promo: string = 'Ingé 3 (Promo 2027)'
  ) => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      return { success: false, error: 'Veuillez renseigner une adresse email valide.' };
    }

    // Look for existing user in localStorage users or mock data
    let existingUser: UserProfile | undefined;
    try {
      const savedUsersStr = localStorage.getItem('ece_terroir_users_v2');
      if (savedUsersStr) {
        const savedUsers: UserProfile[] = JSON.parse(savedUsersStr);
        existingUser = savedUsers.find((u) => u.email.toLowerCase() === trimmedEmail);
      }
    } catch (e) {}

    if (!existingUser) {
      existingUser = MOCK_USERS.find((u) => u.email.toLowerCase() === trimmedEmail);
    }

    if (existingUser) {
      // Login as existing user
      const loggedUser: UserProfile = {
        ...existingUser,
        fullName: fullName || existingUser.fullName,
        lastLogin: new Date().toISOString(),
      };
      setUser(loggedUser);
      localStorage.setItem('ece_terroir_user', JSON.stringify(loggedUser));
      return { success: true };
    }

    // Create new user profile (default to requested role, usually 'visitor' for non-members)
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email: trimmedEmail,
      fullName: fullName || 'Visiteur / Non-Membre',
      promo: promo || 'Visiteur ECE',
      role: requestedRole,
      status: 'active',
      membershipStatus: requestedRole === 'member' || requestedRole === 'admin' ? 'active' : 'none',
      bio: requestedRole === 'admin'
        ? 'Membre actif du Bureau ECE Terroir.'
        : requestedRole === 'member'
        ? 'Membre adhérent officiel d\'ECE Terroir.'
        : 'Visiteur et amateur de gastronomie du terroir.',
      favoriteTerroirs: ['Bourgogne', 'Jura', 'Savoie'],
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    setUser(newUser);
    localStorage.setItem('ece_terroir_user', JSON.stringify(newUser));

    // Also register in users list if not present
    try {
      const savedUsersStr = localStorage.getItem('ece_terroir_users_v2');
      const currentUsers: UserProfile[] = savedUsersStr ? JSON.parse(savedUsersStr) : MOCK_USERS;
      if (!currentUsers.some((u) => u.email.toLowerCase() === trimmedEmail)) {
        const updatedUsers = [newUser, ...currentUsers];
        localStorage.setItem('ece_terroir_users_v2', JSON.stringify(updatedUsers));
      }
    } catch (e) {}

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ece_terroir_user');
  };

  const updateRole = (newRole: UserRole) => {
    if (!user) return;
    const updated = { ...user, role: newRole };
    setUser(updated);
    localStorage.setItem('ece_terroir_user', JSON.stringify(updated));
  };

  const updateProfile = (updatedFields: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem('ece_terroir_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateRole, updateProfile, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
