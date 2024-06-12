import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";

const app = express();
const port = 5000;
const uri =
  "mongodb://hrTest:hTy785JbnQ5@mongo0.maximum.expert:27423/?authSource=hrTest&replicaSet=ReplicaSet&readPreference=primary";

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const client = new MongoClient(uri);

const connectToDatabase = async () => {
  try {
    await client.connect();
    const db = client.db("hrTest");
    const collection = db.collection("stock");

    app.get("/api/marks", async (req, res) => {
      try {
        const marks = await collection
          .aggregate([
            { $group: { _id: "$mark", count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
            { $project: { mark: "$_id", count: 1, _id: 0 } },
          ])
          .toArray();
        res.json(marks);
      } catch (error) {
        console.error("Error fetching marks:", error);
        res.status(500).json({ error: "Error fetching marks" });
      }
    });

    app.get("/api/stock", async (req, res) => {
      const { mark, models } = req.query;

      if (!mark) {
        return res.status(400).json({ error: "Mark is required" });
      }

      const query: any = { mark };
      if (models) {
        query.model = { $in: (models as string).split(",") };
      }

      try {
        const stock = await collection.find(query).toArray();
        res.json(stock);
      } catch (error) {
        console.error("Error fetching stock:", error);
        res.status(500).json({ error: "Error fetching stock" });
      }
    });

    app.get("/api/models", async (req, res) => {
      const { mark } = req.query;

      if (!mark) {
        return res.status(400).json({ error: "Mark is required" });
      }

      try {
        const models = await collection
          .aggregate([
            { $match: { mark } },
            { $group: { _id: "$model", count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
            { $project: { model: "$_id", count: 1, _id: 0 } },
          ])
          .toArray();
        res.json(models);
      } catch (error) {
        console.error("Error fetching models:", error);
        res.status(500).json({ error: "Error fetching models" });
      }
    });

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    app.use((req, res) => {
      res.status(500).json({ error: "Error connecting to MongoDB" });
    });
  }
};

connectToDatabase();
