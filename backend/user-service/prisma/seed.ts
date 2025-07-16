import mongoose from "mongoose";
import { PrismaClient, RequestStatus } from "@prisma/client";
import requestModel from "../src/models/requestModel";
import { config } from "../src/config";

const prisma = new PrismaClient();

async function main() {
  // 1. Connect to MongoDB
  await mongoose.connect(config.db.mongoURI);

  // 2. Fetch all requests
  const mongoRequests = await requestModel.find();
  console.log(mongoRequests)

  console.log(`Found ${mongoRequests.length} requests.`);

  for (const req of mongoRequests) {
    try {
      // 3. Transform and insert into Prisma
      await prisma.organizerRequest.create({
        data: {
          userId: req.userId,
          organization: req.organization,
          website: req.website || null,
          reason: req.reason,
          documents: req.documents,
          status: req.status as RequestStatus, // must match Prisma enum
          rejectionReason: req.rejectionReason || null,
          createdAt: req.createdAt,
          updatedAt: req.updatedAt,
        },
      });

      console.log(`✅ Migrated request for userId: ${req.userId}`);
    } catch (err: any) {
      console.error(`❌ Failed for userId ${req.userId}:`, err.message);
    }
  }

  await prisma.$disconnect();
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
