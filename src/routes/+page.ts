export const prerender = true;
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
  if(!url.pathname.startsWith('/login')) {
    throw redirect(302, '/do');
  }
}