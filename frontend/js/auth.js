// Granthalaya: auth
/* ---------- sign in ---------- */
async function tryLogin(roll,pw){roll=roll.trim().toUpperCase();const h=await sha(roll,pw),a=db.staff.find(x=>x.roll===roll&&x.h===h);
if(a)return{roll,role:'lib',name:a.name};const s=fs(roll);return s&&(s.h?s.h===h:pw===DEFPW)?{roll:s.roll,role:'stu',name:s.name,dp:!s.h}:null}
function setMe(u){me=u;try{u?sessionStorage.setItem('gh.me',JSON.stringify(u)):sessionStorage.removeItem('gh.me')}catch(e){}}
function auth(){document.body.toggleAttribute('data-auth',!!me);if(!me){drawLogin();return}$('#login').innerHTML='';
$('#me').innerHTML=`<i>${me.role==='stu'&&fs(me.roll)&&fs(me.roll).pic?`<img src="${fs(me.roll).pic}" alt="">`:esc(me.name[0])}</i><div><b>${esc(me.name)}</b><small>${me.role==='lib'?'Librarian':'Roll no '+me.roll+brTag(me.roll)}</small></div><button class="ib" data-act="pw" title="Change password" aria-label="Change password">${I('lock',18)}</button><button class="ib" data-act="logout" title="Sign out" aria-label="Sign out">${I('logout',18)}</button>`;
$('#rs').hidden=me.role!=='lib';if(me.role==='stu'&&!S.bbSet){S.bbSet=1;S.bb=(fs(me.roll)||{}).br||''}if(me.dp&&!S.dpWarn){S.dpWarn=1;setTimeout(()=>toast('You are using the default password. Please change it from the lock icon.',0),600)}render()}
function drawLogin(){$('#login').innerHTML=`<section class="scene">${globe('l')}<div class="lbrand"><svg class="logo" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="11" fill="#f5b53b"/><path d="M10 28V13c4-1 7-.5 10 2 3-2.5 6-3 10-2v15c-4-1-7-.5-10 2-3-2.5-6-3-10-2Z" fill="#0c1a3a"/></svg>Granthalaya <small lang="hi">ग्रंथालय</small></div><p class="inst">Central Library, Madhav Institute of Technology &amp; Science, Gwalior<br><span lang="hi">माधव प्रौद्योगिकी एवं विज्ञान संस्थान, ग्वालियर</span></p>
<div><h1>Every book, from every corner of the world.</h1><p>Sign in to browse the catalogue, track your loans and run the library desk.</p></div>
<div class="chips"><span>${I('clock',16)}${DAYS}-day loans</span><span>${I('book',16)}${MAX} books per student</span><span>${I('coin',16)}Rs. ${FINE} per late day</span></div>
<div class="greet" aria-hidden="true">${['Welcome','स्वागत है','Bienvenue','Willkommen','ようこそ','Bienvenido'].map((w,i)=>`<span style="--k:${i}">${w}</span>`).join('')}</div></section>
<section class="lform"><form id="lf" class="lcard"><div class="lk">${I('lock',24)}</div><div class="seg lr"><button type="button" data-act="lr" data-r="stu" class="${S.lr!=='lib'?'on':''}">Student</button><button type="button" data-act="lr" data-r="lib" class="${S.lr==='lib'?'on':''}">Librarian</button></div><h2>Sign in</h2><p class="sub">${S.lr==='lib'?'Use your librarian ID.':'Use your college roll number, like BTCS24O1001.'}</p>
<label class="f"><span>${S.lr==='lib'?'Librarian ID':'Roll no'}</span><input name="roll" required autocomplete="username" autofocus></label>
<label class="f"><span>Password</span><div class="pw"><input name="pw" id="pw" type="password" required autocomplete="current-password"><button type="button" class="lnk" data-act="eye">Show</button></div></label>
<p class="err" id="lerr" role="alert"></p><button class="btn wide">Sign in</button>
${S.lr==='lib'?'':'<p class="note"><button type="button" class="lnk" data-act="signup">New student? Create an account</button></p>'}<p class="note">Forgot your password? Ask the librarian desk to reset it.</p></form></section>`}

