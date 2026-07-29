'use strict';
/* N2S3 PROTOCOL v4.0 */

const CFG = {
  youtubeId: 'VIDEO_ID_ICI',
  targetDate: new Date('2026-08-05T11:00:00+02:00'),
  phaseCodes: {'BRADDY-ALPHA':1,'BRADDY-BRAVO':2,'BRADDY-CHARLIE':3,'BRADDY-DELTA':4,'BRADDY-OMEGA':5},
  costs: {
    gageSecondaire:{hippolyte:15,nathanael:15,edwin:15,teo:15},
    refaireRoue:{hippolyte:20,nathanael:20,edwin:20,teo:20},
    laisserPasser:{hippolyte:25,nathanael:25,edwin:25,teo:25},
    doubleTimbre:{hippolyte:25,nathanael:25,edwin:25,teo:25},
    imposerGage:{hippolyte:30,nathanael:30,edwin:30,teo:30},
    declencherEvenement:{hippolyte:50,nathanael:50,edwin:50,teo:50},
  },
  initStock:{
    gageSecondaire:{hippolyte:1,nathanael:1,edwin:1,teo:1},
    refaireRoue:{hippolyte:2,nathanael:2,edwin:2,teo:2},
    laisserPasser:{hippolyte:1,nathanael:1,edwin:1,teo:1},
    doubleTimbre:{hippolyte:1,nathanael:1,edwin:1,teo:1},
    imposerGage:{hippolyte:1,nathanael:1,edwin:1,teo:1},
    declencherEvenement:{hippolyte:1,nathanael:1,edwin:1,teo:1},
  },
  phaseCoins:[0,5,5,5,5,10],
};

const R_PLAYERS  = ['Hippolyte','Teo','Edwin','Nathanael'];
const R_KEYS     = ['hippolyte','teo','edwin','nathanael'];
const R_COLORS   = ['#5a0000','#380000','#7a0000','#440000'];
const DISPLAY_NAMES = ['Hippolyte','Teo','Edwin','Nathanael'];
const EV_COLORS  = ['#1a0040','#002a1a','#1a1500','#001a2a','#2a0020','#0a1500'];

const SECONDARY_GAGES = [
  {id:'sg1',name:'Monologue de Comptoir',desc:"S'asseoir seul a un comptoir, commander quelque chose et engager une conversation de 3 minutes avec un inconnu.",bc:8},
  {id:'sg2',name:"L'Artiste Incompris",desc:"Convaincre quelqu'un de dessiner votre portrait en moins de 60 secondes, sur n'importe quel support.",bc:8},
  {id:'sg3',name:'Le Vendeur du Siecle',desc:"Convaincre quelqu'un d'acheter un objet fictif invente sur le moment en moins de 2 minutes.",bc:8},
];

const EVENTS = [
  {id:'ev1',name:'SYNCHRONISATION FORCEE',desc:'Les 4 agents se prennent en photo dans une posture imposee decidee par Brad Bitt. 30 secondes pour trouver la pose.'},
  {id:'ev2',name:'TRADUCTION EN DIRECT',desc:'Pendant 10 minutes, chaque phrase doit se terminer par "...et je pense que Brad serait d\'accord".'},
  {id:'ev3',name:'AUDIT BRADDY3000',desc:'Chaque agent recite de memoire le nom complet du BRADDY3000 et l\'orthographe exacte de "Kirby 67".'},
  {id:'ev4',name:'MODE TOURISTE',desc:'Demander a 2 inconnus de prendre le groupe en photo, comme si vous visitiez Lille pour la toute premiere fois.'},
  {id:'ev5',name:'TRANSMISSION PRIORITAIRE',desc:'Chaque agent envoie un message vocal a un contact : "Le BRADDY3000 vous salue."'},
  {id:'ev6',name:'CONCLAVE DE L\'OMBRE',desc:'Le groupe tient une reunion de 3 minutes en chuchotant uniquement, peu importe l\'endroit.'},
];

const PHASES = [
  {name:'INITIALISATION',desc:'En attente de mission',gages:[],contracts:[],dt:null},
  {
    name:'PHASE 1 — ARRIVEE A LILLE',desc:'Premieres collectes de donnees',
    gages:[
      {id:'p1g1',name:'Expert Raclette',desc:"Entrer dans un magasin d'electromenager et demander des informations tres precises sur un appareil a raclette : nombre de fromages par minute, rendement de fonte, compatibilite avec le Serrano.",bc:5},
      {id:'p1g2',name:'Carte Miaouscarade',desc:"Trouver une carte Miaouscarade dans une boutique specialisee et l'acheter.",bc:5},
      {id:'p1g3',name:'Objet Mystere',desc:"Acheter un objet coutant moins de 2 euros et le garder secret jusqu'a la fin de la journee.",bc:5},
      {id:'p1g4',name:'Demande de la plus haute importance',desc:'Envoyer une proposition a Brets afin de suggerer une saveur Raclette Serrano.',bc:5},
    ],
    contracts:[{name:'Synchronisation BRADDY3000',desc:'Deux participants se tiennent la main pendant 20 minutes.',reward:'Multiplicateur x1.5'}],
    dt:{a:'Equipe Fromage — Trouver du fromage a raclette.',b:'Equipe Charcuterie — Trouver du Serrano.',bonus:'+5 BC bonus par participant pour la premiere equipe revenue.'}
  },
  {
    name:'PHASE 2 — DEJEUNER',desc:'Collecte intensive',
    gages:[
      {id:'p2g1',name:'Commande Controlee',desc:"Le participant choisit uniquement la taille de son repas. Le reste est decide par un autre joueur.",bc:5},
      {id:'p2g2',name:"Collaboration O'Tacos",desc:"Demander au personnel si une collaboration O'Tacos x Serrano est prevue.",bc:5},
      {id:'p2g3',name:'Serrano Secret',desc:'Integrer le Serrano achete precedemment dans son repas.',bc:5},
      {id:'p2g4',name:'Influenceur Culinaire',desc:'Presenter son repas comme une revolution technologique.',bc:5},
    ],
    contracts:[],dt:null
  },
  {name:'PHASE 3 — RUPTURE NARRATIVE',desc:'Evenement special',rupture:true,gages:[],contracts:[],dt:null},
  {
    name:'PHASE 4 — RELOOKING',desc:'Phase critique — Contrats BRADDY3000',
    gages:[{id:'p4g1',name:'Relooking Brad Corporation',desc:'Trois participants choisissent chaussures, haut et accessoire. Le quatrieme essaie la tenue, demande un avis et prend une photo.',bc:5,team:true}],
    contracts:[
      {name:'Synchronisation BRADDY3000',desc:'Deux participants se tiennent la main pendant 20 minutes.',reward:'Multiplicateur x1.5'},
      {name:'Liaison Satellite',desc:'Deux participants restent a moins de 2m.',reward:'+BC'},
      {name:'Communication Prioritaire',desc:"Deux participants terminent les phrases de l'autre.",reward:'+BC'},
      {name:'Operation Serrano',desc:'Integrer "Serrano" dans plusieurs conversations.',reward:'+BC'},
    ],
    dt:null
  },
  {
    name:'PHASE 5 — FINALE',desc:'Attribution directe par Brad',directAssignment:true,
    gages:[
      {id:'p5g1',name:'Mario Kart',desc:"Demander a quelqu'un a la FNAC de faire une partie sur une borne de demonstration.",bc:10},
      {id:'p5g2',name:'Micro-Trottoir Raclette',desc:'"Pensez-vous que la raclette est reservee aux fetes ou peut etre consommee toute l\'annee ?"',bc:10},
      {id:'p5g3',name:"Livre d'Or",desc:"Acheter un carnet et obtenir la dedicace d'un inconnu.",bc:10},
      {id:'p5g4',name:'La Story Salee',desc:'Defendre les merites de la raclette dans une story a un cercle restreint.',bc:10},
    ],
    contracts:[],dt:null
  },
];

const BOLT_SVG='<svg width="13" height="18" viewBox="0 0 13 18" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;margin:0 2px"><path d="M8.5 0L0 10.5h5.5L3.5 18 13 7.5H7.5z" fill="#ff2222"/></svg>';

/* STATE */
function loadState(){try{const s=localStorage.getItem('n2s3');if(s)return JSON.parse(s);}catch(e){}
  return{phase:0,coins:{hippolyte:0,nathanael:0,edwin:0,teo:0},stock:JSON.parse(JSON.stringify(CFG.initStock)),
    chatHistory:[],introComplete:false,chatBadge:0,lastView:'home',
    doneGages:[],phaseExcluded:[],waitingForOui:false,phase1Announced:false,
    waitingForDelete:false,doneDT:false,phase1Complete:false,
    pool:{},activeGages:[],gageHistory:[],usedEvents:[],usedSgIds:[],
  };}
let S=loadState();
function save(){try{localStorage.setItem('n2s3',JSON.stringify(S));}catch(e){}}

/* POOL MANAGEMENT */
function initPool(){
  if(!S.pool)S.pool={};
  if(!S.activeGages)S.activeGages=[];
  if(!S.gageHistory)S.gageHistory=[];
  if(!S.usedEvents)S.usedEvents=[];
  if(!S.usedSgIds)S.usedSgIds=[];
  [1,2,3,4,5].forEach(n=>{
    if(S.pool[n]===undefined)S.pool[n]=(PHASES[n]?.gages||[]).map(g=>g.id);
  });
}
function getGageById(id){
  for(const ph of PHASES){const g=ph.gages?.find(x=>x.id===id);if(g)return g;}
  return SECONDARY_GAGES.find(g=>g.id===id)||null;
}
function drawFromPool(phase,excludeId=null){
  if(!S.pool[phase])return null;
  const av=S.pool[phase].filter(id=>id!==excludeId);
  if(!av.length)return null;
  const gid=av[Math.floor(Math.random()*av.length)];
  S.pool[phase]=S.pool[phase].filter(id=>id!==gid);
  return gid;
}
function returnToPool(phase,gageId){
  if(!S.pool[phase])S.pool[phase]=[];
  if(!S.pool[phase].includes(gageId))S.pool[phase].push(gageId);
}
function addActiveGage(gageId,playerIdx){
  const g=getGageById(gageId);if(!g)return;
  const now=new Date();
  S.activeGages.push({gageId,gageName:g.name,gageDesc:g.desc,playerIdx,bc:g.bc,
    startTime:`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`,phase:S.phase});
  save();
}
function completeActiveGage(agIdx,status){
  const ag=S.activeGages[agIdx];if(!ag)return;
  const bc=status==='reussi'?ag.bc:0;
  if(status==='reussi'){
    S.coins[R_KEYS[ag.playerIdx]]=(S.coins[R_KEYS[ag.playerIdx]]||0)+bc;
    if(!S.phaseExcluded)S.phaseExcluded=[];
    if(!S.phaseExcluded.includes(R_KEYS[ag.playerIdx]))S.phaseExcluded.push(R_KEYS[ag.playerIdx]);
    if(!S.doneGages)S.doneGages=[];
    if(!ag.gageId.startsWith('sg')&&!S.doneGages.includes(ag.gageId))S.doneGages.push(ag.gageId);
  }
  const now=new Date();
  if(!S.gageHistory)S.gageHistory=[];
  S.gageHistory.push({gageName:ag.gageName,playerName:DISPLAY_NAMES[ag.playerIdx],
    phase:ag.phase,startTime:ag.startTime,
    endTime:`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`,
    status,bc,gageId:ag.gageId});
  S.activeGages.splice(agIdx,1);
  save();
  checkPhase1Complete();
  renderGages();renderBraddy();
}

