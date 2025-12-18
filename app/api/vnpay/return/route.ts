import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import qs from 'qs';
import DB from '@/lib/database/models';

// Helper sort (cần giống hệt bên Create)
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    let vnp_Params: any = {};
    const vnp_SecureHash = searchParams.get('vnp_SecureHash');
    
 
    for (const [key, value] of searchParams.entries()) {
        vnp_Params[key] = value;
    }

 
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];


    vnp_Params = sortObject(vnp_Params);

    const secretKey = process.env.VNP_HASH_SECRET;
    
 
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey!);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (vnp_SecureHash === signed) {
        const responseCode = vnp_Params['vnp_ResponseCode'];
        const bookingId = vnp_Params['vnp_TxnRef']; 

        const booking = await DB.Booking.findByPk(Number(bookingId));
        if (!booking) {
            return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
        }

        if (responseCode === '00') {
            
            if (booking.status !== 'CONFIRMED' && booking.status !== 'COMPLETED') {
                booking.status = 'CONFIRMED'; 
                booking.paymentInfo = JSON.stringify(vnp_Params); 
                await booking.save();
            }
            return NextResponse.json({ success: true, message: 'Payment successful' });
        } else {
      
            booking.status = 'CANCELLED'; 
           
            await booking.save();
            
            return NextResponse.json({ success: false, message: 'Payment failed', code: responseCode });
        }
    } else {
        return NextResponse.json({ success: false, message: 'Invalid Signature' }, { status: 400 });
    }
  } catch (err: any) {
    console.error('VNPAY Return Error:', err);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}