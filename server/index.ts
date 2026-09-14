import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleProgramStatus } from "./routes/program";
import {
  createPaymentRequest,
  listPaymentRequests,
  updatePaymentRequestStatus,
} from "./routes/payment-requests";
import {
  getAdminUserDetails,
  listAdminUsers,
  updateAdminUserStatus,
} from "./routes/admin-users";
import {
  getAdminApplicationDetails,
  listAdminApplications,
  mirrorApplication,
  updateAdminApplicationStatus,
} from "./routes/admin-applications";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/program/status", handleProgramStatus);
  app.post("/api/payment-requests", createPaymentRequest);
  app.get("/api/payment-requests", listPaymentRequests);
  app.patch(
    "/api/admin/payment-requests/:id/status",
    updatePaymentRequestStatus,
  );
  app.get("/api/admin/users", listAdminUsers);
  app.get("/api/admin/users/:id", getAdminUserDetails);
  app.patch("/api/admin/users/:id/status", updateAdminUserStatus);
  app.post("/api/applications/mirror", mirrorApplication);
  app.get("/api/admin/applications", listAdminApplications);
  app.get("/api/admin/applications/:id", getAdminApplicationDetails);
  app.patch("/api/admin/applications/:id/status", updateAdminApplicationStatus);

  return app;
}