/* BRADDY3000 ANALYZE ANIMATION */
function bradAnalyze(cb){
  const msgs=['ANALYSE EN COURS...','CALCUL DES PROBABILITES...','EVALUATION DES DONNEES...','TRAITEMENT BRADDY3000...','RECALIBRATION TRAJECTOIRE...'];
  glitchSnd(.15);sweep(200,800,1,.1);
  const ov=document.getElementById('braddy-analyze');
  const txt=document.getElementById('braddy-analyze-txt');
  txt.textContent=msgs[Math.floor(Math.random()*msgs.length)];
  ov.classList.remove('hidden');
  let t=0;const glitch=setInterval(()=>{t++;ov.style.transform=`translate(${(Math.random()-.5)*4}px,${(Math.random()-.5)*2}px)`;beep(200+Math.random()*400,.03,.04,'square');if(t>8)ov.style.opacity=Math.max(0,1-(t-8)/6);},90);
  setTimeout(()=>{clearInterval(glitch);ov.style.transform='';ov.style.opacity='';ov.classList.add('hidden');if(cb)cb();},1400);
}


/* AUDIO */
let AC=null;
function initAudio(){try{AC=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}}
function res(){if(AC&&AC.state==='suspended')AC.resume();}
function beep(f=440,d=.1,v=.08,t='square'){if(!AC)return;res();try{const o=AC.createOscillator(),g=AC.createGain();o.type=t;o.frequency.value=f;g.gain.setValueAtTime(v,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+d);o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+d);}catch(e){}}
function glitchSnd(v=.14){if(!AC)return;res();try{const sz=AC.sampleRate*.08,buf=AC.createBuffer(1,sz,AC.sampleRate),d=buf.getChannelData(0);for(let i=0;i<sz;i++)d[i]=Math.random()*2-1;const src=AC.createBufferSource();src.buffer=buf;const g=AC.createGain(),bp=AC.createBiquadFilter();bp.type='bandpass';bp.frequency.value=1000+Math.random()*1000;bp.Q.value=2;g.gain.setValueAtTime(v,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+.08);src.connect(bp);bp.connect(g);g.connect(AC.destination);src.start();}catch(e){}}
function sweep(f0=80,f1=1400,dur=2.5,v=.12){if(!AC)return;res();try{const o=AC.createOscillator(),g=AC.createGain();o.type='sawtooth';o.frequency.setValueAtTime(f0,AC.currentTime);o.frequency.exponentialRampToValueAtTime(f1,AC.currentTime+dur*.65);o.frequency.exponentialRampToValueAtTime(f0*.4,AC.currentTime+dur);g.gain.setValueAtTime(0,AC.currentTime);g.gain.linearRampToValueAtTime(v,AC.currentTime+.1);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+dur);o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+dur);}catch(e){}}
function impact(v=.28){if(!AC)return;res();try{const sz=AC.sampleRate*.4,buf=AC.createBuffer(1,sz,AC.sampleRate),d=buf.getChannelData(0);for(let i=0;i<sz;i++)d[i]=(Math.random()*2-1)*Math.exp(-i/(AC.sampleRate*.09));const src=AC.createBufferSource();src.buffer=buf;const g=AC.createGain(),lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=280;g.gain.setValueAtTime(v,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+.4);src.connect(lp);lp.connect(g);g.connect(AC.destination);src.start();}catch(e){}}
function drone(){if(!AC)return;res();try{const g=AC.createGain();g.gain.setValueAtTime(0,AC.currentTime);g.gain.linearRampToValueAtTime(.055,AC.currentTime+4);g.connect(AC.destination);[40,61,82].forEach((f,i)=>{const o=AC.createOscillator();o.type=i===0?'sawtooth':'sine';o.frequency.value=f;const lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=140;o.connect(lp);lp.connect(g);o.start();});}catch(e){}}

/* PARTICLES */
const cvBg=document.getElementById('cv-bg'),ctxBg=cvBg.getContext('2d');
let parts=[],pSpd=1;
function resizeBg(){cvBg.width=window.innerWidth;cvBg.height=window.innerHeight;}
function initParts(n=55){parts=Array.from({length:n},()=>({x:Math.random()*cvBg.width,y:Math.random()*cvBg.height,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:Math.random()*1.3+.2,a:Math.random()*.22+.03,c:Math.random()>.84?'#cc0000':'#fff'}));}
function tickParts(){ctxBg.clearRect(0,0,cvBg.width,cvBg.height);parts.forEach(p=>{p.x+=p.vx*pSpd;p.y+=p.vy*pSpd;if(p.x<0)p.x=cvBg.width;if(p.x>cvBg.width)p.x=0;if(p.y<0)p.y=cvBg.height;if(p.y>cvBg.height)p.y=0;ctxBg.beginPath();ctxBg.arc(p.x,p.y,p.r,0,Math.PI*2);ctxBg.fillStyle=p.c;ctxBg.globalAlpha=p.a;ctxBg.fill();});ctxBg.globalAlpha=1;requestAnimationFrame(tickParts);}

/* LOGS */
const logsEl=document.getElementById('logs');
const LOGS=['> INITIALIZING BRAD PROTOCOL...','> Bradification level: UNSTABLE','> Synchronisation secteur Lille: OK','> OTacos incident: ARCHIVED [ref:2024]','> Paintball casualties: ACCEPTABLE','> WARNING: Never trust sector 3','> BRAD.exe running [PID 3110]','> Chargement des gages... [87%]','> Connexion Bradford: ÉTABLIE','> Niveau de chaos: CRITIQUE','> CLASSIFIED: NE PAS LIRE CE TEXTE','> Brad.init() -- SUCCESS','> Taux de bradification: 94.7%','> ERROR: shame.dll not found','> Kirby67.exe has been detected','> Anti-serrano protocols: LOADING','> Raclette database: ONLINE'];
function startLogs(){logsEl.style.opacity='1';document.getElementById('hline').classList.add('show');setInterval(()=>{const el=document.createElement('div');el.className='log-entry';el.textContent=LOGS[Math.floor(Math.random()*LOGS.length)];el.style.top=(Math.random()*88)+'%';el.style.left=(Math.random()*22)+'%';logsEl.appendChild(el);setTimeout(()=>el.remove(),5100);},650);}

/* UTILS */
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function flash(dur=80,red=false){const el=document.getElementById(red?'fl-r':'fl-w');el.style.opacity='1';setTimeout(()=>el.style.opacity='0',dur);}
function setPh(id){document.querySelectorAll('.ph').forEach(p=>p.classList.remove('on'));document.getElementById(id).classList.add('on');}
function shake(px=5,ms=280){const end=Date.now()+ms;(function go(){if(Date.now()>end){document.body.style.transform='';return;}document.body.style.transform=`translate(${(Math.random()-.5)*px}px,${(Math.random()-.5)*px*.5}px)`;requestAnimationFrame(go);})();return wait(ms);}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}


