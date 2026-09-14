const GAS_URL =
  'https://script.google.com/macros/s/AKfycbyiQByilfcF3QDIuYtDkNVV_GY-skTCZbP_9KwVlD-BxX1ysOvV6s9sd0gxdkiC7XSb/exec';

const EXPECTED_GAS_VERSION = '2026-09-14-separated-sheets-v1';

type GasResponse = {
  result?: string;
  message?: string;
  clinic?: string;
  version?: string;
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
      redirect: 'follow',
    });

    const responseText = await gasResponse.text();
    let gasBody: GasResponse | null = null;

    try {
      gasBody = JSON.parse(responseText) as GasResponse;
    } catch {
      console.error('Unexpected GAS response:', {
        status: gasResponse.status,
        url: gasResponse.url,
        preview: responseText.slice(0, 500),
      });
      return Response.json(
        {
          error:
            'Google Apps Scriptへ接続できません。GASのWebアプリを「次のユーザーとして実行: 自分」「アクセスできるユーザー: 全員」で新しいバージョンとして再デプロイしてください。',
        },
        { status: 502 },
      );
    }

    if (!gasResponse.ok) {
      console.error('GAS HTTP error:', gasResponse.status, gasBody);
      return Response.json(
        { error: gasBody.message || `GASへの接続に失敗しました。（HTTP ${gasResponse.status}）` },
        { status: 502 },
      );
    }

    if (gasBody.result !== 'success') {
      console.error('GAS submission failed:', gasBody);
      return Response.json(
        { error: gasBody.message || '回答の保存に失敗しました。' },
        { status: 502 },
      );
    }

    if (gasBody.version && gasBody.version !== EXPECTED_GAS_VERSION) {
      console.warn('Unexpected GAS version:', gasBody.version);
    }

    return Response.json({
      ok: true,
      clinic: gasBody.clinic || 'sannomiya',
      gasVersion: gasBody.version || null,
    });
  } catch (error) {
    console.error('Survey submission failed:', error);
    return Response.json({ error: '送信に失敗しました。' }, { status: 500 });
  }
}
