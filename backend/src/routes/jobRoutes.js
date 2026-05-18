const express = require("express");
const JobRequest = require("../models/JobRequest");

const router = express.Router();

// GET /api/jobs?category=Plumbing&status=Open
router.get("/", async (req, res, next) => {
  try {
    const { category, status, search } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const jobs = await JobRequest.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/jobs/:id
router.get("/:id", async (req, res, next) => {
  try {
    const job = await JobRequest.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job request not found",
      });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/jobs
router.post("/", async (req, res, next) => {
  try {
    const job = await JobRequest.create(req.body);

    res.status(201).json({
      success: true,
      message: "Job request created successfully",
      data: job,
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/jobs/:id
router.patch("/:id", async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const allowedStatuses = ["Open", "In Progress", "Closed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const job = await JobRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      {
  returnDocument: "after",
  runValidators: true,
}
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job status updated successfully",
      data: job,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/jobs/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const job = await JobRequest.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job request deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;