/* TRANSITION */
function runTransition(){
  const cv=document.getElementById('cv-trans');cv.width=window.innerWidth;cv.height=window.innerHeight;
  const ctx=cv.getContext('2d'),W=cv.width,H=cv.height;ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
  const lines=Array.from({length:28},()=>({y:Math.random()*H,vy:(Math.random()-.25)*7,w:Math.random()*W*.7+W*.3,h:Math.random()*2.5+.4,a:Math.random()*.55+.2,red:Math.random()>.65}));
  const pts=Array.from({length:70},()=>({x:W/2+(Math.random()-.5)*W,y:H/2+(Math.random()-.5)*H,spd:Math.random()*4+2,sz:Math.random()*1.8+.4}));
  const TXT=['BRAD','N2S3','LILLESECTOR','PROTOCOL','K67','SERRANO'];
  let f=0;
  (function frame(){f++;const t=f/145;ctx.fillStyle=`rgba(5,5,8,${.18+t*.22})`;ctx.fillRect(0,0,W,H);
    if(t<.65)lines.forEach(l=>{l.y+=l.vy;if(l.y>H+5)l.y=-5;if(l.y<-5)l.y=H+5;ctx.fillStyle=l.red?`rgba(204,0,0,${l.a*(1-t)})`:`rgba(255,255,255,${l.a*(1-t)*.55})`;ctx.fillRect(0,l.y,l.w,l.h);});
    if(t>.22){const ph=Math.min((t-.22)/.78,1);pts.forEach(p=>{const dx=W/2-p.x,dy=H/2-p.y,dist=Math.hypot(dx,dy);if(dist>4){p.x+=(dx/dist)*p.spd*ph*2.5;p.y+=(dy/dist)*p.spd*ph*2.5;}ctx.beginPath();ctx.arc(p.x,p.y,p.sz,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,255,${.3-.2*t})`;ctx.fill();});}
    if(f%6<2&&t<.8){ctx.font=`${8+Math.floor(Math.random()*4)}px monospace`;ctx.fillStyle=`rgba(0,255,65,${Math.random()*.22})`;ctx.fillText(TXT[Math.floor(Math.random()*TXT.length)],Math.random()*W*.8,Math.random()*H);}
    if(t>.72){ctx.fillStyle=`rgba(255,255,255,${(t-.72)/.28*.92})`;ctx.fillRect(0,0,W,H);}
    if(f<145)requestAnimationFrame(frame);})();
}


/* BOOT */
const BOOT=['BRADDY3000 FIRMWARE v3.0.0 loading...','Checking memory banks: OK [90% utilized]','Calibrating Serrano detectors...','Loading Kirby 67 threat profile...','Establishing Lille sector connection...','Verifying agent credentials...','BradProtocol.init() -- initialized','Loading Edition III parameters...','Anti-raclette firewall: ACTIVE','Checking Temu outfit database...','BRADDY3000 ready. Sort of.','>> TRANSMISSION EN COURS...'];
async function runBoot(){
  const lEl=document.getElementById('boot-lines'),bEl=document.getElementById('boot-bar'),lbEl=document.getElementById('boot-label');lEl.textContent='';
  for(let i=0;i<BOOT.length;i++){const el=document.createElement('div');lEl.appendChild(el);for(const ch of BOOT[i]){el.textContent+=ch;await wait(18+Math.random()*14);}
    const pct=Math.round(((i+1)/BOOT.length)*100);bEl.style.width=pct+'%';lbEl.textContent=pct<100?`INITIALISATION... ${pct}%`:'SYSTEME OPERATIONNEL';beep(200+Math.random()*200,.05,.05,'square');await wait(80+Math.random()*100);}await wait(350);}


/* COUNTDOWN */
let cdTimer=null;
function pad(n){return String(n).padStart(2,'0');}
function setCD(id,v){const el=document.getElementById(id);const s=pad(v);if(el.textContent!==s){el.textContent=s;el.dataset.v=s;}}
function tickCD(){const diff=CFG.targetDate-new Date();if(diff<=0){['cd-d','cd-h','cd-m','cd-s'].forEach(id=>setCD(id,0));return true;}setCD('cd-d',Math.floor(diff/864e5));setCD('cd-h',Math.floor((diff%864e5)/36e5));setCD('cd-m',Math.floor((diff%36e5)/6e4));setCD('cd-s',Math.floor((diff%6e4)/1e3));return false;}
function startCD(){if(tickCD()){setPh('p6');return;}cdTimer=setInterval(()=>{if(tickCD()){clearInterval(cdTimer);triggerCDEnd();}},1000);}
async function triggerCDEnd(){flash(600);await shake(10,500);sweep(350,40,1.5,.2);impact(.28);await wait(700);flash(300);await wait(500);setPh('p6');}


/* INTRO SEQUENCE */
document.getElementById('btn-start').addEventListener('click',activate);
async function activate(){
  initAudio();drone();pSpd=3.5;
  document.getElementById('btn-start').classList.add('glitch');
  document.querySelector('#p0 .hud-tr').textContent='SYSTEME ONLINE';
  startLogs();
  glitchSnd(.18);await wait(220);flash(55);shake(3,180);
  await wait(280);glitchSnd(.15);flash(40);shake(5,150);
  await wait(350);glitchSnd(.2);flash(120);shake(8,280);await wait(280);
  setPh('p1');pSpd=1.5;
  await wait(380);document.getElementById('logo-imagine').classList.add('on');beep(1200,.35,.05);
  await wait(920);document.getElementById('logo-div').classList.add('on');
  await wait(500);document.getElementById('logo-hwr').classList.add('on');beep(600,.22,.04);
  await wait(720);document.getElementById('logo-presents').classList.add('on');await wait(1350);
  flash(55);shake(4,200);glitchSnd(.12);await wait(260);
  setPh('p2');beep(300,.8,.06,'sine');await runBoot();
  flash(80);glitchSnd(.15);await wait(200);
  setPh('p3');sweep(55,2000,2.6,.14);pSpd=6;runTransition();await wait(2750);
  setPh('p4');pSpd=1;impact(.22);
  await wait(180);document.getElementById('t-edition').classList.add('on');beep(440,.5,.04);
  await wait(480);document.getElementById('t-main').classList.add('on');beep(220,.8,.06);beep(330,.6,.04);shake(3,280);
  await wait(580);document.getElementById('t-line').classList.add('on');
  await wait(580);document.getElementById('t-tagline').classList.add('on');await wait(1000);
  document.getElementById('kirby-alert').classList.remove('hidden');
  flash(200,true);glitchSnd(.2);shake(6,400);beep(150,.5,.15,'sawtooth');await wait(2000);
  document.getElementById('btn-proto').classList.add('on');beep(880,.1,.04);
}
document.getElementById('btn-proto').addEventListener('click',async()=>{flash(90);glitchSnd(.1);shake(4,180);await wait(280);setPh('p5');startCD();});
document.getElementById('btn-skip-cd').addEventListener('click',async()=>{clearInterval(cdTimer);flash(90);glitchSnd(.1);await wait(200);setPh('p6');});
document.getElementById('btn-action').addEventListener('click',async()=>{glitchSnd(.15);flash(140);shake(5,280);await wait(380);setPh('p7');document.getElementById('yt-frame').src=`https://www.youtube.com/embed/${CFG.youtubeId}?autoplay=1&rel=0&modestbranding=1`;setTimeout(()=>{document.getElementById('btn-enter-app').style.opacity='1';},8000);});
document.getElementById('btn-enter-app').addEventListener('click',enterApp);
function enterApp(){S.introComplete=true;save();document.getElementById('yt-frame').src='about:blank';document.querySelectorAll('.ph').forEach(p=>p.classList.remove('on'));document.getElementById('app').classList.add('show');initApp();}


/* MAP */
function initMap(){
  const c=document.getElementById('zones-container');c.innerHTML='';
  let mapPanel=null;
  function closePanel(){if(mapPanel){mapPanel.remove();mapPanel=null;}}
  function showPanel(z,ph){
    closePanel();
    const phD=PHASES[ph]||null;
    const gDone=phD?.gages?.filter(g=>S.doneGages?.includes(g.id)).length||0;
    const gTot=phD?.gages?.length||0;
    const phStatus=S.phase>ph?'COMPLÉTÉE':S.phase===ph?'EN COURS':'EN ATTENTE';
    let scoreRows=DISPLAY_NAMES.map((n,i)=>`<div class="mi-score"><span>${n}</span><span>${S.coins[R_KEYS[i]]} BC</span></div>`).join('');
    let content=`<div class="mi-row"><span>Statut</span><span>${phStatus}</span></div>`;
    if(gTot)content+=`<div class="mi-row"><span>Gages</span><span>${gDone}/${gTot} accomplis</span></div>`;
    content+=`<div class="mi-scores-label">SCORES BRADCOINS</div><div class="mi-scores">${scoreRows}</div>`;
    mapPanel=document.createElement('div');
    mapPanel.className='map-panel';
    mapPanel.innerHTML=`<div class="mp-header"><span class="mp-title">${z.name}</span><button class="mp-close">✕</button></div><div class="mp-body">${content}</div>`;
    document.getElementById('map-wrap').appendChild(mapPanel);
    mapPanel.querySelector('.mp-close').addEventListener('click',closePanel);
  }
  ZONES.forEach(z=>{
    const u=S.phase>=z.ph;
    const d=document.createElement('div');
    d.className='zone-marker'+(u?'':' locked');
    d.style.cssText=`left:${z.x}%;top:${z.y}%`;
    d.innerHTML=`<div class="zone-dot${u?'':' locked'}"></div><div class="zone-name">${z.name}</div>${u?'':'<div style="font-size:10px">&#128274;</div>'}`;
    if(u)d.addEventListener('click',()=>showPanel(z,z.ph));
    c.appendChild(d);
  });
  const b=document.getElementById('kirby-blip');if(b){b.style.left='48%';b.style.top='44%';}
  setTimeout(drawMap,150);
}

function checkPhase1Complete(){
  if(S.phase!==1||S.phase1Complete)return;
  const ph1=PHASES[1];
  const allDone=ph1.gages.every(g=>S.doneGages?.includes(g.id));
  if(allDone&&S.doneDT){
    S.phase1Complete=true;save();
    setTimeout(()=>{bradMsg("Bien. Le BRADDY3000 vient de recevoir un volume conséquent de données — missions accomplies, coordonnées de terrain, résultats Double Trouble. Je transmets l'ensemble au système d'analyse central. Restez à l'écoute : la Phase 2 se profile. En attendant — pour ceux que ça intéresse — un Contrat BRADDY3000 est désormais déverrouillé dans la section Gages. Liaison Synchronisation. N'hésitez pas à y faire un tour. Ou pas. C'est vous qui voyez.");},2500);
  }
}
function drawMap(){const cv=document.getElementById('cv-map'),wrap=document.getElementById('map-wrap');cv.width=wrap.offsetWidth||window.innerWidth;cv.height=wrap.offsetHeight||300;const ctx=cv.getContext('2d'),W=cv.width,H=cv.height;ctx.strokeStyle='rgba(204,0,0,.08)';ctx.lineWidth=1;for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}ctx.strokeStyle='rgba(204,0,0,.04)';for(let i=-H;i<W;i+=80){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i+H,H);ctx.stroke();}const ul=ZONES.filter(z=>S.phase>=z.ph);if(ul.length>1){ctx.strokeStyle='rgba(204,0,0,.2)';ctx.lineWidth=1;ctx.setLineDash([4,6]);for(let i=0;i<ul.length-1;i++){const a=ul[i],b=ul[i+1];ctx.beginPath();ctx.moveTo(a.x*W/100,a.y*H/100);ctx.lineTo(b.x*W/100,b.y*H/100);ctx.stroke();}ctx.setLineDash([]);}ctx.font='8px monospace';ctx.fillStyle='rgba(255,255,255,.12)';ctx.fillText('50.63N',4,12);ctx.textAlign='right';ctx.fillText('3.07E',W-4,12);ctx.textAlign='left';}



/* GAGES */
function renderGages(){
  const body=document.getElementById('gages-body');
  initPool();
  if(!S.doneGages)S.doneGages=[];if(!S.phaseExcluded)S.phaseExcluded=[];
  if(S.phase===0){body.innerHTML=`<div class="phase-indicator"><div class="phase-name">SYSTEME EN VEILLE</div><div class="phase-desc">En attente du debut de l'operation</div></div><div class="braddy-analyzing"><div class="adots"><div class="adot"></div><div class="adot"></div><div class="adot"></div></div><p>En attente de mission</p></div>`;return;}
  const ph=PHASES[Math.min(S.phase,5)];
  let html=`<div class="phase-indicator"><div class="phase-name">${ph.name}</div><div class="phase-desc">${ph.desc}</div></div>`;

  // RUPTURE
  if(ph.rupture){html+=`<div class="rupture-block"><div class="rupture-title">&#9888; ERREUR SYSTEME &#9888;</div><p class="rupture-error">> FAUX POSITIF DETECTE</p><p class="rupture-error">> KIRBY 67 NON CONFIRME</p><p class="rupture-error">> RECALIBRATION EN COURS...</p><div class="rupture-msg">Le BRADDY3000 a detecte ce qui semblait etre Kirby 67. Il s'agissait d'un sosie.</div></div><div class="brad-msg-block pacifico">"Aucun traitement de donnees ne sera possible durant cette operation. Profitez-en pour vous detendre."<span class="brad-sign">— Brad Bitt</span></div>`;body.innerHTML=html;return;}

  if(ph.directAssignment){html+=`<div class="brad-msg-block pacifico">"Les donnees collectees me permettent enfin d'attribuer les missions optimales. Le hasard n'est plus necessaire."<span class="brad-sign">— Brad Bitt</span></div>`;}

  // ACTIVE GAGES
  if(S.activeGages&&S.activeGages.length){
    html+=`<div class="section-lbl">EN COURS</div>`;
    S.activeGages.forEach((ag,idx)=>{
      const pk=R_KEYS[ag.playerIdx],bc=S.coins[pk]||0;
      const canRef=(S.stock.refaireRoue?.[pk]||0)>0&&bc>=20;
      const canSec=(S.stock.gageSecondaire?.[pk]||0)>0&&bc>=15&&SECONDARY_GAGES.filter(s=>!(S.usedSgIds||[]).includes(s.id)).length>0;
      const canPass=(S.stock.laisserPasser?.[pk]||0)>0&&bc>=25;
      html+=`<div class="active-gage-card" data-idx="${idx}">
        <div class="ag-header"><span class="ag-phase-lbl">PHASE ${ag.phase}</span><span class="ag-bc">+${ag.bc} BC</span></div>
        <div class="ag-name">${ag.gageName}</div>
        <div class="ag-player">Agent : ${DISPLAY_NAMES[ag.playerIdx]}</div>
        <div class="ag-time">Debut : ${ag.startTime}</div>
        ${(canRef||canSec||canPass)?`<div class="ag-bonus-row">${canRef?`<button class="ag-mini-btn" data-agbonus="refaire" data-idx="${idx}">&#8635; Refaire (20BC)</button>`:''}${canSec?`<button class="ag-mini-btn ag-sg" data-agbonus="secondaire" data-idx="${idx}">&#9733; Secondaire (15BC)</button>`:''}${canPass?`<button class="ag-mini-btn ag-pass" data-agbonus="passer" data-idx="${idx}">&#8856; Passer (25BC)</button>`:''}</div>`:''}
        <div class="ag-main-btns"><button class="ag-ok" data-idx="${idx}">&#10003; REUSSI</button><button class="ag-fail" data-idx="${idx}">&#10007; ECHOUE</button></div>
      </div>`;
    });
  }

  // AVAILABLE GAGES
  const poolGages=(S.pool[S.phase]||[]).map(id=>getGageById(id)).filter(Boolean);
  if(poolGages.length||ph.directAssignment){
    if(!ph.directAssignment&&poolGages.length)html+=`<div class="section-lbl">DISPONIBLES</div>`;
    if(ph.directAssignment&&poolGages.length)html+=`<div class="section-lbl">DISPONIBLES — ATTRIBUTION BRAD</div>`;
    poolGages.forEach(g=>{
      html+=`<div class="gage-card" data-gid="${g.id}"><div class="gage-card-header"><div class="gage-card-name">${g.team?'<span class="gage-team-tag">[EQUIPE] </span>':''}${g.name}</div><div class="gage-card-bc">+${g.bc} BC</div></div><div class="gage-card-desc">${g.desc}</div><div class="gage-card-footer"><span class="gage-card-tap">${ph.directAssignment?'&#9658; ATTRIBUTION DIRECTE':'&#9658; APPUYER POUR TIRER AU SORT'}</span></div></div>`;
    });
    if(!poolGages.length&&!S.activeGages.length)html+=`<div class="pool-empty">Tous les gages de cette phase ont ete attribues.</div>`;
  }

  // DOUBLE TROUBLE
  if(ph.dt){
    const pDone=!ph.gages?.length||ph.gages.every(g=>S.doneGages?.includes(g.id));
    const doneN=(ph.gages||[]).filter(g=>S.doneGages?.includes(g.id)).length,totN=(ph.gages||[]).length;
    if(!pDone){html+=`<div class="dt-block dt-locked"><div class="dt-title">${BOLT_SVG} DOUBLE TROUBLE ${BOLT_SVG}</div><div class="dt-locked-body"><p class="dt-locked-q">???</p><p class="dt-locked-hint">Se deverouille apres ${totN} gages accomplis — ${doneN}/${totN}</p></div></div>`;}
    else if(!S.doneDT){html+=`<div class="dt-block"><div class="dt-title">${BOLT_SVG} DOUBLE TROUBLE ${BOLT_SVG}</div><div class="dt-teams"><div class="dt-team"><div class="dt-team-name">EQUIPE A</div><div class="dt-team-desc">${ph.dt.a}</div></div><div class="dt-team"><div class="dt-team-name">EQUIPE B</div><div class="dt-team-desc">${ph.dt.b}</div></div></div><div class="dt-bonus">${ph.dt.bonus}</div><button class="dt-launch-btn" id="dt-launch-btn">&#9654; LANCER LE DOUBLE TROUBLE</button><button class="dt-complete-btn" id="dt-done-btn">&#10003; MARQUER COMME ACCOMPLI</button></div>`;}
    else{html+=`<div class="dt-block"><div class="dt-title">${BOLT_SVG} DOUBLE TROUBLE ${BOLT_SVG}</div><div class="dt-teams"><div class="dt-team"><div class="dt-team-name">EQUIPE A</div><div class="dt-team-desc">${ph.dt.a}</div></div><div class="dt-team"><div class="dt-team-name">EQUIPE B</div><div class="dt-team-desc">${ph.dt.b}</div></div></div><div class="dt-bonus">${ph.dt.bonus}</div><div class="dt-done-lbl">&#10003; DOUBLE TROUBLE ACCOMPLI</div></div>`;}
  }

  // CONTRACTS
  const contractsLocked=!!(ph.dt&&!S.doneDT);
  if(ph.contracts&&ph.contracts.length){
    html+=`<div class="contracts-section"><div class="contracts-title">CONTRATS BRADDY3000</div>`;
    if(contractsLocked){html+=`<div class="contract-locked"><p class="contract-locked-q">???</p><p class="contract-locked-hint">Se deverouille apres le Double Trouble</p></div>`;}
    else{ph.contracts.forEach(c=>{html+=`<div class="contract-card"><div class="contract-name">${c.name}</div><div class="contract-desc">${c.desc}</div><div class="contract-reward">${c.reward}</div></div>`;});}
    html+='</div>';
  }

  // HISTORY
  if(S.gageHistory&&S.gageHistory.length){
    html+=`<div class="section-lbl">HISTORIQUE</div>`;
    [...S.gageHistory].reverse().forEach(h=>{
      const cls=h.status==='reussi'?'hist-ok':h.status==='echoue'?'hist-fail':'hist-pass';
      html+=`<div class="hist-item ${cls}"><div class="hist-name">${h.gageName}</div><div class="hist-meta">${h.playerName} — Ph.${h.phase} — ${h.endTime}</div><div class="hist-status">${h.status.toUpperCase()}${h.bc>0?` +${h.bc} BC`:''}</div></div>`;
    });
  }

  html+=`<div class="braddy-analyzing"><div class="adots"><div class="adot"></div><div class="adot"></div><div class="adot"></div></div><p>Brad analyse votre position actuelle</p></div>`;
  body.innerHTML=html;

  // Event listeners — active gage buttons
  document.querySelectorAll('.ag-ok').forEach(btn=>btn.addEventListener('click',()=>completeActiveGage(parseInt(btn.dataset.idx),'reussi')));
  document.querySelectorAll('.ag-fail').forEach(btn=>btn.addEventListener('click',()=>completeActiveGage(parseInt(btn.dataset.idx),'echoue')));
  document.querySelectorAll('[data-agbonus]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const idx=parseInt(btn.dataset.idx),bonus=btn.dataset.agbonus;
      if(bonus==='refaire')applyRefaireRoue(idx);
      else if(bonus==='secondaire')applyGageSecondaire(idx);
      else if(bonus==='passer')applyLaisserPasser(idx);
    });
  });

  // Available gage click -> roulette or direct
  document.querySelectorAll('.gage-card').forEach(card=>{
    card.addEventListener('click',()=>{
      const gid=card.dataset.gid,g=getGageById(gid);if(!g)return;
      if(ph.directAssignment){
        S.pool[S.phase]=(S.pool[S.phase]||[]).filter(id=>id!==gid);
        const pidx=Math.floor(Math.random()*4);
        addActiveGage(gid,pidx);save();renderGages();flash(100,true);
        bradMsg(`Mission "${g.name}" attribuee a ${DISPLAY_NAMES[pidx]}. Le BRADDY3000 a decide.`);
      } else {openRoulette(g);}
    });
  });

  const dtBtn=document.getElementById('dt-done-btn');
  if(dtBtn){dtBtn.addEventListener('click',()=>{S.doneDT=true;save();beep(440,.5,.1,'sine');bradMsg("Double Trouble accompli. Le BRADDY3000 prend note. Bien joue.");checkPhase1Complete();renderGages();});}
  const launchBtn=document.getElementById('dt-launch-btn');
  if(launchBtn){launchBtn.addEventListener('click',openDTInterface);}
}

function checkPhase1Complete(){
  if(S.phase!==1||S.phase1Complete)return;
  const ph1=PHASES[1];
  const allDone=ph1.gages.every(g=>S.doneGages?.includes(g.id));
  if(allDone&&S.doneDT){
    S.phase1Complete=true;save();
    setTimeout(()=>{bradMsg("Bien. Le BRADDY3000 vient de recevoir un volume consequent de donnees — missions accomplies, coordonnees de terrain, resultats Double Trouble. Je transmets l'ensemble au systeme d'analyse central. Restez a l'ecoute : la Phase 2 se profile. En attendant — un Contrat BRADDY3000 est desormais deverouille dans la section Gages. Liaison Synchronisation. N'hesitez pas a y faire un tour. Ou pas. C'est vous qui voyez.");},2500);
  }
}

/* CLOCK */
function checkPhaseTime(){
  if(S.phase>0||S.phase1Announced)return;
  const now=new Date(),h=now.getHours(),m=now.getMinutes();
  if(h>10||(h===10&&m>=30)){
    S.phase1Announced=true;save();
    setTimeout(()=>{bradMsg("Agents. Il est 10h30. Le BRADDY3000 vient de terminer son cafe. La Phase 1 de l'Operation Never 2 sans 3 est desormais prete. Les gages sont charges. Kirby 67 est quelque part dans Lille. Si vous etes prets, tapez simplement \"oui\" dans ce chat.");S.waitingForOui=true;save();},800);
  }
}
function startClock(){function u(){const n=new Date();document.getElementById('time-disp').textContent=`${String(n.getHours()).padStart(2,'0')}h${String(n.getMinutes()).padStart(2,'0')}`;checkPhaseTime();}u();setInterval(u,10000);}

const DEF_STATUS=['Brad en ligne','Brad analyse les donnees','Brad recherche Kirby 67','Brad compile les rapports','Brad prepare une transmission','Brad surveille le BRADDY3000','Brad traite une anomalie','Brad est en pause dejeuner','Brad est temporairement indisponible'];
function startBradStatus(){function u(){const el=document.getElementById('brad-status-lbl');if(el)el.textContent=DEF_STATUS[Math.floor(Math.random()*DEF_STATUS.length)];}u();setInterval(u,3*60*1000);}



/* ROULETTE */
let rAngle=0,rSpinning=false,rCurrentGage=null,rWinnerIdx=-1;

function getAvailPlayers(){
  if(!S.phaseExcluded)S.phaseExcluded=[];
  const av=R_PLAYERS.map((p,i)=>({name:p,key:R_KEYS[i],color:R_COLORS[i],idx:i})).filter(pl=>!S.phaseExcluded.includes(pl.key));
  return av.length?av:R_PLAYERS.map((p,i)=>({name:p,key:R_KEYS[i],color:R_COLORS[i],idx:i}));
}

function openRoulette(gage){
  rCurrentGage=gage;rWinnerIdx=-1;
  document.getElementById('roll-phase-lbl').textContent=`PHASE ${S.phase}`;
  document.getElementById('roll-gname').textContent=gage.name;
  document.getElementById('roll-gdesc').textContent=gage.desc;
  document.getElementById('roll-bc-lbl').textContent=`+${gage.bc} BC`;
  document.getElementById('roll-result').classList.add('hidden');
  document.getElementById('roll-btn').disabled=false;
  const excl=S.phaseExcluded?.length||0;
  document.getElementById('roll-btn').textContent=excl?`TOURNER (${4-excl} restants)`:'TOURNER';
  document.getElementById('roll-pre-close').style.display='';
  document.getElementById('roulette-ol').classList.remove('hidden');
  setTimeout(()=>drawRoulette(rAngle),50);
}

function drawRoulette(angle,players,cv){
  const pl=players||getAvailPlayers();
  const canvas=cv||document.getElementById('roll-cv');if(!canvas)return;
  const ctx=canvas.getContext('2d'),W=canvas.width,H=canvas.height,cx=W/2,cy=H/2,r=Math.min(W,H)*.44,n=pl.length;
  ctx.clearRect(0,0,W,H);
  const gl=ctx.createRadialGradient(cx,cy,r*.85,cx,cy,r*1.1);
  gl.addColorStop(0,'rgba(204,0,0,0)');gl.addColorStop(.7,'rgba(204,0,0,.3)');gl.addColorStop(1,'rgba(204,0,0,0)');
  ctx.beginPath();ctx.arc(cx,cy,r*1.08,0,Math.PI*2);ctx.fillStyle=gl;ctx.fill();
  const seg=2*Math.PI/n;
  for(let i=0;i<n;i++){
    const sA=angle-Math.PI/2+i*seg-seg/2,eA=sA+seg,mA=sA+seg/2;
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,sA,eA);ctx.closePath();
    ctx.fillStyle=pl[i].color;ctx.fill();ctx.strokeStyle='rgba(204,0,0,.8)';ctx.lineWidth=2;ctx.stroke();
    const tx=cx+Math.cos(mA)*r*(n===1?.0:.65),ty=cy+Math.sin(mA)*r*(n===1?.0:.65);
    ctx.save();ctx.translate(n===1?cx:tx,n===1?cy:ty);if(n!==1)ctx.rotate(mA+Math.PI/2);
    ctx.fillStyle='rgba(255,255,255,.9)';ctx.font=`bold ${n===1?14:11}px monospace`;
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(pl[i].name,0,0);ctx.restore();
  }
  if(n>1){for(let i=0;i<n;i++){const a=angle-Math.PI/2+i*seg-seg/2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);ctx.strokeStyle='rgba(204,0,0,.6)';ctx.lineWidth=1.5;ctx.stroke();}}
  ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.strokeStyle='#cc0000';ctx.lineWidth=3;ctx.stroke();
  ctx.beginPath();ctx.arc(cx,cy,13,0,Math.PI*2);ctx.fillStyle='#000';ctx.fill();ctx.strokeStyle='#cc0000';ctx.lineWidth=2;ctx.stroke();
}

