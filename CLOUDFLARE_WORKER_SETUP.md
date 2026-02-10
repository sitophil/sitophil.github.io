# راهنمای راه‌اندازی ورکر کلودفلر برای فرم تماس سایتوفیل

این راهنما به شما کمک می‌کند تا یک Cloudflare Worker بسازید که پیام‌های فرم تماس وب‌سایت شما را به یک ربات تلگرام ارسال کند. تمام مراحل از طریق وب‌سایت کلودفلر انجام می‌شود.

## مرحله ۱: ساخت ربات تلگرام و دریافت Token
۱. در تلگرام به آیدی `@BotFather` پیام دهید.
۲. دستور `/newbot` را ارسال کنید و نام و یوزرنیم ربات خود را انتخاب کنید.
۳. در انتها، یک **API Token** به شما داده می‌شود (چیزی شبیه `123456789:ABCdefGhI...`). آن را کپی کنید.

## مرحله ۲: دریافت Chat ID
۱. ربات خود را در تلگرام استارت کنید (دکمه Start را بزنید).
۲. به آیدی `@userinfobot` پیام دهید تا **ID** عددی خود را دریافت کنید. این همان `CHAT_ID` شماست.

## مرحله ۳: ساخت ورکر در کلودفلر
۱. وارد پنل [Cloudflare Dashboard](https://dash.cloudflare.com/) شوید.
۲. از منوی سمت چپ به بخش **Workers & Pages** بروید.
۳. روی دکمه **Create application** و سپس **Create Worker** کلیک کنید.
۴. یک نام برای ورکر خود انتخاب کنید (مثلاً `sitophil-contact-form`) و روی **Deploy** کلیک کنید.

## مرحله ۴: وارد کردن کد ورکر
۱. بعد از Deploy، روی دکمه **Edit Code** کلیک کنید.
۲. کد موجود در فایل (معمولاً `worker.js`) را کاملاً پاک کنید و کد زیر را جایگزین آن کنید:

```javascript
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
```

۳. روی دکمه **Save and Deploy** (یا **Deploy**) در بالای صفحه کلیک کنید.

## مرحله ۵: تنظیم متغیرهای محیطی (Variables)
۱. به صفحه تنظیمات ورکر خود برگردید (در پنل کلودفلر).
۲. به لبه (Tab) **Settings** بروید.
۳. از منوی سمت چپ تنظیمات، **Variables** را انتخاب کنید.
۴. در قسمت **Environment Variables**، روی **Add variable** کلیک کرده و دو متغیر زیر را اضافه کنید:
   - نام: `TELEGRAM_BOT_TOKEN` | مقدار: (توکنی که از BotFather گرفتید)
   - نام: `TELEGRAM_CHAT_ID` | مقدار: (آیدی عددی که از userinfobot گرفتید)
۵. روی **Save and deploy** کلیک کنید.

## مرحله ۶: اتصال وب‌سایت به ورکر
۱. در همان صفحه اول ورکر (بخش Summary)، آدرس URL ورکر خود را کپی کنید (چیزی شبیه `https://sitophil-contact-form.username.workers.dev`).
۲. فایل `index.html` سایت خود را باز کنید.
۳. در انتهای فایل، در بخش اسکریپت‌ها، عبارت `YOUR_CLOUDFLARE_WORKER_URL` را پیدا کرده و آدرس ورکر خود را جایگزین آن کنید (دقت کنید که آدرس داخل کوتیشن باشد).
۴. فایل را ذخیره و آپلود کنید.

**تبریک! فرم تماس هوشمند و "بامزه" شما اکنون به تلگرام متصل است.**
