// Granthalaya: data
/* ---------- data layer ---------- */
function save(){try{localStorage.setItem(K,JSON.stringify(db))}catch(e){}}
function init(){try{localStorage.removeItem('granthalaya.v2')}catch(e){}try{db=JSON.parse(localStorage.getItem(K))}catch(e){db=null}if(!db||!db.books||!db.staff)seed();else upg()}
function seed(){const t=today(),o=n=>addDays(t,n),
B=(id,title,author,total,avail)=>({id,title,author,total,avail}),
T=(roll,name,dept,held,h,br,yr)=>({roll,name,dept,held,h,br,yr}),
R=(id,bookId,roll,a,b,r,fine)=>({id,bookId,roll,issued:o(a),due:o(b),returned:r!=null,ret:r!=null?o(r):'',fine:fine||0});
db={staff:[{roll:'LIB2026',name:'Head Librarian',h:'33501c6fce1a95ec1141e6992d334dd83ecf60fe33f98a8a06fac0e08e2e409f'}],
books:[B(1001,'Introduction to Algorithms','T. H. Cormen',4,3),B(1002,'The C++ Programming Language','B. Stroustrup',3,2),B(1003,'Database System Concepts','A. Silberschatz',3,2),B(1004,'Wings of Fire','A. P. J. Abdul Kalam',5,5),B(1005,'Discrete Mathematics','K. H. Rosen',2,2),B(1006,'Operating System Concepts','A. Silberschatz',3,3),B(1007,'Let Us C','Y. Kanetkar',6,6),B(1008,'Computer Networks','A. S. Tanenbaum',2,2),...[['Data Structures Using C','Reema Thareja',4],['Python Crash Course','Eric Matthes',3],['Clean Code','Robert C. Martin',3],['Engineering Mathematics','B. S. Grewal',6],['Signals and Systems','Alan V. Oppenheim',2],['Digital Design','M. Morris Mano',4],['Computer Organization','Carl Hamacher',3],['Artificial Intelligence','Stuart Russell',3],['The Alchemist','Paulo Coelho',4],['Malgudi Days','R. K. Narayan',3],['The Discovery of India','Jawaharlal Nehru',2],['Godan','Munshi Premchand',3],['The White Tiger','Aravind Adiga',3],['A Brief History of Time','Stephen Hawking',3],['Sapiens','Yuval Noah Harari',4],['Atomic Habits','James Clear',5],['Rich Dad Poor Dad','Robert Kiyosaki',3],['Ignited Minds','A. P. J. Abdul Kalam',3],['Concepts of Physics','H. C. Verma',5],['Organic Chemistry','Morrison and Boyd',2],['Software Engineering','Roger Pressman',3],['Compilers: Principles and Techniques','Alfred Aho',2],['Thinking, Fast and Slow','Daniel Kahneman',2],['The Monk Who Sold His Ferrari','Robin Sharma',2]].map((x,i)=>B(1009+i,x[0],x[1],x[2],x[2]))],
students:[T('BTCS24O1001','Aarav Sharma','Computer Science and Engineering',2,'','CS',3),T('BTIT25O1001','Diya Patel','Information Technology',1,'','IT',2),T('BTEL26O1001','Rohan Verma','Electronics Engineering',0,'','EL',1)],
records:[R(1,1001,'BTCS24O1001',-20,-6),R(2,1002,'BTCS24O1001',-3,11),R(3,1003,'BTIT25O1001',-5,9),R(4,1004,'BTEL26O1001',-30,-16,-12,8),R(5,1007,'BTCS24O1001',-27,-13,-14),R(6,1010,'BTIT25O1001',-24,-10,-7,6),R(7,1012,'BTEL26O1001',-21,-7,-9),R(8,1020,'BTCS24O1001',-17,-3,-4),R(9,1004,'BTIT25O1001',-12,2,-2),R(10,1015,'BTEL26O1001',-9,5,-1),R(11,1001,'BTEL26O1001',-8,6,-3),R(12,1018,'BTIT25O1001',-4,10,-1),R(13,1017,'BTCS24O1001',-6,8,-5),R(14,1008,'BTEL26O1001',-11,3,-8)],reviews:[{id:1,bookId:1004,roll:'BTCS24O1001',stars:5,text:'Inspiring and easy to read.',date:o(-14)},{id:2,bookId:1001,roll:'BTEL26O1001',stars:4,text:'Dense but worth it.',date:o(-3)}],resv:[],bk:[],notices:[{id:1,title:'Library hours',text:'Open Monday to Saturday, 9:00 to 17:00. Closed on public holidays.',date:o(-6)},{id:2,title:'New arrivals',text:'Fresh titles in Programming and Self-Help are now on the shelves.',date:o(-1)}]};db.records[5].paid=true;db.records[5].paidOn=o(-6);db.records[5].txn='GHDEMO01';upg();save()}

