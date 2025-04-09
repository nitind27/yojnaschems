export const isAlphaWithSpaces = (value: string): boolean => {
    // Allowing alphabetic characters from Latin and Devanagari scripts, including spaces
    return /^[A-Za-zÀ-ÿ\u0900-\u097F\s]+$/.test(value);
};

export const validateClusterName = (name: string): string | null => {
    if (!name) {
        return "Cluster name is required.";
    }
    if (!isAlphaWithSpaces(name)) {
        return "Cluster name must contain only alphabetic characters and spaces.";
    }
    return null; // No errors
};


export const validateTalukaName = (name: string): string | null => {
    if (!name) {
        return "Taluka  name is required.";
    }
    if (!isAlphaWithSpaces(name)) {
        return "Taluka  name must contain only alphabetic characters and spaces.";
    }
    return null; // No errors
};



// Function to check if a value is numeric
export const isNumeric = (value: string): boolean => {
    return /^\d+$/.test(value);
};

// Updated validation functions
export const validateTownName = (name: string): string | null => {
    if (!name) {
        return "Town name is required.";
    }
    if (!isAlphaWithSpaces(name)) {
        return "Town name must contain only alphabetic characters and spaces.";
    }
    return null; // No errors
};

export const validateNameMarathi = (name: string): string | null => {
    if (!name) {
        return "Name in Marathi is required.";
    }
    if (!isAlphaWithSpaces(name)) {
        return "Name in Marathi must contain only alphabetic characters and spaces.";
    }
    return null; // No errors
};

export const validateTalukaId = (talukaId: string): string | null => {
    if (!talukaId) {
        return "Taluka ID is required.";
    }
    // Assuming talukaId is selected from a dropdown, you may want to check if it's a valid ID
    return null; // No errors
};

export const validatePopulation = (population: string): string | null => {
    if (!population) {
        return "Population is required.";
    }
    if (!isNumeric(population)) {
        return "Population must be a number.";
    }
    return null; // No errors
};

// Main validation function
export const validateFormgrampanchayat = (townName: string, nameMarathi: string, talukaId: string, population: string): string[] => {
    const errors: string[] = [];

    const townNameError = validateTownName(townName);
    if (townNameError) errors.push(townNameError);

    const nameMarathiError = validateNameMarathi(nameMarathi);
    if (nameMarathiError) errors.push(nameMarathiError);

    const talukaIdError = validateTalukaId(talukaId);
    if (talukaIdError) errors.push(talukaIdError);

    const populationError = validatePopulation(population);
    if (populationError) errors.push(populationError);

    return errors; // Returns an array of error messages
};

// Usage example





// Validation function for the Masul Gaav form
export const validateMasulGaav = (
    townName: string,
    nameMarathi: string,
    talukaId: string,
    population: string,
    triblePopulation: string,
    arthikMaryada: string,
    villageType: string
): string[] => {
    const errors: string[] = [];

    // Check required fields
    if (!townName) {
        errors.push("Grampanchayat name is required.");
    }
    if (!nameMarathi) {
        errors.push("Mahsul Gaav is required.");
    }
    if (!talukaId) {
        errors.push("Select Taluka is required.");
    }
    if (!population) {
        errors.push("Total Population is required.");
    } else if (!isNumeric(population)) {
        errors.push("Total Population must be a number.");
    }
    if (!triblePopulation) {
        errors.push("Trible Population is required.");
    } else if (!isNumeric(triblePopulation)) {
        errors.push("Trible Population must be a number.");
    }
    if (!arthikMaryada) {
        errors.push("Arthik Maryada is required.");
    }
    if (!villageType) {
        errors.push("Village Type is required.");
    }

    return errors; // Return an array of error messages
};






