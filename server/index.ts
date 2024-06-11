import express, { Request, Response } from "express";
import { MongoClient } from "mongodb";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const uri =
  "mongodb://hrTest:hTy785JbnQ5@mongo0.maximum.expert:27423/?authSource=hrTest&replicaSet=ReplicaSet&readPreference=primary";
const client = new MongoClient(uri, {
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 10000,
});

async function connectToMongo() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db("hrTest");
    const collection = db.collection("stock");

    app.get("/api/stock", async (req: Request, res: Response) => {
      try {
        console.log("Fetching stock data...");
        const { mark, models } = req.query;
        let query: any = {};
        if (mark) query.mark = mark;

        if (models) query.model = { $in: (models as string).split(",") };

        const result = await collection.find(query).toArray();
        console.log("Stock data:", result);
        res.json(result);
      } catch (err) {
        console.error("Error fetching stock data:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.get("/api/models", async (req: Request, res: Response) => {
      try {
        console.log("Fetching models data...");
        const { mark } = req.query;
        const query = mark ? { mark } : {};
        const result = await collection
          .aggregate([
            { $match: query },
            { $group: { _id: "$model", count: { $sum: 1 } } },
            { $project: { _id: 0, model: "$_id", count: 1 } },
            { $sort: { model: 1 } },
          ])
          .toArray();
        console.log("Models data:", result);
        res.json(result);
      } catch (err) {
        console.error("Error fetching models data:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.get("/api/marks", async (req: Request, res: Response) => {
      try {
        console.log("Fetching marks data...");
        const result = await collection
          .aggregate([
            { $group: { _id: "$mark", count: { $sum: 1 } } },
            { $project: { _id: 0, mark: "$_id", count: 1 } },
            { $sort: { mark: 1 } },
          ])
          .toArray();
        console.log("Marks data:", result);
        res.json(result);
      } catch (err) {
        console.error("Error fetching marks data:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    setTimeout(connectToMongo, 5000);
  }
}

connectToMongo();

// import express, { Request, Response } from 'express';
// import { MongoClient } from 'mongodb';
// import cors from 'cors';

// const app = express();
// const PORT = process.env.PORT || 5000;
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   })
// );

// const uri = 'mongodb://hrTest:hTy785JbnQ5@mongo0.maximum.expert:27423/?authSource=hrTest&replicaSet=ReplicaSet&readPreference=primary';
// const client = new MongoClient(uri, {
//   connectTimeoutMS: 10000,
//   serverSelectionTimeoutMS: 10000
// });

// async function connectToMongo() {
//   try {
//     await client.connect();
//     console.log('Connected to MongoDB');
//     const db = client.db('hrTest');
//     const collection = db.collection('stock');
//     app.get('/api/stock', async (req: Request, res: Response) => {
//       try {
//         const result = await collection.find().toArray();
//         res.json(result);
//       } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Internal Server Error' });
//       }
//     });

//     app.get('/api/models', async (req: Request, res: Response) => {
//       try {
//         const result = await collection.aggregate([
//           {
//             $group: {
//               _id: '$model',
//               count: { $sum: 1 }
//             }
//           },
//           {
//             $project: {
//               _id: 0,
//               model: '$_id',
//               count: 1
//             }
//           }
//         ]).toArray();
//         res.json(result);
//       } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Internal Server Error' });
//       }
//     });

//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   } catch (err) {
//     console.error('Failed to connect to MongoDB', err);
//     setTimeout(connectToMongo, 5000);
//   }
// }

// connectToMongo();
