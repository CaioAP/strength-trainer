export function validatePassword(password: string, confirmPassword: string): string | null {
  if (password !== confirmPassword) return 'Passwords do not match';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Include at least one uppercase letter and one number';
  }
  return null;
}
