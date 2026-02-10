export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // پاسخ به درخواست‌های OPTIONS برای CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    try {
      const data = await request.json();
      const { name, phone, work } = data;

      // این متغیرها در تنظیمات پنل کلودفلر وارد می‌شوند
      const botToken = env.TELEGRAM_BOT_TOKEN;
      const chatId = env.TELEGRAM_CHAT_ID;

      const text = `🚀 <b>پیام جدید از سایت سایتوفیل:</b>\n\n👤 <b>نام:</b> ${name}\n📞 <b>تلفن:</b> ${phone}\n💼 <b>حوزه کاری:</b> ${work}`;

      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML'
        })
      });

      if (!response.ok) {
        throw new Error('Telegram API error');
      }

      return new Response('Message Sent Successfully', { status: 200, headers: corsHeaders });
    } catch (err) {
      return new Response('Error: ' + err.message, { status: 500, headers: corsHeaders });
    }
  }
};
