module.exports = (sequelize, Sequelize) => {
  // Define the Participants model
  const Participants = sequelize.define(
    "Participants",
    {
      // Email field - must be valid, unique, and not null
      email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true, // Ensures the value is in email format
        },
      },
      // First name - required
      firstname: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      // Last name - required
      lastname: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      // Date of birth - must be a valid date and not null
      dob: {
        type: Sequelize.DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: true, // Validates proper date format
        },
      },
    },
    {
      timestamps: false, // Disable automatic createdAt and updatedAt columns
    }
  );

  // Define model associations
  Participants.associate = (models) => {
    // One-to-one relationship with Home model
    Participants.hasOne(models.Home, {
      foreignKey: "participantId",
      as: "homeDetails", // Alias for accessing related home data
      onDelete: "CASCADE", // Delete Home record if Participant is deleted
    });

    // One-to-one relationship with Work model
    Participants.hasOne(models.Work, {
      foreignKey: "participantId",
      as: "workDetails", // Alias for accessing related work data
      onDelete: "CASCADE", // Delete Work record if Participant is deleted
    });
  };

  return Participants;
};
