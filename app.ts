import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async (data: LabelTelemetry[]) => {
  console.info("Chegou no put", data);
  const { deviceCode, passengerCount } = data[0];

  const device = await prisma.device.findFirst({
    where: {
      code: data[0].deviceCode,
    },
  });

  if (!device) throw new Error("Device not found");

  return prisma.telemetry.create({
    data: {
      deviceId: device.id,
      passengerCount: passengerCount,
    }
  })
};

type LabelTelemetry = {
  deviceCode: string;
  passengerCount: number;
}

export { main };