// Granthalaya: views
/* ---------- views ---------- */
const NAV=[['dash','Home','dash',1],['shelf','Shelf','shelf',1],['books','Browse','book',1],['mine','My books','user',2],['rooms','Study rooms','door',1],['fines','Fines','coin',2],['goals','Reading','trophy',2],['notices','Notices','mega',1],['authors','Authors','pen',1],['quotes','Quotes','quote',1],['about','About MITS','cap',1],['students','Students','users'],['circ','Issue &amp; return','swap'],['reports','Reports','chart']];
function go(v){if(S.v!==v)S.slip='';S.v=v;render();scrollTo(0,0);const e=$('#view');e.classList.remove('vin');void e.offsetWidth;e.classList.add('vin')}
function render(){
$('#nav').innerHTML=NAV.filter(n=>me.role==='lib'?n[3]!==2:!!n[3]).map(([k,l,i])=>`<button data-act="go" data-v="${k}" class="${S.v===k?'on':''}">${I(i)}${l}</button>`).join('');
$('#rules').innerHTML=[['clock',DAYS+'-day loans'],['book',MAX+' books per student'],['coin','Rs. '+FINE+' fine per late day']].map(([i,t])=>`<span>${I(i,16)}${t}</span>`).join('');
$('#dl-s').innerHTML=db.students.map(s=>`<option value="${s.roll}">${esc(s.name)}</option>`).join('');
$('#dl-b').innerHTML=db.books.map(b=>`<option value="${b.id}">${esc(b.title)}</option>`).join('');
$('#view').innerHTML=({dash:vDash,books:vBooks,students:vStudents,circ:vCirc,reports:vReports,mine:vMine,shelf:vShelf,rooms:vRooms,fines:vFines,goals:vGoals,notices:vNotices,authors:vAuthors,quotes:vQuotes,about:vAbout})[S.v]();
const f=({books:fillBooks,students:fillStudents,reports:fillReports,authors:fillAuthors,quotes:fillQuotes})[S.v];if(f)f();document.querySelectorAll('.kpi').forEach((e,i)=>e.style.setProperty('--i',i));countUp()}

