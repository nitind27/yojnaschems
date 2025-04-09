export const parseMsg = (
    message: string | Record<string, string[]> | null,
  ): string | null => {
    if (message === null) {
      return null;
    }
  
    if (typeof message === "string") {
      return message;
    }
  
    if (typeof message === "object") {
      // Check if it's an object with a 'message' property as a string
      if ("message" in message && typeof message.message === "string") {
        return message.message;
      }
  
      // Otherwise, process it as an object of string arrays
      const errorMessages = Object.values<string[]>(message);
  
      // Check if errorMessages[0] is an array
      if (Array.isArray(errorMessages[0])) {
        // Assuming you want to return the first error message of the first array
        return errorMessages.length > 0 && errorMessages[0].length > 0
          ? errorMessages[0][0]
          : "Something went wrong";
      } else {
        // If it's not an array of arrays, assume it's an array of strings
        return errorMessages.length > 0
          ? errorMessages[0]
          : "Something went wrong";
      }
    }
  
    return "Unknown error";
  };