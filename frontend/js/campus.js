// Granthalaya v5: MITS Gwalior branches, roll numbers, more genres, books, authors and students
Object.assign(IC,{cap:'<path d="M2 9l10-5 10 5-10 5zM6 11.5V16c3 2.5 9 2.5 12 0v-4.5M22 9v6"/>'});
const grow=()=>{grow4();grow5()};

/* ---------- branches (codes are the same letters used inside roll numbers) ---------- */
const YR=['First','Second','Third','Fourth','Fifth'];
const BR=[['CE','Civil Engineering','B.Tech',1957,60,'V'],['ME','Mechanical Engineering','B.Tech',1957,60,'M'],['EE','Electrical Engineering','B.Tech',1957,60,'E'],
['EL','Electronics Engineering','B.Tech',1982,120,'E'],['AR','Architecture','B.Arch',1984,40,'AD'],['CS','Computer Science & Engineering','B.Tech',1994,120,'C'],
['CM','Chemical Engineering','B.Tech',1996,30,'H'],['IT','Information Technology','B.Tech',2000,120,'C'],['ET','Electronics & Telecommunication Engineering','B.Tech',2015,120,'E'],
['IR','Information Technology (AI & Robotics)','B.Tech',2020,60,'CE'],['MC','Mathematics & Computing','B.Tech',2020,120,'CT'],['IO','Internet of Things (IoT)','B.Tech',2020,60,'CE'],
['AD','Artificial Intelligence & Data Science','B.Tech',2021,60,'CT'],['AM','Artificial Intelligence & Machine Learning','B.Tech',2021,60,'CT'],['CD','Computer Science & Design','B.Tech',2021,120,'CD'],
['CB','Computer Science & Business Systems','B.Tech',2024,60,'CB'],['AI','Artificial Intelligence','B.Tech',2024,0,'CT'],['EC','Electrical & Computer Engineering','B.Tech',2025,0,'EC'],
['TC','Computer Science & Technology','B.Tech',2025,0,'C']].map(([c,n,p,s,i,g])=>({c,n,p,s,i,g}));
const brOf=c=>BR.find(b=>b.c===c),hc=s=>[...String(s)].reduce((a,ch)=>a+ch.charCodeAt(0),0);
const ay=()=>{const d=new Date();return d.getMonth()>=6?d.getFullYear():d.getFullYear()-1},yrsOf=b=>Math.max(1,Math.min(b.c==='AR'?5:4,ay()-b.s+1));
const pad3=n=>String(n).padStart(3,'0'),pre=(b,adm)=>(b.c==='AR'?'BRAR':'BT'+b.c)+String(adm%100).padStart(2,'0')+'O1';
/* roll number = BT + branch + joining year + O1 + serial, e.g. BTCS24O1001 (B.Arch uses BRAR) */
function parseRoll(r){const m=/^(?:BT([A-Z]{2})|BR(AR))(\d{2})O[13][0-9A-Z]{3}$/.exec(String(r).toUpperCase());if(!m)return null;const c=m[1]||m[2],y=ay()-(2000+ +m[3])+1;return brOf(c)&&y>=1&&y<=5?{br:c,yr:y}:null}
function nextRoll(c,yr){const b=brOf(c),p=pre(b,ay()-yr+1);let n=0;db.students.forEach(s=>{if(s.roll.startsWith(p)){const k=parseInt(s.roll.slice(p.length));if(k>n)n=k}});return p+pad3(n+1)}
const brOpts=(v,all)=>`<option value="">${all}</option>`+BR.map(b=>`<option value="${b.c}"${b.c===v?' selected':''}>${b.c} · ${esc(b.n)}</option>`).join('');
const yrOpts=v=>'<option value="">All years</option>'+YR.map((y,i)=>`<option value="${i+1}"${String(i+1)===v?' selected':''}>${y} year</option>`).join('');
const brYr=()=>`<label class="f"><span>Branch</span><select name="br"><option value="">Detect from roll no</option>${BR.map(b=>`<option value="${b.c}">${b.c} · ${esc(b.n)}</option>`).join('')}</select></label><label class="f"><span>Year</span><select name="yr"><option value="">Detect from roll no</option>${YR.map((y,i)=>`<option value="${i+1}">${y} year</option>`).join('')}</select></label>`;
const brLabel=s=>(s.br&&brOf(s.br)?s.br+', ':'')+(s.yr?YR[s.yr-1]+' year':s.dept||''),brTag=r=>{const s=fs(r);return s&&s.br?' · '+s.br+(s.yr?' · Year '+s.yr:''):''};
const brChip=s=>s.br&&brOf(s.br)?`<span class="tag">${s.br}</span> ${esc(brOf(s.br).n)}`:esc(s.dept||'-');
const bookFits=(b,c)=>{if(!c)return true;const B=brOf(c),g=b.g||'X';return g.includes('X')||[...g].some(ch=>B.g.includes(ch))};

