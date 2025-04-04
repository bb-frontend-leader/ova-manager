// Function to clean the string by removing special characters and converting to lowercase
export function cleanString(str: string) {
    return str.replace(/[^a-zA-Z0-9]/g, " ").toLowerCase();
}