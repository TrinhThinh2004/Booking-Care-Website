const mysql2 = require('mysql2');
const { Sequelize } = require("sequelize");
const config = require("../config/config");

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: 'mysql',
    dialectModule: mysql2,
    logging: dbConfig.logging,
    timezone: dbConfig.timezone,
    define: dbConfig.define,
    pool: dbConfig.pool,
  }
);

// Import models
const User = require("./User")(sequelize, Sequelize.DataTypes);
const Doctor = require("./Doctor")(sequelize, Sequelize.DataTypes);
const Specialty = require("./Specialty")(sequelize, Sequelize.DataTypes);
const Clinic = require("./Clinic")(sequelize, Sequelize.DataTypes);
const Schedule = require("./Schedule")(sequelize, Sequelize.DataTypes);
const Booking = require("./Booking")(sequelize, Sequelize.DataTypes);
const AllCode = require("./AllCode")(sequelize, Sequelize.DataTypes);
const Markdown = require("./Markdown")(sequelize, Sequelize.DataTypes);
const History = require("./History")(sequelize, Sequelize.DataTypes);

// Define associations
// User associations
User.hasMany(Doctor, { foreignKey: "userId", as: "doctors" });
User.hasMany(Booking, { foreignKey: "patientId", as: "bookings" });
User.hasMany(History, { foreignKey: "patientId", as: "histories" });

// Doctor associations
Doctor.belongsTo(User, { foreignKey: "userId", as: "user" });
Doctor.belongsTo(Specialty, { foreignKey: "specialtyId", as: "specialty" });
Doctor.belongsTo(Clinic, { foreignKey: "clinicId", as: "clinic" });
Doctor.hasMany(Schedule, { foreignKey: "doctorId", as: "schedules" });
Doctor.hasMany(Booking, { foreignKey: "doctorId", as: "bookings" });
Doctor.hasMany(History, { foreignKey: "doctorId", as: "histories" });
Doctor.hasOne(Markdown, { foreignKey: "doctorId", as: "markdown" });

// Specialty associations
Specialty.hasMany(Doctor, { foreignKey: "specialtyId", as: "doctors" });

// Clinic associations
Clinic.hasMany(Doctor, { foreignKey: "clinicId", as: "doctors" });
Clinic.hasMany(Booking, { foreignKey: "clinicId", as: "bookings" });

// Schedule associations
Schedule.belongsTo(Doctor, { foreignKey: "doctorId", as: "doctor" });
Schedule.hasMany(Booking, { foreignKey: "scheduleId", as: "bookings" });

// Booking associations
Booking.belongsTo(User, { foreignKey: "patientId", as: "patient" });
Booking.belongsTo(Doctor, { foreignKey: "doctorId", as: "doctor" });
Booking.belongsTo(Clinic, { foreignKey: "clinicId", as: "clinic" });
Booking.belongsTo(Schedule, { foreignKey: "scheduleId", as: "schedule" });

// Markdown associations
Markdown.belongsTo(Doctor, { foreignKey: "doctorId", as: "doctor" });

// History associations
History.belongsTo(User, { foreignKey: "patientId", as: "patient" });
History.belongsTo(Doctor, { foreignKey: "doctorId", as: "doctor" });

const db = {
  sequelize,
  Sequelize,
  User,
  Doctor,
  Specialty,
  Clinic,
  Schedule,
  Booking,
  AllCode,
  Markdown,
  History,
};

module.exports = db;
