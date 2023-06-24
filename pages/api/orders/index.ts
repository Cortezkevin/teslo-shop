import { db } from '@/database';
import { IOrder } from '@/interfaces';
import { Order, Product } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt';
import { getSession } from 'next-auth/react';

type Data = 
| { message: string }
| IOrder

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch( req.method ){
    case 'POST':
      return createOrder( req, res );
    default: 
      return res.status(400).json({ message: 'Bad request' })
  }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { orderItems, total } = req.body as IOrder;

  const token = await getToken({ req });
  if(!token){
    return res.status(401).json({ message: 'Not authorized' });
  }

  const productsIds = orderItems.map( p => p._id );
  await db.connect();

  const dbProducts = await Product.find({ _id: { $in: productsIds }});

  try {
    const subTotal = orderItems.reduce( ( prev, current ) => {
      const currentPrice = dbProducts.find(p => p.id === current._id )?.price;
      if( !currentPrice ){
        throw new Error('Verify the cart, a product not exist');
      }
      return (currentPrice * current.quantity) + prev;
    }, 0);

    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
    const backendTotal = subTotal * ( taxRate + 1 );

    if( total !== backendTotal ){
      throw new Error('The total not match with the amount');
    }
  
    const user = token.user as { id: string };
    const userId = user.id;
    const newOrder = new Order({ ...req.body, isPaid: false, user: userId });
    newOrder.total = Math.round( newOrder.total * 100 ) / 100;
    await newOrder.save();
    await db.disconnect();
    
    return res.status(201).json( newOrder );
  } catch (error: any) {
    await db.disconnect();
    return res.status(400).json({ message: error.message || 'Check the logs' });
  }

}