/* ---------- more books: Title|Author|Genre|Copies|Branch groups (X all, C computing, E electrical/electronics, M mechanical, V civil, H chemical, A architecture, D design, T maths/data, B business) ---------- */
const NEW2=`Advanced Engineering Mathematics|Erwin Kreyszig|Mathematics|6|X
Higher Engineering Mathematics|B. S. Grewal|Mathematics|5|X
Calculus|James Stewart|Mathematics|4|X
Thomas’ Calculus|George B. Thomas|Mathematics|3|X
Linear Algebra and Its Applications|Gilbert Strang|Mathematics|3|T
Introduction to Probability|D. Bertsekas and J. Tsitsiklis|Mathematics|3|T
Numerical Methods for Engineers|Steven Chapra and Raymond Canale|Mathematics|3|X
Concrete Mathematics|Graham, Knuth and Patashnik|Mathematics|2|CT
Ordinary and Partial Differential Equations|M. D. Raisinghania|Mathematics|3|X
Introduction to Real Analysis|Robert G. Bartle|Mathematics|2|T
Pattern Recognition and Machine Learning|Christopher M. Bishop|AI & Data|3|CT
Deep Learning|Ian Goodfellow, Yoshua Bengio, Aaron Courville|AI & Data|3|CT
Hands-On Machine Learning with Scikit-Learn and TensorFlow|Aurélien Géron|AI & Data|4|CT
An Introduction to Statistical Learning|Gareth James et al.|AI & Data|3|CT
Python for Data Analysis|Wes McKinney|AI & Data|3|CT
Data Science from Scratch|Joel Grus|AI & Data|3|CT
Reinforcement Learning: An Introduction|Richard S. Sutton and Andrew G. Barto|AI & Data|2|CT
Machine Learning|Tom M. Mitchell|AI & Data|3|CT
Speech and Language Processing|Daniel Jurafsky and James H. Martin|AI & Data|2|CT
Data Mining: Concepts and Techniques|Jiawei Han, Micheline Kamber, Jian Pei|AI & Data|3|CT
Probabilistic Robotics|Sebastian Thrun|AI & Data|2|CE
Introduction to Robotics|John J. Craig|Mechanical|2|ME
Life 3.0|Max Tegmark|AI & Data|2|X
Introduction to the Theory of Computation|Michael Sipser|Programming|3|C
Fundamentals of Computer Algorithms|Ellis Horowitz and Sartaj Sahni|Programming|3|C
Computer Networking: A Top-Down Approach|James Kurose and Keith Ross|Programming|3|C
Database Management Systems|Raghu Ramakrishnan|Programming|3|C
Head First Java|Kathy Sierra and Bert Bates|Programming|4|C
Effective Java|Joshua Bloch|Programming|3|C
Java: The Complete Reference|Herbert Schildt|Programming|4|C
Programming in ANSI C|E. Balagurusamy|Programming|5|X
Object-Oriented Programming with C++|E. Balagurusamy|Programming|4|C
The C Programming Language|Brian Kernighan and Dennis Ritchie|Programming|4|X
Fluent Python|Luciano Ramalho|Programming|2|C
Eloquent JavaScript|Marijn Haverbeke|Programming|3|CD
Design Patterns|Erich Gamma et al.|Programming|3|C
Computer Architecture: A Quantitative Approach|Hennessy and Patterson|Programming|2|CE
Computer System Architecture|M. Morris Mano|Programming|3|CE
Introduction to Automata Theory, Languages and Computation|Hopcroft, Motwani and Ullman|Programming|3|C
Cryptography and Network Security|William Stallings|Programming|3|C
Designing Data-Intensive Applications|Martin Kleppmann|Programming|3|C
Cloud Computing: Concepts, Technology and Architecture|Thomas Erl|Programming|2|C
Internet of Things: A Hands-On Approach|Arshdeep Bahga and Vijay Madisetti|Programming|3|CE
Embedded Systems: Architecture, Programming and Design|Raj Kamal|Electronics|3|CE
Cracking the Coding Interview|Gayle Laakmann McDowell|Competitive Exams|4|C
Microelectronic Circuits|Adel S. Sedra and Kenneth C. Smith|Electronics|4|E
Electronic Devices and Circuit Theory|Robert Boylestad and Louis Nashelsky|Electronics|4|E
Integrated Electronics|Jacob Millman and Christos Halkias|Electronics|2|E
Electronic Principles|Albert Malvino|Electronics|3|E
Digital Signal Processing|John G. Proakis and Dimitris Manolakis|Electronics|3|E
Communication Systems|Simon Haykin|Electronics|3|E
Electronic Communication Systems|Wayne Tomasi|Electronics|2|E
Microprocessor Architecture, Programming and Applications with the 8085|Ramesh Gaonkar|Electronics|3|EC
The 8051 Microcontroller and Embedded Systems|Muhammad Ali Mazidi|Electronics|3|EC
Engineering Electromagnetics|William H. Hayt|Electronics|3|E
Antenna Theory|Constantine A. Balanis|Electronics|2|E
Digital Logic and Computer Design|M. Morris Mano|Electronics|3|EC
CMOS VLSI Design|Neil Weste and David Harris|Electronics|2|E
Discrete-Time Signal Processing|Alan Oppenheim and Ronald Schafer|Electronics|2|E
Wireless Communications|Theodore S. Rappaport|Electronics|2|E
Electrical Machinery|P. S. Bimbhra|Electrical|4|E
Electrical Machines|I. J. Nagrath and D. P. Kothari|Electrical|3|E
Power System Analysis|Hadi Saadat|Electrical|3|E
A Textbook of Electrical Technology|B. L. Theraja and A. K. Theraja|Electrical|5|E
Control Systems Engineering|I. J. Nagrath and M. Gopal|Electrical|3|E
Modern Control Engineering|Katsuhiko Ogata|Electrical|3|E
Power Electronics|Muhammad H. Rashid|Electrical|3|E
Principles of Power System|V. K. Mehta|Electrical|3|E
Network Analysis|M. E. Van Valkenburg|Electrical|3|E
Fundamentals of Electric Circuits|Charles Alexander and Matthew Sadiku|Electrical|4|E
Engineering Circuit Analysis|William H. Hayt and Jack Kemmerly|Electrical|3|E
Switchgear and Protection|Sunil S. Rao|Electrical|2|E
Sustainable Energy: Without the Hot Air|David J. C. MacKay|Environment|2|EM
Engineering Thermodynamics|P. K. Nag|Mechanical|4|M
Thermodynamics: An Engineering Approach|Yunus A. Cengel and Michael Boles|Mechanical|3|MH
A Textbook of Fluid Mechanics and Hydraulic Machines|R. K. Bansal|Mechanical|4|MVH
Theory of Machines|S. S. Rattan|Mechanical|3|M
A Textbook of Machine Design|R. S. Khurmi and J. K. Gupta|Mechanical|4|M
Shigley’s Mechanical Engineering Design|Richard Budynas and Keith Nisbett|Mechanical|3|M
Mechanics of Materials|Ferdinand Beer and E. Russell Johnston|Mechanical|3|MV
Vector Mechanics for Engineers|Ferdinand Beer and E. Russell Johnston|Mechanical|3|X
Heat and Mass Transfer|Yunus A. Cengel|Mechanical|3|MH
Fundamentals of Heat and Mass Transfer|Frank P. Incropera|Mechanical|2|MH
Internal Combustion Engines|V. Ganesan|Mechanical|3|M
Manufacturing Engineering and Technology|Serope Kalpakjian|Mechanical|3|M
Materials Science and Engineering|William D. Callister|Mechanical|3|MVH
Refrigeration and Air Conditioning|C. P. Arora|Mechanical|2|M
Engineering Drawing|N. D. Bhatt|Mechanical|5|X
Surveying|B. C. Punmia|Civil|4|V
Soil Mechanics and Foundations|B. C. Punmia|Civil|3|V
Limit State Design of Reinforced Concrete|P. C. Varghese|Civil|3|V
Structural Analysis|R. C. Hibbeler|Civil|3|V
Theory of Structures|S. Ramamrutham|Civil|3|V
Concrete Technology|M. S. Shetty|Civil|3|V
Highway Engineering|S. K. Khanna and C. E. G. Justo|Civil|3|V
Water Supply Engineering|S. K. Garg|Civil|2|V
Irrigation Engineering and Hydraulic Structures|S. K. Garg|Civil|2|V
Building Construction|B. C. Punmia, Ashok Jain and Arun Jain|Civil|3|VA
Engineering Hydrology|K. Subramanya|Civil|2|V
Design of Steel Structures|S. K. Duggal|Civil|2|V
Chemical Engineering Thermodynamics|J. M. Smith and H. C. Van Ness|Chemical|2|H
Unit Operations of Chemical Engineering|Warren McCabe and Julian Smith|Chemical|3|H
Chemical Reaction Engineering|Octave Levenspiel|Chemical|3|H
Transport Phenomena|R. B. Bird, W. E. Stewart and E. N. Lightfoot|Chemical|2|H
Process Heat Transfer|Donald Q. Kern|Chemical|2|H
Mass Transfer Operations|Robert E. Treybal|Chemical|2|H
Elements of Chemical Reaction Engineering|H. Scott Fogler|Chemical|2|H
Process Dynamics and Control|Dale Seborg et al.|Chemical|2|H
Engineering Chemistry|P. C. Jain and Monika Jain|Chemical|4|X
Architecture: Form, Space, and Order|Francis D. K. Ching|Architecture|4|A
A Visual Dictionary of Architecture|Francis D. K. Ching|Architecture|2|A
Building Construction Illustrated|Francis D. K. Ching|Architecture|3|AV
Towards a New Architecture|Le Corbusier|Architecture|2|A
A Pattern Language|Christopher Alexander|Architecture|2|A
Neufert Architects’ Data|Ernst Neufert|Architecture|3|A
The Death and Life of Great American Cities|Jane Jacobs|Architecture|2|A
Experiencing Architecture|Steen Eiler Rasmussen|Architecture|2|A
Indian Architecture: Buddhist and Hindu Periods|Percy Brown|Architecture|2|A
Fundamentals of Building Construction|Edward Allen and Joseph Iano|Architecture|3|AV
A Place in the Shade|Charles Correa|Architecture|2|A
The Design of Everyday Things|Don Norman|Art & Design|3|AD
Don’t Make Me Think|Steve Krug|Art & Design|3|CD
Ways of Seeing|John Berger|Art & Design|3|AD
Thinking with Type|Ellen Lupton|Art & Design|2|AD
The Elements of Typographic Style|Robert Bringhurst|Art & Design|2|AD
Universal Principles of Design|William Lidwell et al.|Art & Design|2|AD
Steal Like an Artist|Austin Kleon|Art & Design|3|X
Fundamentals of Physics|Halliday, Resnick and Walker|Science|5|X
Engineering Physics|R. K. Gaur and S. L. Gupta|Science|4|X
Physics for Scientists and Engineers|Raymond Serway and John Jewett|Science|3|X
The Feynman Lectures on Physics|Richard Feynman, Robert Leighton, Matthew Sands|Science|2|X
Six Easy Pieces|Richard Feynman|Science|3|X
Introduction to Quantum Mechanics|David J. Griffiths|Science|2|X
The Elegant Universe|Brian Greene|Science|2|X
On the Origin of Species|Charles Darwin|Science|2|X
Astrophysics for People in a Hurry|Neil deGrasse Tyson|Science|3|X
Pale Blue Dot|Carl Sagan|Science|2|X
Chemistry: The Central Science|Theodore Brown and H. Eugene LeMay|Science|3|XH
Silent Spring|Rachel Carson|Environment|2|X
Textbook of Environmental Studies|Erach Bharucha|Environment|5|X
Environmental Engineering|Peavy, Rowe and Tchobanoglous|Environment|2|V
The Sixth Extinction|Elizabeth Kolbert|Environment|2|X
Small Is Beautiful|E. F. Schumacher|Environment|2|X
Ecology and Environment|P. D. Sharma|Environment|3|X
Kamayani|Jaishankar Prasad|Hindi Literature|3|X
Rashmirathi|Ramdhari Singh Dinkar|Hindi Literature|3|X
Karmabhoomi|Munshi Premchand|Hindi Literature|3|X
Rangbhoomi|Munshi Premchand|Hindi Literature|2|X
Mansarovar|Munshi Premchand|Hindi Literature|3|X
Gunahon Ka Devta|Dharamvir Bharati|Hindi Literature|3|X
Andha Yug|Dharamvir Bharati|Hindi Literature|2|X
Raag Darbari|Shrilal Shukla|Hindi Literature|3|X
Tamas|Bhisham Sahni|Hindi Literature|3|X
Chitralekha|Bhagwati Charan Verma|Hindi Literature|2|X
Vaishnav Ki Fisalan|Harishankar Parsai|Hindi Literature|2|X
Shekhar: Ek Jivani|Agyeya|Hindi Literature|2|X
Ramcharitmanas|Tulsidas|Hindi Literature|3|X
The Kite Runner|Khaled Hosseini|Fiction|3|X
A Thousand Splendid Suns|Khaled Hosseini|Fiction|2|X
The God of Small Things|Arundhati Roy|Fiction|3|X
Midnight’s Children|Salman Rushdie|Fiction|2|X
The Room on the Roof|Ruskin Bond|Fiction|3|X
Train to Pakistan|Khushwant Singh|Fiction|3|X
Five Point Someone|Chetan Bhagat|Fiction|5|X
2 States|Chetan Bhagat|Fiction|4|X
Interpreter of Maladies|Jhumpa Lahiri|Fiction|2|X
Life of Pi|Yann Martel|Fiction|3|X
A Suitable Boy|Vikram Seth|Fiction|2|X
To Kill a Mockingbird|Harper Lee|Classics|3|X
1984|George Orwell|Classics|4|X
Animal Farm|George Orwell|Classics|4|X
The Old Man and the Sea|Ernest Hemingway|Classics|3|X
Crime and Punishment|Fyodor Dostoevsky|Classics|2|X
The Great Gatsby|F. Scott Fitzgerald|Classics|3|X
Jane Eyre|Charlotte Brontë|Classics|2|X
Wuthering Heights|Emily Brontë|Classics|2|X
Brave New World|Aldous Huxley|Classics|3|X
Dune|Frank Herbert|Sci-Fi & Fantasy|3|X
Foundation|Isaac Asimov|Sci-Fi & Fantasy|3|X
I, Robot|Isaac Asimov|Sci-Fi & Fantasy|3|CE
The Hitchhiker’s Guide to the Galaxy|Douglas Adams|Sci-Fi & Fantasy|3|X
Ender’s Game|Orson Scott Card|Sci-Fi & Fantasy|2|X
The Hobbit|J. R. R. Tolkien|Sci-Fi & Fantasy|4|X
The Fellowship of the Ring|J. R. R. Tolkien|Sci-Fi & Fantasy|3|X
2001: A Space Odyssey|Arthur C. Clarke|Sci-Fi & Fantasy|2|X
The Martian|Andy Weir|Sci-Fi & Fantasy|3|X
The Three-Body Problem|Liu Cixin|Sci-Fi & Fantasy|3|X
The Immortals of Meluha|Amish Tripathi|Sci-Fi & Fantasy|4|X
Frankenstein|Mary Shelley|Sci-Fi & Fantasy|2|X
The Adventures of Sherlock Holmes|Arthur Conan Doyle|Mystery|4|X
The Hound of the Baskervilles|Arthur Conan Doyle|Mystery|2|X
And Then There Were None|Agatha Christie|Mystery|4|X
Murder on the Orient Express|Agatha Christie|Mystery|3|X
The Murder of Roger Ackroyd|Agatha Christie|Mystery|2|X
The Da Vinci Code|Dan Brown|Mystery|4|X
Angels & Demons|Dan Brown|Mystery|3|X
The Girl with the Dragon Tattoo|Stieg Larsson|Mystery|2|X
The Silent Patient|Alex Michaelides|Mystery|3|X
Leaves of Grass|Walt Whitman|Poetry|2|X
The Waste Land|T. S. Eliot|Poetry|2|X
Diwan-e-Ghalib|Mirza Ghalib|Poetry|3|X
The Prophet|Kahlil Gibran|Poetry|3|X
Songs of Innocence and of Experience|William Blake|Poetry|2|X
Milk and Honey|Rupi Kaur|Poetry|3|X
Long Walk to Freedom|Nelson Mandela|Biography|3|X
Steve Jobs|Walter Isaacson|Biography|3|X
The Man Who Knew Infinity|Robert Kanigel|Biography|3|X
Surely You’re Joking, Mr. Feynman!|Richard Feynman|Biography|3|X
My Journey|A. P. J. Abdul Kalam|Biography|3|X
I Am Malala|Malala Yousafzai|Biography|3|X
The Diary of a Young Girl|Anne Frank|Biography|3|X
Playing It My Way|Sachin Tendulkar|Biography|3|X
India’s Struggle for Independence|Bipan Chandra|History|4|X
The Wonder That Was India|A. L. Basham|History|3|X
Freedom at Midnight|Larry Collins and Dominique Lapierre|History|3|X
Guns, Germs, and Steel|Jared Diamond|History|3|X
An Era of Darkness|Shashi Tharoor|History|2|X
The Penguin History of Early India|Romila Thapar|History|2|X
The Bhagavad Gita|Eknath Easwaran|Philosophy|4|X
Meditations|Marcus Aurelius|Philosophy|3|X
The Republic|Plato|Philosophy|2|X
Sophie’s World|Jostein Gaarder|Philosophy|3|X
The Art of War|Sun Tzu|Philosophy|3|X
Arthashastra|Kautilya|Philosophy|3|X
Autobiography of a Yogi|Paramahansa Yogananda|Philosophy|3|X
Siddhartha|Hermann Hesse|Philosophy|3|X
The Story of Philosophy|Will Durant|Philosophy|2|X
The 7 Habits of Highly Effective People|Stephen R. Covey|Self-Help|4|X
How to Win Friends and Influence People|Dale Carnegie|Self-Help|5|X
Deep Work|Cal Newport|Self-Help|3|X
Ikigai|Héctor García and Francesc Miralles|Self-Help|4|X
Think and Grow Rich|Napoleon Hill|Self-Help|3|X
Mindset|Carol S. Dweck|Self-Help|3|X
You Can Win|Shiv Khera|Self-Help|3|X
The Power of Your Subconscious Mind|Joseph Murphy|Self-Help|3|X
The 5 AM Club|Robin Sharma|Self-Help|3|X
Principles of Management|P. C. Tripathi and P. N. Reddy|Business|3|B
Marketing Management|Philip Kotler|Business|3|B
Zero to One|Peter Thiel|Business|3|X
The Lean Startup|Eric Ries|Business|3|X
Good to Great|Jim Collins|Business|2|B
The Intelligent Investor|Benjamin Graham|Business|2|B
Principles of Economics|N. Gregory Mankiw|Business|3|B
The Psychology of Money|Morgan Housel|Business|3|X
Management Information Systems|Kenneth C. Laudon|Business|3|B
Competitive Strategy|Michael E. Porter|Business|2|B
Quantitative Aptitude for Competitive Examinations|R. S. Aggarwal|Competitive Exams|6|X
A Modern Approach to Verbal and Non-Verbal Reasoning|R. S. Aggarwal|Competitive Exams|5|X
Objective General English|S. P. Bakshi|Competitive Exams|4|X
Word Power Made Easy|Norman Lewis|Competitive Exams|4|X
Indian Polity|M. Laxmikanth|Competitive Exams|5|X
High School English Grammar and Composition|P. C. Wren and H. Martin|Competitive Exams|5|X
Lucent’s General Knowledge|Binay Karna|Competitive Exams|3|X`.split('\n').map(l=>l.split('|'));

