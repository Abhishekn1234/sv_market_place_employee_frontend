export function validateEmail(email?: string): string {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Valid email is required");
  }
  return email.trim().toLowerCase();
}

export function validatePassword(password?: string): string {
  if (!password || password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) {
    throw new Error(
      "Password must contain uppercase, lowercase, number and special character"
    );
  }

  return password;
}

export function validateFullName(fullName?: string): string {
  if (!fullName || fullName.trim().length < 2) {
    throw new Error("Full name must be at least 2 characters");
  }
  return fullName.trim();
}

export function validatePhone(phone?: string): string {
  if (!phone || phone.trim().length < 10) {
    throw new Error("Valid phone number is required");
  }
  return phone.trim();
}