function spinRouletteWith(players,canvas,onDone){
  const pl=players||getAvailPlayers();const n=pl.length;
  const targetLocal=Math.floor(Math.random()*n);
  const winnerGlobal=pl[targetLocal].idx;
  const seg=2*Math.PI/n;
  const tBase=(n-targetLocal)*seg;
  let angle=0;
  const nC=((angle%(2*Math.PI))+2*Math.PI)%(2*Math.PI);
  let diff=((tBase-nC)%(2*Math.PI)+2*Math.PI)%(2*Math.PI);
  if(diff<.05)diff+=2*Math.PI;
  const tot=diff+(4+Math.floor(Math.random()*3))*2*Math.PI;
  const sA=angle,eA=sA+tot,dur=4000+Math.random()*1500,t0=performance.now();
  let curAngle=0;
  (function anim(now){
    const t=Math.min((now-t0)/dur,1);
    curAngle=sA+tot*(1-Math.pow(1-t,4));
    drawRoulette(curAngle,pl,canvas);
    if(t<1){requestAnimationFrame(anim);}
    else{drawRoulette(eA,pl,canvas);if(onDone)onDone(winnerGlobal,pl[targetLocal].name);}
  })(performance.now());
  return {winnerIdx:winnerGlobal,winnerName:pl[targetLocal].name};
}

