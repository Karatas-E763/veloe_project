export function stripNonDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function formatCPF(value: string): string {
  const digits = stripNonDigits(value).slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function validateCPF(cpf: string): boolean {
  const digits = stripNonDigits(cpf);
  if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(digits[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  return remainder === parseInt(digits[10]);
}

export function formatPhone(value: string): string {
  const digits = stripNonDigits(value).slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 7)
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function validatePhone(phone: string): boolean {
  const digits = stripNonDigits(phone);
  return digits.length === 10 || digits.length === 11;
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validateBirthDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return false;

  const today = new Date();
  const minAge = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );
  const maxAge = new Date(
    today.getFullYear() - 120,
    today.getMonth(),
    today.getDate()
  );

  return parsed <= minAge && parsed >= maxAge;
}

export function formatLicensePlate(value: string): string {
  const cleaned = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 7);
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 4) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
}

export function validateLicensePlate(plate: string): boolean {
  const cleaned = plate.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(cleaned) || /^[A-Z]{3}[0-9]{4}$/.test(cleaned);
}

export function validateFullName(name: string): boolean {
  return name.trim().length >= 2;
}

export function isCPFFormatComplete(cpf: string): boolean {
  return stripNonDigits(cpf).length === 11;
}

export function isBirthDateFilled(date: string): boolean {
  return date.trim().length > 0;
}

export function isPersonalDataFilled(data: {
  fullName: string;
  cpf: string;
  email: string;
  phone: string;
  deviceType: string;
}): boolean {
  return (
    data.fullName.trim().length > 0 &&
    data.cpf.trim().length > 0 &&
    data.email.trim().length > 0 &&
    data.phone.trim().length > 0 &&
    (data.deviceType === "iphone" || data.deviceType === "android")
  );
}

export function isPersonalDataValid(data: {
  fullName: string;
  cpf: string;
  birthDate: string;
  email: string;
  phone: string;
  deviceType: string;
}): boolean {
  return (
    validateFullName(data.fullName) &&
    validateCPF(data.cpf) &&
    validateBirthDate(data.birthDate) &&
    validateEmail(data.email) &&
    validatePhone(data.phone) &&
    (data.deviceType === "iphone" || data.deviceType === "android")
  );
}
