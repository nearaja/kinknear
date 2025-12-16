export default function handler(req, res) {
  res.status(200).json({
    botTokenExist: !!process.env.BOT_TOKEN
  });
}
