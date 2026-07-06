import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { CloudClient } from "chromadb";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


const chromaClient = new CloudClient();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});


app.get("/", function (req, res) {

  res.send("Student Handbook AI Assistant API is running");

});


app.post("/ask", async function (req, res) {

  try {

    const question = req.body.question;


    if (!question || question.trim() === "") {

      return res.status(400).json({
        error: "Please provide a question."
      });

    }


    const collection = await chromaClient.getCollection({
      name: "handbook-chunks"
    });


    const results = await collection.query({

      queryTexts: [question],

      nResults: 8

    });


    const documents = results.documents[0];

    const pages = results.metadatas[0];


    let context = "";


    for (let i = 0; i < documents.length; i++) {

      context +=
        "Page " +
        pages[i].page +
        ":\n" +
        documents[i] +
        "\n\n";

    }


    const prompt =
      "Use only the handbook information below to answer the question.\n\n" +

      "If the answer is not available in the handbook information, say exactly:\n" +

      "I could not find this information in the handbook.\n\n" +

      "HANDBOOK INFORMATION:\n" +
      context +

      "\nQUESTION:\n" +
      question;


    const response = await ai.interactions.create({

      model: "gemini-2.5-flash",

      input: prompt

    });


    let answer = response.output_text;


    if (!answer) {

      answer =
        "I could not find this information in the handbook.";

    }


    if (
      answer.includes(
        "I could not find this information in the handbook."
      )
    ) {

      return res.json({

        answer: answer,

        source: "Not found"

      });

    }


    const sourcePages = [];


    for (let i = 0; i < pages.length; i++) {

      const pageNumber = pages[i].page;


      if (!sourcePages.includes(pageNumber)) {

        sourcePages.push(pageNumber);

      }

    }


    res.json({

      answer: answer,

      source: "Pages " + sourcePages.join(", ")

    });


  } catch (error) {

    console.log(error);


    res.status(500).json({

      error: "Something went wrong. Please try again."

    });

  }

});


export default app;