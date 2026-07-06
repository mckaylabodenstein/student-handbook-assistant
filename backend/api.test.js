import test from "node:test";
import assert from "node:assert";
import request from "supertest";

import app from "./app.js";


test("GET / should return 200", async function () {

  const response = await request(app)
    .get("/");


  assert.equal(response.status, 200);

});


test("POST /ask should reject missing question", async function () {

  const response = await request(app)
    .post("/ask")
    .send({});


  assert.equal(response.status, 400);

  assert.equal(
    response.body.error,
    "Please provide a question."
  );

});


test("POST /ask should reject empty question", async function () {

  const response = await request(app)
    .post("/ask")
    .send({
      question: ""
    });


  assert.equal(response.status, 400);

  assert.equal(
    response.body.error,
    "Please provide a question."
  );

});