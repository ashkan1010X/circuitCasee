import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CAD",
  });
  return formatter.format(price);
};

/* First example: Before cn:
<div
  className={
    isDragOver
      ? "p-4 rounded-xl bg-blue-900/10 ring-2 ring-blue-900/25"
      : "p-4 rounded-xl bg-gray-900/5 ring-1 ring-gray-900/10"
  }
>

//Second example: after cn:

<div
className={cn(
  "p-4 rounded-xl bg-gray-900/5 ring-1 ring-gray-900/10",
  { "bg-blue-900/10 ring-2 ring-blue-900/25": isDragOver }
)}
>

*/
