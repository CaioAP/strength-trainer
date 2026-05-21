import React from "react";

export interface UseLoginFormReturn {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
  error: string | null;
  deletionScheduled: string | null;
  handleLogin: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export interface UseForgotPasswordFormReturn {
  email: string;
  setEmail: (email: string) => void;
  loading: boolean;
  success: boolean;
  error: string | null;
  handleResetRequest: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export interface UseResetPasswordFormReturn {
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  loading: boolean;
  initializing: boolean;
  error: string | null;
  success: boolean;
  handleReset: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export interface UseSetPasswordFormReturn {
  fullName: string;
  setFullName: (name: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  loading: boolean;
  initializing: boolean;
  error: string | null;
  handleSetPassword: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}
