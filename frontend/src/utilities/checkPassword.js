export function checkPasswordComplexity(password, confirmPassword) {

    var errors = [];
    
    if (password.length < 8) {
        errors.push("Password must be at least 8 characters long.");
    }
    if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter.");
    }
    if (!/[a-z]/.test(password)) {
        errors.push("Password must contain at least one lowercase letter.");
    }
    if (!/[0-9]/.test(password)) {
        errors.push("Password must contain at least one number.");
    }
    if (!/[@$!%*?&]/.test(password)) {
        errors.push("Password must contain at least one special character (@, $, !, %, *, ?, &).");
    }
    if (password !== confirmPassword) {
        errors.push("Passwords do not match.");
    }
    return errors; // Return errors array
}