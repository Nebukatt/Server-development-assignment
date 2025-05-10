module.exports = (sequelize, Sequelize) => {
  // Define the Work model
  const Work = sequelize.define(
    "Work",
    {
      // Company name - required field
      companyname: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      // Salary - required field (float value)
      salary: {
        type: Sequelize.DataTypes.FLOAT,
        allowNull: false,
      },
      // Currency - required field
      currency: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false, // Disable automatic createdAt and updatedAt columns
    }
  );

  // Define model associations
  Work.associate = (models) => {
    // One-to-many relationship with Participants (Work -> Participant)
    Work.belongsTo(models.Participants, {
      foreignKey: "participantId", // Foreign key pointing to the Participants table
      as: "participant", // Alias for accessing related Participant data
    });
  };

  return Work;
};