const fb=id=>db.books.find(b=>b.id===id),fs=r=>{r=String(r).trim().toUpperCase();return db.students.find(s=>s.roll===r)};
const bt=id=>fb(id)?fb(id).title:'(deleted book)',sn=r=>fs(r)?fs(r).name:'(deleted student)';
const late=r=>!r.returned&&diff(r.due,today())>0,overdue=()=>db.records.filter(late);
const nextId=()=>Math.max(1000,...db.books.map(b=>b.id),...db.records.map(r=>r.bookId))+1;

function addBook(f){const title=f.title.trim(),author=f.author.trim(),c=parseInt(f.copies);
if(!title)return[0,'Title cannot be empty.'];if(!(c>0))return[0,'Copies must be at least 1.'];
const id=nextId();db.books.push({id,title:title.slice(0,59),author:(author||'Unknown').slice(0,39),total:c,avail:c,cat:CATS.includes(f.cat)?f.cat:'Science'});save();return[1,'Book added. Book ID is '+id+'.']}
function updBook(id,f){const b=fb(id);if(!b)return[0,'Book not found.'];
const t=f.title.trim(),a=f.author.trim(),n=parseInt(f.copies)||0;let note='';
if(t)b.title=t.slice(0,59);if(a)b.author=a.slice(0,39);if(CATS.includes(f.cat))b.cat=f.cat;
if(n>0){const out=b.total-b.avail;if(n<out)note=' Total copies cannot be less than the '+out+' copies currently issued, so copies were left unchanged.';else{b.total=n;b.avail=n-out}}
else if(n<0)note=' Invalid number of copies. Copies left unchanged.';
save();return[1,'Book updated.'+note]}
function delBook(id){const i=db.books.findIndex(b=>b.id===id);if(i<0)return[0,'Book not found.'];db.books.splice(i,1);save();return[1,'Book deleted.']}
async function addStu(f){let roll=(f.roll||'').trim().toUpperCase();const pr=parseRoll(roll),br=f.br||(pr?pr.br:''),yr=+f.yr||(pr?pr.yr:0);
if(!roll){if(!br||!yr)return[0,'Pick a branch and year, or type a roll number.'];roll=nextRoll(br,yr)}
if(!/^[A-Z0-9]{6,16}$/.test(roll))return[0,'Roll number should look like BTCS24O1001.'];
if(fs(roll))return[0,'A student with this roll number already exists.'];
const name=f.name.trim();if(!name)return[0,'Name cannot be empty.'];if((f.pw||'').length<8)return[0,'Password must be at least 8 characters.'];
const B=brOf(br);db.students.push({roll,name:name.slice(0,39),dept:B?B.n:'N/A',br:B?br:'',yr:yr||0,held:0,h:await sha(roll,f.pw)});save();return[1,'Student registered. Roll no '+roll+'.']}
function delStu(roll){const i=db.students.findIndex(s=>s.roll===roll);if(i<0)return[0,'Student not found.'];db.students.splice(i,1);save();return[1,'Student deleted.']}
async function resetPw(roll,f){const s=fs(roll);if(!s)return[0,'Student not found.'];if((f.pw||'').length<8)return[0,'Password must be at least 8 characters.'];s.h=await sha(roll,f.pw);save();return[1,'Password reset for '+s.name+'. Share it with the student privately.']}
async function chPw(f){if(f.n1!==f.n2)return[0,'The new passwords do not match.'];
if(f.n1.length<8||!/\d/.test(f.n1)||!/[a-zA-Z]/.test(f.n1))return[0,'Use at least 8 characters, with letters and numbers.'];
const u=me.role==='lib'?db.staff.find(x=>x.roll===me.roll):fs(me.roll);
if(!u||!(u.h?u.h===await sha(me.roll,f.cur):f.cur===DEFPW))return[0,'Your current password is incorrect.'];
u.h=await sha(me.roll,f.n1);save();return[1,'Password updated. Use it the next time you sign in.']}
function issue(r,b){const s=fs(r);if(!s)return[0,'Student not found. Register the student first.'];
if(s.held>=MAX)return[0,s.name+' already holds the maximum of '+MAX+' books.'];
const k=fb(b);if(!k)return[0,'Book not found.'];
if(k.avail<=0)return[0,'Sorry, no copies of “'+k.title+'” are available right now.'];
if(db.records.some(x=>!x.returned&&x.roll===r&&x.bookId===b))return[0,'This student has already borrowed this book.'];
const t=today(),rec={id:Math.max(0,...db.records.map(x=>x.id))+1,bookId:b,roll:r,issued:t,due:addDays(t,DAYS),returned:false,ret:'',fine:0};
k.avail--;s.held++;db.records.push(rec);save();return[1,'Book issued. Due on '+fmt(rec.due)+'.',rec]}
function giveBack(r,b){const x=db.records.find(x=>!x.returned&&x.roll===r&&x.bookId===b);
if(!x)return[0,'No active borrowing found for this student and book.'];
x.ret=today();x.returned=true;const l=diff(x.due,x.ret);x.fine=l>0?l*FINE:0;
const k=fb(b),s=fs(r);if(k)k.avail++;if(s&&s.held>0)s.held--;
save();return[1,'Book returned. Fine: Rs. '+x.fine.toFixed(2)+'.',x,Math.max(0,l)]}