function spinRoulette(){
  if(rSpinning)return;rSpinning=true;
  document.getElementById('roll-btn').disabled=true;
  const players=getAvailPlayers(),n=players.length;
  const targetLocal=Math.floor(Math.random()*n);
  rWinnerIdx=players[targetLocal].idx;
  const seg=2*Math.PI/n;
  const tBase=(n-targetLocal)*seg;
  const nC=((rAngle%(2*Math.PI))+2*Math.PI)%(2*Math.PI);
  let diff=((tBase-nC)%(2*Math.PI)+2*Math.PI)%(2*Math.PI);
  if(diff<.05)diff+=2*Math.PI;
  const tot=diff+(4+Math.floor(Math.random()*3))*2*Math.PI;
  const sA=rAngle,eA=sA+tot,dur=4000+Math.random()*1500,t0=performance.now();
  (function animate(now){
    const t=Math.min((now-t0)/dur,1);
    rAngle=sA+tot*(1-Math.pow(1-t,4));
    drawRoulette(rAngle);
    if(t<1){requestAnimationFrame(animate);}
    else{
      rAngle=eA;rSpinning=false;drawRoulette(rAngle);
      flash(200,true);beep(880,.3,.1);setTimeout(()=>shake(5,300),100);
      document.getElementById('roll-winner-name').textContent=players[targetLocal].name.toUpperCase();
      document.getElementById('roll-result').classList.remove('hidden');
      document.getElementById('roll-pre-close').style.display='none';
    }
  })(performance.now());
}

function startMissionFromRoulette(){
  if(!rCurrentGage||rWinnerIdx<0)return;
  document.getElementById('roulette-ol').classList.add('hidden');
  S.pool[S.phase]=(S.pool[S.phase]||[]).filter(id=>id!==rCurrentGage.id);
  addActiveGage(rCurrentGage.id,rWinnerIdx);
  save();renderGages();showPage('gages');
  setTimeout(()=>bradMsg(`Mission "${rCurrentGage.name}" attribuee a ${DISPLAY_NAMES[rWinnerIdx]}. Elle apparait dans la section "En cours".`),400);
}

/* BONUS UTILITY (on active gages) */
function applyRefaireRoue(agIdx){
  const ag=S.activeGages[agIdx];if(!ag)return;
  const pk=R_KEYS[ag.playerIdx];
  S.coins[pk]-=20;S.stock.refaireRoue[pk]--;
  const cancelled=ag.gageId;
  returnToPool(ag.phase,cancelled);
  S.activeGages.splice(agIdx,1);save();
  bradAnalyze(()=>{
    const newId=drawFromPool(S.phase,cancelled);
    if(!newId){save();renderGages();bradMsg('Plus de gages disponibles dans cette phase.');return;}
    const newG=getGageById(newId);
    addActiveGage(newId,ag.playerIdx);save();renderGages();
    bradMsg(`Nouveau gage pour ${DISPLAY_NAMES[ag.playerIdx]} : "${newG?.name}". Le BRADDY3000 a recalibre la trajectoire.`);
  });
}

function applyGageSecondaire(agIdx){
  const ag=S.activeGages[agIdx];if(!ag)return;
  const pk=R_KEYS[ag.playerIdx];
  S.coins[pk]-=15;S.stock.gageSecondaire[pk]--;
  returnToPool(ag.phase,ag.gageId);
  S.activeGages.splice(agIdx,1);save();
  bradAnalyze(()=>openGageSecondaire(ag.playerIdx));
}

function applyLaisserPasser(agIdx){
  const ag=S.activeGages[agIdx];if(!ag)return;
  const pk=R_KEYS[ag.playerIdx];
  S.coins[pk]-=25;S.stock.laisserPasser[pk]--;
  S.activeGages.splice(agIdx,1);
  const now=new Date();
  if(!S.gageHistory)S.gageHistory=[];
  S.gageHistory.push({gageName:ag.gageName,playerName:DISPLAY_NAMES[ag.playerIdx],phase:ag.phase,startTime:ag.startTime,endTime:`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`,status:'passe',bc:0,gageId:ag.gageId});
  save();renderGages();
  bradMsg("Gage ignore. Passe dans l'historique. Le BRADDY3000 note votre lachetee. C'est tout.");
}

