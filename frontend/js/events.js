// Granthalaya: events
/* ---------- events ---------- */
document.addEventListener('click',e=>{const t=e.target.closest('[data-act]');if(!t)return;const a=t.dataset.act,id=+t.dataset.id,rid=t.dataset.id;
if(a==='close'){if(e.target===t)closeM()}
else if(a==='cz'){const q=$('#czp');q.hidden=!q.hidden;t.setAttribute('aria-expanded',String(!q.hidden))}
else if(a==='ui'){UI[t.dataset.k]=t.dataset.v;applyUI()}
else if(a==='mo'){UI.motion=t.checked;applyUI()}
else if(a==='go'){if(t.dataset.t)S.rt=t.dataset.t;go(t.dataset.v)}
else if(a==='tab'){S.rt=t.dataset.t;render()}
else if(a==='spine')openBook(id)
else if(a==='logout'){setMe(null);auth()}
else if(a==='vw'){S.bw=t.dataset.w;render()}
else if(a==='eye'){const i=$('#pw');i.type=i.type==='password'?'text':'password';t.textContent=i.type==='password'?'Show':'Hide'}
else if(a==='addBook')modal('Add book',fld('Title','title','maxlength="59" required')+fld('Author','author','maxlength="39"')+fld('Number of copies','copies','type="number" min="1" required','1')+catSel(),'Add book',f=>fin(addBook(f)));
else if(a==='editBook'){const b=fb(id);modal('Update book',fld('Title','title','maxlength="59" required',b.title)+fld('Author','author','maxlength="39"',b.author)+fld('Total copies ('+(b.total-b.avail)+' currently issued)','copies','type="number" min="1" required',b.total)+catSel(b.cat),'Save changes',f=>fin(updBook(id,f)))}
else if(a==='delBook'){const b=fb(id);if(b.avail!==b.total)toast('Cannot delete: some copies of this book are still issued.',0);else ask('Delete “'+esc(b.title)+'” by '+esc(b.author)+'?','Delete book',()=>fin(delBook(id)))}
else if(a==='addStudent')modal('Register student',fld('Roll no (leave blank to auto-generate)','roll','maxlength="16" autocapitalize="characters" placeholder="BTCS24O1001"')+fld('Name','name','maxlength="39" required')+brYr()+fld('Starting password (8+ characters)','pw','type="password" minlength="8" required autocomplete="new-password"'),'Register',async f=>fin(await addStu(f)));
else if(a==='rpw'){const s=fs(rid);modal('Reset password for '+s.name,fld('New password (8+ characters)','pw','type="password" minlength="8" required autocomplete="new-password"'),'Reset password',async f=>fin(await resetPw(rid,f)))}
else if(a==='pw')modal('Change password',fld('Current password','cur','type="password" required autocomplete="current-password"')+fld('New password','n1','type="password" minlength="8" required autocomplete="new-password"')+fld('Repeat new password','n2','type="password" minlength="8" required autocomplete="new-password"'),'Update password',async f=>fin(await chPw(f)));
else if(a==='delStudent'){const s=fs(rid);if(s.held>0)toast('Cannot delete: student still holds '+s.held+' book(s). Return them first.',0);else ask('Delete '+esc(s.name)+' ('+esc(s.dept)+')?','Delete student',()=>fin(delStu(rid)))}
else if(a==='more'){S.sl+=120;fillStudents()}
else if(a==='csv'){const q=c=>{c=String(c);if(/^[=+\-@]/.test(c))c="'"+c;return'"'+c.replace(/"/g,'""')+'"'},x=[RH,...db.records.map(recRow)].map(r=>r.map(q).join(',')).join('\n'),l=document.createElement('a');l.href=URL.createObjectURL(new Blob([x],{type:'text/csv'}));l.download='granthalaya-records.csv';l.click();toast('Records exported.',1)}
else if(a==='reset')ask('This replaces every book, student, record and password with the sample data.','Reset data',()=>{seed();S.slip='';closeM();render();toast('Sample data restored.',1)})});
document.addEventListener('submit',e=>{const k=e.target.dataset.form;if(k!=='issue'&&k!=='return')return;e.preventDefault();
const d=Object.fromEntries(new FormData(e.target)),n=d.roll.trim().toUpperCase(),b=+d.book,r=k==='issue'?issue(n,b):giveBack(n,b);toast(r[1],r[0]);
if(r[0]){const x=r[2];S.slip=k==='issue'?slipHtml('Issue slip',[['Record ID',x.id],['Student',sn(n)],['Book',bt(b)],['Issue date',fmt(x.issued)],['Due date',fmt(x.due)]])
:slipHtml('Return receipt',[['Student',sn(n)],['Book',bt(b)],['Issued',fmt(x.issued)],['Due',fmt(x.due)],['Returned',fmt(x.ret)],['Days late',r[3]],['Fine','Rs. '+x.fine.toFixed(2)]]);render();if(k==='issue'||!x.fine)confetti()}});
document.addEventListener('input',e=>{const t=e.target,i=t.id;
if(i==='bq'){S.bq=t.value;fillBooks()}else if(i==='bs'){S.bo=t.value;fillBooks()}else if(i==='bav'){S.ba=t.checked;fillBooks()}else if(i==='rd'){S.rd=t.value;render()}
else if(i==='sq'){S.sq=t.value;S.sl=120;fillStudents()}else if(i==='sb'){S.sb=t.value;S.sl=120;fillStudents()}else if(i==='sy'){S.sy=t.value;S.sl=120;fillStudents()}else if(i==='bb'){S.bb=t.value;fillBooks()}
else if(i==='hq'){S.hq=t.value;fillReports()}
else if(t.dataset.look)look(t)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeM();$('#czp').hidden=true}});
document.addEventListener('click',e=>{const b=e.target.closest('button'),f=b&&b.form;if(f&&b.type==='submit'){e.preventDefault();if(f.reportValidity())f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))}});
document.addEventListener('submit',async e=>{if(e.target.id!=='lf')return;e.preventDefault();const E=$('#lerr');
if(Date.now()<lock){E.textContent='Too many attempts. Try again in '+Math.ceil((lock-Date.now())/1000)+' seconds.';return}
if(!(window.crypto&&crypto.subtle)){E.textContent='Sign-in needs a secure page. Open this file in Chrome, Edge or Firefox, or serve it over https.';return}
const d=Object.fromEntries(new FormData(e.target)),u=await tryLogin(d.roll,d.pw);
if(!u){if(++fails>=5){fails=0;lock=Date.now()+30000;E.textContent='Too many attempts. Sign-in is paused for 30 seconds.'}else E.textContent='ID or password is incorrect. Check both and try again.';return}
fails=0;setMe(u);S.v='dash';S.slip='';auth()});
