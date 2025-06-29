import DOMPurify from 'dompurify';

/**
 * General utility function to sanitize any data type, protecting against XSS.
 * It handles strings, arrays, nested objects, and skips sanitizing files.
 *
 * @param {any} data - The data to sanitize
 * @returns {any} - The sanitized data
 */
export const sanitizeData = (data) => {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'string') {
    // Sanitize strings using DOMPurify
    return DOMPurify.sanitize(data);
  }

  if (Array.isArray(data)) {
    // Recursively sanitize array elements
    return data.map((item) => sanitizeData(item));
  }

  if (typeof data === 'object' && data.constructor === Object) {
    // Handle plain objects
    return Object.keys(data).reduce((sanitizedObj, key) => {
      const value = data[key];

      // Skip sanitizing File or Blob objects
      if (value instanceof File || value instanceof Blob) {
        sanitizedObj[key] = value;
      } else {
        sanitizedObj[key] = sanitizeData(value);
      }

      return sanitizedObj;
    }, {});
  }

  // Return other data types (numbers, booleans, etc.) as-is
  return data;
};

/**
 * Example usage:
 * const formData = {
 *   name: '<script>alert("XSS")</script>',
 *   files: [new File(["content"], "file.txt")],
 *   nested: {
 *     description: '<b>Safe text</b>',
 *   },
 *   items: ['<img src="x" onerror="alert(1)">', 42]
 * };
 *
 * const sanitizedData = sanitizeData(formData);
 */
