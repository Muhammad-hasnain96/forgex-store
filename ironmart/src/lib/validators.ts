export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string): boolean {
  return /^(\+92|0)[0-9]{10}$/.test(phone.replace(/[-\s]/g, ""));
}

export function validateName(name: string): boolean {
  return name.trim().length >= 2;
}

export function validatePassword(password: string): boolean {
  return password.length >= 6;
}

export function formatPrice(amount: number): string {
  return "Rs. " + amount.toLocaleString("en-PK");
}
