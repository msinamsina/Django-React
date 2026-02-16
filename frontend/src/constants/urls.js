export const BACKEND_URL = 
"__env__" in window ? window.__env__.BACKEND_URL : "";

export const REGISTER_URL = `${BACKEND_URL}/api/register/`;

export const VERIFY_EMAIL_URL = `${BACKEND_URL}/api/verify-email`;