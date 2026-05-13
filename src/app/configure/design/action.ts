"use server";

import { db } from "@/db";
import {
  CaseFinish,
  CaseMaterial,
  CaseColor,
  PhoneModel,
} from "@/generated/prisma";

export type SaveConfigArgs = {
  color: CaseColor;
  finish: CaseFinish;
  material: CaseMaterial;
  model: PhoneModel;
  configId: string;
};

export async function saveConfig({
  color,
  finish,
  material,
  model,
  configId,
}: SaveConfigArgs) {
  await db.configuration.update({
    where: { id: configId },
    data: {
      color,
      finish,
      material,
      model,
    },
  });
}