/* GAGE SECONDAIRE */
function openGageSecondaire(playerIdx){
  const available=SECONDARY_GAGES.filter(sg=>!(S.usedSgIds||[]).includes(sg.id));
  if(!available.length){bradMsg("Aucun gage secondaire disponible. Le stock est epuise.");return;}
  const ol=document.getElementById('sg-ol');
  ol.classList.remove('hidden');
  document.getElementById('sg-status').textContent='';
  document.getElementById('sg-confirm-btn').classList.add('hidden');
  document.getElementById('sg-close').style.display='';
  const cardsEl=document.getElementById('sg-cards');
  cardsEl.innerHTML='';
  available.slice(0,3).forEach((sg,i)=>{
    const d=document.createElement('div');d.className='sg-card';
    d.innerHTML=`<div class="sg-front"><div class="sg-front-icon">?</div></div><div class="sg-back"><div class="sg-back-name">${sg.name}</div><div class="sg-back-desc">${sg.desc}</div><div class="sg-back-bc">+${sg.bc} BC</div></div>`;
    cardsEl.appendChild(d);
  });
  const cards=cardsEl.querySelectorAll('.sg-card');
  const cursor=document.getElementById('sg-cursor');
  const targetIdx=Math.floor(Math.random()*available.length);
  let curIdx=0,dir=1,ticks=0,maxTicks=30+Math.floor(Math.random()*10),chosen=null,scanning=true;
  cursor.style.opacity='1';
  function moveCursor(){
    cards.forEach((c,i)=>c.classList.toggle('sg-active',i===curIdx));
    const card=cards[curIdx];if(!card)return;
    const cr=card.getBoundingClientRect(),wr=cardsEl.getBoundingClientRect();
    cursor.style.left=(cr.left-wr.left+cr.width/2-8)+'px';
  }
  const baseInterval=80;
  function scan(){
    if(!scanning)return;
    moveCursor();ticks++;
    const t=ticks/maxTicks,delay=baseInterval+t*t*320;
    if(ticks<maxTicks){
      curIdx+=dir;
      if(curIdx>=Math.min(available.length,3)){curIdx=Math.min(available.length,3)-2;dir=-1;}
      if(curIdx<0){curIdx=1;dir=1;}
      setTimeout(scan,delay);
    } else {
      // Land on target
      curIdx=targetIdx;moveCursor();beep(440,.1,.1,'sine');
      setTimeout(()=>{
        scanning=false;cursor.style.opacity='0';
        cards[targetIdx].classList.add('sg-flipped');
        beep(660,.6,.12,'sine');flash(100);
        chosen=available[targetIdx];
        document.getElementById('sg-status').textContent=`Gage secondaire selectionne : ${chosen.name}`;
        setTimeout(()=>{
          document.getElementById('sg-confirm-btn').classList.remove('hidden');
          document.getElementById('sg-close').style.display='none';
          document.getElementById('sg-confirm-btn').onclick=()=>{
            if(!S.usedSgIds)S.usedSgIds=[];S.usedSgIds.push(chosen.id);
            addActiveGage(chosen.id,playerIdx);save();
            ol.classList.add('hidden');renderGages();
            bradMsg(`Gage secondaire : "${chosen.name}". ${DISPLAY_NAMES[playerIdx]} prend le relais.`);
          };
        },1200);
      },600);
    }
  }
  setTimeout(scan,200);
  document.getElementById('sg-close').onclick=()=>{scanning=false;cursor.style.opacity='0';ol.classList.add('hidden');renderGages();};
}

/* EVENT WHEEL */
let evAngle=0,evSpinning=false;
function drawEventWheel(angle,cv){
  const canvas=cv||document.getElementById('ev-cv');if(!canvas)return;
  const available=EVENTS.filter(e=>!(S.usedEvents||[]).includes(e.id));
  if(!available.length)return;
  const ctx=canvas.getContext('2d'),W=canvas.width,H=canvas.height,cx=W/2,cy=H/2,r=Math.min(W,H)*.44,n=available.length;
  ctx.clearRect(0,0,W,H);
  const seg=2*Math.PI/n;
  for(let i=0;i<n;i++){
    const sA=angle-Math.PI/2+i*seg-seg/2,eA=sA+seg,mA=sA+seg/2;
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,sA,eA);ctx.closePath();
    ctx.fillStyle=EV_COLORS[i%EV_COLORS.length];ctx.fill();
    ctx.strokeStyle='rgba(100,50,200,.6)';ctx.lineWidth=2;ctx.stroke();
    const tx=cx+Math.cos(mA)*r*.6,ty=cy+Math.sin(mA)*r*.6;
    ctx.save();ctx.translate(tx,ty);ctx.rotate(mA+Math.PI/2);
    ctx.fillStyle='rgba(200,180,255,.9)';ctx.font='bold 9px monospace';
    ctx.textAlign='center';ctx.textBaseline='middle';
    const words=available[i].name.split(' ');
    words.forEach((w,wi)=>ctx.fillText(w,0,(wi-(words.length-1)/2)*11));
    ctx.restore();
  }
  ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.strokeStyle='rgba(100,50,200,.8)';ctx.lineWidth=3;ctx.stroke();
  ctx.beginPath();ctx.arc(cx,cy,13,0,Math.PI*2);ctx.fillStyle='#000';ctx.fill();ctx.strokeStyle='rgba(150,80,255,.8)';ctx.lineWidth=2;ctx.stroke();
}

function openEvenementOverlay(){
  const available=EVENTS.filter(e=>!(S.usedEvents||[]).includes(e.id));
  if(!available.length){bradMsg("Aucun evenement disponible. Tous ont deja ete declenches.");return;}
  const ol=document.getElementById('ev-ol');
  ol.classList.remove('hidden');
  document.getElementById('ev-result').classList.add('hidden');
  document.getElementById('ev-spin-btn').disabled=false;
  evAngle=0;evSpinning=false;
  setTimeout(()=>drawEventWheel(evAngle),50);
}

function spinEventWheel(){
  if(evSpinning)return;evSpinning=true;
  document.getElementById('ev-spin-btn').disabled=true;
  const available=EVENTS.filter(e=>!(S.usedEvents||[]).includes(e.id));
  const n=available.length,targetLocal=Math.floor(Math.random()*n);
  const seg=2*Math.PI/n,tBase=(n-targetLocal)*seg;
  const nC=((evAngle%(2*Math.PI))+2*Math.PI)%(2*Math.PI);
  let diff=((tBase-nC)%(2*Math.PI)+2*Math.PI)%(2*Math.PI);
  if(diff<.05)diff+=2*Math.PI;
  const tot=diff+(4+Math.floor(Math.random()*2))*2*Math.PI;
  const sA=evAngle,eA=sA+tot,dur=3500+Math.random()*1000,t0=performance.now();
  (function anim(now){
    const t=Math.min((now-t0)/dur,1);
    evAngle=sA+tot*(1-Math.pow(1-t,4));
    drawEventWheel(evAngle);
    if(t<1){requestAnimationFrame(anim);}
    else{
      evAngle=eA;evSpinning=false;drawEventWheel(evAngle);
      const chosen=available[targetLocal];
      if(!S.usedEvents)S.usedEvents=[];S.usedEvents.push(chosen.id);
      save();flash(200,true);beep(660,.4,.12,'sine');
      document.getElementById('ev-result-name').textContent=chosen.name;
      document.getElementById('ev-result-desc').textContent=chosen.desc;
      document.getElementById('ev-result').classList.remove('hidden');
      bradMsg(`EVENEMENT BRADDY3000 : "${chosen.name}". ${chosen.desc}`);
    }
  })(performance.now());
}

/* DOUBLE TIRAGE (bonus chaos) */
let dt2Spinning=false,dt2Gage1=null,dt2Gage2=null,dt2Player1=-1,dt2Player2=-1;
let dt2Angle1=0,dt2Angle2=0;

function openDoubleTimbre(){
  const pool=(S.pool[S.phase]||[]);
  if(pool.length<2){bradMsg("Pas assez de gages disponibles pour le Double Tirage. Minimum 2 gages requis.");return;}
  const ol=document.getElementById('dt2-ol');ol.classList.remove('hidden');
  document.getElementById('dt2-result').classList.add('hidden');
  document.getElementById('dt2-spin-btn').disabled=false;
  dt2Spinning=false;dt2Angle1=0;dt2Angle2=0;dt2Gage1=null;dt2Gage2=null;dt2Player1=-1;dt2Player2=-1;
  const pl=getAvailPlayers();
  drawRoulette(dt2Angle1,pl,document.getElementById('dt2-cv1'));
  drawRoulette(dt2Angle2,pl,document.getElementById('dt2-cv2'));
}

function spinDoubleTimbre(){
  if(dt2Spinning)return;dt2Spinning=true;
  document.getElementById('dt2-spin-btn').disabled=true;
  const id1=drawFromPool(S.phase,null);
  const id2=drawFromPool(S.phase,id1);
  if(!id1||!id2){
    if(id1)returnToPool(S.phase,id1);
    bradMsg("Pas assez de gages disponibles.");document.getElementById('dt2-ol').classList.add('hidden');return;
  }
  dt2Gage1=getGageById(id1);dt2Gage2=getGageById(id2);
  const pl=getAvailPlayers();
  let done1=false,done2=false;
  function tryFinish(){
    if(!done1||!done2)return;
    flash(200,true);beep(880,.3,.1);
    addActiveGage(id1,dt2Player1);addActiveGage(id2,dt2Player2);save();
    document.getElementById('dt2-name1').textContent=dt2Gage1?.name||'?';
    document.getElementById('dt2-name2').textContent=dt2Gage2?.name||'?';
    document.getElementById('dt2-result').classList.remove('hidden');
  }
  // Spin wheel 1 (player for gage1)
  const seg=2*Math.PI/pl.length,t1=Math.floor(Math.random()*pl.length);
  dt2Player1=pl[t1].idx;
  const tBase1=(pl.length-t1)*seg;
  const tot1=tBase1+(4+Math.floor(Math.random()*2))*2*Math.PI,t0=performance.now(),dur=3500+Math.random()*500;
  // Spin wheel 2 (player for gage2 — different from wheel1 if possible)
  const remaining=pl.filter(p=>p.idx!==dt2Player1);
  const pl2=remaining.length?remaining:pl;
  const t2=Math.floor(Math.random()*pl2.length);
  dt2Player2=pl2[t2].idx;
  const tBase2=(pl2.length-t2)*seg;
  const tot2=tBase2+(4+Math.floor(Math.random()*2))*2*Math.PI,dur2=3500+Math.random()*500;
  (function a1(now){const t=Math.min((now-t0)/dur,1);dt2Angle1=(1-Math.pow(1-t,4))*tot1;drawRoulette(dt2Angle1,pl,document.getElementById('dt2-cv1'));if(t<1)requestAnimationFrame(a1);else{done1=true;tryFinish();}})(performance.now());
  (function a2(now){const t=Math.min((now-t0)/dur2,1);dt2Angle2=(1-Math.pow(1-t,4))*tot2;drawRoulette(dt2Angle2,pl2,document.getElementById('dt2-cv2'));if(t<1)requestAnimationFrame(a2);else{done2=true;tryFinish();}})(performance.now());
}