function stats(){const B=db.books,R=db.records,sum=k=>B.reduce((a,b)=>a+b[k],0);
return{titles:B.length,tc:sum('total'),ac:sum('avail'),stu:db.students.length,out:R.filter(r=>!r.returned).length,od:overdue().length,fines:R.filter(r=>r.returned).reduce((a,r)=>a+r.fine,0)}}
const cards=s=>[['book','Book titles',s.titles,'#3347c9'],['stack','Total copies',s.tc,'#7a4bd1'],['check','Copies available',s.ac,'#138a5e'],['users','Students',s.stu,'#c27a0e'],['out','On loan now',s.out,'#d1457a'],['clock','Overdue',s.od,'#c93a4b'],['coin','Fines collected','Rs. '+s.fines.toFixed(2),'#0f8f94']].map(([i,l,v,c])=>{const m=/^Rs/.test(v);return`<div class="card kpi${l==='Overdue'&&v?' alert':''}" style="--c:${c}"><i>${I(i)}</i><b data-n="${parseFloat(String(v).replace(/[^\d.]/g,''))}" data-pre="${m?'Rs. ':''}" data-dec="${m?2:0}">${v}</b><span>${l}</span></div>`}).join('');
const donut=p=>{const c=2*Math.PI*52;return`<svg class="donut" viewBox="0 0 140 140" role="img" aria-label="${p}% of copies on the shelf"><circle cx="70" cy="70" r="52" fill="none" stroke="var(--soft)" stroke-width="16"/>${p?`<circle class="arc" cx="70" cy="70" r="52" fill="none" stroke="var(--aqua)" stroke-width="16" stroke-linecap="round" stroke-dasharray="${c*p/100} ${c}" transform="rotate(-90 70 70)"/>`:''}<text x="70" y="77" text-anchor="middle" font-family="Sora,sans-serif" font-weight="700" font-size="26" fill="var(--ink)">${p}%</text></svg>`};
function activity(){const days=Array.from({length:14},(_,i)=>addDays(today(),i-13)),c=days.map(d=>db.records.filter(r=>r.issued===d).length),m=Math.max(1,...c);
return`<svg class="chart" viewBox="0 0 320 130" role="img" aria-label="Books issued per day over the last 14 days">${[20,60,100].map(y=>`<line x1="0" x2="320" y1="${y}" y2="${y}" stroke="var(--line)"/>`).join('')}${c.map((n,i)=>{const h=Math.max(n/m*80,3);return`<rect style="--i:${i}" x="${6+i*22.5}" y="${100-h}" width="14" height="${h}" rx="4" fill="${i===13?'var(--aqua)':'var(--btn)'}" opacity="${n?1:.25}"><title>${fmt(days[i])}: ${n} issued</title></rect>`}).join('')}<text x="6" y="121">${fmt(days[0])}</text><text x="314" y="121" text-anchor="end">Today</text></svg>`}
const sp=(b,i)=>`<button class="spine" data-act="spine" data-id="${b.id}" title="${esc(b.title)} (${b.avail} of ${b.total} available)" style="height:${96+(b.id*37)%56}px;width:${26+(b.title.length%4)*5}px;background-color:${COL[b.id%8]};opacity:${b.avail?1:.4}"><span>${esc(b.title)}</span></button>`;
const shelf=()=>db.books.length?`<div class="case"><h2>On the shelf</h2><div class="shelf">${db.books.slice(0,24).map(sp).join('')}</div><div class="board"></div></div>`:empty('The shelf is empty. Add your first book to see it here.');
function top5(){const c={};db.records.forEach(r=>{c[r.bookId]=(c[r.bookId]||0)+1});const L=Object.entries(c).sort((a,b)=>b[1]-a[1]).slice(0,5),m=L.length?L[0][1]:1;
return`<div class="card"><h2>Most borrowed</h2>${L.length?L.map(([id,n])=>`<div class="hb"><span>${esc(bt(+id))}</span><div><i style="width:${n/m*100}%;background:${COL[+id%8]}"></i></div><b>${n}</b></div>`).join(''):'<p class="sub">Issue a book to see this chart.</p>'}</div>`}
function dueSoon(){const L=db.records.filter(r=>!r.returned&&(me.role==='lib'||r.roll===me.roll)).sort((a,b)=>a.due<b.due?-1:1).slice(0,5);
return`<div class="card"><h2>Due soon</h2>${L.length?L.map(r=>{const d=diff(today(),r.due),c=d<0?'bad':d<=3?'warn':'ok';return`<div class="ds"><span>${esc(bt(r.bookId))}${me.role==='lib'?`<small>${esc(sn(r.roll))}</small>`:''}</span><b class="tag ${c}">${d<0?-d+' day'+(d<-1?'s':'')+' late':d===0?'Due today':'In '+d+' day'+(d>1?'s':'')}</b></div>`}).join(''):'<p class="sub">No books are out right now.</p>'}</div>`}
function vDash(){const s=stats(),p=s.tc?Math.round(s.ac/s.tc*100):0,h=new Date().getHours(),g=h<12?'Good morning':h<18?'Good afternoon':'Good evening',L=me.role==='lib';
return`<section class="ban">${globe('d')}<div class="bt"><h1>${g}, ${esc(me.name.split(' ')[0])}</h1><p>${new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}. ${s.out} books are on loan and ${s.od} ${s.od===1?'is':'are'} overdue.</p><div class="ba">${L?'<button class="btn sun" data-act="go" data-v="circ">Issue a book</button><button class="btn line" data-act="go" data-v="books">Browse catalogue</button>':'<button class="btn sun" data-act="go" data-v="books">Browse catalogue</button><button class="btn line" data-act="go" data-v="mine">My books</button>'}</div></div></section>${qotd()}
<div class="grid">${cards(s)}</div>
<div class="cg"><div class="card"><h2>Shelf availability</h2><div class="dn">${donut(p)}<ul class="lg"><li><i style="background:var(--aqua)"></i>${s.ac} on the shelf</li><li><i style="background:var(--soft)"></i>${s.tc-s.ac} issued</li></ul></div></div><div class="card"><h2>Books issued, last 14 days</h2>${activity()}</div></div>${me.role==='stu'?recs():''}<div class="two" style="margin-top:16px">${dueSoon()}${top5()}</div>${shelf()}${spot()}`}
const motif=b=>`<svg class="mo" viewBox="0 0 140 140" aria-hidden="true">${MO[b.id%4]}</svg>`;
const grid=L=>`<div class="covers">${L.map(b=>`<article class="cv" style="--c:${COL[b.id%8]}"><div class="bk">${motif(b)}<small>${esc(b.author)}</small><h3>${esc(b.title)}</h3><span class="bd${b.avail?'':' out'}">${b.avail?b.avail+' of '+b.total+' in':'All issued'}</span></div><div class="cf"><b>ID ${b.id}</b>${me.role==='lib'?`<span><button class="lnk" data-act="editBook" data-id="${b.id}">Edit</button><button class="lnk bad" data-act="delBook" data-id="${b.id}">Delete</button></span>`:''}</div></article>`).join('')}</div>`;
function vMine(){const L=db.records.filter(r=>r.roll===me.roll),a=L.filter(r=>!r.returned);
return`<div class="top"><div><h1>My books</h1><p class="sub">${esc(me.name)}, roll no ${me.roll}</p></div></div><div class="grid" style="margin-bottom:20px"><div class="card kpi"><b>${a.length} of ${MAX}</b><span>books you hold</span></div><div class="card kpi${a.some(late)?' alert':''}"><b>${a.filter(late).length}</b><span>overdue books</span></div><div class="card kpi"><b>Rs. ${L.reduce((t,r)=>t+(r.returned?r.fine:0),0).toFixed(2)}</b><span>fines paid so far</span></div></div>${L.length?tbl(RH,L.map(recRow),L.map(r=>late(r)?'late':'')):empty('You have not borrowed any books yet.')}`}

