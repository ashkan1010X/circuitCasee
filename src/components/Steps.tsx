import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    name: "Step 1: Add Image",
    description: "Upload an image of your product to get started",
    url: "/upload",
  },
  {
    name: "Step 2: Customize Design",
    description: "Add your own unique design to the product",
    url: "/design",
  },
  {
    name: "Step 3: Review & Publish",
    description: "Review your design and checkout",
    url: "/preview",
  },
];

export default function Steps() {
  const pathname = usePathname();
  return (
    <ol className="rounded-md bg-white lg:flex lg:rounded-none lg:border-l lg:border-r lg:border-gray-200">
      {STEPS.map((step, idx) => {
        const isCurrent = pathname.endsWith(step.url);
        const isCompleted = STEPS.slice(idx + 1).some((step) =>
          pathname.endsWith(step.url),
        );
        const imgPath = `/bot-${idx + 1}.png`;

        return (
          <li key={step.name} className="relative overflow-hidden lg:flex-1 ">
            <div>
              <span
                className={cn(
                  "absolute left-0 top-0 h-full w-1 bg-zinc-400 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full",
                  {
                    "bg-zinc-700": isCurrent,
                    "bg-primary": isCompleted,
                  },
                )}
                aria-hidden="true"
              />

              <span
                className={cn(
                  idx !== 0 ? "lg:pl-9" : "",
                  "flex items-center px-6 py-4 text-sm font-medium",
                )}
              >
                <span className="shrink-0">
                  <img
                    src={imgPath}
                    className={cn(
                      "flex h-40 w-20 object-contain items-center justify-center",
                      {
                        "border-none": isCompleted,
                        "border-zinc-700": isCurrent,
                      },
                    )}
                  />
                </span>

                <span className="ml-4 h-full mt-0.5 flex min-w-0 flex-col justify-center">
                  <span
                    className={cn("text-sm font-semibold text-zinc-700", {
                      "text-primary": isCompleted,
                      "text-zinc-700": isCurrent,
                    })}
                  >
                    {step.name}
                  </span>
                  <span className="text-sm text-zinc-500">
                    {step.description}
                  </span>
                </span>
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
