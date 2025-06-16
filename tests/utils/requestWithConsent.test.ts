import { Express } from "express";
import request from "supertest";

export const requestWithHeader = (app: Express) => {
  return request(app).set("x-cookie-consent", JSON.stringify({ accept: true }));
};
