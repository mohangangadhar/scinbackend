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

export class ReviewController {
  // Create a new review
  async createReview(req: Request, res: Response) {
    try {
      const { document, reviewer_id, date } = req.body;
      const query =
        "INSERT INTO test_schema1.review_docs (document, reviewer_id, date) VALUES ($1, $2, $3) RETURNING *";
      const values = [document, reviewer_id, date];
      const result = await pool.query(query, values);
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Get all reviews
  async getAllReviews(req: Request, res: Response) {
    try {
      const query = "SELECT * FROM test_schema1.review_docs";
      const result = await pool.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Get a single review by ID
  async getReviewById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const query = "SELECT * FROM test_schema1.review_docs WHERE id = $1";
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        res.status(404).json({ error: "Review not found" });
      } else {
        res.json(result.rows[0]);
      }
    } catch (error) {
      console.error("Error fetching review:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Update a review
  async updateReview(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { document, reviewer_id, date } = req.body;
      const query =
        "UPDATE test_schema1.review_docs SET document = $1, reviewer_id = $2, date = $3 WHERE id = $4 RETURNING *";
      const values = [document, reviewer_id, date, id];
      const result = await pool.query(query, values);
      if (result.rows.length === 0) {
        res.status(404).json({ error: "Review not found" });
      } else {
        res.json(result.rows[0]);
      }
    } catch (error) {
      console.error("Error updating review:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Delete a review
  async deleteReview(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const query =
        "DELETE FROM test_schema1.review_docs WHERE id = $1 RETURNING *";
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        res.status(404).json({ error: "Review not found" });
      } else {
        res.json({ message: "Review deleted successfully" });
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export const createReviewController = new ReviewController().createReview;
export const getAllReviewsController = new ReviewController().getAllReviews;
export const deleteReviewController = new ReviewController().deleteReview;
export const getReviewByIdController = new ReviewController().getReviewById;