function vBooks(){return`<div class="top"><div><h1>Books</h1><p class="sub">Add, find, update and remove titles.</p></div>${me.role==='lib'?'<button class="btn" data-act="addBook">Add book</button>':''}</div>
<div class="tb"><select id="bm" aria-label="Search by"><option value="kw"${S.bm==='kw'?' selected':''}>Title or author</option><option value="id"${S.bm==='id'?' selected':''}>Book ID</option></select><input id="bq" type="search" aria-label="Search books" placeholder="${S.bm==='id'?'Enter a book ID':'Search by title or author'}" value="${esc(S.bq)}"><div class="seg"><button type="button" data-act="vw" data-w="grid" class="${S.bw==='grid'?'on':''}">Covers</button><button type="button" data-act="vw" data-w="tbl" class="${S.bw==='tbl'?'on':''}">Table</button></div></div><div id="tbl"></div>`}
function fillBooks(){const q=S.bq.trim().toLowerCase();
const L=!q?db.books:S.bm==='id'?db.books.filter(b=>String(b.id)===q):db.books.filter(b=>b.title.toLowerCase().includes(q)||b.author.toLowerCase().includes(q));
$('#tbl').innerHTML=!L.length?empty(db.books.length?'No matching book found.':'No books in the library yet. Add the first one.'):
S.bw==='grid'?grid(L):tbl(['ID','Title','Author','Total','Available',''],L.map(b=>[b.id,b.title,b.author,b.total,H(`<span class="bar"><i style="width:${b.avail/b.total*100}%"></i></span>${b.avail}`),me.role==='lib'?H(`<button class="lnk" data-act="editBook" data-id="${b.id}">Edit</button> <button class="lnk bad" data-act="delBook" data-id="${b.id}">Delete</button>`):H(`<span class="tag ${b.avail?'ok':'bad'}">${b.avail?'In stock':'All issued'}</span>`)]))}

function vStudents(){return`<div class="top"><div><h1>Students</h1><p class="sub">Register students, reset passwords and see what each one is holding.</p></div><button class="btn" data-act="addStudent">Register student</button></div>
<div class="tb"><input id="sq" type="search" aria-label="Search students" placeholder="Search by roll number or name" value="${esc(S.sq)}"><select id="sb" aria-label="Branch">${brOpts(S.sb,'All branches')}</select><select id="sy" aria-label="Year">${yrOpts(S.sy)}</select></div><div id="tbl"></div>`}
function fillStudents(){const q=S.sq.trim().toLowerCase();
const A=db.students.filter(s=>(!q||s.roll.toLowerCase().includes(q)||s.name.toLowerCase().includes(q))&&(!S.sb||s.br===S.sb)&&(!S.sy||String(s.yr)===S.sy)),L=A.slice(0,S.sl);
$('#tbl').innerHTML=!A.length?empty(db.students.length?'Student not found.':'No students registered yet. Register the first one.'):
`<p class="sub">Showing ${L.length} of ${A.length} students${A.length<db.students.length?' (of '+db.students.length+' registered)':''}</p>`+tbl(['Roll no','Name','Branch','Year','Books held',''],L.map(s=>[s.roll,H(`<span class="av" style="background:${COL[hc(s.roll)%8]}">${esc(s.name[0])}</span>${esc(s.name)}`),H(brChip(s)),s.yr?YR[s.yr-1]||s.yr:'-',H(`<span class="pips">${Array.from({length:MAX},(_,i)=>`<i class="${i<s.held?'f':''}"></i>`).join('')}</span>${s.held} of ${MAX}`),H(`<button class="lnk" data-act="rpw" data-id="${esc(s.roll)}">Reset password</button> <button class="lnk bad" data-act="delStudent" data-id="${esc(s.roll)}">Delete</button>`)]))+(A.length>L.length?`<p style="text-align:center;margin-top:14px"><button class="btn ghost" data-act="more">Show 120 more</button></p>`:'')}