/* legacy titles: which branches they suit (everything else defaults by genre) */
const GMAP={'Signals and Systems':'E','Digital Design':'EC','Computer Organization':'CE','Engineering Mathematics':'X','Concepts of Physics':'X','Organic Chemistry':'XH','Artificial Intelligence':'CT','Introduction to Algorithms':'C','Discrete Mathematics':'CT','The Art of Computer Programming':'CT','Human Compatible':'CT','Modern Operating Systems':'C'};

/* ---------- authors and professors added in v5 ---------- */
AU.push(...[['kreyszig','Erwin Kreyszig','p','Mathematician',210,'Mathematics professor','Mathematician whose Advanced Engineering Mathematics is a standard text in engineering colleges across the world.',['Advanced Engineering Mathematics','Introductory Functional Analysis']],
['grewal','B. S. Grewal','p','Indian educator',100,'Engineering mathematics author','Indian mathematics educator whose Higher Engineering Mathematics has served generations of engineering students.',['Higher Engineering Mathematics','Engineering Mathematics']],
['balagurusamy','E. Balagurusamy','p','Indian author',140,'Programming textbook author','Writes widely used introductory textbooks on C, C++ and Java for Indian colleges.',['Programming in ANSI C','Object-Oriented Programming with C++']],
['kanetkar','Yashavant Kanetkar','p','Indian author',170,'Author of Let Us C','Indian author best known for Let Us C, a first programming book for countless students.',['Let Us C','Understanding Pointers in C']],
['kernighan','Brian Kernighan','p','Princeton University',200,'Computer scientist','Co-author of The C Programming Language with Dennis Ritchie and a long-time Unix pioneer.',['The C Programming Language','The Unix Programming Environment']],
['goodfellow','Ian Goodfellow','p','AI researcher',250,'Deep learning researcher','Co-author of the textbook Deep Learning and the inventor of generative adversarial networks.',['Deep Learning']],
['sipser','Michael Sipser','p','MIT',190,'Computer scientist','MIT professor whose textbook is the usual first book on the theory of computation.',['Introduction to the Theory of Computation']],
['sedra','Adel S. Sedra','p','Electrical engineer',20,'Electronics educator','Co-author of Microelectronic Circuits, a standard introduction to analog and digital electronics.',['Microelectronic Circuits']],
['nagrath','I. J. Nagrath','p','Indian educator',280,'Electrical engineering author','With D. P. Kothari and M. Gopal he wrote classic Indian texts on machines, power systems and control.',['Electrical Machines','Control Systems Engineering']],
['cengel','Yunus A. Cengel','p','Mechanical engineer',330,'Thermal sciences author','Professor and author of widely used textbooks on thermodynamics and heat transfer.',['Thermodynamics: An Engineering Approach','Heat and Mass Transfer']],
['punmia','B. C. Punmia','p','Indian educator',45,'Civil engineering author','Civil engineering educator known for books on surveying, soil mechanics and construction.',['Surveying','Soil Mechanics and Foundations','Building Construction']],
['levenspiel','Octave Levenspiel','p','Oregon State University',130,'Chemical engineer','Chemical engineering professor whose Chemical Reaction Engineering became a classic.',['Chemical Reaction Engineering']],
['ching','Francis D. K. Ching','p','Architect and illustrator',160,'Architecture educator','American architect and professor whose drawings teach design and construction clearly.',['Architecture: Form, Space, and Order','Building Construction Illustrated']],
['feynman','Richard Feynman','p','1918–1988',150,'Physicist and Nobel laureate','Nobel prize winning physicist and a famously clear teacher.',['The Feynman Lectures on Physics','Six Easy Pieces']],
['sagan','Carl Sagan','p','1934–1996',215,'Astronomer','Astronomer who made the cosmos a public conversation through books and television.',['Cosmos','Pale Blue Dot','Contact']],
['laxmikanth','M. Laxmikanth','p','Indian author',300,'Civil services author','Author of Indian Polity, a standard book for competitive examinations in India.',['Indian Polity']],
['ruskin','Ruskin Bond','w','b. 1934',25,'Author of the hills','Indian author loved for short stories and children’s books set in the Himalayan foothills.',['The Room on the Roof','A Flight of Pigeons']],
['arundhati','Arundhati Roy','w','b. 1961',335,'Novelist and essayist','Booker Prize winner for The God of Small Things, her first novel.',['The God of Small Things','The Ministry of Utmost Happiness']],
['bhagat','Chetan Bhagat','w','b. 1974',50,'Popular novelist','Wrote Five Point Someone about life in an engineering college and many bestsellers since.',['Five Point Someone','2 States','One Night at the Call Center']],
['hosseini','Khaled Hosseini','w','b. 1965',190,'Novelist','Afghan-American novelist of The Kite Runner and A Thousand Splendid Suns.',['The Kite Runner','A Thousand Splendid Suns']],
['christie','Agatha Christie','w','1890–1976',5,'Crime novelist','Best selling English crime writer, creator of Hercule Poirot and Miss Marple.',['And Then There Were None','Murder on the Orient Express']],
['doyle','Arthur Conan Doyle','w','1859–1930',300,'Creator of Sherlock Holmes','Scottish writer who gave detective fiction its most famous detective.',['The Adventures of Sherlock Holmes','The Hound of the Baskervilles']],
['orwell','George Orwell','w','1903–1950',90,'Novelist and essayist','English writer whose sharp political fables and essays still shape how we talk about power.',['1984','Animal Farm']],
['tolkien','J. R. R. Tolkien','w','1892–1973',140,'Author and philologist','Oxford scholar who built the world of Middle-earth.',['The Hobbit','The Lord of the Rings']],
['asimov','Isaac Asimov','w','1920–1992',215,'Science fiction writer','Biochemist and prolific author whose robot and Foundation stories shaped science fiction.',['Foundation','I, Robot']],
['darwin','Charles Darwin','w','1809–1882',60,'Naturalist','English naturalist whose theory of evolution by natural selection changed biology.',['On the Origin of Species','The Voyage of the Beagle']],
['bachchan','Harivansh Rai Bachchan','w','1907–2003',30,'Hindi poet','Hindi poet best loved for Madhushala, a book-length poem first published in 1935.',['Madhushala','Madhubala','Madhukalash']],
['dinkar','Ramdhari Singh Dinkar','w','1908–1974',10,'Hindi poet','Poet of heroism and national awakening, remembered as Rashtrakavi.',['Rashmirathi','Kurukshetra','Urvashi']],
['jaishankar','Jaishankar Prasad','w','1889–1937',270,'Hindi poet and dramatist','Leading figure of the Chhayavad school of Hindi poetry, famed for Kamayani.',['Kamayani','Skandagupta','Chandragupta']],
['sahni','Bhisham Sahni','w','1915–2003',80,'Hindi novelist','Writer of Tamas, a novel about the Partition riots, and many short stories.',['Tamas']],
['ghalib','Mirza Ghalib','w','1797–1869',350,'Urdu poet','Master of the Urdu ghazal, still quoted in everyday speech across South Asia.',['Diwan-e-Ghalib']],
['covey','Stephen R. Covey','w','1932–2012',215,'Author and educator','Author of The 7 Habits of Highly Effective People, a long-running self-help classic.',['The 7 Habits of Highly Effective People']]
].map(([k,n,t,y,h,r,b,w],i)=>({k,n,t,y,h,r,b,w,v:i%3})));

