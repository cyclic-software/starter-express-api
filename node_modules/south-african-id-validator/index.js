// ************************************************************************************************************************
// A South African ID number is a 13-digit number which is defined by the following format: YYMMDDSSSSCAZ.
//
// The first six digits (YYMMDD) are based on your date of birth. For example, 23 January 1988 becomes 880123.
// Although rare, it can happen that someone’s birth date does not correspond with their ID number.
//
// The next four digits (SSSS) are used to define your gender, with only the first digit of the sequence relevant.
// Females have a number of 0 to 4, while males are 5 to 9. 891020 5072 0 8 7
//
// The next digit (C) is 0 if you are an SA citizen, or 1 if you are a permanent resident.
//
// The next digit (A) was used until the late 1980s to indicate a person’s race. This has been eliminated and
// old ID numbers were reissued to remove this.
//
// The last digit (Z) is a checksum digit, used to check that the number sequence is accurate using the Luhn algorithm.
// ************************************************************************************************************************

export const validateIdNumber = idNumber => {
  // regex pattern using the Luhn algorithm
  const ex = /^(((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(\d{4})( |-)(\d{3})|(\d{7}))/;

  // if the ID number is not valid
  if (ex.test(idNumber) === false) {
    return {
      valid: false,
    };
  }

  // finally return the deets if the number is valid
  return {
    valid: true,
    gender: parseGender(idNumber),
    DOB: parseDOB(idNumber),
    isCitizen: parseCitizenship(idNumber),
  };
};


// get the gender out of the SSSS sequence
export const parseGender = idNumber => {
  const genderCode = idNumber.substring(6, 10);
  const gender = Number(genderCode) < 5000 ? 'female' : 'male';
  return gender;
};

// check for citizenshop
export const parseCitizenship = idNumber => {
  const citizenshipCode = idNumber.substring(10, 11);
  const isCitizen = Number(citizenshipCode) === 0;
  return isCitizen;
}

// get the date of birth out of the number
export const parseDOB = idNumber => {
  // get year, and assume the century
  const currentYear = new Date().getFullYear();
  const currentCentury = Math.floor(currentYear / 100) * 100;
  const currentMonth = new Date().getMonth();
  const currentDay = new Date().getDay();
  
  let yearPart = currentCentury + parseInt(idNumber.substring(0, 2), 10);

  // In Javascript, Jan=0. In ID Numbers, Jan=1.
  const monthPart = parseInt(idNumber.substring(2, 4), 10) - 1;

  const dayPart = parseInt(idNumber.substring(4, 6), 10);

  // only 16 years and above are eligible for an ID
  const eligibleYear = currentYear - 16;
  // make sure the ID's DOB is not below 16 years from today, if so it's last century issue
  if (yearPart > eligibleYear || yearPart === eligibleYear && (monthPart > currentMonth || monthPart === currentMonth && dayPart > currentDay)) {
    yearPart -= 100; // must be last century
  }
  
  const dateOfBirth = new Date(yearPart, monthPart, dayPart);

  // validate that date is in a valid range by making sure that it wasn't 'corrected' during construction
  if (
    !dateOfBirth ||
    dateOfBirth.getFullYear() !== yearPart ||
    dateOfBirth.getMonth() !== monthPart ||
    dateOfBirth.getDate() !== dayPart
  ) {
    return undefined;
  }

  return dateOfBirth;
}
