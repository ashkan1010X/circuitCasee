// bg-zinc-950 border-zinc-950
// bg-green-950 border-green-950
// bg-rose-950 border-rose-950

import { PRODUCT_PRICES } from "@/config/product";

export const COLORS = [
  {
    label: "Black",
    value: "black",
    tw: "zinc-950",
  },
  {
    label: "Green",
    value: "green",
    tw: "green-950",
  },
  {
    label: "Red",
    value: "red",
    tw: "rose-950",
  },
] as const;

export const MODELS = {
  name: "models",
  options: [
    { label: "iPhone X", value: "iPhoneX" },
    { label: "iPhone 11", value: "iPhone11" },
    { label: "iPhone 12", value: "iPhone12" },
    { label: "iPhone 13", value: "iPhone13" },
    { label: "iPhone 14", value: "iPhone14" },
    { label: "iPhone 15", value: "iPhone15" },
    { label: "iPhone 16", value: "iPhone16" },
    { label: "iPhone 17", value: "iPhone17" },
  ],
} as const;

export const MATERIALS = {
  name: "material",
  options: [
    {
      label: "Silicone",
      value: "silicone",
      description: "Soft and flexible",
      price: PRODUCT_PRICES.material.silicone,
    },
    {
      label: "Leather",
      value: "leather",
      description: "Premium and durable",
      price: PRODUCT_PRICES.material.leather,
    },
  ],
} as const;

export const FINISHES = {
  name: "finish",
  options: [
    {
      label: "Smooth",
      value: "smooth",
      description: "Sleek and glossy",
      price: PRODUCT_PRICES.finish.smooth,
    },
    {
      label: "Textured",
      value: "textured",
      description: "Rough and tactile",
      price: PRODUCT_PRICES.finish.textured,
    },
  ],
} as const;
