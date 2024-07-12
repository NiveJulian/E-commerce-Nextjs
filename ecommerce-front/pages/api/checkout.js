import { mongooseConnect } from "../../lib/mongoose";
import { Order } from "../../models/Order";
import { Product } from "../../models/Product";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { NextApiRequest, NextApiResponse } from 'next';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(400).json("should be a POST request");
    return;
  }
  const {
    name,
    email,
    city,
    postalNumber,
    address,
    country,
    telefone,
    cartProducts,
  } = req.body;
  await mongooseConnect();
  const productIds = cartProducts;
  const uniqueIds = [...new Set(productIds)];
  const productsInfos = await Product.find({ _id: uniqueIds });

  let totalOrderValue = 0;
  const line_items = [];

  for (const productId of uniqueIds) {
    const productInfo = productsInfos.find(
      (p) => p._id.toString() === productId
    );
    const quantity = productIds.filter((id) => id === productId)?.length || 0;
    if (quantity > 0 && productInfo) {
      totalOrderValue += quantity * productInfo.price;
      line_items.push({
        name: productInfo.title,
        quantity: quantity,
        unit_price: productInfo.price * 1010,
      });
    }
  }

  const orderDoc = await Order.create({
    line_items,
    name,
    email,
    city,
    postalNumber,
    address,
    country,
    telefone,
    paid: false,
  });

  const preference = await new Preference(client).create({
    body: {
      items: line_items,
      back_urls: {
        success: 'https://toward-literature-nowhere-flows.trycloudflare.com/cart?success',
        failure: 'https://toward-literature-nowhere-flows.trycloudflare.com/cart?failure',
        pending: 'https://toward-literature-nowhere-flows.trycloudflare.com/cart?pending',
      },
      metadata: {orderId: orderDoc._id.toString(), test: 'ok'},
      notification_url: 'https://toward-literature-nowhere-flows.trycloudflare.com/api/payment',
     },
  });

  
  res.status(200).json({ preference });
}