function vCirc(){const f=(n,l,k,li)=>`<label class="f"><span>${l}</span><input name="${n}" ${k==='s'?'autocapitalize="characters" placeholder="BTCS24O1001"':'type="number" min="1" inputmode="numeric"'} required list="${li}" data-look="${k}"><small class="hint"></small></label>`;
return`<div class="top"><div><h1>Issue &amp; return</h1><p class="sub">Type a roll number or book ID, or pick one from the suggestions.</p></div></div>
<div class="two"><form class="card" data-form="issue"><h2>Issue a book</h2><p class="sub">Loans run ${DAYS} days. Each student can hold ${MAX} books.</p>${f('roll','Student roll no','s','dl-s')}${f('book','Book ID','b','dl-b')}<button class="btn">Issue book</button></form>
<form class="card" data-form="return"><h2>Return a book</h2><p class="sub">Late returns cost Rs. ${FINE} for each day after the due date.</p>${f('roll','Student roll no','s','dl-s')}${f('book','Book ID','b','dl-b')}<button class="btn">Return book</button></form></div>${S.slip}`}
function look(t){const h=t.nextElementSibling,n=+t.value;let s='';
if(t.value){if(t.dataset.look==='s'){const x=fs(t.value);s=x?x.name+', '+brLabel(x)+' (holds '+x.held+' of '+MAX+')':'Student not found'}else{const x=fb(n);s=x?x.title+' ('+x.avail+' available)':'Book not found'}}
h.textContent=s}

const RH=['Rec ID','Roll no','Book','Issued','Due','Returned','Fine (Rs)'];
const recRow=r=>[r.id,r.roll,bt(r.bookId),fmt(r.issued),fmt(r.due),r.returned?fmt(r.ret):'Not yet',r.fine.toFixed(2)];
function vReports(){const T=[['records','All records'],['history','Student history'],['overdue','Overdue books'],['branch','By branch'],['stats','Statistics']];
return`<div class="top"><div><h1>Reports</h1><p class="sub">Borrowing records, overdue books and library totals.</p></div><button class="btn ghost" data-act="csv" style="display:flex;gap:8px;align-items:center">${I('dl',17)}Export records (CSV)</button></div>
<div class="tabs">${T.map(([k,l])=>`<button data-act="tab" data-t="${k}" class="${S.rt===k?'on':''}">${l}</button>`).join('')}</div>
${S.rt==='history'?`<div class="tb"><input id="hq" aria-label="Student roll no" placeholder="Enter a student roll no" list="dl-s" value="${esc(S.hq)}"></div>`:''}<div id="rep"></div>`}
function fillReports(){const t=S.rt;let h='';
if(t==='records'){const L=db.records.slice().reverse();h=L.length?tbl(RH,L.map(recRow),L.map(r=>late(r)?'late':'')):empty('No borrowing records yet.')}
else if(t==='history'){const q=S.hq.trim();
if(!q)h=empty('Enter a roll number to see that student’s borrowing history.');
else{const n=q.toUpperCase(),s=fs(n),L=db.records.filter(r=>r.roll===n);
h=`<p class="sub">${s?'Borrowing history of '+esc(s.name):'Student no longer registered. History for roll '+esc(q)}</p>`+(L.length?tbl(RH,L.map(recRow),L.map(r=>late(r)?'late':'')):empty('No records found.'))}}
else if(t==='overdue'){const L=overdue();
h=L.length?`<p class="sub">As of ${fmt(today())}</p>`+tbl(['Roll no','Student','Book','Due','Days late','Fine so far (Rs)'],L.map(r=>{const d=diff(r.due,today());return[r.roll,sn(r.roll),bt(r.bookId),fmt(r.due),d,(d*FINE).toFixed(2)]})):empty('No overdue books.')}
else if(t==='branch')h=branchReport();
else h=`<div class="grid">${cards(stats())}</div>`;
$('#rep').innerHTML=h}

