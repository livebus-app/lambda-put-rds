import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async (data: LabelTelemetry[]) => {
  console.info("Chegou no put", data);
  const { deviceCode, passengerCount, timestamp } = data[0];

  const device = await prisma.device.findUnique({
    where: {
      id: deviceCode
    }
  });

  if (!device) throw new Error("Device not found");

  return prisma.telemetry.create({
    data: {
      deviceId: device.id,
      passengerCount: passengerCount,
      timestamp: timestamp
    }
  })
};

type LabelTelemetry = {
  deviceCode: string;
  passengerCount: number;
  timestamp: string;
}

export { main };