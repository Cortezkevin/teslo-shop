import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
 
export async function middleware(req: NextRequest) {
  
  switch( req.nextUrl.pathname ){
    case '/admin':
    case '/admin/orders':
    case '/admin/products':
      return validateRoleAdmin( req );
    case '/checkout/address':
    case '/checkout/summary':
      return validateSession( req );
    default:
      return NextResponse.next();
  }
}

const validateRoleAdmin = async ( req: NextRequest ) => {
  const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if( !session ){
    const requestedPage = req.nextUrl.pathname;
    const url = req.nextUrl.clone();
    url.pathname = '/auth/login';
    url.search = `prevPage=${ requestedPage }`;
    return NextResponse.redirect( url );
  }

  const validRoles = ['admin', 'super-user', 'SEO'];
  if( !validRoles.includes( session.user.role ) ){
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

const validateSession = async ( req: NextRequest ) => {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if( !session ){
    const requestedPage = req.nextUrl.pathname;
    const url = req.nextUrl.clone();
    url.pathname = '/auth/login';
    url.search = `prevPage=${ requestedPage }`;
    return NextResponse.redirect( url );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/checkout/address', '/checkout/summary', '/admin', '/admin/products', '/admin/orders'],
}
