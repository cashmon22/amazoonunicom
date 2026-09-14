import { RequestHandler } from "express";
import { ProgramResponse } from "@shared/api";

export const handleProgramStatus: RequestHandler = (_req, res) => {
  const response: ProgramResponse = {
    message: "Amazon Contributor Program API",
  };
  res.status(200).json(response);
};
