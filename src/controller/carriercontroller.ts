import { Request, Response } from "express";
import { Pool } from "pg";
import * as dotenv from "dotenv";
// Load environment variables from .env file
dotenv.config();

// Create a PostgreSQL connection pool
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || "5432"), // Default port is 5432
});

export class CarrierController {
  // Create a new carrier
  async createCarrier(req: Request, res: Response) {
    try {
      const { carrier_name, date, created_by } = req.body;
      const query =
        "INSERT INTO test_schema1.shipping_carriers (carrier_name, date, created_by) VALUES ($1, $2, $3) RETURNING *";
      const values = [carrier_name, date, created_by];
      const result = await pool.query(query, values);
      res.json(result.rows[0]);
    } catch (error) {
      console.log(error);
      console.error("Error creating carrier:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Get all carriers
  async getAllCarriers(req: Request, res: Response) {
    try {
      const query = "SELECT * FROM test_schema1.shipping_carriers";
      const result = await pool.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching carriers:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Get a single carrier by ID
  async getCarrierById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const query =
        "SELECT * FROM test_schema1.shipping_carriers WHERE id = $1";
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        res.status(404).json({ error: "Carrier not found" });
      } else {
        res.json(result.rows[0]);
      }
    } catch (error) {
      console.error("Error fetching carrier:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Update a carrier
  async updateCarrier(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { carrier_name, date, created_by } = req.body;
      const query =
        "UPDATE test_schema1.shipping_carriers SET carrier_name = $1, date = $2, created_by = $3 WHERE id = $4 RETURNING *";
      const values = [carrier_name, date, created_by, id];
      const result = await pool.query(query, values);
      if (result.rows.length === 0) {
        res.status(404).json({ error: "Carrier not found" });
      } else {
        res.json(result.rows[0]);
      }
    } catch (error) {
      console.error("Error updating carrier:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Delete a carrier
  async deleteCarrier(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const query =
        "DELETE FROM test_schema1.shipping_carriers WHERE id = $1 RETURNING *";
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        res.status(404).json({ error: "Carrier not found" });
      } else {
        res.json({ message: "Carrier deleted successfully" });
      }
    } catch (error) {
      console.error("Error deleting carrier:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export const createCarrierController = new CarrierController().createCarrier;
export const getAllCarriersController = new CarrierController().getAllCarriers;
export const deleteCarrierController = new CarrierController().deleteCarrier;
export const getCarrierByIdController = new CarrierController().getCarrierById;