/* IMPOSER UN GAGE */
let imposerPayerKey=null,imposerTargetIdx=-1;
function openImposer(){
  const pool=(S.pool[S.phase]||[]);
  if(!pool.length){bradMsg("Aucun gage disponible a imposer dans cette phase.");return;}
  const ol=document.getElementById('imposer-ol');ol.classList.remove('hidden');
  document.getElementById('imposer-step1').classList.remove('hidden');
  document.getElementById('imposer-step2').classList.add('hidden');
  imposerTargetIdx=-1;
  const grid=document.getElementById('imposer-players');
  grid.innerHTML=DISPLAY_NAMES.map((n,i)=>`<button class="imposer-player-btn" data-pidx="${i}">${n}</button>`).join('');
  grid.querySelectorAll('.imposer-player-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      imposerTargetIdx=parseInt(btn.dataset.pidx);
      document.getElementById('imposer-step1').classList.add('hidden');
      document.getElementById('imposer-step2').classList.remove('hidden');
      const gagesEl=document.getElementById('imposer-gages');
      gagesEl.innerHTML=pool.map(gid=>{const g=getGageById(gid);return g?`<button class="imposer-gage-btn" data-gid="${gid}">${g.name} (+${g.bc} BC)</button>`:''}).join('');
      gagesEl.querySelectorAll('.imposer-gage-btn').forEach(gb=>{
        gb.addEventListener('click',()=>{
          const gid=gb.dataset.gid;
          S.pool[S.phase]=(S.pool[S.phase]||[]).filter(id=>id!==gid);
          addActiveGage(gid,imposerTargetIdx);save();
          ol.classList.add('hidden');renderGages();
          const g=getGageById(gid);
          bradMsg(`Gage impose : "${g?.name}" a ${DISPLAY_NAMES[imposerTargetIdx]}. Le BRADDY3000 approuve cette decision. Le joueur cible peut toujours utiliser ses bonus.`);
        });
      });
    });
  });
}

/* BONUS MENU — CHAOS ROUTING */
function openBonus(id){
  const chaosIds=['doubleTimbre','imposerGage','declencherEvenement'];
  if(chaosIds.includes(id)){
    // Chaos: need player to pay first via existing player select page
    curBonus=id;selPl=null;
    const info=BONUS_INFO[id];
    document.getElementById('bd-title').textContent=info.title;
    document.getElementById('bd-desc').textContent=info.desc;
    const baseCost=CFG.costs[id]?.hippolyte||0;
    ['hippolyte','nathanael','edwin','teo'].forEach(p=>{
      const stock=S.stock[id]?.[p]??0,coins=S.coins[p]||0;
      document.getElementById('cost-'+p).textContent=`${coins} BC`;
      const btn=document.querySelector(`.player-btn[data-player="${p}"]`);
      if(btn){btn.classList.remove('selected');btn.style.opacity=(stock>0&&coins>=baseCost)?'1':'.4';}
    });
    document.getElementById('bd-stock').textContent=`Cout : ${baseCost} BC — Stock : H:${S.stock[id]?.hippolyte??0} / N:${S.stock[id]?.nathanael??0} / E:${S.stock[id]?.edwin??0} / T:${S.stock[id]?.teo??0}`;
    document.getElementById('purchase-confirm').classList.add('hidden');
    document.getElementById('purch-feedback').classList.add('hidden');
    nav('bonus-detail');
  } else {
    // Utility bonuses — point to gage cards
    goBack();
    bradMsg(`Pour utiliser "${BONUS_INFO[id]?.title}", rendez-vous sur la carte du gage en cours dans la section Gages. Les boutons apparaissent directement dessus.`);
    showPage('gages');
  }
}

const BONUS_INFO={gageSecondaire:{title:'Gage secondaire',desc:'Un gage de secours si celui actuel ne convient pas. Visible sur la carte de gage active.'},refaireRoue:{title:'Refaire la roue',desc:'Retirer un nouveau gage. Visible sur la carte de gage active.'},laisserPasser:{title:'Laisser Passer',desc:'Ignorer un gage sans penalite. Visible sur la carte de gage active.'},doubleTimbre:{title:'Double Tirage',desc:'Deux gages tires simultanement. Deux fois plus de chaos.'},imposerGage:{title:'Imposer un Gage',desc:'Impose un gage supplementaire a la personne de votre choix.'},declencherEvenement:{title:'Declencher un evenement',desc:'Active un evenement special via une roue dedicee.'}};
let curBonus=null,selPl=null;
function selPlayer(p){if(!curBonus)return;const cost=CFG.costs[curBonus]?.[p]||0,stock=S.stock[curBonus]?.[p]??0,coins=S.coins[p]||0;if(stock<=0||coins<cost)return;selPl=p;document.querySelectorAll('.player-btn').forEach(b=>b.classList.remove('selected'));document.querySelector(`.player-btn[data-player="${p}"]`)?.classList.add('selected');const names={hippolyte:'Hippolyte',nathanael:'Nathanael',edwin:'Edwin',teo:'Teo'};document.getElementById('purch-name').textContent=names[p];document.getElementById('purchase-confirm').classList.remove('hidden');document.getElementById('purch-feedback').classList.add('hidden');}
function confirmPurch(){
  if(!curBonus||!selPl)return;
  const baseCost=CFG.costs[curBonus]?.hippolyte||0,stock=S.stock[curBonus]?.[selPl]??0;
  if(stock<=0){showFb('Stock epuise.',true);return;}
  if((S.coins[selPl]||0)<baseCost){showFb('BittCoins insuffisants.',true);return;}
  S.coins[selPl]-=baseCost;S.stock[curBonus][selPl]--;save();
  document.getElementById('purchase-confirm').classList.add('hidden');
  goBack();
  if(curBonus==='doubleTimbre'){bradAnalyze(()=>openDoubleTimbre());}
  else if(curBonus==='imposerGage'){bradAnalyze(()=>openImposer());}
  else if(curBonus==='declencherEvenement'){bradAnalyze(()=>openEvenementOverlay());}
}
function cancelPurch(){selPl=null;document.getElementById('purchase-confirm').classList.add('hidden');document.querySelectorAll('.player-btn').forEach(b=>b.classList.remove('selected'));}
function showFb(msg,err){const el=document.getElementById('purch-feedback');el.textContent=msg;el.className=err?'err':'ok';el.classList.remove('hidden');}

function openMission(gage,playerIdx){
  S.pool[S.phase]=(S.pool[S.phase]||[]).filter(id=>id!==gage.id);
  addActiveGage(gage.id,playerIdx);save();renderGages();showPage('gages');
}

/* APP INIT */
function initApp(){
  initPool();startClock();startBradStatus();initMap();renderGages();renderBraddy();renderDossiers();updateBadge();
  if(!S.chatHistory||S.chatHistory.length===0){setTimeout(()=>bradMsg("Ah. Vous voila enfin. Le BRADDY3000 vous attendait. Moi aussi, je suppose."),1500);}else{renderHistory();}
  document.getElementById('topbar-chat').addEventListener('click',()=>nav('chat'));
  document.getElementById('chat-send-btn').addEventListener('click',sendMsg);
  document.getElementById('chat-inp').addEventListener('keydown',e=>{if(e.key==='Enter')sendMsg();});
  document.querySelectorAll('.back-btn').forEach(b=>b.addEventListener('click',goBack));
  document.querySelectorAll('[data-nav]').forEach(b=>b.addEventListener('click',()=>nav(b.dataset.nav)));
  document.querySelectorAll('.bonus-row').forEach(b=>b.addEventListener('click',()=>openBonus(b.dataset.bonus)));
  document.querySelectorAll('.player-btn').forEach(b=>b.addEventListener('click',()=>selPlayer(b.dataset.player)));
  document.querySelectorAll('.aide-btn').forEach(b=>b.addEventListener('click',()=>openAide(b.dataset.aide)));
  document.getElementById('purch-yes').addEventListener('click',confirmPurch);
  document.getElementById('purch-no').addEventListener('click',cancelPurch);
  document.getElementById('roll-pre-close').addEventListener('click',()=>document.getElementById('roulette-ol').classList.add('hidden'));
  document.getElementById('roll-btn').addEventListener('click',spinRoulette);
  document.getElementById('roll-start-btn').addEventListener('click',startMissionFromRoulette);
  document.getElementById('roll-close-btn').addEventListener('click',()=>document.getElementById('roulette-ol').classList.add('hidden'));
  document.getElementById('ev-spin-btn').addEventListener('click',spinEventWheel);
  document.getElementById('ev-close-btn').addEventListener('click',()=>document.getElementById('ev-ol').classList.add('hidden'));
  document.getElementById('dt2-spin-btn').addEventListener('click',spinDoubleTimbre);
  document.getElementById('dt2-close-btn').addEventListener('click',()=>{document.getElementById('dt2-ol').classList.add('hidden');renderGages();});
  document.getElementById('dt2-cancel-btn').addEventListener('click',()=>document.getElementById('dt2-ol').classList.add('hidden'));
  document.getElementById('imposer-close').addEventListener('click',()=>document.getElementById('imposer-ol').classList.add('hidden'));
  showPage(S.lastView||'home');
}

/* NAV */
let navStack=['home'];
function nav(to){navStack.push(to);showPage(to);}
function goBack(){if(navStack.length>1)navStack.pop();showPage(navStack[navStack.length-1]);}
function showPage(name){document.querySelectorAll('.page').forEach(p=>p.classList.remove('on'));const p=document.getElementById('page-'+name);if(p)p.classList.add('on');document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.nav===name));S.lastView=name;save();if(name==='chat'){S.chatBadge=0;save();updateBadge();setTimeout(()=>{const m=document.getElementById('chat-msgs');if(m)m.scrollTop=m.scrollHeight;},80);}}

function enterApp(){S.introComplete=true;save();document.getElementById('yt-frame').src='about:blank';document.querySelectorAll('.ph').forEach(p=>p.classList.remove('on'));document.getElementById('app').classList.add('show');initApp();}

