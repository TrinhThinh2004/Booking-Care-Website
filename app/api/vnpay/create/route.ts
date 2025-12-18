import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import qs from 'qs';
import moment from 'moment';
import DB from '@/lib/database/models';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, amount, bankCode, language } = body;

    if (!bookingId || !amount) {
      return NextResponse.json({ success: false, message: 'Missing bookingId or amount' }, { status: 400 });
    }

    // 1. Check Booking exists
    const booking = await DB.Booking.findByPk(Number(bookingId));
    if (!booking) return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });

    // 2. Config VNPay
    const tmnCode = process.env.VNP_TMNCODE;
    const secretKey = process.env.VNP_HASH_SECRET;
    const vnpUrl = process.env.VNP_URL;
    const returnUrl = process.env.VNP_RETURN_URL;

    // 3. Get IP Address
    const ipRaw = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const ipAddr = ipRaw.split(',')[0].trim();

    // 4. Create Params
    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const orderId = bookingId; 

    let vnp_Params: any = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = language || 'vn';
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = `Thanh toan cho booking ${bookingId}`;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = Math.round(Number(amount) * 100);
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode) {
      vnp_Params['vnp_BankCode'] = bankCode;
    }

    // 5. Sort & Sign

    vnp_Params = sortObject(vnp_Params);

    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey!);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    
    vnp_Params['vnp_SecureHash'] = signed;
    
    // 6. Create URL
    const paymentUrl = `${vnpUrl}?${qs.stringify(vnp_Params, { encode: false })}`;

    // 7. Save paymentUrl to Booking (optional)
    booking.paymentUrl = paymentUrl;
    await booking.save();

    return NextResponse.json({ success: true, url: paymentUrl });
  } catch (err: any) {
    console.error('VNPAY Create Error:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// Helper sort object theo key
function sortObject(obj: any) {
    let sorted: any = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}