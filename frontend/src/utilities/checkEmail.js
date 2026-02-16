export function checkEmail(email) {
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return false; // Invalid email format
    }
    
    // Check for double dots in the domain part
    const domainPart = email.split('@')[1];
    if (domainPart.includes('..')) {
        return false; // Invalid email format due to double dots
    }
    
    return true; // Email is valid
}