// Types for the school form validation parameters
type SchoolFormValidationParams = {
    schoolName: string;
    address: string;
    clusterId: string;
    talukaId: string;
    udias: string;
    stds: string;
    medium: string;
    emailId: string;
    mukhyaName: string;
    mukhyaContact: string;
    mukhyaEmail: string;
    purushName: string;
    purushContact: string;
    purushEmail: string;
    striName: string;
    striContact: string;
    striEmail: string;
    schoolNameMr: string;
};

// Validation function for the school form
export const validateSchoolForm = ({
    schoolName,
    address,
    clusterId,
    talukaId,
    udias,
    stds,
    medium,
    emailId,
    mukhyaName,
    mukhyaContact,
    mukhyaEmail,
    purushName,
    purushContact,
    purushEmail,
    striName,
    striContact,
    striEmail,
    schoolNameMr,
}: SchoolFormValidationParams): string[] => {
    const errors: string[] = [];

    // Required field validation for text inputs
    const requiredTextFields = [
        { value: schoolName, name: "School Name" },
        { value: address, name: "Address" },
        { value: udias, name: "UDIAS" },
        { value: stds, name: "STDS" },
        { value: emailId, name: "Email ID" },
        { value: mukhyaName, name: "Mukhya Name" },
        { value: mukhyaContact, name: "Mukhya Contact" },
        { value: mukhyaEmail, name: "Mukhya Email" },
        { value: purushName, name: "Purush Name" },
        { value: purushContact, name: "Purush Contact" },
        { value: purushEmail, name: "Purush Email" },
        { value: striName, name: "Stri Name" },
        { value: striContact, name: "Stri Contact" },
        { value: striEmail, name: "Stri Email" },
        { value: schoolNameMr, name: "School Name (MR)" },
    ];

    requiredTextFields.forEach(field => {
        if (!field.value) {
            errors.push(`${field.name} is required.`);
        }
    });

    // Required field validation for select inputs
    const requiredSelectFields = [
        { value: clusterId, name: "Cluster ID" },
        { value: talukaId, name: "Taluka ID" },
        { value: medium, name: "Medium" },
    ];

    requiredSelectFields.forEach(field => {
        if (!field.value) {
            errors.push(`${field.name} is required.`);
        }
    });

    // UDIAS should be a maximum of 11 digits
    // UDIAS should be exactly 11 digits
    if (!udias) {
        errors.push("UDIAS is required.");
    } else if (udias.length !== 11) {
        errors.push("UDIAS must be exactly 11 digits.");
    }


    // Validate email formats (required and must be valid)
    const validateEmail = (email: string, name: string) => {
        if (!email) {
            errors.push(`${name} is required.`);
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.push(`${name} must be a valid email format.`);
        }
    };

    validateEmail(emailId, "Email ID");
    validateEmail(mukhyaEmail, "Mukhya Email");
    validateEmail(purushEmail, "Purush Email");
    validateEmail(striEmail, "Stri Email");

    // Validate contact formats (10 digits)
    const validateContact = (contact: string, name: string) => {
        if (!contact) {
            errors.push(`${name} is required.`);
        } else if (!/^\d{10}$/.test(contact)) {
            errors.push(`${name} must be a 10-digit number.`);
        }
    };

    validateContact(mukhyaContact, "Mukhya Contact");
    validateContact(purushContact, "Purush Contact");
    validateContact(striContact, "Stri Contact");

    return errors; // Returns an array of error messages
};





export const validateSuvidhaname = (name: string): string | null => {
    if (!name) {
        return "Suvidha name is required.";
    }
    if (!isAlphaWithSpaces(name)) {
        return "Suvidha name must contain only alphabetic characters and spaces.";
    }
    return null; // No errors
};





export const validaterepresentative = (name: string): string | null => {
    if (!name) {
        return "Representative name is required.";
    }
    if (!isAlphaWithSpaces(name)) {
        return "Representative name must contain only alphabetic characters and spaces.";
    }
    return null; // No errors
};






// Function to validate alphanumeric characters in any language
export const isAlphaNumeric = (value: string): boolean => {
    return /^[A-Za-zÀ-ÿ\u0900-\u097F0-9]+$/.test(value);
};

