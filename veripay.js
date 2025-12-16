export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const data = req.body;

  payload = {
    "amount": product["price"],
    "description": product["name"],
    "external_id": order_id,
    "callback_url": "https://nama-project.vercel.app/api/veripay"
    }

  if (!data || data.status !== "PAID") {
    return res.status(200).json({ message: "Ignored" });
  }

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const ordersUrl = process.env.ORDERS_JSON_URL; 
  const productsUrl = process.env.PRODUCTS_JSON_URL;

  // ambil orders
  const orders = await fetch(ordersUrl).then(r => r.json());
  const products = await fetch(productsUrl).then(r => r.json());

  const order = orders[data.external_id];
  if (!order || order.paid) {
    return res.status(200).json({ message: "Already processed" });
  }

  // tandai paid (jika pakai db nanti diganti)
  order.paid = true;

  const product = products[order.product_id];

  // kirim produk ke user
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: order.user_id,
      text: `✅ PEMBAYARAN BERHASIL\n\n📦 ${product.name}\n\n${product.content}`,
      parse_mode: "Markdown"
    })
  });

  return res.status(200).json({ success: true });
}