/* BRADDY3000 */
function renderBraddy(){const b=document.getElementById('braddy-body'),ph=S.phase,dc=ph*20,ka=ph===0?3:Math.min(3+ph*18,97),rl=Math.floor(Math.random()*25+ph*10+20);b.innerHTML=`<div class="stat-block"><div class="stat-label">DONNÉES COLLECTÉES</div><div class="stat-bar-wrap"><div class="stat-bar" style="width:${dc}%"></div></div><div class="stat-value-row"><div class="stat-val">${dc}<span style="font-size:.6em;opacity:.5">%</span></div><div class="stat-unit">PHASE ${ph}/5</div></div></div><div class="stat-block"><div class="stat-label">LOCALISATION KIRBY 67</div><div class="stat-bar-wrap"><div class="stat-bar yellow" style="width:${ka}%"></div></div><div class="stat-value-row"><div class="stat-val">${ka}<span style="font-size:.6em;opacity:.5">%</span></div><div class="stat-unit">PRÉCISION</div></div></div><div class="stat-block"><div class="stat-label">FIABILITÉ DU BRADDY3000</div><div class="stat-bar-wrap"><div class="stat-bar green" style="width:${rl}%"></div></div><div class="stat-value-row"><div class="stat-val">${rl}<span style="font-size:.6em;opacity:.5">%</span></div><div class="stat-unit">ESTIMÉ</div></div></div><div class="fun-stat"><div>> Température du grille-pain de Brad : <span>42°C</span></div><div>> Niveau de sérieux : <span>3%</span></div><div>> Charabia généré : <span>${Math.floor(Math.random()*999)+100} TB</span></div><div>> Taux de bradification : <span>94.7%</span></div><div>> Grille-pains détectés : <span>1 (perdu)</span></div><div>> Probabilité que tout se passe bien : <span>incalculable</span></div></div>`;}

/* PHASE MANAGEMENT */
function advancePhase(n){if(n<=S.phase)return;S.phase=n;S.phaseExcluded=[];S.waitingForOui=false;S.doneDT=false;S.phase1Complete=false;const coins=CFG.phaseCoins[n]||0;Object.keys(S.coins).forEach(p=>S.coins[p]+=coins);save();initPool();initMap();renderGages();renderBraddy();renderDossiers();const msgs=['','Phase 1 initialisée. Données en réception. Bonne chance.','Phase 2 débloquée. Votre progression est acceptable.','Phase 3 active. Attention, rupture narrative imminente.','Phase 4 critique. Contrats BRADDY3000 prioritaires.','Phase 5 — Ultime. Le BRADDY3000 et moi-même vous regardons.'];if(msgs[n])setTimeout(()=>bradMsg(msgs[n]),500);}


/* DOSSIERS */
const DOSS={kirby67:{title:'Kirby 67',content:`<div class="class-tag">CLASSIFICATION : ALPHA-ROUGE</div><h3>IDENTIFICATION</h3><p>Kirby 67 est le double maléfique de Kirby 54, capturé lors de l'Edition II. Niveau de malveillance : 94% selon le BRADDY3000.</p><h3>DERNIÈRE LOCALISATION</h3><p>Ville de Lille — signal perdu lors de son évasion.</p><h3>MOTIVATIONS</h3><p>Kirby 67 parle obsessionnellement d'un "Monde au Serrano".</p><p class="warn">NE PAS mentionner le Serrano en sa présence.</p><h3>NOTE DE BRAD BITT</h3><p class="warn">Si vous le trouvez, ne le nourrissez pas. Et surtout pas de Serrano.</p>`}};
function renderDossiers(){const l=document.getElementById('dossiers-list');const rows=[{id:'kirby67',name:'Kirby 67',u:true},{id:'bb',name:'Brad Bitt',u:false},{id:'b3k',name:'BRADDY3000',u:false},{id:'inc',name:'Incidents précédents',u:false},{id:'arc',name:'Archives',u:false}];l.innerHTML=rows.map(d=>`<div class="dossier-row ${d.u?'unlocked':'locked'}" ${d.u?`data-dos="${d.id}"`:''}><span class="dossier-name">${d.name}</span><span class="dossier-badge ${d.u?'open':'closed'}">${d.u?'DÉBLOQUÉ':'&#128274; ACCÈS REFUSÉ'}</span></div>`).join('');document.querySelectorAll('.dossier-row.unlocked').forEach(r=>r.addEventListener('click',()=>{const d=DOSS[r.dataset.dos];if(!d)return;document.getElementById('dd-title').textContent=d.title;document.getElementById('dd-body').innerHTML=d.content;nav('dossier-detail');}));}

/* DOUBLE TROUBLE INTERFACE */
function openDTInterface(){
  const shuffled=[...DISPLAY_NAMES].map((n,i)=>({name:n,key:R_KEYS[i]})).sort(()=>Math.random()-.5);
  const teamA=shuffled.slice(0,2),teamB=shuffled.slice(2,4);
  const ph=PHASES[Math.min(S.phase,5)];
  document.getElementById('dt-ol-title-el').innerHTML=`${BOLT_SVG} DOUBLE TROUBLE ${BOLT_SVG}`;
  document.getElementById('dt-ol-note').textContent='Petite quantité uniquement — éviter le gaspillage';
  document.getElementById('dt-ol-teams').innerHTML=`
    <div class="dt-ol-team dt-ol-a">
      <div class="dt-ol-team-label">ÉQUIPE A — FROMAGE</div>
      <div class="dt-ol-task">${ph.dt?.a||'Trouver du fromage à raclette.'}</div>
      <div class="dt-ol-players">${teamA.map(p=>`<div class="dt-ol-player">${p.name}</div>`).join('')}</div>
    </div>
    <div class="dt-ol-team dt-ol-b">
      <div class="dt-ol-team-label">ÉQUIPE B — CHARCUTERIE</div>
      <div class="dt-ol-task">${ph.dt?.b||'Trouver du Serrano.'}</div>
      <div class="dt-ol-players">${teamB.map(p=>`<div class="dt-ol-player">${p.name}</div>`).join('')}</div>
    </div>`;
  const ol=document.getElementById('dt-ol');
  ol.classList.remove('hidden');
  document.getElementById('dt-countdown-wrap').classList.add('hidden');
  document.getElementById('dt-go-section').classList.add('hidden');
  document.getElementById('dt-ol-actions').classList.remove('hidden');
  document.getElementById('dt-ol-start-btn').disabled=false;
  // Wire buttons
  const startBtn=document.getElementById('dt-ol-start-btn');
  const cancelBtn=document.getElementById('dt-ol-cancel-btn');
  const doneBtn=document.getElementById('dt-ol-done-btn');
  const newStart=startBtn.cloneNode(true);startBtn.parentNode.replaceChild(newStart,startBtn);
  const newCancel=cancelBtn.cloneNode(true);cancelBtn.parentNode.replaceChild(newCancel,cancelBtn);
  const newDone=doneBtn.cloneNode(true);doneBtn.parentNode.replaceChild(newDone,doneBtn);
  document.getElementById('dt-ol-cancel-btn').addEventListener('click',()=>ol.classList.add('hidden'));
  document.getElementById('dt-ol-start-btn').addEventListener('click',()=>{
    document.getElementById('dt-ol-actions').classList.add('hidden');
    startDTCountdown();
  });
  document.getElementById('dt-ol-done-btn').addEventListener('click',()=>{
    S.doneDT=true;save();ol.classList.add('hidden');
    beep(440,.5,.1,'sine');checkPhase1Complete();renderGages();
    bradMsg('Double Trouble... accompli. Le BRADDY3000 enregistre le résultat. Bien joué aux deux équipes.');
  });
}

function startDTCountdown(){
  const wrap=document.getElementById('dt-countdown-wrap');
  const numEl=document.getElementById('dt-count-num');
  wrap.classList.remove('hidden');
  let n=3;
  function tick(){
    numEl.textContent=n;
    numEl.className='dt-count-num dt-count-anim';
    void numEl.offsetWidth;
    numEl.className='dt-count-num dt-count-anim';
    beep(n===1?660:440,.25,.15,'sine');
    if(n>1){n--;setTimeout(tick,950);}
    else{
      setTimeout(()=>{
        flash(200,true);beep(880,.4,.2,'sine');shake(4,300);
        wrap.classList.add('hidden');
        document.getElementById('dt-go-section').classList.remove('hidden');
      },900);
    }
  }
  setTimeout(tick,200);
}

/* RESET ANIMATION */
function launchResetAnimation(){
  const ov=document.createElement('div');
  ov.style.cssText='position:fixed;inset:0;z-index:500;background:#000;display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-end;padding:30px 24px;overflow:hidden;font-family:var(--mono)';
  document.body.appendChild(ov);
  const lines=['> BRADDY3000 — PROCÉDURE DE RÉINITIALISATION INITIALISÉE...','> Déconnexion des agents en cours...','> Suppression des BradCoins. Toutes les richesses disparaissent.','> Effacement des gages accomplis. Impressionnant, mais terminé.','> MODE USINE BRAD™ ACTIVÉ.','> Kirby 67 est temporairement libre. Surveillez vos arrières.','> Données de localisation effacées.','> Je ne suis pas responsable de ce qui suit.','> Suppression de mes propres souvenirs... (ça fait un peu mal)','> Effacement du chat. Oubli mutuel.','> BRADDY3000 REBOOT EN COURS...','> .','> ..','> ...','> AU REVOIR.'];
  let i=0;
  const next=()=>{if(i>=lines.length){setTimeout(()=>{localStorage.removeItem('n2s3');location.reload();},900);return;}const p=document.createElement('p');p.textContent=lines[i];p.style.cssText='color:rgba(0,255,65,.8);font-size:11px;letter-spacing:.25em;margin:3px 0;opacity:0;transition:opacity .15s;';ov.insertBefore(p,ov.firstChild);setTimeout(()=>p.style.opacity='1',20);beep(180+Math.random()*200,.05,.05,'square');i++;setTimeout(next,lines[i-1].startsWith('> .')?350:300);};
  flash(300,true);setTimeout(next,500);
}

/* BOOTSTRAP */
window.addEventListener('resize',()=>{resizeBg();initParts();if(document.getElementById('app').classList.contains('show'))drawMap();});
resizeBg();initParts();tickParts();
if(S.introComplete){document.querySelectorAll('.ph').forEach(p=>p.classList.remove('on'));document.getElementById('app').classList.add('show');initApp();}
