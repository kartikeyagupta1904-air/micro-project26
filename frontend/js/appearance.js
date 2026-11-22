// Granthalaya: appearance
/* ---------- appearance: schemes, mode, wallpapers, motion ---------- */
let UI={scheme:'mits',mode:'auto',wp:'aurora',motion:!matchMedia('(prefers-reduced-motion:reduce)').matches},raf=0,wk='';
try{Object.assign(UI,JSON.parse(localStorage.getItem('granthalaya.ui')||'{}'))}catch(e){}
const SC=[['mits','#1f3a9e'],['midnight','#3347c9'],['sunset','#c2410c'],['emerald','#0b7a5f'],['violet','#6d28d9']],WP=[['aurora','Aurora'],['net','Network'],['books','Books'],['waves','Waves'],['letters','Letters'],['stars','Stars'],['embers','Embers'],['none','Plain']];
function applyUI(){const h=document.documentElement,d=UI.mode==='dark'||(UI.mode==='auto'&&matchMedia('(prefers-color-scheme:dark)').matches);
h.dataset.mode=d?'dark':'light';h.dataset.scheme=UI.scheme;h.dataset.motion=UI.motion?'on':'off';
try{localStorage.setItem('granthalaya.ui',JSON.stringify(UI))}catch(e){}
if(wk!==UI.wp+UI.motion){wk=UI.wp+UI.motion;wall()}$('#cz').innerHTML=I('pal',22);drawCz()}
function drawCz(){$('#czp').innerHTML=`<h3>Appearance</h3><p class="cl">Colour scheme</p><div class="sw">${SC.map(([k,c])=>`<button data-act="ui" data-k="scheme" data-v="${k}" style="--c:${c}" class="${UI.scheme===k?'on':''}" aria-label="${k} scheme" title="${k}"></button>`).join('')}</div>
<p class="cl">Mode</p><div class="seg">${['auto','light','dark'].map(m=>`<button data-act="ui" data-k="mode" data-v="${m}" class="${UI.mode===m?'on':''}">${m[0].toUpperCase()+m.slice(1)}</button>`).join('')}</div>
<p class="cl">Moving wallpaper</p><div class="seg wr">${WP.map(([k,l])=>`<button data-act="ui" data-k="wp" data-v="${k}" class="${UI.wp===k?'on':''}">${l}</button>`).join('')}</div>
<label class="tg"><input type="checkbox" data-act="mo"${UI.motion?' checked':''}> Animations</label>`}
function wall(){cancelAnimationFrame(raf);const w=$('#wp'),k=UI.wp,wv='<svg viewBox="0 0 1440 200" preserveAspectRatio="none"><path d="M0 80Q90 20 180 80T360 80T540 80T720 80T900 80T1080 80T1260 80T1440 80V200H0Z"/></svg>';
w.className='w-'+k;w.innerHTML=k==='aurora'?'<i></i><i></i><i></i><i></i>':k==='books'?Array.from({length:16},(_,i)=>`<svg viewBox="0 0 46 62" style="--x:${(i*37+5)%96}%;--s:${(.6+(i*13%10)/10).toFixed(2)};--d:${-i*2.3}s;--t:${18+(i*7)%14}s">${BK(COL[i%8])}</svg>`).join(''):k==='waves'?wv+wv:(k==='net'||CVK[k])?'<canvas></canvas>':'';
if(k==='net')net(w.firstChild);else if(CVK[k])cvw(w.firstChild,k)}
function net(c){const x=c.getContext('2d'),W=c.width=innerWidth,Ht=c.height=innerHeight,N=Math.min(70,Math.round(W*Ht/20000)),p=Array.from({length:N},()=>({x:Math.random()*W,y:Math.random()*Ht,vx:(Math.random()-.5)*.6,vy:(Math.random()-.5)*.6}));
const f=()=>{if(!c.isConnected)return;x.clearRect(0,0,W,Ht);x.fillStyle=x.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue(document.documentElement.dataset.mode==='dark'?'--hi':'--b').trim();
p.forEach((a,i)=>{if(UI.motion){a.x+=a.vx;a.y+=a.vy;if(a.x<0||a.x>W)a.vx*=-1;if(a.y<0||a.y>Ht)a.vy*=-1}x.globalAlpha=.55;x.beginPath();x.arc(a.x,a.y,2.2,0,7);x.fill();
for(let j=i+1;j<N;j++){const b=p[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<150){x.globalAlpha=(1-d/150)*.4;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke()}}});
if(UI.motion)raf=requestAnimationFrame(f)};f()}
function countUp(){if(!UI.motion)return;document.querySelectorAll('[data-n]').forEach(e=>{const n=+e.dataset.n,d=+e.dataset.dec,p=e.dataset.pre||'',t0=performance.now();if(isNaN(n))return;
const f=t=>{const k=Math.min(1,(t-t0)/900);e.textContent=p+(n*(1-Math.pow(1-k,3))).toFixed(d);if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)})}
function confetti(){if(!UI.motion)return;const c=document.createElement('canvas');c.id='cf';c.width=innerWidth;c.height=innerHeight;document.body.append(c);
const x=c.getContext('2d'),cl=['#f5b53b','#12b5a5','#e5546c','#7a8dff','#ffffff'],p=Array.from({length:90},()=>({x:innerWidth/2,y:innerHeight*.7,vx:(Math.random()-.5)*14,vy:-Math.random()*14-4,r:Math.random()*6+3,c:cl[Math.random()*5|0],a:Math.random()*6}));let n=0;
const f=()=>{x.clearRect(0,0,c.width,c.height);p.forEach(q=>{q.vy+=.35;q.x+=q.vx;q.y+=q.vy;q.a+=.2;x.fillStyle=q.c;x.save();x.translate(q.x,q.y);x.rotate(q.a);x.fillRect(-q.r/2,-q.r/4,q.r,q.r/2);x.restore()});if(++n<110)requestAnimationFrame(f);else c.remove()};f()}
document.addEventListener('pointermove',e=>{const b=e.target.closest&&e.target.closest('.bk');if(!b||!UI.motion)return;const r=b.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;b.style.transform=`perspective(600px) rotateY(${x*16}deg) rotateX(${-y*16}deg) translateY(-6px)`});
document.addEventListener('mouseout',e=>{const b=e.target.closest&&e.target.closest('.bk');if(b&&!b.contains(e.relatedTarget))b.style.transform=''});
matchMedia('(prefers-color-scheme:dark)').addEventListener('change',()=>{if(UI.mode==='auto')applyUI()});
addEventListener('resize',()=>{if(UI.wp==='net'||CVK[UI.wp])wall()});

