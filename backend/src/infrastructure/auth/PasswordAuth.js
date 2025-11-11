const bcrypt = require('bcrypt');

const saltRounds = 12; // Custo do hash (ajuste conforme necessidade)

const hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = { hashPassword, comparePassword };