/* ---------- one-time growth: text roll numbers, branch tags, new genres and books, student roster ---------- */
function mk(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const FM='Aarav Vivaan Aditya Arjun Rohan Karan Ishaan Harsh Yash Ankit Rahul Siddharth Manish Pranav Nikhil Saurabh Shubham Abhishek Ayush Devansh Kunal Lakshya Mohit Naman Piyush Rishabh Sahil Tushar Utkarsh Vikas Akash Deepak Gaurav Himanshu Jatin Kartik Mayank Neeraj Prateek Raghav Sumit Tanmay Vedant Yogesh Anirudh Chirag Dhruv Hardik Lokesh'.split(' '),
FF='Diya Ananya Aadhya Isha Kavya Meera Neha Pooja Riya Sakshi Shreya Tanvi Anjali Bhavna Divya Garima Harshita Jhanvi Khushi Muskan Nidhi Palak Priya Rashi Simran Sneha Tanya Vaishnavi Yashika Aarohi Charu Drishti Ekta Gunjan Ishita Juhi Kritika Lavanya Mansi Nandini Pallavi Radhika Sanya Trisha Urvashi Vidhi Aditi Bhumi Chhavi Deepika'.split(' '),
SN='Sharma Verma Gupta Patel Singh Tomar Bhadoria Chauhan Jain Agrawal Mishra Tiwari Pandey Yadav Dubey Shrivastava Kushwah Rathore Sengar Parihar Jadon Saxena Khare Bansal Mittal Goyal Sisodia Raghuvanshi Dwivedi Chaturvedi Thakur Kaushik Soni Rawat Bhatt Kulkarni Nair Reddy Iyer Mehta Joshi Shukla Awasthi Pathak Gurjar Dixit Kapoor Malhotra Arora Bajpai'.split(' ');

function grow5(){if(db.v5)return;const rn=mk(2026),pick=a=>a[Math.floor(rn()*a.length)];
/* 1. roll numbers become text; tag legacy students with a branch */
db.students.forEach(s=>{s.roll=String(s.roll).toUpperCase();if(!s.br){const p=parseRoll(s.roll),b=BR.find(x=>x.n.toLowerCase().startsWith((s.dept||'~').toLowerCase()));if(p){s.br=p.br;s.yr=p.yr}else if(b)s.br=b.c;s.yr=s.yr||0}});
[db.records,db.reviews,db.bk,db.resv].forEach(L=>(L||[]).forEach(x=>{x.roll=String(x.roll).toUpperCase()}));
/* 2. books: branch tags, then new titles */
db.books.forEach(b=>{if(!b.g)b.g=GMAP[b.title]||(b.cat==='Programming'?'C':'X')});
let id=nextId();NEW2.forEach(([title,author,cat,n,g])=>{if(!db.books.some(b=>b.title===title))db.books.push({id:id++,title,author,total:+n,avail:+n,cat,g})});
/* 3. roster: 100 students per branch, spread over the years that branch has run */
const have=new Set(db.students.map(s=>s.roll)),fresh=[];
BR.forEach(b=>{const Y=yrsOf(b),T=Math.max(0,100-db.students.filter(s=>s.br===b.c).length);for(let y=1;y<=Y;y++){const cnt=Math.floor(T/Y)+(y<=T%Y?1:0),adm=ay()-y+1;let k=0;
 for(let n=0;n<cnt;n++){let roll;do roll=pre(b,adm)+pad3(++k);while(have.has(roll));have.add(roll);
  const f=rn()<.42;fresh.push({roll,name:pick(f?FF:FM)+' '+pick(SN),dept:b.n,br:b.c,yr:y,held:0,h:''})}}});
db.students.push(...fresh);
/* 4. sample loans for about one in five of the new students */
let rid=Math.max(0,...db.records.map(r=>r.id));
fresh.forEach(s=>{if(rn()>.2)return;for(let j=0,n=1+(rn()<.3);j<n;j++){const L=db.books.filter(b=>b.avail>0&&bookFits(b,s.br)&&!db.records.some(r=>r.roll===s.roll&&r.bookId===b.id));if(!L.length)return;
 const b=pick(L),age=1+Math.floor(rn()*44),r={id:++rid,bookId:b.id,roll:s.roll,issued:addDays(today(),-age),due:addDays(today(),DAYS-age),returned:false,ret:'',fine:0};
 if(age>DAYS&&rn()<.65){const rt=Math.min(age-1,3+Math.floor(rn()*17));r.ret=addDays(r.issued,rt);r.returned=true;const l=diff(r.due,r.ret);r.fine=l>0?l*FINE:0;if(r.fine&&rn()<.6){r.paid=true;r.paidOn=r.ret;r.txn='GH'+(rid+4e5).toString(36).toUpperCase()}}
 else{b.avail--;s.held++}db.records.push(r)}});
db.v5=1;save()}

/* ---------- About MITS and branch report ---------- */
const brStu=c=>db.students.filter(s=>s.br===c).length,brBooks=c=>db.books.filter(b=>b.g!=='X'&&bookFits(b,c)).length;
function vAbout(){const L=me.role==='lib';
return`<div class="top"><div><p class="eyebrow">Our campus</p><h1>Madhav Institute of Technology &amp; Science</h1><p class="sub" lang="hi">माधव प्रौद्योगिकी एवं विज्ञान संस्थान, ग्वालियर (म.प्र.)</p></div></div>
<section class="card abt"><h2>History</h2><p>MITS Gwalior was founded in 1957 by His Highness Sir Jiwaji Rao Scindia, Maharaja of the then Gwalior state, as part of an open-door policy of the Government of India. President Dr. Rajendra Prasad laid the foundation stone on 28 October 1956, and President Dr. S. Radhakrishnan inaugurated the building on 11 December 1964.</p><p>During the Golden Jubilee celebrations, President Pratibha Devi Singh Patil attended as chief guest on 30 June 2008, when a postal stamp on MITS was released. Today MITS is a deemed university declared under the Distinct Category by the Ministry of Education, Government of India, and is accredited by NAAC with an A++ grade. Its motto is <i>Work is Worship</i>.</p></section>
<div class="grid" style="margin:16px 0"><div class="card kpi" style="--c:#3347c9"><i>${I('cap')}</i><b>1957</b><span>Established</span></div><div class="card kpi" style="--c:#138a5e"><i>${I('trophy')}</i><b>A++</b><span>NAAC grade</span></div><div class="card kpi" style="--c:#c27a0e"><i>${I('shelf')}</i><b>${BR.length}</b><span>Programmes</span></div><div class="card kpi" style="--c:#7a4bd1"><i>${I('users')}</i><b>${db.students.length}</b><span>Students on the library roll</span></div></div>
<h2 style="margin:22px 0 10px">Programmes and library support</h2>${tbl(['Since','Programme','Intake','Students','Branch books',''],BR.slice().sort((a,b)=>a.s-b.s).map(b=>[b.s,H(`<b>${esc(b.p)}</b> ${esc(b.n)} <span class="tag">${b.c}</span>${!L&&b.c===(fs(me.roll)||{}).br?' <span class="tag ok">Your branch</span>':''}`),b.i||'-',brStu(b.c),brBooks(b.c),H(`<button class="lnk" data-act="brBooks" data-c="${b.c}">View books</button>`)]))}
<p class="sub" style="margin-top:10px">Intake is the sanctioned seats per year as published by the institute; blank (-) means it was not listed. Roll numbers are written like <b>BTCS24O1001</b>: BT, the branch code (CS), the joining year (24), then O1 and a serial number. B.Arch uses BRAR.</p>`}
function branchReport(){const on={},od={};db.records.forEach(r=>{const s=fs(r.roll);if(!s||!s.br)return;if(!r.returned){on[s.br]=(on[s.br]||0)+1;if(late(r))od[s.br]=(od[s.br]||0)+1}});
return tbl(['Branch','Students','On loan','Overdue','Books for branch'],BR.map(b=>[H(`<span class="tag">${b.c}</span> ${esc(b.n)}`),brStu(b.c),on[b.c]||0,od[b.c]||0,brBooks(b.c)]))}
document.addEventListener('click',e=>{const t=e.target.closest('[data-act="brBooks"]');if(t){S.bb=t.dataset.c;S.bc='';S.bq='';go('books')}});
