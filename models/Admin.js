const bcrypt = require("bcrypt");

module.exports = (sequelize, Sequelize) => {
  const Admin = sequelize.define(
    "Admin",
    {
      username: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  // Secure password validation using bcrypt
  Admin.prototype.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  return Admin;
};
