import fs from "fs";
import dotenv from "dotenv";
import { PDFParse } from "pdf-parse";
import { CloudClient } from "chromadb";

dotenv.config();

const client = new CloudClient();

const pdfBuffer = fs.readFileSync("./data/handbook.pdf");

const parser = new PDFParse({
  data: pdfBuffer
});


function splitText(text) {

  const words = text.split(" ");

  const chunks = [];

  const chunkSize = 200;


  for (let i = 0; i < words.length; i += chunkSize) {

    const chunkWords = words.slice(i, i + chunkSize);

    const chunkText = chunkWords.join(" ");

    chunks.push(chunkText);
  }


  return chunks;
}


async function processHandbook() {

  try {

    console.log("Connecting to Chroma Cloud...");


    const collection = await client.getOrCreateCollection({
      name: "handbook-chunks"
    });


    console.log("Connected to collection");


    const info = await parser.getInfo();

    console.log("Total pages: " + info.total);


    const allChunks = [];


    for (
      let pageNumber = 1;
      pageNumber <= info.total;
      pageNumber++
    ) {

      const result = await parser.getText({
        partial: [pageNumber]
      });


      const pageText = result.text.trim();


      if (
        pageText.length > 50 &&
        pageText !== "This page intentionally left blank"
      ) {

        const pageChunks = splitText(pageText);


        for (let i = 0; i < pageChunks.length; i++) {

          if (pageChunks[i].trim().length > 50) {

            allChunks.push({
              id: "page-" + pageNumber + "-chunk-" + i,
              text: pageChunks[i],
              page: pageNumber
            });

          }

        }

      }


      console.log("Read page " + pageNumber);

    }


    console.log("");
    console.log("Total useful chunks: " + allChunks.length);


    const batchSize = 100;


    for (let i = 0; i < allChunks.length; i += batchSize) {

      const batch = allChunks.slice(i, i + batchSize);


      const ids = [];

      const documents = [];

      const metadatas = [];


      for (let j = 0; j < batch.length; j++) {

        ids.push(batch[j].id);

        documents.push(batch[j].text);

        metadatas.push({
          page: batch[j].page
        });

      }


      await collection.upsert({
        ids: ids,
        documents: documents,
        metadatas: metadatas
      });


      console.log(
        "Saved chunks " +
        (i + 1) +
        " to " +
        Math.min(i + batchSize, allChunks.length)
      );

    }


    console.log("");
    console.log("Handbook successfully saved to ChromaDB");


  } catch (error) {

    console.log("Error processing handbook:");

    console.log(error);

  } finally {

    await parser.destroy();

  }

}


processHandbook();