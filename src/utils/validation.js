export const DUI_REGEX = /^\d{8}-\d{1}$/;
export const PHONE_REGEX = /^[267]\d{7}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
export const COMPANY_CODE_REGEX = /^[A-Z]{3}\d{3}$/;

export const validateDUI = (v) => DUI_REGEX.test(v);
export const validatePhone = (v) => PHONE_REGEX.test(v);
export const validateEmail = (v) => EMAIL_REGEX.test(v);
export const validatePassword = (v) => PASSWORD_REGEX.test(v);
export const validateCompanyCode = (v) => COMPANY_CODE_REGEX.test(v);

export const formatDUI = (raw) => {
  let value = raw.replace(/\D/g, "");
  if (value.length > 9) value = value.slice(0, 9);
  if (value.length > 8) value = `${value.slice(0, 8)}-${value.slice(8)}`;
  return value;
};

export const isValidCardNumber = (v) => {
  const s = String(v || "").replace(/\D/g, "");
  if (s.length < 13 || s.length > 19) return false;
  let sum = 0;
  let alt = false;
  for (let i = s.length - 1; i >= 0; i--) {
    let n = parseInt(s[i], 10);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
};

export const isValidExpiry = (mmYY) => {
  const m = String(mmYY || "").trim();
  if (!/^\d{2}\/\d{2}$/.test(m)) return false;
  const [mm, yy] = m.split("/").map(Number);
  if (mm < 1 || mm > 12) return false;
  const exp = new Date(2000 + yy, mm, 0, 23, 59, 59);
  return exp >= new Date();
};

export const isValidCVV = (v) => /^\d{3,4}$/.test(String(v || "").replace(/\D/g, ""));
