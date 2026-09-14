const GAS_URL =
  'https://script.google.com/macros/s/AKfycbxoGBuRblAo7EYdij2fwr0yeHGkqZrlRfl2yOJ56hXX4wySn7EW4QwkyuREYyoL2jvn/exec';

type GasResponse = {
  result?: string;
  message?: string;
  clinic?: string;
};

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    if (!payload || payload.clinicKey !== 'sannomiya') {
      return Response.json({ error: '送信データが不正です。' }, { status: 400 });
    }

    const gasResponse = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const responseText = await gasResponse.text();
    let gasBody: GasResponse | null = null;

    try {
      gasBody = JSON.parse(responseText) as GasResponse;
    } catch {
      console.error('Unexpected GAS response:', responseText);
    }

    if (!gasResponse.ok || gasBody?.result !== 'success') {
      console.error('GAS submission failed:', {
        status: gasResponse.status,
        body: gasBody,
      });
      return Response.json(
        { error: gasBody?.message || '回答の保存に失敗しました。' },
        { status: 502 },
      );
    }

    return Response.json({ ok: true, clinic: gasBody.clinic || 'sannomiya' });
  } catch (error) {
    console.error('Survey submission failed:', error);
    return Response.json({ error: '送信に失敗しました。' }, { status: 500 });
  }
}
