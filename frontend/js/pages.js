// Granthalaya v4: authors, quotes, live canvas wallpapers, command palette, extra catalogue
Object.assign(S,{aq:'',ak:'',qt:'',qi:-1});
Object.assign(IC,{pen:'<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',quote:'<path d="M3 21c3 0 7-1 7-8V5H3v8h4M14 21c3 0 7-1 7-8V5h-7v8h4"/>',search:'<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',copy:'<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>',shuffle:'<path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5"/>'});

/* ---------- extra catalogue: added once, existing data is kept ---------- */
const NEWB=[['Pride and Prejudice','Jane Austen','Classics',3],['Great Expectations','Charles Dickens','Classics',3],['Hamlet','William Shakespeare','Classics',4],['To the Lighthouse','Virginia Woolf','Classics',2],['A Room of One’s Own','Virginia Woolf','Classics',2],['Swami and Friends','R. K. Narayan','Classics',3],['The Guide','R. K. Narayan','Classics',3],['Gaban','Munshi Premchand','Classics',3],['Nirmala','Munshi Premchand','Classics',2],['Gitanjali','Rabindranath Tagore','Poetry',4],['Abhijnanashakuntalam','Kalidasa','Poetry',2],['Madhushala','Harivansh Rai Bachchan','Poetry',3],['My Experiments with Truth','M. K. Gandhi','Biography',4],['Glimpses of World History','Jawaharlal Nehru','History',2],['India After Gandhi','Ramachandra Guha','History',2],['Homo Deus','Yuval Noah Harari','History',3],['The Art of Computer Programming','Donald E. Knuth','Programming',2],['Modern Operating Systems','A. S. Tanenbaum','Programming',3],['The Pragmatic Programmer','Andrew Hunt and David Thomas','Programming',3],['Cosmos','Carl Sagan','Science',3],['The Selfish Gene','Richard Dawkins','Science',2],['The Universe in a Nutshell','Stephen Hawking','Science',2],['Human Compatible','Stuart Russell','Science',2],['Man’s Search for Meaning','Viktor E. Frankl','Self-Help',3]];
function grow4(){db.fq=db.fq||{};if(db.v4)return;let id=nextId();NEWB.forEach(([title,author,cat,n])=>{if(!db.books.some(b=>b.title===title))db.books.push({id:id++,title,author,total:n,avail:n,cat})});db.v4=1;save()}

