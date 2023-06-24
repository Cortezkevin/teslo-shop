import { db } from '@/database';
import { IPaypal } from '@/interfaces';
import { Order } from '@/models';
import axios, { isAxiosError } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt';

type Data = {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch( req.method ) {
    case 'POST':
      return payOrder( req, res );
    default :
      return res.status(400).json({ message: 'Bad request' });
  }  
}

const getPaypalBearerToken = async() => {
  const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET_KEY;

  const base64Token = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`, 'utf-8').toString('base64');
  const body = new URLSearchParams('grant_type=client_credentials');
  try {
    const { data } = await axios.post(`${process.env.PAYPAL_OAUTH_URL || ''}`, body , {
      headers: {
        'Authorization': `Basic ${base64Token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return data.access_token;
  } catch (error) {
    if( isAxiosError( error ) ){
      console.log("AXIOS ERROR")
      console.log(error.response?.data);
    }else {
      console.log("OTHER ERROR")
      console.log(error)
    }
    return null;
  }
}

const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  
  const session = getToken({ req });

  if( !session ) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  console.log("SESSION GOOD")

  const paypalBearerToken = await getPaypalBearerToken();

  if( !paypalBearerToken ){
    return res.status(400).json({ message: 'Error at generate paypal token' });
  }

  console.log("PAYPAL TOKEN GOOD")

  const { transactionId = '', orderId = '' } = req.body;

  const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(`${process.env.PAYPAL_ORDERS_URL}/${transactionId}`, {
    headers: {
      'Authorization': `Bearer ${ paypalBearerToken }`
    }
  });

  console.log("CHECK PAY GOOD")

  if( data.status !== 'COMPLETED' ){
    return res.status(401).json({ message: 'Not valid order' });
  }

  await db.connect();
  const dbOrder = await Order.findById( orderId );

  if( !dbOrder ){
    await db.disconnect();
    return res.status(400).json({ message: 'This Order not exists' });
  }

  if( dbOrder.total !== Number(data.purchase_units[0].amount.value) ){
    await db.disconnect();
    return res.status(400).json({ message: 'This amounts not match with the order' });
  }

  dbOrder.transactionId = transactionId;
  dbOrder.isPaid = true;

  await dbOrder.save();
  
  await db.disconnect();

  return res.status(200).json({ message: 'Order paied :)' });
}

