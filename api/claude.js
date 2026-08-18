// Backend proxy ke Anthropic API.
// API key TIDAK PERNAH dikirim ke browser — hanya dipakai di sini, di server,
// diambil dari environment variable ANTHROPIC_API_KEY yang diatur lewat
// dashboard Vercel (Settings > Environment Variables). Ini yang membuat versi
// mandiri ini aman dipakai bersama staf lain, karena tidak ada yang bisa
// mencuri key hanya dengan "View Page Source" di browser.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'ANTHROPIC_API_KEY belum diatur di server. Tambahkan di Vercel > Settings > Environment Variables, lalu redeploy.'
    });
  }

  const { system, messages, max_tokens } = req.body || {};
  if (!messages) {
    return res.status(400).json({ error: 'Field "messages" wajib diisi.' });
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: max_tokens || 1200,
        system,
        messages
      })
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: data });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Terjadi kesalahan pada server.' });
  }
}