/* ---------- authors and professors ---------- */
const AU=[['tagore','Rabindranath Tagore','w','1861–1941',215,'Poet & Nobel laureate','Bengali poet and polymath. Gitanjali won him the 1913 Nobel Prize in Literature, the first for a non-European.',['Gitanjali','The Home and the World','Gora']],
['premchand','Munshi Premchand','w','1880–1936',28,'Novelist','Pioneer of realism in Hindi and Urdu fiction, writing with compassion about village life, debt and dignity.',['Godan','Gaban','Nirmala']],
['narayan','R. K. Narayan','w','1906–2001',150,'Novelist of Malgudi','Created the fictional South Indian town of Malgudi, the gentle and ironic setting for his best-loved stories.',['Malgudi Days','Swami and Friends','The Guide']],
['kalam','A. P. J. Abdul Kalam','p','1931–2015',200,'Scientist & President','Aerospace scientist, lifelong teacher and India’s 11th President, known to millions as the Missile Man of India.',['Wings of Fire','Ignited Minds','India 2020']],
['nehru','Jawaharlal Nehru','w','1889–1964',20,'Statesman & author','India’s first Prime Minister. He wrote much of The Discovery of India while imprisoned in Ahmednagar Fort.',['The Discovery of India','Glimpses of World History']],
['hawking','Stephen Hawking','p','1942–2018',262,'Theoretical physicist','Cambridge professor of mathematics who made black holes and the origin of the universe readable for everyone.',['A Brief History of Time','The Universe in a Nutshell']],
['austen','Jane Austen','w','1775–1817',335,'Novelist','English novelist whose witty, sharply observed stories of marriage and money are still read everywhere.',['Pride and Prejudice','Emma','Sense and Sensibility']],
['shakespeare','William Shakespeare','w','1564–1616',8,'Playwright & poet','English playwright and poet whose plays and sonnets shaped the English language and world theatre.',['Hamlet','Macbeth','Othello']],
['dickens','Charles Dickens','w','1812–1870',38,'Novelist','Victorian novelist who exposed poverty and injustice through unforgettable characters and serial stories.',['Great Expectations','Oliver Twist','A Tale of Two Cities']],
['woolf','Virginia Woolf','w','1882–1941',290,'Novelist & essayist','Modernist writer who pioneered stream of consciousness and argued for women’s freedom to think and write.',['To the Lighthouse','Mrs Dalloway','A Room of One’s Own']],
['gandhi','Mahatma Gandhi','w','1869–1948',45,'Leader & author','Leader of India’s non-violent freedom movement. His autobiography recounts his search for truth.',['My Experiments with Truth','Hind Swaraj']],
['kalidasa','Kalidasa','w','c. 4th–5th century CE',320,'Poet & dramatist','Classical Sanskrit poet and dramatist, remembered for the play Abhijnanashakuntalam and the poem Meghaduta.',['Abhijnanashakuntalam','Meghaduta','Raghuvamsha']],
['knuth','Donald E. Knuth','p','b. 1938',175,'Computer scientist','Professor emeritus at Stanford and Turing Award winner, famous for his multi-volume series on algorithms.',['The Art of Computer Programming','The TeXbook']],
['tanenbaum','Andrew S. Tanenbaum','p','b. 1944',185,'Computer scientist','Professor at Vrije Universiteit Amsterdam and author of classic textbooks on networks and operating systems.',['Computer Networks','Modern Operating Systems']],
['russell','Stuart Russell','p','b. 1962',230,'AI researcher','Professor of computer science at UC Berkeley and co-author of the leading textbook on artificial intelligence.',['Artificial Intelligence: A Modern Approach','Human Compatible']],
['harari','Yuval Noah Harari','p','b. 1976',12,'Historian','Professor of history at the Hebrew University of Jerusalem, known for sweeping books on humankind’s past and future.',['Sapiens','Homo Deus','21 Lessons for the 21st Century']],
['kahneman','Daniel Kahneman','p','1934–2024',350,'Psychologist & Nobel laureate','Nobel laureate in Economics (2002) who showed how fast and slow thinking shape the choices we make.',['Thinking, Fast and Slow']],
['cormen','Thomas H. Cormen','p','Dartmouth College',160,'Computer scientist','Professor of computer science at Dartmouth and co-author of Introduction to Algorithms.',['Introduction to Algorithms']]].map(([k,n,t,y,h,r,b,w],i)=>({k,n,t,y,h,r,b,w,v:i%3}));
const NOPIC=new Set(),CAP='<path d="M31 38c-2-20 34-20 34 0-7-9-27-9-34 0Z"/>',HAIR=[CAP,'',CAP+'<circle cx="48" cy="19" r="6"/>'];
/* Illustrated portrait. If assets/authors/<key>.jpg exists it is shown on top, so licensed photos can simply be dropped in. */
const portrait=a=>`<svg viewBox="0 0 96 96" aria-hidden="true"><defs><linearGradient id="pg${a.k}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${a.h} 72% 58%)"/><stop offset="1" stop-color="hsl(${(a.h+55)%360} 62% 20%)"/></linearGradient></defs><rect width="96" height="96" fill="url(#pg${a.k})"/><path d="M12 96c3-25 19-35 36-35s33 10 36 35Z" fill="rgba(255,255,255,.9)"/><circle cx="48" cy="38" r="16" fill="rgba(255,255,255,.96)"/><g fill="#241a38">${HAIR[a.v]}</g>${a.t==='p'?'<path d="M22 22 48 11l26 11-26 11Z" fill="#0c1a3a"/><path d="M36 28v7c7 4 17 4 24 0v-7" fill="none" stroke="#0c1a3a" stroke-width="3"/><path d="M74 22v12" stroke="#f5b53b" stroke-width="2.5"/>':'<path d="M30 30c3-15 33-15 36 0" fill="none" stroke="#f5b53b" stroke-width="3.5" stroke-linecap="round"/>'}</svg>${NOPIC.has(a.k)?'':`<img src="assets/authors/${a.k}.jpg" alt="" loading="lazy" onerror="NOPIC.add('${a.k}');this.remove()">`}`;
const auOf=n=>AU.find(a=>n.toLowerCase().includes(a.k)),libBooks=a=>db.books.filter(b=>b.author.toLowerCase().includes(a.k)),
authLink=n=>{const a=auOf(n);return a?`<button class="lnk" data-act="au" data-k="${a.k}">${esc(n)}</button>`:esc(n)},
acard=a=>`<button class="ac" data-act="au" data-k="${a.k}"><span class="pic">${portrait(a)}</span><b>${esc(a.n)}</b><small>${esc(a.y)}</small><em>${esc(a.r)}</em><span class="tag">${libBooks(a).length} in library</span></button>`;
function vAuthors(){const o=(k,l)=>`<button data-act="ak" data-k="${k}" class="${S.ak===k?'on':''}">${l}</button>`;
return`<div class="top"><div><p class="eyebrow">Minds behind the books</p><h1>Authors &amp; professors</h1><p class="sub" id="an"></p></div></div><div class="tb"><div class="sbox"><input id="aq" type="search" aria-label="Search authors" placeholder="Search by name, field or book" value="${esc(S.aq)}"></div></div><div class="chips2">${o('','All')}${o('w','Writers')}${o('p','Professors')}</div><div id="ag"></div>`}
function fillAuthors(){const q=S.aq.trim().toLowerCase(),L=AU.filter(a=>(!S.ak||a.t===S.ak)&&(!q||(a.n+' '+a.r+' '+a.w.join(' ')).toLowerCase().includes(q)));
$('#an').textContent=L.length+' profiles';$('#ag').innerHTML=L.length?`<div class="auth">${L.map(acard).join('')}</div>`:empty('No author found.')}
function openAuthor(k){const a=AU.find(x=>x.k===k);if(!a)return;const B=libBooks(a),qi=QT.findIndex(q=>q[1].toLowerCase().includes(a.k));
$('#modal').innerHTML=`<div class="ov" data-act="close"><div class="mdl wide2" role="dialog" aria-modal="true" aria-label="${esc(a.n)}"><div class="bh"><span class="pic lg">${portrait(a)}</span><div><h2>${esc(a.n)}</h2><p class="sub" style="margin:0 0 8px">${esc(a.y)}</p><span class="tag">${a.t==='p'?'Professor':'Writer'}</span> <span class="tag">${esc(a.r)}</span></div></div><p>${esc(a.b)}</p>${qi>=0?`<blockquote class="aq">${esc(QT[qi][0])}</blockquote>`:''}<h3>Notable works</h3><p class="sub">${a.w.map(esc).join(' · ')}</p><h3>In our library</h3><div class="sim">${B.length?B.map(b=>`<button class="tag" data-act="bk" data-id="${b.id}">${esc(b.title)}</button>`).join(''):'<span class="sub">No titles in the catalogue yet.</span>'}</div><div class="acts"><button class="btn ghost" data-act="close">Close</button></div></div></div>`}

