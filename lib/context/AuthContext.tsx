'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, MembershipStatus } from '../types';
import { MOCK_USERS } from '../mock-data';
import { isEceEmail, normalizeEmail, hashPassword, verifyPassword } from '../utils/auth-security';

interface SignupData {
  email: string;
  password: string;
  fullName: string;
  promo: string;
  favoriteTerroirs?: string[];
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
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

  const signup = async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
    const normalizedEmail = normalizeEmail(data.email || '');

    // 1. Validation de l'email ECE Paris
    if (!normalizedEmail) {
      return { success: false, error: 'Veuillez renseigner une adresse email.' };
    }

    if (!isEceEmail(normalizedEmail)) {
      return {
        success: false,
        error: 'Adresse refusée : Vous devez utiliser votre adresse étudiante officielle ECE Paris (@edu.ece.fr ou @ece.fr).',
      };
    }

    if (!data.password || data.password.length < 6) {
      return { success: false, error: 'Le mot de passe doit comporter au moins 6 caractères.' };
    }

    if (!data.fullName || data.fullName.trim().length < 2) {
      return { success: false, error: 'Veuillez renseigner votre nom et prénom complet.' };
    }

    // 2. Vérifier si l'utilisateur existe déjà
    let existingUsers: UserProfile[] = [];
    try {
      const savedStr = localStorage.getItem('ece_terroir_users_v2');
      if (savedStr) existingUsers = JSON.parse(savedStr);
    } catch (e) {}

    const alreadyExists = existingUsers.some((u) => u.email.toLowerCase() === normalizedEmail) ||
      MOCK_USERS.some((u) => u.email.toLowerCase() === normalizedEmail);

    if (alreadyExists) {
      return { success: false, error: 'Un compte existe déjà avec cette adresse email. Veuillez vous connecter.' };
    }

    const hashedPassword = await hashPassword(data.password);

    // 3. Création du compte VISITEUR
    const newUser: UserProfile = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      email: normalizedEmail,
      fullName: data.fullName.trim(),
      promo: data.promo || 'ING3 (Promo 2027)',
      role: 'visitor', // RÔLE TOUJOURS VISITEUR PAR DÉFAUT
      status: 'active',
      membershipStatus: 'none', // AUCUNE COTISATION INITIALE
      bio: 'Étudiant à l\'ECE Paris, amateur de gastronomie et de terroirs.',
      favoriteTerroirs: data.favoriteTerroirs && data.favoriteTerroirs.length > 0 ? data.favoriteTerroirs : ['Savoie', 'Bourgogne', 'Jura'],
      passwordHash: hashedPassword,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    // Sauvegarde session locale
    setUser(newUser);
    localStorage.setItem('ece_terroir_user', JSON.stringify(newUser));

    // Sauvegarde registre local
    existingUsers.push(newUser);
    localStorage.setItem('ece_terroir_users_v2', JSON.stringify(existingUsers));

    // Tentative envoi API
    try {
      await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (e) {}

    return { success: true };
  };

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = normalizeEmail(email || '');
    if (!trimmedEmail) {
      return { success: false, error: 'Veuillez renseigner une adresse email valide.' };
    }

    // 1. Recherche dans la liste locale des utilisateurs
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

    if (!existingUser) {
      return {
        success: false,
        error: 'Aucun compte trouvé avec cette adresse email. Veuillez vous inscrire.',
      };
    }

    // 2. Vérification du mot de passe
    if (password) {
      const isValid = await verifyPassword(password, existingUser.passwordHash || 'demo_bypass');
      if (!isValid) {
        return { success: false, error: 'Mot de passe incorrect. Veuillez vérifier vos identifiants.' };
      }
    }

    // 3. Vérification de suspension
    if (existingUser.status === 'suspended' || existingUser.membershipStatus === 'suspended') {
      return {
        success: false,
        error: 'Ce compte a été suspendu par le Bureau ECE Terroir. Contactez les administrateurs.',
      };
    }

    // Mise à jour de la session
    const loggedUser: UserProfile = {
      ...existingUser,
      lastLogin: new Date().toISOString(),
    };

    setUser(loggedUser);
    localStorage.setItem('ece_terroir_user', JSON.stringify(loggedUser));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ece_terroir_user');
  };

  const updateRole = (newRole: UserRole) => {
    if (!user) return;
    const updatedUser: UserProfile = {
      ...user,
      role: newRole,
      membershipStatus: newRole === 'member' || newRole === 'admin' ? 'active' : user.membershipStatus,
    };
    setUser(updatedUser);
    localStorage.setItem('ece_terroir_user', JSON.stringify(updatedUser));
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    if (!user) return;
    const updatedUser: UserProfile = {
      ...user,
      ...updated,
    };
    setUser(updatedUser);
    localStorage.setItem('ece_terroir_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        updateRole,
        updateProfile,
        refreshUser,
      }}
    >
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
