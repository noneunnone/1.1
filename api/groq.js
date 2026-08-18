// Backend proxy ke Groq API.
// API key TIDAK PERNAH dikirim ke browser — hanya dipakai di sini, di server,
// diambil dari environment variable GROQ_API_KEY yang diatur lewat
// dashboard Vercel (Settings > Environment Variables).
//
// CATATAN: versi Groq ini hanya membaca TEKS. Untuk PDF hasil scan/foto
// (yang tidak punya lapisan teks), backend ini tidak akan bisa membacanya —
// itu sebabnya di frontend, teks PDF diekstrak dulu di browser (pdf.js)
// sebelum dikirim ke sini.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'GROQ_API_KEY belum diatur di server. Tambahkan di Vercel > Settings > Environment Variables, lalu redeploy.'
    });
  }

  const { system, user, max_tokens } = req.body || {};
  if (!user) {
    return res.status(400).json({ error: 'Field "user" wajib diisi.' });
  }

  try {
    const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: max_tokens || 1200,
        messages: [
          { role: 'system', content: system || '' },
          { role: 'user', content: user }
        ]
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