/* ---------- quotes ---------- */
const QT=[['Where the mind is without fear and the head is held high','Rabindranath Tagore','Poetry'],['There is no Frigate like a Book','Emily Dickinson','Reading'],['I have always imagined that Paradise will be a kind of library.','Jorge Luis Borges','Libraries'],['My life is my message.','Mahatma Gandhi','Wisdom'],['A woman must have money and a room of her own if she is to write fiction.','Virginia Woolf','Writing'],['No one is useless in this world who lightens the burden of another.','Charles Dickens','Wisdom'],['There is no charm equal to tenderness of heart.','Jane Austen','Wisdom'],['All the world’s a stage, and all the men and women merely players.','William Shakespeare','Life'],['Some books are to be tasted, others to be swallowed, and some few to be chewed and digested.','Francis Bacon','Reading'],['Dream, dream, dream. Dreams transform into thoughts and thoughts result in action.','A. P. J. Abdul Kalam','Dreams'],['पोथी पढ़ि पढ़ि जग मुआ, पंडित भया न कोय','Kabir','Wisdom'],['Arise, awake, and stop not till the goal is reached.','Swami Vivekananda','Courage'],['Remember to look up at the stars and not down at your feet.','Stephen Hawking','Curiosity']];
const fav=()=>(db.fq[me.roll]=db.fq[me.roll]||[]),qd=()=>{const n=new Date();return Math.floor((Date.UTC(n.getFullYear(),n.getMonth(),n.getDate())-Date.UTC(n.getFullYear(),0,0))/864e5)%QT.length},
lang=t=>/[\u0900-\u097F]/.test(t)?'hi':'en';
const qotd=(i=qd())=>{const[t,a]=QT[i],A=auOf(a);return`<section class="qd">${A?`<span class="pic">${portrait(A)}</span>`:''}<div><p class="eyebrow">Quote of the day</p><blockquote lang="${lang(t)}">${esc(t)}</blockquote><p class="by">${esc(a)}</p></div></section>`};
const qcard=i=>{const[t,a,g]=QT[i],A=auOf(a);return`<figure class="qc"><blockquote lang="${lang(t)}">${esc(t)}</blockquote><figcaption>${A?`<span class="pic sm">${portrait(A)}</span>`:''}<span>${authLink(a)}</span><span class="tag">${g}</span></figcaption><div class="qa"><button class="ib" data-act="qf" data-i="${i}" aria-pressed="${fav().includes(i)}" aria-label="Save quote">${I('heart',18)}</button><button class="ib" data-act="qc" data-i="${i}" aria-label="Copy quote">${I('copy',18)}</button></div></figure>`};
function vQuotes(){const T=['',  '♥',...new Set(QT.map(q=>q[2]))];
return`<div class="top"><div><p class="eyebrow">Words worth keeping</p><h1>Quotes</h1><p class="sub">Lines from writers, poets and professors. Save your favourites.</p></div><button class="btn ghost" data-act="qs" style="display:flex;gap:8px;align-items:center">${I('shuffle',17)}Surprise me</button></div>${qotd(S.qi<0?qd():S.qi)}<div class="chips2">${T.map(t=>`<button data-act="qk" data-t="${t}" class="${S.qt===t?'on':''}">${t===''?'All':t==='♥'?'Saved':t}</button>`).join('')}</div><div id="qg"></div>`}
function fillQuotes(){const L=QT.map((_,i)=>i).filter(i=>!S.qt||(S.qt==='♥'?fav().includes(i):QT[i][2]===S.qt));$('#qg').innerHTML=L.length?`<div class="qs">${L.map(qcard).join('')}</div>`:empty('Nothing saved yet. Tap the heart on a quote you like.')}
const spot=()=>{const d=qd();return`<h2 style="margin:22px 0 12px">Author spotlight</h2><div class="auth">${[0,1,2,3].map(i=>acard(AU[(d+i*5)%AU.length])).join('')}</div>`};

