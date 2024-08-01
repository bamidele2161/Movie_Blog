exports.validateInput = (input, type, min, max) => {
  //convert input to string and trim whitespace

  const sanitizedInput = String(input).trim();

  //Define regular expression for email and name validation
  const emailRegex =
    /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,12})(\.[a-z]{2,12})?$/;
  const nameRegex = /^[a-zA-Z-]+$/;

  //validate input based on the specified type

  switch (type) {
    case "email":
      return sanitizedInput.toLowerCase().match(emailRegex) !== null;
    case "name":
      return sanitizedInput.toLowerCase().match(nameRegex) !== null;
    case "length":
      return sanitizedInput.length >= min && sanitizedInput.length <= max;
    default:
      return false;
  }
};
