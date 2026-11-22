// Granthalaya: core
const $=s=>document.querySelector(s),pad=n=>String(n).padStart(2,'0'),P=s=>s.split('-').map(Number);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const iso=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()),today=()=>iso(new Date());
const addDays=(s,n)=>{const[y,m,d]=P(s);return iso(new Date(y,m-1,d+n,12))},U=s=>{const[y,m,d]=P(s);return Date.UTC(y,m-1,d)};
const diff=(a,b)=>Math.round((U(b)-U(a))/864e5),fmt=s=>s?s.split('-').reverse().join('/'):'';
const MAX=3,DAYS=14,FINE=2,K='granthalaya.v3',DEFPW='Student@123';
let db,me=null,S={v:'dash',bw:'grid',rt:'records',bq:'',bm:'kw',sq:'',hq:'',slip:''},tt,fails=0,lock=0;