/* ---------- live canvas wallpapers: letters, stars, embers (they follow the cursor) ---------- */
const CVK={letters:1,stars:1,embers:1},PX={x:.5,y:.5};
addEventListener('pointermove',e=>{PX.x=e.clientX/innerWidth;PX.y=e.clientY/innerHeight});
function cvw(c,k){const x=c.getContext('2d'),W=c.width=innerWidth,H=c.height=innerHeight,r=document.documentElement,dk=r.dataset.mode==='dark',cs=getComputedStyle(r),v=n=>cs.getPropertyValue(n).trim(),
A=v(dk?'--hi':'--b'),Q=v('--aqua'),Y=v('--sun'),G='अआकखगमनपरसहabdegkmnprstαβγδжяあいうえ文字أبجd'.split(''),
N=k==='stars'?Math.min(170,Math.round(W*H/9000)):k==='letters'?Math.min(46,Math.round(W/34)):Math.min(70,Math.round(W/22)),
p=Array.from({length:N},()=>({x:Math.random()*W,y:Math.random()*H,z:.3+Math.random()*.7,r:Math.random()*6.3,g:G[Math.random()*G.length|0],c:[A,Q,Y][Math.random()*3|0]}));let t=0,sh=null;
const f=()=>{if(!c.isConnected)return;x.clearRect(0,0,W,H);const on=UI.motion,ox=(PX.x-.5)*44,oy=(PX.y-.5)*44;t++;
p.forEach(q=>{if(on){q.y-=k==='stars'?0:.15+q.z*.45;q.x+=k==='stars'?-.04*q.z:Math.sin((t+q.r*100)/110)*.3;if(q.y<-50){q.y=H+50;q.x=Math.random()*W}if(q.x<-50)q.x=W+50}
const px=q.x-ox*q.z,py=q.y-oy*q.z;
if(k==='letters'){x.globalAlpha=.07+q.z*.2;x.fillStyle=q.c;x.font=`${12+q.z*30}px "Noto Sans Devanagari",Sora,sans-serif`;x.fillText(q.g,px,py)}
else if(k==='stars'){x.globalAlpha=q.z*(.35+.65*Math.abs(Math.sin(t/60+q.r*9)));x.fillStyle=dk?'#fff':A;x.beginPath();x.arc(px,py,q.z*1.9,0,7);x.fill()}
else{x.globalAlpha=.3+.4*Math.abs(Math.sin(t/45+q.r*9));x.shadowBlur=16;x.shadowColor=x.fillStyle=q.c;x.beginPath();x.arc(px,py,1.5+q.z*2.6,0,7);x.fill();x.shadowBlur=0}});
if(k==='stars'&&on){if(!sh&&Math.random()<.004)sh={x:Math.random()*W*.8,y:Math.random()*H*.35,l:0};
if(sh){sh.x+=11;sh.y+=5;sh.l++;const g=x.createLinearGradient(sh.x-90,sh.y-41,sh.x,sh.y);g.addColorStop(0,'transparent');g.addColorStop(1,dk?'#fff':A);x.globalAlpha=1;x.strokeStyle=g;x.lineWidth=2;x.beginPath();x.moveTo(sh.x-90,sh.y-41);x.lineTo(sh.x,sh.y);x.stroke();if(sh.l>60)sh=null}}
x.globalAlpha=1;if(on)raf=requestAnimationFrame(f)};f()}

