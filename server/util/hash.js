const bcrypt = require("bcryptjs");

const valueHasher = (value, salt) => bcrypt.hash(value, salt);

const matchChecker = (value, dbValue) => {
  let compare = bcrypt.compare(value, dbValue);
  return compare;
};

module.exports = { valueHasher, matchChecker };
