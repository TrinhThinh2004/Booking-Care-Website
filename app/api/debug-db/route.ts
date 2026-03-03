
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASS!,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

export async function GET() {
  try {
    await sequelize.authenticate();
    const [users] = await sequelize.query("SELECT COUNT(*) as total FROM users");
    return Response.json({ connected: true, users });
  } catch (error) {
    return Response.json({ connected: false, error: String(error) });
  }
}