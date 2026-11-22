// Granthalaya: ui
/* ---------- ui helpers ---------- */
const H=h=>({h}),cell=c=>c&&c.h!==undefined?c.h:esc(c);
const tbl=(hd,rows,cls=[])=>`<div class="wrap"><table><thead><tr>${hd.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r,i)=>`<tr class="${cls[i]||''}">${r.map(c=>`<td>${cell(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const empty=m=>`<div class="card empty">${m}</div>`;
const fld=(l,n,at,v='')=>`<label class="f"><span>${l}</span><input name="${n}" value="${esc(v)}" ${at}></label>`;
const closeM=()=>{$('#modal').innerHTML=''};
function toast(m,ok){const t=$('#toast');t.textContent=m;t.className='show'+(ok?'':' bad');clearTimeout(tt);tt=setTimeout(()=>{t.className=''},3800)}
const fin=r=>{toast(r[1],r[0]);if(r[0]){closeM();render()}};
function modal(title,body,ok,fn){$('#modal').innerHTML=`<div class="ov" data-act="close"><form class="mdl" role="dialog" aria-modal="true" aria-label="${esc(title)}"><h2>${esc(title)}</h2>${body}<div class="acts"><button type="button" class="btn ghost" data-act="close">Cancel</button><button class="btn">${ok}</button></div></form></div>`;
const f=$('#modal form');f.onsubmit=e=>{e.preventDefault();fn(Object.fromEntries(new FormData(f)))};const i=f.querySelector('input');if(i)i.focus()}
const ask=(msg,ok,fn)=>modal('Please confirm',`<p>${msg}</p>`,ok,()=>{closeM();fn()});
const slipHtml=(t,rows)=>`<div class="slip"><h3>${t}</h3><dl>${rows.map(([k,v])=>`<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}</dl></div>`;

