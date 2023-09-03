import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async (data: LabelTelemetry[]) => {
  const { deviceCode, timestamp, objectKey, detectedLabels } = data[0];

  const device = await prisma.device.findUnique({
    where: {
      id: deviceCode
    }
  });

  console.info(`Procurando pelo device ${deviceCode}`)
  if (!device) throw new Error("Device not found");

  if (detectedLabels.find(label => label.name === "Knife")) {
    const nonExpiredAlert = await prisma.alert.findFirst({
      where: {
        deviceId: device.id,
        type: "PERICULOUS_OBJECT",
        expiredAt: {
          gt: new Date()
        }
      }
    });

    if (!nonExpiredAlert) await prisma.alert.create({
      data: {
        deviceId: device.id,
        type: "PERICULOUS_OBJECT",
        expiredAt: new Date(Date.now() + 1000 * 60 * 2),
        description: "A knife was detected in the bus",
        objectKey,
      }
    })
  }

  return prisma.telemetry.create({
    data: {
      deviceId: device.id,
      passengerCount: detectedLabels.find(label => label.name === "Person")?.count || 0,
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
  detectedLabels: ({ name: string, count: number, })[];
}

export { main };