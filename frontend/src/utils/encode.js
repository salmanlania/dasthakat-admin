export function decodeRfqData(encodedData) {
  try {
    // Step 1: Replace URL-safe characters back to standard Base64 characters.
    // '-' becomes '+' and '_' becomes '/'.
    let base64 = encodedData.replace(/-/g, '+').replace(/_/g, '/');

    // Step 2: Add back the Base64 padding ('=') that was removed.
    // A valid Base64 string's length must be a multiple of 4.
    const padding = base64.length % 4;
    if (padding) {
      base64 += '='.repeat(4 - padding);
    }

    // Step 3: Decode the Base64 string using the built-in atob() function.
    // atob() decodes a string of data which has been encoded using base-64 encoding.
    const jsonData = atob(base64);

    // Step 4: Parse the JSON string into a JavaScript object.
    const data = JSON.parse(jsonData);

    return data;
  } catch (error) {
    // If any step fails (e.g., invalid Base64 or JSON), it will throw an error.
    return null; // Return null to indicate failure.
  }
}
