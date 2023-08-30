const { genSalt, compare, hash, getSalt } = require("bcryptjs");

//const salt = genSalt(10);

const convertHash = async (txt) => {
  const salt = await genSalt(10);
  return await hash(txt, salt);
};

const compareHashedValue = async (txt, hashedTxt) => {
  try {
    return await compare(txt, hashedTxt);
  } catch (e) {
    console.log(`error in compareHashedValue: ${e}`);
    return false;
  }
};

const getHashed = (hashedValed) => {
  return getSalt(hashedValed);
};

module.exports = { convertHash, compareHashedValue, getHashed };
