import express from "express";
import {
  getAllCarriersController,
  getCarrierByIdController,
} from "../controller/carriercontroller";
import {
  getAllReviewsController,
  getReviewByIdController,
  deleteReviewController,
} from "../controller/reviewcontroller";

const router = express.Router();

// Define a route handler for the GET request to "/getAll"
router.get("/carrier/getAll", getAllCarriersController);
router.get("/carrier/:id", getCarrierByIdController);
router.get("/review", getAllReviewsController);
router.get("/review/:id", getReviewByIdController);
router.get("/review/delete/:id", deleteReviewController);

export default router;
