import { db } from "@/db";
import { notFound } from "next/navigation";
import DesignConfigurator from "./DesignConfigurator";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}
export default async function DesignPage({ searchParams }: PageProps) {
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

  const { width, height, imageUrl } = configuration;

  return (
    <div>
      <DesignConfigurator
        imageDimensions={{ width, height }}
        imageUrl={imageUrl}
        configId={configuration.id}
      />
    </div>
  );
}
