import { db } from "@/db";
import { notFound } from "next/navigation";
import PreviewDesign from "./PreviewDesign";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function PreviewPage({ searchParams }: PageProps) {
  const { configId } = await searchParams;

  if (!configId || typeof configId !== "string") {
    return notFound();
  }

  const configuration = await db.configuration.findUnique({
    where: { id: configId },
  });

  if (!configuration) {
    return notFound();
  }

  return <PreviewDesign configuration={configuration} />;
}
