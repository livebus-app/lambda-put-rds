import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async (data: LabelTelemetry[]) => {
  const { deviceCode, passengerCount, timestamp, objectKey } = data[0];

  const device = await prisma.device.findUnique({
    where: {
      id: deviceCode
    }
  });

  if (!device) throw new Error("Device not found");

  return prisma.telemetry.create({
    data: {
      deviceId: device.id,
      passengerCount,
      timestamp,
      objectKey
    }
  })
};

type LabelTelemetry = {
  deviceCode: string;
  passengerCount: number;
  timestamp: string;
  objectKey: string;
}

export { main };