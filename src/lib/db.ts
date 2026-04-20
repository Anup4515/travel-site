import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalWithMongoose = global as typeof global & {
  mongoose: MongooseCache;
};

const cached: MongooseCache = globalWithMongoose.mongoose || {
  conn: null,
  promise: null,
};

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = cached;
}

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = (async () => {
      const m = await mongoose.connect(MONGODB_URI);
      
      // Clean up stale indexes - run every connection
      try {
        const db = m.connection.db;
        if (db) {
          try {
            await db.collection("packagebookings").dropIndex("bookingReference_1");
            console.log("✓ Dropped stale bookingReference_1 index");
          } catch (err: any) {
            // Index might not exist, that's fine
            if (err.code !== 27) { // 27 = index not found
              console.log("Index check:", err.message);
            }
          }
        }
      } catch (error) {
        console.log("Cleanup (non-critical):", (error as Error).message);
      }
      
      return m;
    })();
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