/* ---------- command palette (Ctrl or Cmd + K) ---------- */
let pal=[],pi=0;
const palClose=()=>{const o=$('#pal');if(o)o.innerHTML=''};
function palOpen(){if(!me)return;let o=$('#pal');if(!o){o=document.createElement('div');o.id='pal';document.body.append(o)}
o.innerHTML=`<div class="ov pv2" data-act="pc"><div class="pbox" role="dialog" aria-modal="true" aria-label="Search everything"><div class="pin">${I('search',18)}<input id="pq" placeholder="Search pages, books and authors" autocomplete="off" aria-label="Search everything"><kbd>Esc</kbd></div><ul id="pl"></ul></div></div>`;palFill('');$('#pq').focus()}
function palFill(q){q=q.trim().toLowerCase();const hit=(L,n)=>L.filter(x=>!q||(x.s||x.l).toLowerCase().includes(q)).slice(0,n),
P=NAV.filter(n=>me.role==='lib'?n[3]!==2:!!n[3]).map(n=>({k:'Page',l:n[1].replace('&amp;','&'),f:()=>go(n[0])})),
B=db.books.map(b=>({k:'Book',l:b.title+', '+b.author,s:b.title+' '+b.author+' '+b.id,f:()=>openBook(b.id)})),
U=AU.map(a=>({k:'Author',l:a.n,s:a.n+' '+a.w.join(' '),f:()=>openAuthor(a.k)}));
pal=q?[...hit(P,3),...hit(U,3),...hit(B,5)]:hit(P,7);pi=0;palDraw()}
function palDraw(){$('#pl').innerHTML=pal.length?pal.map((x,i)=>`<li><button data-act="pgo" data-i="${i}" class="${i===pi?'on':''}"><span>${esc(x.l)}</span><small>${x.k}</small></button></li>`).join(''):'<li class="sub" style="padding:14px 16px;margin:0">Nothing found.</li>'}

/* ---------- events ---------- */
const mark=(sel,key,val)=>document.querySelectorAll(sel).forEach(b=>b.classList.toggle('on',b.dataset[key]===val));
document.addEventListener('click',e=>{const t=e.target.closest('[data-act]');if(!t)return;const a=t.dataset.act;
if(a==='au')openAuthor(t.dataset.k);
else if(a==='ak'){S.ak=t.dataset.k;mark('.chips2 button','k',S.ak);fillAuthors()}
else if(a==='qk'){S.qt=t.dataset.t;mark('.chips2 button','t',S.qt);fillQuotes()}
else if(a==='qs'){S.qi=Math.floor(Math.random()*QT.length);render()}
else if(a==='qf'){const f=fav(),i=+t.dataset.i,j=f.indexOf(i);j<0?f.push(i):f.splice(j,1);save();t.setAttribute('aria-pressed',j<0);if(S.qt==='♥')fillQuotes();toast(j<0?'Saved to your favourites.':'Removed from favourites.',1)}
else if(a==='qc'){const q=QT[+t.dataset.i];navigator.clipboard?navigator.clipboard.writeText('“'+q[0]+'” — '+q[1]).then(()=>toast('Quote copied.',1),()=>toast('Could not copy.',0)):toast('Copy is not supported here.',0)}
else if(a==='pal')palOpen();
else if(a==='pc'){if(e.target===t)palClose()}
else if(a==='pgo'){const x=pal[+t.dataset.i];palClose();if(x)x.f()}});
document.addEventListener('input',e=>{if(e.target.id==='aq'){S.aq=e.target.value;fillAuthors()}else if(e.target.id==='pq')palFill(e.target.value)});
document.addEventListener('keydown',e=>{const o=$('#pal'),open=o&&o.innerHTML;
if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){if(me){e.preventDefault();open?palClose():palOpen()}return}
if(!open)return;if(e.key==='Escape')palClose();
else if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();pi=(pi+(e.key==='ArrowDown'?1:pal.length-1))%Math.max(1,pal.length);palDraw()}
else if(e.key==='Enter'&&pal[pi]){e.preventDefault();const x=pal[pi];palClose();x.f()}});
