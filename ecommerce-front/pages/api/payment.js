import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Obtén el ID del pago desde la solicitud
      const paymentId = req.query['data.id'];
      const payment = await new Payment(client).get({ id: paymentId });

      console.log("payment:",payment);

      // Envía los detalles del pago como respuesta
      return res.status(200).json({ success: true, payment: payment });
    } catch (error) {
      console.error('Error processing request:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