// Function to validate contact number (numeric only)


// Validation functions for each field
export const validateUsername = (username: string): string | null => {
    if (!username) {
        return "Username is required.";
    }
    if (!isAlphaNumeric(username)) {
        return "Username must contain only alphanumeric characters.";
    }
    return null;
};

export const validatePadName = (padName: string): string | null => {
    if (!padName) {
        return "Pad Name is required.";
    }
    return null;
};

export const validateCategory = (category: string): string | null => {
    if (!category) {
        return "Category is required.";
    }
    return null;
};

export const validateContactNo = (contactNo: string): string | null => {
    if (!contactNo) {
        return "Contact Number is required.";
    }
    if (!isNumeric(contactNo)) {
        return "Contact Number must contain only numbers.";
    }
    if (contactNo.length !== 10) {
        return "Contact Number must be exactly 10 digits.";
    }
    return null;
};


export const validatePassword = (password: string): string | null => {
    if (!password) {
        return "Password is required.";
    }
    return null;
};

export const validateAddress = (address: string): string | null => {
    if (!address) {
        return "Address is required.";
    }
    return null;
};

// Main validation function
export const validateFormsupervisor = (
    username: string,
    padName: string,
    category: string,
    contactNo: string,
    password: string,
    address: string
): string[] => {
    const errors: string[] = [];

    const usernameError = validateUsername(username);
    if (usernameError) errors.push(usernameError);

    const padNameError = validatePadName(padName);
    if (padNameError) errors.push(padNameError);

    const categoryError = validateCategory(category);
    if (categoryError) errors.push(categoryError);

    const contactNoError = validateContactNo(contactNo);
    if (contactNoError) errors.push(contactNoError);

    const passwordError = validatePassword(password);
    if (passwordError) errors.push(passwordError);

    const addressError = validateAddress(address);
    if (addressError) errors.push(addressError);

    return errors; // Returns an array of error messages
};





// Helper function to check if a string contains only alphanumeric characters (no special characters)
export const isAlphaNumericbank = (value: string): boolean => {
    return /^[A-Za-z0-9\s]+$/.test(value);
};



// Validation function for the bank form
export const validationBank = (
    bankName: string,
    accountNo: string,
    yojanayearid: string | number,
    amount: string
): string[] => {
    const errors: string[] = [];

    // Validate bankName (required and no special characters)
    if (!bankName) {
        errors.push("Bank Name is required.");
    } else if (!isAlphaNumericbank(bankName)) {
        errors.push("Bank Name must not contain special characters.");
    }

    // Validate accountNo (required, no special characters, and between 11 to 16 digits)
    if (!accountNo) {
        errors.push("Bank Account Number is required.");
    } else if (!isNumeric(accountNo)) {
        errors.push("Bank Account Number must contain only numbers.");
    } else if (accountNo.length < 11 || accountNo.length > 16) {
        errors.push("Bank Account Number must be between 11 and 16 digits.");
    }

    // Validate yojanayearid (required)
    if (!yojanayearid) {
        errors.push("Yojana Year ID is required.");
    }

    // Validate amount (required, must be a number)
    if (!amount) {
        errors.push("Amount is required.");
    } else if (!isNumeric(amount)) {
        errors.push("Amount must contain only numbers.");
    }

    return errors; // Return the array of error messages
};



export const validationOpenBalance = (
    bankyear: string | number, // Accepting string or number for bankyear
    openbalance: string
  ): string[] => {
    const errors: string[] = [];
  
    // Validate bankyear (required)
    if (!bankyear) {
      errors.push("Bank Year is required.");
    }
  
    // Validate openbalance (required and only numbers allowed)
    if (!openbalance) {
      errors.push("Open Balance is required.");
    } else if (!isNumeric(openbalance)) {
      errors.push("Open Balance must contain only numbers.");
    }
  
    return errors; // Return an array of error messages
  };
  