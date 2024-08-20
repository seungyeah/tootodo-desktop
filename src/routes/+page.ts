export const prerender = true;
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url ,cookies }) => {
  if(cookies.get('logged_in') === 'true' && url.pathname.startsWith('/login')) {
    return redirect(302, '/do');
  }
  if(!url.pathname.startsWith('/login')) {
    throw redirect(302, '/do');
  }
}