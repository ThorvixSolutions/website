/**
 * Runs in <head> before first paint.
 * - First visit of the session: cover the page with the loader (`cgld-go`) and hold entrance animations (`cg-hold-ld`).
 * - Every hard load: start under the page-transition blocks (`cg-hold-pt`) so they can fall away.
 * Reduced motion skips the transition and gets a simple fade loader (`cgld-rm`).
 */
export const BOOT_SCRIPT = `(function(){try{var h=document.documentElement,rm=matchMedia('(prefers-reduced-motion: reduce)').matches;if(!rm)h.classList.add('cg-hold-pt');if(sessionStorage.getItem('cg-loaded'))return;h.classList.add('cgld-go','cg-hold-ld');if(rm)h.classList.add('cgld-rm');}catch(e){}})()`;
