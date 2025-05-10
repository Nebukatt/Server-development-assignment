// Define and export the "Home" model
module.exports = (sequelize, Sequelize) => {
  // Define the schema for the "Home" table
  const Home = sequelize.define(
    "Home",
    {
      // Country field: required string
      country: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      // City field: required string
      city: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      // Disable automatic createdAt and updatedAt fields
      timestamps: false,
    }
  );

  // Define associations for the "Home" model
  Home.associate = (models) => {
    // Each Home entry belongs to a Participant
    Home.belongsTo(models.Participants, {
      foreignKey: "participantId",  // Foreign key linking to Participants table
      as: "participant",            // Alias used in queries
      onDelete: "CASCADE",          // Delete Home entry if related Participant is deleted
    });
  };

  // Return the model
  return Home;
};
