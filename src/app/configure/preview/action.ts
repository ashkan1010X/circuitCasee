"use server";

import { BASE_PRICE, PRODUCT_PRICES } from "@/config/product";
import { db } from "@/db";
import { Order } from "@/generated/prisma";
import { stripe } from "@/lib/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const createCheckoutSession = async (configId: string) => {
  const configuration = await db.configuration.findUnique({
    where: { id: configId },
  });

  if (!configuration) {
    throw new Error("Configuration not found");
  }

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("You need to be logged in");
  }

  let dbUser = await db.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) {
    dbUser = await db.user.create({
      data: {
        id: user.id,
        email: user.email ?? "",
      },
    });
  }

  const { finish, material } = configuration;

  let totalPrice = BASE_PRICE;
  if (material === "leather") {
    totalPrice += PRODUCT_PRICES.material.leather;
  }
  if (finish === "textured") {
    totalPrice += PRODUCT_PRICES.finish.textured;
  }

  let order: Order | undefined = undefined;

  const existingOrder = await db.order.findFirst({
    where: {
      userId: dbUser.id,
      configurationId: configuration.id,
    },
  });

  if (existingOrder) {
    order = existingOrder;
  } else {
    order = await db.order.create({
      data: {
        amount: totalPrice / 100,
        userId: dbUser.id,
        configurationId: configuration.id,
      },
    });
  }

  const product = await stripe.products.create({
    name: "Custom iPhone Case",
    images: [configuration.imageUrl],
    default_price_data: {
      currency: "cad",
      unit_amount: totalPrice,
    },
  });

  const stripeSesson = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/thank-you?orderId=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/configure/preview?id=${configuration.id}`,
    payment_method_types: ["card"],
    mode: "payment",
    shipping_address_collection: {
      allowed_countries: ["CA", "US"],
    },
    metadata: { userId: dbUser.id, orderId: order.id },
    line_items: [{ price: product.default_price as string, quantity: 1 }],
  });

  return { url: stripeSesson.url };
};
