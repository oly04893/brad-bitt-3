'use strict';
/* N2S3 PROTOCOL v4.0 */

const CFG = {
  youtubeId: 'VIDEO_ID_ICI',
  targetDate: new Date('2026-08-05T11:00:00+02:00'),
  phaseCodes: {'BRADDY-ALPHA':1,'BRADDY-BRAVO':2,'BRADDY-CHARLIE':3,'BRADDY-DELTA':4,'BRADDY-OMEGA':5},
  costs: {
    gageSecondaire:{hippolyte:15,nathanael:15,teo:15},
    refaireRoue:{hippolyte:20,nathanael:20,teo:20},
    laisserPasser:{hippolyte:25,nathanael:25,teo:25},
    doubleTimbre:{hippolyte:25,nathanael:25,teo:25},
    imposerGage:{hippolyte:30,nathanael:30,teo:30},
    declencherEvenement:{hippolyte:50,nathanael:50,teo:50},
  },
  initStock:{
    gageSecondaire:{hippolyte:1,nathanael:1,teo:1},
    refaireRoue:{hippolyte:2,nathanael:2,teo:2},
    laisserPasser:{hippolyte:1,nathanael:1,teo:1},
    doubleTimbre:{hippolyte:1,nathanael:1,teo:1},
    imposerGage:{hippolyte:1,nathanael:1,teo:1},
    declencherEvenement:{hippolyte:1,nathanael:1,teo:1},
  },
  phaseCoins:[0,5,5,5,5,10],
};

const R_PLAYERS  = ['Hippolyte','Teo','Nathanael'];
const R_KEYS     = ['hippolyte','teo','nathanael'];
const R_COLORS   = ['#5a0000','#380000','#7a0000'];
const DISPLAY_NAMES = ['Hippolyte','Teo','Nathanael'];
const EV_COLORS  = ['#1a0040','#002a1a','#1a1500','#001a2a','#2a0020','#0a1500'];

const SECONDARY_GAGES = [
  {id:'sg1',name:"L'Expert Local",desc:"Demander a un passant : Selon vous, quel est le meilleur endroit a visiter a Lille ? Puis raconter la reponse au groupe.",bc:5},
  {id:'sg2',name:"L'Inspection BRADDY3000",desc:"Entrer dans un magasin et demander au vendeur : Quel est l'article le plus original ou insolite que vous vendez actuellement ? Le montrer ou le decrire au groupe.",bc:5},
  {id:'sg3',name:"Pronostic du futur",desc:"Demander a un passant : Selon vous, quel sera le resultat du quart de finale de la Coupe du monde 2030 entre la France et l'Italie, Zidane etant selectonneur ? Transmettre le score au BRADDY3000.",bc:5},
  {id:'sg4',name:"Transmission Prioritaire",desc:"Demander a un inconnu de choisir un nombre entre 1 et 10. Annoncer tres serieusement au groupe : Le BRADDY3000 enregistre la valeur... transmission validee.",bc:5},
];

const DT_TIERS = [
  {n:1,name:"Cornichon peu amer",bc:5,color:"#2d6a2d"},
  {n:2,name:"Serrano Épicé",bc:10,color:"#a83e17"},
  {n:3,name:"Fromage Carbonisé",bc:15,color:"#7a3300"},
  {n:4,name:"Vachement Salé",bc:25,color:"#7a0000"},
];

const SIDE_MISSIONS = [
  {id:"sm1",tier:1,desc:"Trouver dans un magasin ou dans la rue un objet qui fait immediatement penser au YouTuber Asterion (couleur, symbole, personnage...) et le montrer au groupe."},
  {id:"sm2",tier:1,desc:"Apprendre a dire 'jambon' en langage des signes. L'objectif est uniquement d'apprendre le geste."},
  {id:"sm3",tier:1,desc:"Prendre en photo un appareil a raclette apercu dans un magasin. Cette photo doit devenir le fond d'ecran du telephone jusqu'a la fin de la journee."},
  {id:"sm4",tier:2,desc:"Demander a un passant : Selon vous, quel sera le resultat du quart de finale France - Italie de la Coupe du Monde 2030, avec Zinedine Zidane comme selectionneur ? Transmettre le resultat au BRADDY3000 via le chat."},
  {id:"sm5",tier:2,desc:"Trouver un objet particulierement etrange, insolite ou inattendu dans un magasin ou dans la rue. Le groupe valide ensemble si l'objet merite cette qualification."},
  {id:"sm6",tier:3,desc:"Publier une story privee (visible uniquement par un cercle restreint d'amis si souhaite) vantant les merites de la raclette."},
  {id:"sm7",tier:3,desc:"Convaincre un inconnu de faire un dab devant l'objectif ou devant le groupe. Le tout doit rester naturel, respectueux et humoristique."},
  {id:"sm8",tier:4,desc:"Obtenir l'accord d'un inconnu afin de prendre une photo souvenir avec lui. L'objectif est simplement de repartir avec une photo amusante dans un esprit convivial."},
];
function smBC(id){const sm=SIDE_MISSIONS.find(s=>s.id===id);const t=DT_TIERS.find(t=>t.n===sm?.tier);return t?t.bc:5;}
function smTier(id){const sm=SIDE_MISSIONS.find(s=>s.id===id);return DT_TIERS.find(t=>t.n===sm?.tier);}

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
    ],
    contracts:[{name:'Synchronisation BRADDY3000',desc:'Deux participants se tiennent la main pendant 20 minutes.',reward:'Multiplicateur x1.5'}],
    dt:null
  },
  {
    name:'PHASE 2 — DEJEUNER',desc:'Collecte intensive',
    gages:[
      {id:'p2g1',name:'Commande Controlee',desc:"Le participant choisit uniquement la taille de son repas. Le reste est decide par un autre joueur.",bc:5},
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
      {id:'p5g1',name:'Mario Kart',desc:"Se rendre a la borne de demonstration de la FNAC et demander a une personne presente si elle accepterait de faire une partie de Mario Kart contre vous.",bc:10,
       bradOnStart:"Les capacites de conduite des habitants de Lille doivent etre analysees. Toute donnee de pilotage peut s'averer utile pour anticiper les deplacements de Kirby 67."},
      {id:'p5g2',name:'Micro-Trottoir Raclette',desc:"Demander a un passant : 'Pensez-vous que la raclette est un plat reserve aux fetes de fin d'annee ou peut-on en manger toute l'annee ?' La reponse est transmise au BRADDY3000.",bc:10,
       bradOnStart:"Analyse sociologique en cours. Les habitudes alimentaires de la population lilloise pourraient etre directement liees au fameux Monde au Serrano de Kirby 67."},
      {id:'p5g3',name:"Livre d'Or",desc:"Acheter un petit carnet (ou utiliser un carnet prevu) puis demander a un inconnu d'y laisser une dedicace, un mot ou une signature.",bc:10,
       bradOnStart:"Toute trace d'ecriture humaine constitue une donnee precieuse pour enrichir les archives de Brad Corporation."},
    ],
    contracts:[],dt:null
  },
];

const BOLT_SVG='<svg width="13" height="18" viewBox="0 0 13 18" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;margin:0 2px"><path d="M8.5 0L0 10.5h5.5L3.5 18 13 7.5H7.5z" fill="#ff2222"/></svg>';

/* STATE */
function loadState(){try{const s=localStorage.getItem('n2s3');if(s)return JSON.parse(s);}catch(e){}
  return{phase:0,coins:{hippolyte:0,nathanael:0,teo:0},stock:JSON.parse(JSON.stringify(CFG.initStock)),
    chatHistory:[],introComplete:false,chatBadge:0,lastView:'home',
    doneGages:[],phaseExcluded:[],waitingForOui:false,phase1Announced:false,
    waitingForDelete:false,doneDT:false,phase1Complete:false,pendingCC:null,
    pool:{},activeGages:[],gageHistory:[],usedEvents:[],usedSgIds:[],sideMissions:[],usedSMIds:[],brouillageEnd:0,primeNext:0,bradLostUntil:0,glitchModeUntil:0,contractTimers:{},dtActive:false,dtStart:0,dtPoolBC:0,
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
    // JSON parse makes keys strings, handle both
    if(S.pool[n]===undefined&&S.pool[String(n)]===undefined){
      S.pool[n]=(PHASES[n]?.gages||[]).map(g=>g.id);
    } else if(S.pool[String(n)]!==undefined&&S.pool[n]===undefined){
      S.pool[n]=S.pool[String(n)];
    }
  });
}
function getPool(ph){return S.pool[ph]||S.pool[String(ph)]||[];}
function getGageById(id){
  for(const ph of PHASES){const g=ph.gages?.find(x=>x.id===id);if(g)return g;}
  return SECONDARY_GAGES.find(g=>g.id===id)||null;
}
function drawFromPool(phase,excludeId=null){
  const pool=getPool(phase);
  const av=pool.filter(id=>id!==excludeId);
  if(!av.length)return null;
  const gid=av[Math.floor(Math.random()*av.length)];
  S.pool[phase]=pool.filter(id=>id!==gid);
  return gid;
}
function returnToPool(phase,gageId){
  const pool=getPool(phase);
  if(!pool.includes(gageId)){S.pool[phase]=[...pool,gageId];}
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
  let bc=status==='reussi'?ag.bc:0;
  if(status==='reussi'){
    if(S.nextGageMultiplier&&S.nextGageMultiplier>1){const oldBc=bc;bc=Math.round(bc*S.nextGageMultiplier);S.nextGageMultiplier=0;setTimeout(()=>bradMsg(`Multiplicateur du contrat Synchronisation applique ! ${oldBc} BC deviennent ${bc} BC pour ${DISPLAY_NAMES[ag.playerIdx]}.`),300);}
    if(S.brouillageEnd&&Date.now()<S.brouillageEnd){bc*=2;setTimeout(()=>bradMsg(`BROUILLAGE ACTIF — BC doubles ! ${DISPLAY_NAMES[ag.playerIdx]} gagne ${bc} BC.`),200);}
    if((S.primeNext||0)>0){bc+=S.primeNext;S.primeNext=0;setTimeout(()=>bradMsg(`PRIME EXCEPTIONNELLE appliquee. BC bonus inclus.`),400);}
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

/* SIDE MISSIONS */
function completeSideMission(smIdx, status){
  if(!S.sideMissions)return;
  const sm=S.sideMissions.find((_,i)=>i===smIdx);if(!sm)return;
  sm.status=status;
  if(status==='reussi'){S.coins[R_KEYS[sm.playerIdx]]=(S.coins[R_KEYS[sm.playerIdx]]||0)+sm.bc;save();bradMsg(`Mission annexe réussie par ${DISPLAY_NAMES[sm.playerIdx]}. +${sm.bc} BC crédités. Le BRADDY3000 approuve.`);}
  else{save();bradMsg(`Mission annexe échouée. Le BRADDY3000 est... compréhensif. Presque.`);}
  save();renderGages();
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
document.getElementById('btn-enter-app').addEventListener('click',()=>enterApp());


/* MAP */
const ZONES=[{id:'alpha',name:'ZONE ALPHA',x:18,y:22,ph:0},{id:'beta',name:'ZONE BETA',x:68,y:38,ph:1},{id:'gamma',name:'ZONE GAMMA',x:32,y:60,ph:2},{id:'delta',name:'ZONE DELTA',x:72,y:68,ph:3},{id:'omega',name:'[ CLASSIFIE ]',x:50,y:47,ph:5}];

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
      const canRef=(S.stock.refaireRoue?.[pk]||0)>0&&bc>=20&&S.phase!==5;
      const canSec=(S.stock.gageSecondaire?.[pk]||0)>0&&bc>=15&&SECONDARY_GAGES.filter(s=>!(S.usedSgIds||[]).includes(s.id)).length>0;
      const canPass=(S.stock.laisserPasser?.[pk]||0)>0&&bc>=25;
      html+=`<div class="active-gage-card" data-idx="${idx}">
        <div class="ag-header"><span class="ag-phase-lbl">PHASE ${ag.phase}</span><span class="ag-bc">+${ag.bc} BC</span></div>
        <div class="ag-name">${ag.gageName}</div>
        <div class="ag-player">Agent : ${DISPLAY_NAMES[ag.playerIdx]}</div>
        <div class="ag-time">Debut : ${ag.startTime}</div>
        ${(canRef||canSec||canPass)?`<div class="ag-bonus-row">${canRef?`<button class="ag-mini-btn" data-agbonus="refaire" data-idx="${idx}">&#8635; Refaire (20BC)</button>`:''}${canSec?`<button class="ag-mini-btn ag-sg" data-agbonus="secondaire" data-idx="${idx}">&#9733; Secondaire (15BC)</button>`:''}${canPass?`<button class="ag-mini-btn ag-pass" data-agbonus="passer" data-idx="${idx}">&#8856; Passer (25BC)</button>`:''}</div>`:''}
        <div class="ag-main-btns"><button class="ag-ok" data-idx="${idx}">&#10003; RÉUSSI</button><button class="ag-fail" data-idx="${idx}">&#10007; ÉCHOUÉ</button></div>
      </div>`;
    });
  }

  // AVAILABLE GAGES
  const poolGages=(getPool(S.phase)).map(id=>getGageById(id)).filter(Boolean);
  if(poolGages.length||ph.directAssignment){
    if(!ph.directAssignment&&poolGages.length)html+=`<div class="section-lbl">DISPONIBLES</div>`;
    if(ph.directAssignment&&poolGages.length)html+=`<div class="section-lbl">DISPONIBLES — ATTRIBUTION BRAD</div>`;
    poolGages.forEach(g=>{
      const isPendingCC=g.id==='p2g1'&&S.pendingCC&&S.pendingCC.gageId==='p2g1';
      const footer=isPendingCC?`<span class="gage-card-tap gage-pending">&#9888; CLIENT : ${DISPLAY_NAMES[S.pendingCC.clientIdx]} — OPÉRATEUR : ${DISPLAY_NAMES[S.pendingCC.opIdx]} — appuyer pour continuer</span>`:`<span class="gage-card-tap">${ph.directAssignment?'&#9658; ATTRIBUTION DIRECTE':'&#9658; APPUYER POUR TIRER AU SORT'}</span>`;
      html+=`<div class="gage-card${isPendingCC?' pending':''}" data-gid="${g.id}"><div class="gage-card-header"><div class="gage-card-name">${g.team?'<span class="gage-team-tag">[EQUIPE] </span>':''}${g.name}</div><div class="gage-card-bc">+${g.bc} BC</div></div><div class="gage-card-desc">${g.desc}</div><div class="gage-card-footer">${footer}</div></div>`;
    });
    if(!poolGages.length&&!S.activeGages.length)html+=`<div class="pool-empty">Tous les gages de cette phase ont ete attribues.</div>`;
  }

  // DOUBLE TROUBLE (nouvelle mecanique — evenement scenarise, plus un gage)
  if(S.phase===1){
    const p1AllDone=PHASES[1].gages.every(g=>S.doneGages?.includes(g.id));
    const doneN=PHASES[1].gages.filter(g=>S.doneGages?.includes(g.id)).length,totN=PHASES[1].gages.length;
    if(S.doneDT){
      html+=`<div class="dt-block"><div class="dt-title">${BOLT_SVG} DOUBLE TROUBLE ${BOLT_SVG}</div><div class="dt-done-lbl">&#10003; PROTOCOLE TERMINÉ — ${S.dtPoolBC||0} BC récoltés, répartis entre les 3 agents.</div></div>`;
    } else if(!p1AllDone){
      html+=`<div class="dt-block dt-locked"><div class="dt-title">${BOLT_SVG} DOUBLE TROUBLE ${BOLT_SVG}</div><div class="dt-locked-body"><p class="dt-locked-q">???</p><p class="dt-locked-hint">Se déverrouille après ${totN} gages accomplis — ${doneN}/${totN}</p></div></div>`;
    } else if(S.dtActive){
      const rem=Math.max(0,Math.floor(((S.dtStart+10*60*1000)-Date.now())/1000));
      const mm=String(Math.floor(rem/60)).padStart(2,'0'),ss=String(rem%60).padStart(2,'0');
      html+=`<div class="dt-block dt-in-progress"><div class="dt-title">${BOLT_SVG} DOUBLE TROUBLE EN COURS ${BOLT_SVG}</div><div class="dt-chrono" id="dt-resume-chrono">${mm}:${ss}</div><div class="dt-pool-mini">Réserve BRADDY3000 : <span id="dt-resume-pool">${S.dtPoolBC||0}</span> BC</div><button class="dt-launch-btn" id="dt-resume-btn">&#9654; REPRENDRE LE DOUBLE TROUBLE</button></div>`;
    } else {
      html+=`<div class="dt-block"><div class="dt-title">${BOLT_SVG} DOUBLE TROUBLE ${BOLT_SVG}</div><div class="dt-locked-body"><p style="font-family:var(--mono);font-size:10px;color:rgba(255,255,255,.5);text-align:center;line-height:1.8">Tous les gages sont accomplis. Le BRADDY3000 détecte une anomalie...</p></div><button class="dt-launch-btn" id="dt-launch-btn">&#9888; DÉCLENCHER LE PROTOCOLE</button></div>`;
    }
  }

  // CONTRACTS
  const contractsLocked=(S.phase===1&&!S.doneDT);
  if(ph.contracts&&ph.contracts.length){
    html+=`<div class="contracts-section"><div class="contracts-title">CONTRATS BRADDY3000</div>`;
    if(contractsLocked){html+=`<div class="contract-locked"><p class="contract-locked-q">???</p><p class="contract-locked-hint">Se déverrouille après le Double Trouble</p></div>`;}
    else{
      if(!S.contractTimers)S.contractTimers={};
      ph.contracts.forEach((c,ci)=>{
        const isSynchroHands=c.name.includes('Synchronisation');
        const duration=isSynchroHands?20*60*1000:5*60*1000;
        const durLbl=isSynchroHands?'20 min':'5 min';
        const key=S.phase+'_'+ci;
        const ct=S.contractTimers[key];
        const now=Date.now();
        if(ct&&ct.active&&now<ct.end){
          const rem=Math.max(0,Math.ceil((ct.end-now)/1000));
          const mm=String(Math.floor(rem/60)).padStart(2,'0'),ss=String(rem%60).padStart(2,'0');
          const p1=DISPLAY_NAMES[ct.p1],p2=DISPLAY_NAMES[ct.p2];
          html+=`<div class="contract-card contract-active-timer" data-ckey="${key}"><div class="contract-name">&#9201; ${c.name}</div><div class="contract-players">${p1} &amp; ${p2} — en cours</div><div class="contract-timer-display" data-ctimer="${key}">${mm}:${ss}</div><div class="contract-desc">${c.desc}</div></div>`;
        } else if(ct&&ct.active&&now>=ct.end){
          html+=`<div class="contract-card contract-done"><div class="contract-name">&#10003; ${c.name}</div><div class="contract-desc">Contrat accompli par ${DISPLAY_NAMES[ct.p1]} et ${DISPLAY_NAMES[ct.p2]}.</div><button class="contract-claim-btn" data-cclaim="${key}">${isSynchroHands?'RÉCLAMER LE MULTIPLICATEUR x1.5':'RÉCLAMER +5 BC CHACUN'}</button></div>`;
        } else {
          html+=`<div class="contract-card"><div class="contract-name">${c.name}</div><div class="contract-desc">${c.desc}</div><div class="contract-reward">${c.reward} — durée : ${durLbl}</div><button class="contract-launch-btn" data-claunch="${key}" data-ci="${ci}">LANCER LE CONTRAT</button></div>`;
        }
      });
    }
    html+='</div>';
  }

  // HISTORY
  if(S.gageHistory&&S.gageHistory.length){
    html+=`<div class="section-lbl">HISTORIQUE</div>`;
    [...S.gageHistory].reverse().forEach(h=>{
      const cls=h.status==='reussi'?'hist-ok':h.status==='echoue'?'hist-fail':'hist-pass';
      const statusLabel={'reussi':'RÉUSSI','echoue':'ÉCHOUÉ','passe':'PASSÉ'}[h.status]||h.status.toUpperCase();
      html+=`<div class="hist-item ${cls}"><div class="hist-name">${h.gageName}</div><div class="hist-meta">${h.playerName} — Ph.${h.phase} — ${h.endTime}</div><div class="hist-status">${statusLabel}${h.bc>0?` +${h.bc} BC`:''}</div></div>`;
    });
  }

  // SIDE MISSIONS
  if(S.sideMissions&&S.sideMissions.length){
    const actSMs=S.sideMissions.filter(sm=>sm.status==='active');
    if(actSMs.length){
      html+=`<div class="section-lbl">MISSIONS ANNEXES ACTIVES</div>`;
      actSMs.forEach((sm,idx)=>{
        const realIdx=S.sideMissions.indexOf(sm);
        html+=`<div class="side-mission-card"><div class="sm-player">${DISPLAY_NAMES[sm.playerIdx]}</div><div class="sm-desc">${sm.missionDesc}</div><div class="sm-bc">+${sm.bc} BC si reussie</div><div class="sm-btns"><button class="sm-ok" data-smidx="${realIdx}">&#10003; RÉUSSIE</button><button class="sm-fail" data-smidx="${realIdx}">&#10007; ÉCHOUÉE</button></div></div>`;
      });
    }
  }
  html+=`<div class="braddy-analyzing"><div class="adots"><div class="adot"></div><div class="adot"></div><div class="adot"></div></div><p>Brad analyse votre position actuelle</p></div>`;
  body.innerHTML=html;

  // Event listeners — active gage buttons
  document.querySelectorAll('.ag-ok').forEach(btn=>btn.addEventListener('click',()=>completeActiveGage(parseInt(btn.dataset.idx),'reussi')));
  document.querySelectorAll('.ag-fail').forEach(btn=>btn.addEventListener('click',()=>completeActiveGage(parseInt(btn.dataset.idx),'echoue')));
  document.querySelectorAll('[data-agbonus]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const idx=parseInt(btn.dataset.idx),bonus=btn.dataset.agbonus;
      const ag=S.activeGages[idx];if(!ag)return;
      const pk=R_KEYS[ag.playerIdx];
      const info={refaire:{name:"Refaire la roue",desc:"Votre gage actuel retourne dans le pool. Une roue tire un nouveau gage parmi ceux disponibles. Personnel uniquement.",cost:20},secondaire:{name:"Gage secondaire",desc:"4 cartes mystere. Votre gage actuel est remplace par celui selectionne. Peut etre plus simple... ou beaucoup plus complique.",cost:15},passer:{name:"Laisser Passer",desc:"Votre gage actuel est ignore definitvement. Aucun Brad Coin attribue. Le gage disparait.",cost:25}};
      const b=info[bonus];if(!b)return;
      const coins=S.coins[pk]||0;
      const ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;z-index:350;background:rgba(0,0,0,.92);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:30px;';
      ov.innerHTML=`<p style="font-family:var(--orb);font-size:11px;color:var(--red2);letter-spacing:.3em">${b.name.toUpperCase()}</p>
        <p style="font-family:var(--mono);font-size:11px;color:rgba(255,255,255,.6);line-height:1.8;text-align:center;max-width:320px">${b.desc}</p>
        <p style="font-family:var(--orb);font-size:13px;color:var(--orange)">Cout : ${b.cost} BC — Votre solde : ${coins} BC</p>
        ${coins<b.cost?'<p style="font-family:var(--mono);font-size:10px;color:var(--red2)">BradCoins insuffisants.</p>':''}
        <div style="display:flex;gap:12px">
          <button id="agb-buy" ${coins<b.cost?'disabled style="opacity:.4"':''} style="font-family:var(--orb);font-size:12px;letter-spacing:.3em;padding:14px 30px;background:rgba(204,0,0,.2);border:2px solid var(--red);color:var(--white)">ACHETER</button>
          <button id="agb-back" style="font-family:var(--mono);font-size:10px;padding:12px 24px;border:1px solid rgba(255,255,255,.2);color:rgba(255,255,255,.5)">RETOUR</button>
        </div>`;
      document.body.appendChild(ov);
      ov.querySelector('#agb-back').addEventListener('click',()=>ov.remove());
      ov.querySelector('#agb-buy').addEventListener('click',()=>{ov.remove();if(bonus==='refaire')applyRefaireRoue(idx);else if(bonus==='secondaire')applyGageSecondaire(idx);else if(bonus==='passer')applyLaisserPasser(idx);});
    });
  });

  // Available gage click -> roulette or direct
  document.querySelectorAll('.gage-card').forEach(card=>{
    card.addEventListener('click',()=>{
      const gid=card.dataset.gid,g=getGageById(gid);if(!g)return;
      if(gid==='p2g1'){
        if(S.pendingCC&&S.pendingCC.gageId==='p2g1'){
          openCommandeControlee(S.pendingCC.clientIdx,g,S.pendingCC.opIdx);
          return;
        }
        openRoulette(g);
        return;
      }
      if(ph.directAssignment){
        S.pool[S.phase]=(getPool(S.phase)).filter(id=>id!==gid);
        const excl=S.phaseExcluded||[];const usedKeys=(S.activeGages||[]).filter(ag=>ag.phase===S.phase).map(ag=>R_KEYS[ag.playerIdx]);
        const combined=[...new Set([...excl,...usedKeys])];
        const avail=R_KEYS.filter(k=>!combined.includes(k));
        const pk=avail.length?avail[Math.floor(Math.random()*avail.length)]:R_KEYS[Math.floor(Math.random()*R_KEYS.length)];
        const pidx=R_KEYS.indexOf(pk);
        addActiveGage(gid,pidx);save();renderGages();flash(100,true);
        bradMsg(`Mission "${g.name}" attribuee a ${DISPLAY_NAMES[pidx]}. Le BRADDY3000 a decide.`);
        if(g.bradOnStart){setTimeout(()=>bradMsg(g.bradOnStart),1800);}
      } else {openRoulette(g);}
    });
  });

  // DT resume live chrono (when overlay is closed but DT still running)
  const dtResumeChronoEl=document.getElementById('dt-resume-chrono');
  if(dtResumeChronoEl&&S.dtActive&&!S.doneDT){
    const dtTick2=setInterval(()=>{
      const el=document.getElementById('dt-resume-chrono');if(!el){clearInterval(dtTick2);return;}
      const rem=Math.max(0,Math.floor(((S.dtStart+10*60*1000)-Date.now())/1000));
      const m=String(Math.floor(rem/60)).padStart(2,'0'),s=String(rem%60).padStart(2,'0');
      el.textContent=m+':'+s;
      if(rem===0){clearInterval(dtTick2);endDoubleTrouble();}
    },1000);
  }
  const dtLaunchBtn=document.getElementById('dt-launch-btn');
  if(dtLaunchBtn){dtLaunchBtn.addEventListener('click',openDTIntro);}
  const dtResumeBtn=document.getElementById('dt-resume-btn');
  if(dtResumeBtn){dtResumeBtn.addEventListener('click',()=>openDTMissionsOverlay());}
  document.querySelectorAll('.sm-ok').forEach(btn=>btn.addEventListener('click',()=>completeSideMission(parseInt(btn.dataset.smidx),'reussi')));
  document.querySelectorAll('.sm-fail').forEach(btn=>btn.addEventListener('click',()=>completeSideMission(parseInt(btn.dataset.smidx),'echoue')));
  // Contract: launch buttons (per phase+index key)
  document.querySelectorAll('[data-claunch]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const key=btn.dataset.claunch,ci=parseInt(btn.dataset.ci);
      const c=ph.contracts[ci];
      openContractSelect(key,c);
    });
  });
  // Contract: live countdowns (one interval per active contract card)
  document.querySelectorAll('[data-ctimer]').forEach(el=>{
    const key=el.dataset.ctimer;
    const ctI=setInterval(()=>{
      const ct=S.contractTimers?.[key];
      const liveEl=document.querySelector(`[data-ctimer="${key}"]`);
      if(!liveEl||!ct||!ct.active){clearInterval(ctI);return;}
      const rem=Math.max(0,Math.ceil((ct.end-Date.now())/1000));
      const mm=String(Math.floor(rem/60)).padStart(2,'0'),ss=String(rem%60).padStart(2,'0');
      liveEl.textContent=mm+':'+ss;
      if(rem===0){clearInterval(ctI);renderGages();}
    },1000);
  });
  // Contract: claim buttons
  document.querySelectorAll('[data-cclaim]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const key=btn.dataset.cclaim;
      const ct=S.contractTimers?.[key];if(!ct)return;
      const isSynchroHands=ph.contracts.some((c,ci)=>(S.phase+'_'+ci)===key&&c.name.includes('Synchronisation'));
      if(isSynchroHands){
        S.nextGageMultiplier=1.5;save();
        bradMsg(`Contrat Synchronisation BRADDY3000 accompli par ${DISPLAY_NAMES[ct.p1]} et ${DISPLAY_NAMES[ct.p2]}. Le multiplicateur x1.5 est actif pour le prochain gage réussi. Bonne performance.`);
      } else {
        S.coins[R_KEYS[ct.p1]]=(S.coins[R_KEYS[ct.p1]]||0)+5;
        S.coins[R_KEYS[ct.p2]]=(S.coins[R_KEYS[ct.p2]]||0)+5;
        save();
        bradMsg(`Contrat accompli par ${DISPLAY_NAMES[ct.p1]} et ${DISPLAY_NAMES[ct.p2]}. +5 BC attribués à chacun.`);
      }
      S.contractTimers[key]={active:false};save();renderGages();renderBraddy();
    });
  });
}

function openContractSelect(key,contract){
  const isSynchroHands=contract.name.includes('Synchronisation');
  const duration=isSynchroHands?20*60*1000:5*60*1000;
  const durLbl=isSynchroHands?'20 minutes':'5 minutes';
  const ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;z-index:400;background:rgba(0,0,0,.96);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:30px;overflow-y:auto;';
  ov.innerHTML=`<p style="font-family:var(--orb);font-size:12px;color:var(--red2);letter-spacing:.3em;text-align:center">${contract.name.toUpperCase()}<br><span style="font-size:9px;opacity:.6">Sélectionner les 2 participants</span></p>
    <div id="cst-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%;max-width:300px">
      ${DISPLAY_NAMES.map((n,i)=>`<button class="cst-player" data-pidx="${i}" style="font-family:var(--orb);font-size:13px;padding:14px;border:1px solid rgba(204,0,0,.4);color:var(--white);background:rgba(0,0,0,.3)">${n}</button>`).join('')}
    </div>
    <p id="cst-hint" style="font-family:var(--mono);font-size:9px;color:rgba(255,255,255,.4);letter-spacing:.2em">Sélectionnez 2 joueurs</p>
    <button id="cst-go" disabled style="font-family:var(--orb);font-size:14px;font-weight:700;letter-spacing:.4em;padding:16px 50px;background:transparent;border:2px solid var(--red);color:var(--white);opacity:.4">GO !</button>
    <button id="cst-cancel" style="font-family:var(--mono);font-size:10px;color:rgba(255,255,255,.3);padding:8px;border:1px solid rgba(255,255,255,.1)">Annuler</button>`;
  document.body.appendChild(ov);
  let sel=[];
  ov.querySelectorAll('.cst-player').forEach(btn=>{btn.addEventListener('click',()=>{
    const idx=parseInt(btn.dataset.pidx);
    if(sel.includes(idx)){sel=sel.filter(i=>i!==idx);btn.style.background='rgba(0,0,0,.3)';btn.style.borderColor='rgba(204,0,0,.4)';}
    else if(sel.length<2){sel.push(idx);btn.style.background='rgba(204,0,0,.25)';btn.style.borderColor='var(--red)';}
    const go=ov.querySelector('#cst-go');if(sel.length===2){go.disabled=false;go.style.opacity='1';ov.querySelector('#cst-hint').textContent=`${DISPLAY_NAMES[sel[0]]} & ${DISPLAY_NAMES[sel[1]]}`;}
    else{go.disabled=true;go.style.opacity='.4';ov.querySelector('#cst-hint').textContent='Sélectionnez 2 joueurs';}
  });});
  ov.querySelector('#cst-go').addEventListener('click',()=>{
    if(sel.length!==2)return;
    const end=Date.now()+duration;
    if(!S.contractTimers)S.contractTimers={};
    S.contractTimers[key]={active:true,p1:sel[0],p2:sel[1],end,start:Date.now()};save();
    ov.remove();renderGages();
    const actionTxt=isSynchroHands?'rester main dans la main':contract.name.includes('Satellite')?'rester a moins de 2 metres l\'un de l\'autre':contract.name.includes('Prioritaire')?'terminer les phrases l\'un de l\'autre':'integrer le mot Serrano dans plusieurs conversations';
    bradMsg(`Contrat ${contract.name} lancé ! ${DISPLAY_NAMES[sel[0]]} et ${DISPLAY_NAMES[sel[1]]} doivent ${actionTxt} pendant ${durLbl}. Le BRADDY3000 surveille.`);
  });
  ov.querySelector('#cst-cancel').addEventListener('click',()=>ov.remove());
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
  // Special: Commande Controlee needs 2 wheels
  if(rCurrentGage.id==='p2g1'){
    S.pendingMission=null;save();
    openCommandeControlee(rWinnerIdx,rCurrentGage);
    return;
  }
  S.pool[S.phase]=(getPool(S.phase)).filter(id=>id!==rCurrentGage.id);
  addActiveGage(rCurrentGage.id,rWinnerIdx);
  save();renderGages();showPage('gages');
  setTimeout(()=>bradMsg(`Mission "${rCurrentGage.name}" attribuee a ${DISPLAY_NAMES[rWinnerIdx]}. Elle apparait dans la section "En cours".`),400);
}

function openCommandeControlee(clientIdx,gage,resumeOpIdx){
  const opPlayersFull=R_PLAYERS.map((p,i)=>({name:p,key:R_KEYS[i],color:R_COLORS[i],idx:i})).filter(pl=>pl.idx!==clientIdx);
  const ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;z-index:300;background:rgba(0,0,0,.96);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;overflow-y:auto;';
  ov.innerHTML=`<p style="font-family:var(--orb);font-size:11px;color:var(--red2);letter-spacing:.3em;text-align:center">COMMANDE CONTROLEE<br><span style="font-size:9px;opacity:.6">Attribution des roles</span></p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;width:100%;max-width:340px">
      <div style="text-align:center">
        <p style="font-family:var(--mono);font-size:9px;color:rgba(255,255,255,.4);letter-spacing:.25em;margin-bottom:6px">CLIENT<br>(choisit la taille)</p>
        <div style="border:2px solid rgba(0,255,65,.5);padding:14px;background:rgba(0,40,15,.3)"><p style="font-family:var(--orb);font-size:16px;font-weight:700;color:#00ff41">${DISPLAY_NAMES[clientIdx]}</p></div>
      </div>
      <div style="text-align:center">
        <p style="font-family:var(--mono);font-size:9px;color:rgba(255,255,255,.4);letter-spacing:.25em;margin-bottom:6px">OPERATEUR<br>(choisit le reste)</p>
        <div class="roll-wheel-wrap" style="margin:0">
          <div class="roll-ptr" style="font-size:16px">&#9660;</div>
          <canvas id="cc-cv" width="130" height="130" style="border-radius:50%;box-shadow:0 0 20px rgba(204,0,0,.4)"></canvas>
        </div>
        <p id="cc-op-name" style="font-family:var(--orb);font-size:14px;color:var(--red2);margin-top:6px;letter-spacing:.1em">?</p>
      </div>
    </div>
    <div id="cc-result" class="hidden" style="display:none;text-align:center">
      <p style="font-family:var(--mono);font-size:10px;color:rgba(255,255,255,.5);letter-spacing:.2em">Attribution confirmee</p>
      <button id="cc-start" style="font-family:var(--orb);font-size:12px;font-weight:700;letter-spacing:.3em;padding:14px 40px;background:rgba(204,0,0,.2);border:2px solid var(--red);color:var(--white);margin-top:12px">&#8627; COMMENCER LA MISSION</button>
    </div>`;
  document.body.appendChild(ov);

  function showResult(op){
    document.getElementById('cc-op-name').textContent=op.name.toUpperCase();
    const res=document.getElementById('cc-result');if(res)res.style.display='block';
    // Persist both names immediately, whichever button is pressed later
    S.pendingCC={gageId:gage.id,clientIdx,opIdx:op.idx};save();
    document.getElementById('cc-start').addEventListener('click',()=>{
      S.pool[S.phase]=(getPool(S.phase)).filter(id=>id!==gage.id);
      addActiveGage(gage.id,clientIdx);
      S.pendingCC=null;save();
      ov.remove();renderGages();showPage('gages');
      bradMsg(`Commande Controlee : ${DISPLAY_NAMES[clientIdx]} est le CLIENT (choisit uniquement la taille). ${op.name} est l'OPERATEUR (choisit le reste du repas). Le BRADDY3000 observe la chaine de commandement.`);
    });
    const ccFermer=document.createElement('button');ccFermer.textContent='← Fermer';ccFermer.style.cssText='font-family:var(--mono);font-size:10px;color:rgba(255,255,255,.3);padding:8px 24px;border:1px solid rgba(255,255,255,.1);margin-top:8px;display:block;';
    ccFermer.onclick=()=>{ov.remove();renderGages();showPage('gages');};
    ov.appendChild(ccFermer);
  }

  if(resumeOpIdx!==undefined&&resumeOpIdx!==null){
    // Resume directly with saved operator - skip spin animation
    const op=opPlayersFull.find(p=>p.idx===resumeOpIdx)||opPlayersFull[0];
    drawRoulette(0,opPlayersFull,document.getElementById('cc-cv'));
    showResult(op);
    return;
  }

  let ccAngle=0;
  const n=opPlayersFull.length,seg=2*Math.PI/n,tgt=Math.floor(Math.random()*n);
  const tBase=(n-tgt)*seg,tot=tBase+(4+Math.floor(Math.random()*2))*2*Math.PI;
  const dur=3000,t0=performance.now();
  (function anim(now){
    const t=Math.min((now-t0)/dur,1);
    ccAngle=(1-Math.pow(1-t,4))*tot;
    drawRoulette(ccAngle,opPlayersFull,document.getElementById('cc-cv'));
    if(t<1){requestAnimationFrame(anim);}
    else{
      flash(150,true);beep(660,.3,.1);
      showResult(opPlayersFull[tgt]);
    }
  })(performance.now());
}

/* BONUS UTILITY (on active gages) */
function applyRefaireRoue(agIdx){
  const ag=S.activeGages[agIdx];if(!ag)return;
  const pk=R_KEYS[ag.playerIdx];
  const available=getPool(ag.phase).filter(id=>id!==ag.gageId).map(id=>getGageById(id)).filter(Boolean);
  if(!available.length){bradMsg("Plus de gages disponibles pour Refaire la roue.");return;}
  S.coins[pk]-=20;S.stock.refaireRoue[pk]--;
  const cancelled=ag.gageId;
  returnToPool(ag.phase,cancelled);
  S.activeGages.splice(agIdx,1);save();
  bradAnalyze(()=>openGageWheel(available,ag.playerIdx,cancelled,ag.phase));
}

let gwAngle=0,gwSpinning=false;
function openGageWheel(gages,playerIdx,excludeId,phase){
  const ol=document.getElementById('gw-ol');if(!ol)return;
  ol.classList.remove('hidden');
  document.getElementById('gw-result').classList.add('hidden');
  gwAngle=0;gwSpinning=false;
  const colors=['#5a0000','#380000','#7a0000','#440000','#621000','#2d1000'];
  function drawGageWheel(angle,gs){
    const cv=document.getElementById('gw-cv');if(!cv)return;
    const ctx=cv.getContext('2d'),W=cv.width,H=cv.height,cx=W/2,cy=H/2,r=Math.min(W,H)*.44,n=gs.length;
    ctx.clearRect(0,0,W,H);
    const seg=2*Math.PI/n;
    for(let i=0;i<n;i++){
      const sA=angle-Math.PI/2+i*seg-seg/2,eA=sA+seg,mA=sA+seg/2;
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,sA,eA);ctx.closePath();
      ctx.fillStyle=colors[i%colors.length];ctx.fill();ctx.strokeStyle='rgba(204,0,0,.8)';ctx.lineWidth=2;ctx.stroke();
      const name=gs[i].name.length>12?gs[i].name.slice(0,11)+'.':gs[i].name;
      const tx=cx+Math.cos(mA)*r*.58,ty=cy+Math.sin(mA)*r*.58;
      ctx.save();ctx.translate(tx,ty);ctx.rotate(mA+Math.PI/2);
      ctx.fillStyle='rgba(255,255,255,.9)';ctx.font='bold 8px monospace';ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText(name,0,0);ctx.restore();
    }
    ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.strokeStyle='#cc0000';ctx.lineWidth=3;ctx.stroke();
    ctx.beginPath();ctx.arc(cx,cy,13,0,Math.PI*2);ctx.fillStyle='#000';ctx.fill();ctx.strokeStyle='#cc0000';ctx.lineWidth=2;ctx.stroke();
  }
  drawGageWheel(gwAngle,gages);
  // auto-spin
  const n=gages.length,tgt=Math.floor(Math.random()*n),seg=2*Math.PI/n;
  const tBase=(n-tgt)*seg;
  const tot=tBase+(4+Math.floor(Math.random()*2))*2*Math.PI;
  const dur=3500+Math.random()*1000,t0=performance.now();
  (function anim(now){
    const t=Math.min((now-t0)/dur,1);
    gwAngle=(1-Math.pow(1-t,4))*tot;
    drawGageWheel(gwAngle,gages);
    if(t<1){requestAnimationFrame(anim);}
    else{
      gwSpinning=false;drawGageWheel(gwAngle,gages);
      const chosen=gages[tgt];
      S.pool[phase]=(getPool(phase)).filter(id=>id!==chosen.id);
      addActiveGage(chosen.id,playerIdx);save();
      flash(200,true);beep(880,.3,.1);
      document.getElementById('gw-winner-name').textContent=chosen.name.toUpperCase();
      document.getElementById('gw-winner-desc').textContent=chosen.desc;
      document.getElementById('gw-result').classList.remove('hidden');
      document.getElementById('gw-close-btn').onclick=()=>{ol.classList.add('hidden');renderGages();bradMsg(`Nouveau gage : "${chosen.name}" — ${DISPLAY_NAMES[playerIdx]} prend le relais.`);};
    }
  })(performance.now());
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
  if(!available.length){bradMsg("Plus de gages secondaires disponibles. Le stock est epuise.");return;}
  const ol=document.getElementById('sg-ol');
  ol.classList.remove('hidden');
  document.getElementById('sg-status').textContent='';
  document.getElementById('sg-confirm-btn').classList.add('hidden');
  document.getElementById('sg-close').style.display='';
  const stopBtn=document.getElementById('sg-stop-btn');
  if(stopBtn){stopBtn.style.display='block';stopBtn.disabled=false;}
  const cardsEl=document.getElementById('sg-cards');
  cardsEl.innerHTML='';
  const toShow=available.slice(0,4);
  toShow.forEach(sg=>{
    const d=document.createElement('div');d.className='sg-card';
    d.innerHTML=`<div class="sg-front"><div class="sg-front-icon">?</div></div><div class="sg-back"><div class="sg-back-name">${sg.name}</div><div class="sg-back-desc">${sg.desc}</div><div class="sg-back-bc">+${sg.bc} BC</div></div>`;
    cardsEl.appendChild(d);
  });
  const cards=cardsEl.querySelectorAll('.sg-card');
  const cursor=document.getElementById('sg-cursor');
  let curIdx=0,dir=1,scanning=true,stopped=false,chosen=null;
  cursor.style.opacity='1';
  function moveCursor(){
    cards.forEach((c,i)=>c.classList.toggle('sg-active',i===curIdx));
    const card=cards[curIdx];if(!card)return;
    const cr=card.getBoundingClientRect(),wr=cardsEl.getBoundingClientRect();
    cursor.style.left=(cr.left-wr.left+cr.width/2-8)+'px';
  }
  let speed=80;
  function scan(){
    if(!scanning)return;moveCursor();
    curIdx+=dir;
    if(curIdx>=toShow.length){curIdx=toShow.length-2;dir=-1;}
    if(curIdx<0){curIdx=1;dir=1;}
    setTimeout(scan,speed);
  }
  scan();
  // STOP button
  const doStop=()=>{
    if(stopped)return;stopped=true;scanning=false;
    if(stopBtn)stopBtn.disabled=true;
    const targetIdx=Math.floor(Math.random()*toShow.length);
    let slowIdx=curIdx,slowDir=dir,slowSpeed=120;
    function slowScan(){
      moveCursor();
      if(slowIdx===targetIdx&&slowSpeed>450){
        cursor.style.opacity='0';
        cards[targetIdx].classList.add('sg-flipped');
        beep(660,.6,.12,'sine');flash(100);
        chosen=toShow[targetIdx];
        document.getElementById('sg-status').textContent=`Gage secondaire : ${chosen.name}`;
        setTimeout(()=>{
          document.getElementById('sg-confirm-btn').classList.remove('hidden');
          document.getElementById('sg-close').style.display='none';
          if(stopBtn)stopBtn.style.display='none';
          document.getElementById('sg-confirm-btn').onclick=()=>{
            if(!S.usedSgIds)S.usedSgIds=[];S.usedSgIds.push(chosen.id);
            S.pool[S.phase]=(getPool(S.phase)).filter(id=>id!==chosen.id);
            addActiveGage(chosen.id,playerIdx);save();
            ol.classList.add('hidden');renderGages();
            if(chosen.id==='sg3'){bradMsg('Pronostic en attente. Quand le participant obtient le score, ecrivez-le ici (ex: France 2 - 1 Italie).');}
            else{bradMsg(`Gage secondaire "${chosen.name}" assigne a ${DISPLAY_NAMES[playerIdx]}. Le BRADDY3000 observe.`);}
          };
        },1500);
        return;
      }
      slowIdx+=slowDir;
      if(slowIdx>=toShow.length){slowIdx=toShow.length-2;slowDir=-1;}
      if(slowIdx<0){slowIdx=1;slowDir=1;}
      curIdx=slowIdx;slowSpeed=Math.min(slowSpeed+35,600);
      setTimeout(slowScan,slowSpeed);
    }
    slowScan();
  };
  if(stopBtn)stopBtn.onclick=doStop;
  document.getElementById('sg-close').onclick=()=>{scanning=false;stopped=true;cursor.style.opacity='0';if(stopBtn)stopBtn.style.display='none';ol.classList.add('hidden');renderGages();};
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
      applyEventEffect(chosen.id);
    }
  })(performance.now());
}

function applyEventEffect(evId){
  if(evId==='ev1'){S.brouillageEnd=Date.now()+10*60*1000;save();setTimeout(()=>bradMsg("BROUILLAGE ACTIF. Pendant 10 minutes, tous les BC gagnes sont doubles. Profitez-en."),200);}
  else if(evId==='ev2'){setTimeout(()=>bradMsg("TRANSMISSION PRIORITAIRE. Contrat BRADDY3000 — Synchronisation immediatement active. Deux participants doivent se tenir la main pendant 20 minutes. Maintenant."),200);}
  else if(evId==='ev3'){S.primeNext=(S.primeNext||0)+10;save();setTimeout(()=>bradMsg("PRIME EXCEPTIONNELLE enregistree. Le prochain gage reussi rapportera +10 BC bonus. Le BRADDY3000 est genereux. Rarement, mais c'est le cas."),200);}
  else if(evId==='ev4'){glitchSnd(.2);shake(3,1000);setTimeout(()=>bradMsg("DONNEES CORROMPUES. Le classement affiche pourrait etre temporairement inexact. Le score reel, lui, ne change pas."),200);}
  else if(evId==='ev5'){const pool=getPool(S.phase);const nextG=pool.length?getGageById(pool[0]):null;setTimeout(()=>bradMsg(nextG?`ANALYSE ACCELEREE. Prochain gage disponible : "${nextG.name}". Vous etes en avance sur le programme.`:"ANALYSE ACCELEREE. Aucun gage disponible a reveler dans cette phase."),200);}
  else if(evId==='ev6'){setTimeout(()=>bradMsg("MISSION SURPRISE. Les 4 agents doivent choisir une danse TikTok et l'executer ensemble. Duree minimale : 15 secondes. La honte est optionnelle mais recommandee par le BRADDY3000."),200);}
  else if(evId==='ev7'){S.bradLostUntil=Date.now()+3*60*1000;save();setTimeout(()=>bradMsg("...je suis Brad. Ou peut-etre pas. Le BRADDY3000 semble avoir oublie quelque chose. Je vous contacterai quand j'aurai resolu le probleme."),200);}
  else if(evId==='ev8'){S.glitchModeUntil=Date.now()+90*1000;save();glitchSnd(.25);let gc=0;const gi=setInterval(()=>{if(Date.now()>S.glitchModeUntil||gc>15){clearInterval(gi);document.body.style.transform='';return;}shake(Math.random()*6+2,150+Math.random()*200);glitchSnd(.15);if(Math.random()>.5)flash(40+Math.random()*80,Math.random()>.5);gc++;},3000+Math.random()*4000);setTimeout(()=>bradMsg("PARASITES DETECTES. Recalibration en cours... Aucun impact sur le gameplay. Le BRADDY3000 resist. En principe."),200);}
}

/* MISSION PARALLELE (anciennement Double Tirage) */
function openMissionParallele(payerKey){
  if(!S.sideMissions)S.sideMissions=[];if(!S.usedSMIds)S.usedSMIds=[];
  const available=SIDE_MISSIONS.filter(sm=>!S.usedSMIds.includes(sm.id));
  if(!available.length){bradMsg("Plus de missions annexes disponibles. Toutes ont ete assignees.");return;}
  const mission=available[Math.floor(Math.random()*available.length)];
  S.usedSMIds.push(mission.id);
  const payerIdx=R_KEYS.indexOf(payerKey);
  const bc=smBC(mission.id);
  S.sideMissions.push({missionId:mission.id,missionDesc:mission.desc,playerIdx:payerIdx,status:'active',bc});
  save();renderGages();
  bradAnalyze(()=>{bradMsg(`Analyse terminee. Une donnee supplementaire semble necessaire. Mission parallele transmise a ${DISPLAY_NAMES[payerIdx]} : "${mission.desc}" — +${bc} BC si reussie.`);});
}

/* IMPOSER UNE MISSION (anciennement Imposer un Gage) */
function openImposerMission(){
  if(!S.sideMissions)S.sideMissions=[];if(!S.usedSMIds)S.usedSMIds=[];
  const available=SIDE_MISSIONS.filter(sm=>!S.usedSMIds.includes(sm.id));
  if(!available.length){bradMsg("Plus de missions annexes disponibles.");return;}
  const ol=document.getElementById('imposer-ol');ol.classList.remove('hidden');
  document.getElementById('imposer-step1').classList.remove('hidden');
  document.getElementById('imposer-step2').classList.add('hidden');
  const grid=document.getElementById('imposer-players');
  grid.innerHTML=DISPLAY_NAMES.map((n,i)=>`<button class="imposer-player-btn" data-pidx="${i}">${n}</button>`).join('');
  grid.querySelectorAll('.imposer-player-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const targetIdx=parseInt(btn.dataset.pidx);
      const avail2=SIDE_MISSIONS.filter(sm=>!S.usedSMIds.includes(sm.id));
      if(!avail2.length){ol.classList.add('hidden');bradMsg("Plus de missions annexes disponibles.");return;}
      const mission=avail2[Math.floor(Math.random()*avail2.length)];
      S.usedSMIds.push(mission.id);
      const bc=smBC(mission.id);
      S.sideMissions.push({missionId:mission.id,missionDesc:mission.desc,playerIdx:targetIdx,status:'active',bc});
      save();ol.classList.add('hidden');renderGages();
      bradMsg(`Mission annexe imposee a ${DISPLAY_NAMES[targetIdx]} : "${mission.desc}" — +${bc} BC si reussie.`);
    });
  });
}

/* BONUS MENU — CHAOS ROUTING */
function getAvailableBonuses(phase){
  if(phase===3)return['declencherEvenement'];
  if(phase===4)return['refaireRoue','declencherEvenement'];
  if(phase===5)return['gageSecondaire','laisserPasser','doubleTimbre','imposerGage','declencherEvenement'];
  return['gageSecondaire','refaireRoue','laisserPasser','doubleTimbre','imposerGage','declencherEvenement'];
}
function openBonus(id){
  const avail=getAvailableBonuses(S.phase);
  if(!avail.includes(id)){bradMsg(`Ce bonus n'est pas disponible en Phase ${S.phase}. Brad s'y oppose formellement.`);return;}
  const chaosIds=['doubleTimbre','imposerGage','declencherEvenement'];
  if(chaosIds.includes(id)){
    // Chaos: need player to pay first via existing player select page
    curBonus=id;selPl=null;
    const info=BONUS_INFO[id];
    document.getElementById('bd-title').textContent=info.title;
    document.getElementById('bd-desc').textContent=info.desc;
    const baseCost=CFG.costs[id]?.hippolyte||0;
    ['hippolyte','teo','nathanael'].forEach(p=>{
      const stock=S.stock[id]?.[p]??0,coins=S.coins[p]||0;
      document.getElementById('cost-'+p).textContent=`${coins} BC`;
      const btn=document.querySelector(`.player-btn[data-player="${p}"]`);
      if(btn){btn.classList.remove('selected');btn.style.opacity=(stock>0&&coins>=baseCost)?'1':'.4';}
    });
    document.getElementById('bd-stock').textContent=`Cout : ${baseCost} BC — Stock : H:${S.stock[id]?.hippolyte??0} / T:${S.stock[id]?.teo??0} / N:${S.stock[id]?.nathanael??0}`;
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

const BONUS_INFO={gageSecondaire:{title:'Gage secondaire',desc:'Un gage de secours si celui actuel ne convient pas. Visible sur la carte de gage active.'},refaireRoue:{title:'Refaire la roue',desc:'Retirer un nouveau gage. Visible sur la carte de gage active.'},laisserPasser:{title:'Laisser Passer',desc:'Ignorer un gage sans penalite. Visible sur la carte de gage active.'},doubleTimbre:{title:'Mission Parallele',desc:'Attribue une mission annexe aleatoire en parallele de votre gage principal. +5 BC si reussie.'},imposerGage:{title:'Imposer une Mission',desc:'Assigne une mission annexe aleatoire a un autre joueur. +5 BC si reussie.'},declencherEvenement:{title:'Declencher un evenement',desc:'Active un evenement special via une roue dedicee.'}};
let curBonus=null,selPl=null;
function selPlayer(p){if(!curBonus)return;const cost=CFG.costs[curBonus]?.[p]||0,stock=S.stock[curBonus]?.[p]??0,coins=S.coins[p]||0;if(stock<=0||coins<cost)return;selPl=p;document.querySelectorAll('.player-btn').forEach(b=>b.classList.remove('selected'));document.querySelector(`.player-btn[data-player="${p}"]`)?.classList.add('selected');const names={hippolyte:'Hippolyte',nathanael:'Nathanael',teo:'Teo'};document.getElementById('purch-name').textContent=names[p];document.getElementById('purchase-confirm').classList.remove('hidden');document.getElementById('purch-feedback').classList.add('hidden');}
function confirmPurch(){
  if(!curBonus||!selPl)return;
  const baseCost=CFG.costs[curBonus]?.hippolyte||0,stock=S.stock[curBonus]?.[selPl]??0;
  if(stock<=0){showFb('Stock epuise.',true);return;}
  if((S.coins[selPl]||0)<baseCost){showFb('BittCoins insuffisants.',true);return;}
  S.coins[selPl]-=baseCost;S.stock[curBonus][selPl]--;save();
  document.getElementById('purchase-confirm').classList.add('hidden');
  goBack();
  if(curBonus==='doubleTimbre'){openMissionParallele(selPl);}
  else if(curBonus==='imposerGage'){bradAnalyze(()=>openImposerMission());}
  else if(curBonus==='declencherEvenement'){bradAnalyze(()=>openEvenementOverlay());}
}
function cancelPurch(){selPl=null;document.getElementById('purchase-confirm').classList.add('hidden');document.querySelectorAll('.player-btn').forEach(b=>b.classList.remove('selected'));}
function showFb(msg,err){const el=document.getElementById('purch-feedback');el.textContent=msg;el.className=err?'err':'ok';el.classList.remove('hidden');}

function openMission(gage,playerIdx){
  S.pool[S.phase]=(getPool(S.phase)).filter(id=>id!==gage.id);
  addActiveGage(gage.id,playerIdx);save();renderGages();showPage('gages');
}

/* APP INIT */
function initApp(){try{
  initAudio();document.addEventListener('click',()=>{if(AC&&AC.state==='suspended')AC.resume();});
  initPool();startClock();startBradStatus();initMap();renderGages();renderBraddy();renderDossiers();updateBadge();
  checkDTResumeOnLoad();
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
  document.getElementById('roll-close-btn').addEventListener('click',()=>{
    if(rWinnerIdx>=0&&rCurrentGage){
      S.pool[S.phase]=(getPool(S.phase)).filter(id=>id!==rCurrentGage.id);
      addActiveGage(rCurrentGage.id,rWinnerIdx);save();renderGages();
    }
    document.getElementById('roulette-ol').classList.add('hidden');
  });
  document.getElementById('ev-spin-btn').addEventListener('click',spinEventWheel);
  document.getElementById('ev-close-btn').addEventListener('click',()=>document.getElementById('ev-ol').classList.add('hidden'));
  document.getElementById('dt2-spin-btn').addEventListener('click',spinDoubleTimbre);
  document.getElementById('dt2-close-btn').addEventListener('click',()=>{document.getElementById('dt2-ol').classList.add('hidden');renderGages();});
  document.getElementById('dt2-cancel-btn').addEventListener('click',()=>document.getElementById('dt2-ol').classList.add('hidden'));
  document.getElementById('imposer-close').addEventListener('click',()=>document.getElementById('imposer-ol').classList.add('hidden'));
  showPage(S.lastView||'home');
}catch(e){console.error('initApp crash:',e);}}

/* NAV */
let navStack=['home'];
function nav(to){navStack.push(to);showPage(to);}
function goBack(){if(navStack.length>1)navStack.pop();showPage(navStack[navStack.length-1]);}
function showPage(name){document.querySelectorAll('.page').forEach(p=>p.classList.remove('on'));const p=document.getElementById('page-'+name);if(p)p.classList.add('on');document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.nav===name));S.lastView=name;save();if(name==='chat'){S.chatBadge=0;save();updateBadge();setTimeout(()=>{const m=document.getElementById('chat-msgs');if(m)m.scrollTop=m.scrollHeight;},80);}if(name==='home'){setTimeout(()=>{const w=document.getElementById('map-wrap');if(w&&w.offsetHeight>0)drawMap();},80);}}

function enterApp(){S.introComplete=true;save();document.getElementById('yt-frame').src='about:blank';document.querySelectorAll('.ph').forEach(p=>p.classList.remove('on'));document.getElementById('app').classList.add('show');initApp();}

/* BRADDY3000 */
function renderBraddy(){const b=document.getElementById('braddy-body'),ph=S.phase,dc=ph*20,ka=ph===0?3:Math.min(3+ph*18,97),rl=Math.floor(Math.random()*25+ph*10+20);b.innerHTML=`<div class="stat-block"><div class="stat-label">DONNÉES COLLECTÉES</div><div class="stat-bar-wrap"><div class="stat-bar" style="width:${dc}%"></div></div><div class="stat-value-row"><div class="stat-val">${dc}<span style="font-size:.6em;opacity:.5">%</span></div><div class="stat-unit">PHASE ${ph}/5</div></div></div><div class="stat-block"><div class="stat-label">LOCALISATION KIRBY 67</div><div class="stat-bar-wrap"><div class="stat-bar yellow" style="width:${ka}%"></div></div><div class="stat-value-row"><div class="stat-val">${ka}<span style="font-size:.6em;opacity:.5">%</span></div><div class="stat-unit">PRÉCISION</div></div></div><div class="stat-block"><div class="stat-label">FIABILITÉ DU BRADDY3000</div><div class="stat-bar-wrap"><div class="stat-bar green" style="width:${rl}%"></div></div><div class="stat-value-row"><div class="stat-val">${rl}<span style="font-size:.6em;opacity:.5">%</span></div><div class="stat-unit">ESTIMÉ</div></div></div><div class="fun-stat"><div>> Température du grille-pain de Brad : <span>42°C</span></div><div>> Niveau de sérieux : <span>3%</span></div><div>> Charabia généré : <span>${Math.floor(Math.random()*999)+100} TB</span></div><div>> Taux de bradification : <span>94.7%</span></div><div>> Grille-pains détectés : <span>1 (perdu)</span></div><div>> Probabilité que tout se passe bien : <span>incalculable</span></div></div>`;}

/* PHASE MANAGEMENT */
function advancePhase(n){if(n<=S.phase)return;S.phase=n;S.phaseExcluded=[];S.waitingForOui=false;S.doneDT=false;S.phase1Complete=false;const coins=CFG.phaseCoins[n]||0;Object.keys(S.coins).forEach(p=>S.coins[p]+=coins);save();initPool();initMap();renderGages();renderBraddy();renderDossiers();const msgs=['','Phase 1 initialisée. Données en réception. Bonne chance.','Phase 2 débloquée. Votre progression est acceptable.','Phase 3 active. Attention, rupture narrative imminente.','Phase 4 critique. Contrats BRADDY3000 prioritaires.','Phase 5 — Ultime. Le BRADDY3000 et moi-même vous regardons.'];if(msgs[n])setTimeout(()=>bradMsg(msgs[n]),500);}


/* DOSSIERS */
const DOSS={
  kirby67:{title:'Kirby 67',content:`<div class="class-tag">CLASSIFICATION : ALPHA-ROUGE</div><h3>IDENTIFICATION</h3><p>Kirby 67 est le double maléfique de Kirby 54, capturé lors de l'Edition II. Niveau de malveillance : 94% selon le BRADDY3000.</p><h3>DERNIÈRE LOCALISATION</h3><p>Ville de Lille — signal perdu lors de son évasion.</p><h3>MOTIVATIONS</h3><p>Kirby 67 parle obsessionnellement d'un "Monde au Serrano".</p><p class="warn">NE PAS mentionner le Serrano en sa présence.</p><h3>NOTE DE BRAD BITT</h3><p class="warn">Si vous le trouvez, ne le nourrissez pas. Et surtout pas de Serrano.</p>`},
  bb:{title:'Brad Bitt',content:`<div class="class-tag">CLASSIFICATION : CONFIDENTIEL</div><h3>IDENTITÉ</h3><p>Brad Bitt est le superviseur officiel de l'Opération Never 2 sans 3, Edition III. Fondateur de la Brad Corporation et inventeur du BRADDY3000. Son vrai prénom reste un mystère. Même pour lui.</p><h3>PERSONNALITÉ</h3><p>Sérieux en toutes circonstances, sauf quand il ne l'est pas. Ce qui arrive souvent. Porte des lunettes de soleil à l'intérieur. Obsédé par la raclette.</p><h3>CITATION OFFICIELLE</h3><p class="warn">"Je ne suis pas là pour rigoler. Si. Un peu."</p>`},
  b3k:{title:'BRADDY3000',content:`<div class="class-tag">CLASSIFICATION : TECHNOLOGIE AVANCÉE</div><h3>DESCRIPTION</h3><p>Le BRADDY3000 est un système de surveillance et d'analyse développé par la Brad Corporation. Fiabilité estimée : entre 3% et 98% selon les circonstances. Les ingénieurs travaillent encore sur le problème.</p><h3>FONCTIONNALITÉS</h3><p>Localisation de Kirby 67. Attribution des gages. Calcul des Brad Coins. Surveillance des agents. Compilation de données absurdes.</p><h3>AVERTISSEMENT</h3><p class="warn">Le BRADDY3000 n'est pas responsable de ses propres décisions.</p>`},
  inc:{title:'Incidents précédents',content:`<div class="class-tag">CLASSIFICATION : ARCHIVES EDITION I & II</div><h3>EDITION I</h3><p>Kirby 54 capturé après une série de gages légendaires. L'incident de la raclette en juillet est classifié. Le grille-pain de Brad a été perdu ce jour-là. Il n'a jamais été retrouvé.</p><h3>EDITION II</h3><p>Evasion de Kirby 67. Deux agents ont été contraints de porter des tenues choisies par le groupe pendant 3 heures. Le BRADDY3000 a crashé deux fois. Brad nie.</p><h3>NOTE</h3><p class="warn">Les détails exacts sont classifiés. Ce que vous ne savez pas ne peut pas vous blesser. En principe.</p>`},
  arc:{title:'Archives',content:`<div class="class-tag">CLASSIFICATION : ULTRA SECRET</div><h3>CONTENU</h3><p>Ces archives contiennent l'intégralité des données collectées lors des trois éditions de l'Opération Never 2 sans 3. Scores finaux, incidents, contrats BRADDY3000 et données sensibles sur Kirby 67.</p><h3>ACCÈS</h3><p>Réservé aux agents ayant atteint la Phase 5. Le BRADDY3000 surveille les tentatives d'accès non autorisées.</p><p class="warn">Toute divulgation à des tiers — notamment à Kirby 67 — est strictement interdite.</p>`}
};
function renderDossiers(){
  const l=document.getElementById('dossiers-list');
  const rows=[
    {id:'kirby67',name:'Kirby 67',u:true},
    {id:'bb',name:'Brad Bitt',u:S.phase>=1},
    {id:'b3k',name:'BRADDY3000',u:S.phase>=2},
    {id:'inc',name:'Incidents précédents',u:S.phase>=3},
    {id:'arc',name:'Archives',u:S.phase>=5}
  ];
  l.innerHTML=rows.map(d=>`<div class="dossier-row ${d.u?'unlocked':'locked'}" ${d.u?`data-dos="${d.id}"`:''}><span class="dossier-name">${d.name}</span><span class="dossier-badge ${d.u?'open':'closed'}">${d.u?'DÉBLOQUÉ':'&#128274; ACCÈS REFUSÉ'}</span></div>`).join('');
  document.querySelectorAll('.dossier-row.unlocked').forEach(r=>r.addEventListener('click',()=>{const d=DOSS[r.dataset.dos];if(!d)return;document.getElementById('dd-title').textContent=d.title;document.getElementById('dd-body').innerHTML=d.content;nav('dossier-detail');}));
}


/* CHAT */
const RESPONSES={
  kirby:["Excellente question. J'aimerais egalement le savoir.","Kirby 67 est quelque part. Le BRADDY3000 analyse. Patiemment.","Notre cible est insaisissable. Comme moi, mais en plus petit et en plus violet.","Le BRADDY3000 a enregistre 47 signaux suspects ce matin. 46 etaient des grille-pains. Le 47e restait flou."],
  mission:["Si je vous le disais, ce ne serait plus une mission.","Les missions se revelent d'elles-memes. Comme moi, d'ailleurs.","La mission est claire. Ou presque. Le BRADDY3000 affine encore.","Une mission Brad Corporation n'est jamais simple. C'est une fonctionnalite, pas un bug."],
  gage:["Chaque gage accompli rapproche le BRADDY3000 de la verite.","Le gage est votre destinee. Embrassez-la.","Les gages sont sacres. Presque autant que la raclette.","Le BRADDY3000 observe. Toujours. Meme quand vous pensez qu'il ne regarde pas."],
  bonjour:["Ah. Vous voila.","Salutations. Je vous attendais.","Je savais que vous repasseriez. Le BRADDY3000 avait calcule une probabilite de 94.7%.","Bonsoir. Ou bonjour. Le temps est une donnee secondaire pour le BRADDY3000."],
  salut:["Salut. Revenons aux affaires.","Hmm. Salut. Votre enthousiasme me touche.","Salutations informelles enregistrees. Le BRADDY3000 prefere le 'Bonjour monsieur Bitt' mais je m'adapte."],
  serrano:["Ne. Prononcez. Pas. Ce. Mot.","...Je vous surveille.","ERREUR — mot interdit detecte. Le BRADDY3000 a failli s'effondrer.","Ce mot est classe confidentiel niveau rouge. Merci de votre comprehension."],
  grille:["Mon grille-pain est temporairement indisponible.","Ce sujet est classe confidentiel niveau grille-pain.","Le grille-pain de Brad Corporation fait l'objet d'une enquete interne. Je n'ai rien a dire."],
  brad:["C'est moi.","Vous avez mentionne mon nom. Je suis mefiant.","Brad Bitt — present, comme toujours. Contrairement a Kirby 67.","Je suis Brad. Bitt. Sans le second T. Enfin si, avec. C'est complique."],
  merci:["Le BRADDY3000 prend note de votre gratitude.","De rien. C'est mon metier. Enfin, un de mes metiers.","Votre reconnaissance est enregistree. Elle sera conservee pendant 72h puis effacee. Brad Corporation, RGPD."],
  raclette:["Sujet delicat. Continuons.","Le BRADDY3000 enregistre votre interet culinaire.","La raclette est une affaire serieuse. Ne la traitez pas a la legere.","La raclette est un sujet de securite nationale. Je prefere ne pas elaborer."],
  coin:["Les Brad Coins sont une monnaie reconnue dans 0 pays. C'est une exclusivite.","Le BRADDY3000 recommande la richesse.","Vous possedez probablement moins de Brad Coins que Brad Bitt. Je ne confirme pas le montant.","Un Brad Coin vaut exactement un Brad Coin. Ne cherchez pas a convertir."],
  coupe:["Je pense que c'est moi, oui, je me sens equipe de foot de temps en temps.","Kirby 67 supporte la mauvaise equipe. C'est tout ce que je dirai.","Le BRADDY3000 a analyse les stats. Je ne suis pas autorise a divulguer les resultats."],
  foot:["Je me sens equipe de foot de temps en temps, oui.","Football ? Le BRADDY3000 prefere les sports ou on porte des lunettes.","Je joue en position 'coach assis dans le BRADDY3000'. C'est une position tactique."],
  france:["Je vis a Lille depuis une duree indeterminee.","La France est un beau pays. Kirby 67 y est quelque part.","France — berceau de la raclette, du Serrano et de Brad Bitt. Deux de ces faits sont vrais."],
  ia:["Je suis Brad Bitt, pas une IA.","Le BRADDY3000 est offense par cette insinuation.","Techniquement je suis... non. Non, rien. Passez votre chemin.","Si j'etais une IA, est-ce que j'aurais des avis sur la raclette ? Ne repondez pas a ca."],
  chatgpt:["Qui ? Je ne connais pas cette personne.","ChatGPT ne recherche pas Kirby 67. Moi si. Decidez vous-memes qui est le plus utile.","Je ne commente pas la concurrence. C'est ma politique officielle."],
  fatigué:["Fatigue detecte. Le BRADDY3000 recommande de continuer quand meme.","La fatigue est une donnee subjective. Le BRADDY3000 ne fatigue jamais. Moi non plus. Enfin, presque."],
  hungry:["La faim est normale a ce stade de l'operation. Phase 2 approche."],
  faim:["La faim est une donnee biologique. Le BRADDY3000 la comprend mais ne peut rien y faire.","Phase 2 gere ce probleme. En principe."],
  perdu:["Perdu ? Le BRADDY3000 connait votre position. Enfin, a peu pres.","Ne vous perdez pas. Kirby 67 profite de la confusion."],
  chaud:["Temperature ambiante enregistree. Brad Corporation ne prend pas en charge la climatisation."],
  splatoon:["Je ne joue pas aux jeux video. Je suis en mission permanente.","Splatoon ? Le BRADDY3000 a analyse 3 Splatfests sans comprendre l'enjeu. Je m'en remets."],
  nintendo:["Nintendo. Connais pas. Sauf le BRADDY3000 Edition, qui n'existe pas encore."],
  oui:["Bien. Le BRADDY3000 enregistre votre accord.","Voila une reponse acceptable.","Oui. Parfait. Continuez dans cette direction."],
  non:["Le BRADDY3000 desapprouve. Legerement.","Non ? Le BRADDY3000 note votre rebellion.","Interessant. Non. Vous assumez."],
  pourquoi:["Excellente question. Brad Bitt n'a pas toujours de reponse.","Le BRADDY3000 traite votre 'pourquoi' depuis 4 minutes. Resultat : confus.","Parce que. C'est la reponse officielle de Brad Corporation."],
  aide:["Tapez /liste pour les commandes. Pour le reste, je suis la.","L'aide de Brad Bitt est gratuite. Ce qui est rare."],
  super:["Oui, je suis super. Merci de le noter.","Super. Le BRADDY3000 enregistre votre enthousiasme."],
  comment:["Le BRADDY3000 va bien. Relativement.","Bien. Enfin, 'bien' est un concept flou pour le BRADDY3000."],
  cool:["Cool est un terme que le BRADDY3000 evalue a 8.3/10.","Je suis cool. C'est factuel."],
  fnac:["La FNAC est une zone d'interet strategique pour la Phase 5. Le BRADDY3000 surveille les bornes de demonstration."],
  lille:["Ville cible de l'operation. Kirby 67 y est. Quelque part. On cherche.","Lille est une belle ville. Kirby 67 y a gache ca."],
};

const FALLBACK=["Interessant. Le BRADDY3000 prend note.","Hmm. Je n'ai pas de reponse claire a cela.","Le BRADDY3000 analyse votre message. Resultat : confus.","Votre message a ete recu, archive et partiellement incompris.","Je pourrais repondre. Mais je choisirais de ne pas le faire.","La reponse est 42. Ou peut-etre 67.","Notez que je ne suis pas un assistant. Je suis Brad Bitt.","Le BRADDY3000 a plante sur cette requete. Reessayez."];
function addUserMsg(txt){const m=document.getElementById('chat-msgs');const d=document.createElement('div');d.className='chat-msg';d.innerHTML=`<div class="msg-label">Vous</div><div class="msg-sep">—</div><div class="msg-text">${esc(txt)}</div>`;m.appendChild(d);m.scrollTop=m.scrollHeight;S.chatHistory.push({type:'user',text:txt});save();}
function bradMsg(txt){const m=document.getElementById('chat-msgs'),ty=document.getElementById('chat-typing');ty.classList.remove('hidden');m.scrollTop=m.scrollHeight;setTimeout(()=>{ty.classList.add('hidden');const d=document.createElement('div');d.className='chat-msg brad-msg';d.innerHTML=`<div class="msg-label brad pacifico">Brad Bitt</div><div class="msg-sep">—</div><div class="msg-text">${esc(txt)}</div>`;m.appendChild(d);m.scrollTop=m.scrollHeight;S.chatHistory.push({type:'brad',text:txt});const chatPg=document.getElementById('page-chat');if(!chatPg.classList.contains('on')){S.chatBadge=(S.chatBadge||0)+1;updateBadge();}save();},1000+txt.length*15);}
function renderHistory(){const m=document.getElementById('chat-msgs');m.innerHTML='';S.chatHistory.forEach(h=>{const d=document.createElement('div');if(h.type==='user'){d.className='chat-msg';d.innerHTML=`<div class="msg-label">Vous</div><div class="msg-sep">—</div><div class="msg-text">${esc(h.text)}</div>`;}else{d.className='chat-msg brad-msg';d.innerHTML=`<div class="msg-label brad pacifico">Brad Bitt</div><div class="msg-sep">—</div><div class="msg-text">${esc(h.text)}</div>`;}m.appendChild(d);});setTimeout(()=>m.scrollTop=m.scrollHeight,60);}
function updateBadge(){const b=document.getElementById('chat-badge');if(!b)return;b.textContent=S.chatBadge>0?S.chatBadge:'';b.style.display=S.chatBadge>0?'flex':'none';}
function addSysMsg(txt){const m=document.getElementById('chat-msgs');const d=document.createElement('div');d.className='chat-msg sys-msg';d.innerHTML=`<div class="msg-text">> ${esc(txt)}</div>`;m.appendChild(d);m.scrollTop=m.scrollHeight;}
function sendMsg(){const inp=document.getElementById('chat-inp');const txt=inp.value.trim();if(!txt)return;inp.value='';
  if(S.waitingForDelete){
    if(txt.toLowerCase()==='oui'){S.waitingForDelete=false;save();addUserMsg(txt);bradMsg("Tres bien. Je t'aurais prevenu. Lancement de la procedure de reinitialisation...");
    localStorage.removeItem('n2s3');
    setTimeout(launchResetAnimation,1800);return;}
    else{S.waitingForDelete=false;save();bradMsg("Reinitialisation annulee. Sage decision.");}
  }
  if(S.waitingForOui&&txt.toLowerCase()==='oui'){
    S.waitingForOui=false;save();addUserMsg(txt);
    setTimeout(()=>{advancePhase(1);bradMsg("Parfait. Que le chaos commence. De maniere organisee. En theorie. Le BRADDY3000 active la Phase 1. Bonne chance.");},500);
    return;
  }
  if(txt==='/admin.p1'){advancePhase(1);addSysMsg('Phase 1 deverouille.');return;}
  if(txt==='/admin.p2'){advancePhase(2);addSysMsg('Phase 2 deverouille.');return;}
  if(txt==='/admin.p3'){advancePhase(3);addSysMsg('Phase 3 deverouille.');return;}
  if(txt==='/admin.p4'){advancePhase(4);addSysMsg('Phase 4 deverouille.');return;}
  if(txt==='/admin.p5'){advancePhase(5);addSysMsg('Phase 5 deverouille.');return;}
  if(txt==='/admin.coins'){Object.keys(S.coins).forEach(p=>S.coins[p]+=5);save();addSysMsg('+5 BC pour tous.');return;}
  if(txt==='/admin.reset'){if(confirm('Reinitialiser ?')){localStorage.removeItem('n2s3');location.reload();}return;}
  if(txt==='/delete'){addUserMsg(txt);bradMsg("Oh Waouh. Tu es sur de vouloir faire ca ? Je veux dire... ca rigole pas ce genre de chose. Toutes les donnees. Les BradCoins. Les gages. Tout. Tape \"oui\" si tu es vraiment sur.");S.waitingForDelete=true;save();return;}
  if(txt==='/debug'){const ph=PHASES[Math.min(S.phase,5)];const ag=(S.activeGages||[]).map(a=>`${a.gageName}(${DISPLAY_NAMES[a.playerIdx]})`).join(', ')||'aucun';addSysMsg(`Phase ${S.phase} | H:${S.coins.hippolyte} T:${S.coins.teo} N:${S.coins.nathanael} BC`);addSysMsg(`Actifs : ${ag}`);addSysMsg(`Brouillage: ${S.brouillageEnd&&Date.now()<S.brouillageEnd?'ACTIF':'off'} | Prime next: ${S.primeNext||0}`);return;}
  if(txt==='/debug.gages'){PHASES.forEach((ph,i)=>{if(ph.gages?.length)ph.gages.forEach(g=>{addSysMsg(`P${i} ${S.doneGages?.includes(g.id)?'✓':'○'} ${g.id} — ${g.name}`);});});return;}
  if(txt==='/debug.coins'){addSysMsg(`H:${S.coins.hippolyte} | T:${S.coins.teo} | N:${S.coins.nathanael}`);return;}
  if(txt==='/debug.reset.gages'){S.doneGages=[];S.activeGages=[];S.gageHistory=[];S.pool={};save();renderGages();addSysMsg('Gages et pool reinitialises.');return;}
  if(txt==='/liste'){addSysMsg('=== TOUTES LES COMMANDES ===');addSysMsg('/liste — cette liste');addSysMsg('/debug — etat (phase/BC/actifs/effets)');addSysMsg('/debug.gages — tous gages par phase');addSysMsg('/debug.coins — soldes BradCoins');addSysMsg('/debug.reset.gages — reinitialise tout');addSysMsg('/add.coins:H:50 — ajouter BC (H/T/E/N)');addSysMsg('/test.gage p1g1 — tester roulette');addSysMsg('/test.mission p1g1 — ouvrir mission');addSysMsg('/admin.p1 a /admin.p5 — debloquer phase');addSysMsg('/admin.coins — +5 BC tous');addSysMsg('/admin.reset — reset complet');addSysMsg('/delete — reset cinematique Brad');return;}
  if(txt.startsWith('/add.coins:')){const pts=txt.split(':');if(pts.length===3){const ltr=pts[1].toUpperCase(),amt=parseInt(pts[2]);const pm={'H':'hippolyte','T':'teo','N':'nathanael'};const pk=pm[ltr];if(pk&&!isNaN(amt)&&amt>0){S.coins[pk]=(S.coins[pk]||0)+amt;save();addSysMsg(`+${amt} BC → ${DISPLAY_NAMES[R_KEYS.indexOf(pk)]}`);renderBraddy();}else addSysMsg('Format: /add.coins:H:50 — H T N');}return;}
  if(txt.startsWith('/test.gage ')){const gid=txt.slice(11).trim();let found=null;PHASES.forEach(ph=>ph.gages?.forEach(g=>{if(g.id===gid)found=g;}));if(found){addSysMsg(`TEST ROULETTE — ${found.name}`);setTimeout(()=>openRoulette(found),300);}else addSysMsg(`Gage "${gid}" introuvable. (ex: p1g1, p2g3, p5g2)`);return;}
  if(txt.startsWith('/test.mission ')){const gid=txt.slice(14).trim();let found=null;PHASES.forEach(ph=>ph.gages?.forEach(g=>{if(g.id===gid)found=g;}));if(found){addSysMsg(`TEST MISSION — ${found.name}`);openMission(found,Math.floor(Math.random()*4));}else addSysMsg(`Gage introuvable.`);return;}
  const upper=txt.toUpperCase();if(CFG.phaseCodes[upper]!==undefined){advancePhase(CFG.phaseCodes[upper]);addSysMsg(`CODE VALIDE — Phase ${CFG.phaseCodes[upper]} deverouilee.`);return;}
  // sg3 pronostic detection
  if((S.activeGages||[]).some(ag=>ag.gageId==='sg3')&&/\d+\s*-\s*\d+/.test(txt)){
    addUserMsg(txt);
    bradMsg("Pronostic enregistre. Les modeles predictifs du BRADDY3000 viennent d'etre mis a jour. En cas de victoire francaise, je considererai officiellement votre intuition comme une technologie de pointe.");
    return;
  }
  // bradLostUntil check
  if(S.bradLostUntil&&Date.now()<S.bradLostUntil){
    addUserMsg(txt);
    const lost=["...ou suis-je.","RECALIBRATION ERREUR 404","Kirby 67 a peut-etre pirate ce canal.","beep.","Signal recu. Signal incompris.","Non. Oui. Je ne sais pas.","...","Je cherche mes lunettes."];
    bradMsg(lost[Math.floor(Math.random()*lost.length)]);return;
  }
  addUserMsg(txt);const lower=txt.toLowerCase();let resp=null;
  for(const[kw,rs]of Object.entries(RESPONSES)){if(lower.includes(kw)){resp=rs[Math.floor(Math.random()*rs.length)];break;}}
  if(!resp)resp=FALLBACK[Math.floor(Math.random()*FALLBACK.length)];
  bradMsg(resp);
}


/* AIDE */
const AIDE={
  lore:{title:"Le LORE",body:"<h3>Le LORE</h3><p>L'Operation Never 2 sans 3 est la 3e edition. Le BRADDY3000 coordonne l'ensemble. Kirby 67 a ete repere a Lille. Votre mission : collecter des donnees via les gages pour l'identifier.</p><p class='warn'>Brad Bitt Corporation ne garantit pas que tout cela ait un sens.</p>"},
  gages:{title:"Les Gages",body:"<h3>Les Gages</h3><p>Phases 1-4 : la roulette designe le participant. Phase 5 : Brad attribue directement. Un gage en cours apparait dans la section <span class='brand'>EN COURS</span>. Reussi : +BC. Echoue : rien. Brad note.</p>"},
  doubleTrouble:{title:"Double Trouble",body:"<h3>Double Trouble</h3><p>Se déverrouille quand tous les gages individuels de la Phase 1 sont accomplis. Deux equipes s'affrontent : Fromage contre Charcuterie. Premiere equipe revenue : +5 BC par participant.</p>"},
  chat:{title:"Le CHAT",body:"<h3>Le CHAT</h3><p>Brad repond a certains mots-cles. Tapez <span class='brand'>/liste</span> pour toutes les commandes. En cas de reponses bizarres : l'evenement BRAD EST PERDU est peut-etre actif.</p>"},
  bonus:{title:"Les Bonus",body:"<h3>Les Bonus</h3><p><strong>Gage secondaire (15 BC)</strong> : remplace votre gage par un gage pioche parmi 4 cartes mystere. Bouton sur la carte de gage actif.</p><p><strong>Refaire la roue (20 BC)</strong> : votre gage retourne dans le pool, un nouveau est tire. Personnel uniquement.</p><p><strong>Laisser Passer (25 BC)</strong> : ignore definitivement votre gage. 0 BC.</p><p><strong>Mission Parallele (25 BC)</strong> : mini-mission annexe en parallele. +5 BC si reussie.</p><p><strong>Imposer une Mission (30 BC)</strong> : assigne une mission annexe a un autre joueur.</p><p><strong>Declencher un evenement (50 BC)</strong> : roue speciale avec 8 effets (BC doubles, parasites, Brad perdu...). Disponibles selon la phase.</p>"},
  monnaie:{title:"La Monnaie",body:"<h3>Les BradCoins</h3><p>Gage individuel : +5 BC. Phase 5 : +10 BC. Mission annexe : +5 BC. Le Brouillage double les BC pendant 10 min. Depenses : bonus shop.</p>"},
  braddy3000:{title:"Le BRADDY3000",body:"<h3>Le BRADDY3000</h3><p>Systeme de surveillance et d'analyse de Brad Bitt. Localise Kirby 67, gere les gages, calcule les BC. Fiabilite : entre 3% et 98%. Les ingenieurs travaillent sur le probleme. Depuis longtemps.</p>"},
  dossiers:{title:"Les Dossiers",body:"<h3>Les Dossiers</h3><p>Se déverrouillent progressivement : Kirby 67 (debut) — Brad Bitt (Ph.1) — BRADDY3000 (Ph.2) — Incidents (Ph.3) — Archives (Ph.5).</p>"}
};
function openAide(id){const d=AIDE[id];if(!d)return;document.getElementById('ad-title').textContent=d.title;document.getElementById('ad-body').innerHTML=d.body;nav('aide-detail');}

/* DOUBLE TROUBLE — nouvelle mecanique (evenement scenarise, reserve commune) */

const DT_ALERT_LINES = [
  "ALERTE",
  "Le BRADDY3000 vient de detecter plusieurs anomalies simultanees.",
  "Les signatures de Kirby 67 apparaissent puis disparaissent de facon totalement aleatoire.",
  "Les donnees risquent d'etre perdues definitivement.",
  "Afin d'augmenter les chances de localisation, le BRADDY3000 active le protocole :",
  "DOUBLE TROUBLE",
  "Durant les prochaines minutes, plusieurs missions secondaires seront accessibles simultanement.",
  "Chaque mission accomplie rapportera des Brad Coins supplementaires.",
  "Ces Brad Coins ne seront pas attribues individuellement.",
  "Ils seront stockes dans une reserve commune.",
  "A la fin du Double Trouble, le total sera partage equitablement entre les trois participants.",
  "Le temps est limite.",
  "Le BRADDY3000 compte sur vous.",
];

function openDTIntro(){
  const ol=document.getElementById('dt-ol');
  ol.classList.remove('hidden');
  document.getElementById('dt-intro-section').classList.remove('hidden');
  document.getElementById('dt-title-section').classList.add('hidden');
  document.getElementById('dt-missions-section').classList.add('hidden');
  document.getElementById('dt-end-section').classList.add('hidden');
  const linesEl=document.getElementById('dt-intro-lines');
  linesEl.innerHTML='';
  glitchSnd(.2);shake(4,300);
  let i=0,skipped=false;
  function showNext(){
    if(skipped)return;
    if(i>=DT_ALERT_LINES.length){setTimeout(()=>{if(!skipped)transitionToTitle();},900);return;}
    const p=document.createElement('p');
    p.className=i===0||i===5?'dt-intro-big':'dt-intro-line';
    p.textContent=DT_ALERT_LINES[i];
    p.style.opacity='0';
    linesEl.appendChild(p);
    setTimeout(()=>p.style.opacity='1',20);
    beep(180+Math.random()*150,.04,.04,'square');
    if(Math.random()>.7)shake(2,120);
    i++;
    setTimeout(showNext,i<=1?700:i===6?900:550);
  }
  showNext();
  const skipBtn=document.getElementById('dt-intro-skip');
  skipBtn.onclick=()=>{skipped=true;transitionToTitle();};
}

function transitionToTitle(){
  flash(200,true);glitchSnd(.2);shake(5,300);
  document.getElementById('dt-intro-section').classList.add('hidden');
  document.getElementById('dt-title-section').classList.remove('hidden');
  beep(880,.5,.15,'sine');
  setTimeout(()=>{startDoubleTrouble();},1800);
}

function startDoubleTrouble(){
  S.dtActive=true;S.dtStart=Date.now();S.dtPoolBC=0;save();
  document.getElementById('dt-title-section').classList.add('hidden');
  openDTMissionsOverlay();
}

let dtOverlayInterval=null;
function openDTMissionsOverlay(){
  const ol=document.getElementById('dt-ol');
  ol.classList.remove('hidden');
  document.getElementById('dt-intro-section').classList.add('hidden');
  document.getElementById('dt-title-section').classList.add('hidden');
  document.getElementById('dt-end-section').classList.add('hidden');
  document.getElementById('dt-missions-section').classList.remove('hidden');
  renderDTMissionsGrid();
  if(dtOverlayInterval)clearInterval(dtOverlayInterval);
  dtOverlayInterval=setInterval(()=>{
    const rem=Math.max(0,Math.floor(((S.dtStart+10*60*1000)-Date.now())/1000));
    const timerEl=document.getElementById('dt-timer-live');
    if(timerEl){const mm=String(Math.floor(rem/60)).padStart(2,'0'),ss=String(rem%60).padStart(2,'0');timerEl.textContent=mm+':'+ss;}
    if(rem===0){clearInterval(dtOverlayInterval);endDoubleTrouble();}
  },1000);
  document.getElementById('dt-minimize-btn').onclick=()=>{
    if(dtOverlayInterval)clearInterval(dtOverlayInterval);
    ol.classList.add('hidden');renderGages();
  };
}

function renderDTMissionsGrid(){
  const grid=document.getElementById('dt-missions-grid');
  const poolEl=document.getElementById('dt-pool-val');
  if(poolEl)poolEl.textContent=S.dtPoolBC||0;
  const rem=Math.max(0,Math.floor(((S.dtStart+10*60*1000)-Date.now())/1000));
  const timerEl=document.getElementById('dt-timer-live');
  if(timerEl){const mm=String(Math.floor(rem/60)).padStart(2,'0'),ss=String(rem%60).padStart(2,'0');timerEl.textContent=mm+':'+ss;}
  const available=SIDE_MISSIONS.filter(sm=>!(S.usedSMIds||[]).includes(sm.id));
  if(!grid)return;
  if(!available.length){
    grid.innerHTML='<p class="dt-empty-hint">Toutes les missions ont ete recoltees. Le BRADDY3000 patiente jusqu\'a la fin du chrono.</p>';
    return;
  }
  let h='';
  DT_TIERS.forEach(tier=>{
    const tierMissions=available.filter(sm=>sm.tier===tier.n);
    if(!tierMissions.length)return;
    h+=`<div class="dt-tier-label" style="color:${tier.color}">NIVEAU ${tier.n} — ${tier.name.toUpperCase()} (+${tier.bc} BC)</div>`;
    tierMissions.forEach(sm=>{
      h+=`<button class="dt-mission-card" style="border-color:${tier.color}" data-smid="${sm.id}"><span class="dt-mission-desc">${sm.desc}</span><span class="dt-mission-bc" style="color:${tier.color}">+${tier.bc} BC</span></button>`;
    });
  });
  grid.innerHTML=h;
  grid.querySelectorAll('.dt-mission-card').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const smid=btn.dataset.smid;
      validateDTMission(smid);
    });
  });
}

function validateDTMission(smid){
  if(!S.usedSMIds)S.usedSMIds=[];
  if(S.usedSMIds.includes(smid))return;
  const bc=smBC(smid);
  S.usedSMIds.push(smid);
  S.dtPoolBC=(S.dtPoolBC||0)+bc;
  save();
  flash(100,true);beep(660,.2,.1,'sine');
  renderDTMissionsGrid();
}

function endDoubleTrouble(){
  if(dtOverlayInterval)clearInterval(dtOverlayInterval);
  const ol=document.getElementById('dt-ol');
  ol.classList.remove('hidden');
  document.getElementById('dt-missions-section').classList.add('hidden');
  document.getElementById('dt-end-section').classList.remove('hidden');
  const total=S.dtPoolBC||0;
  const share=Math.floor(total/3);
  const linesEl=document.getElementById('dt-end-lines');
  linesEl.innerHTML='';
  flash(300,true);glitchSnd(.2);shake(5,400);
  const endLines=[
    "Analyse terminee.",
    "Synchronisation des donnees...",
    "Termine.",
    "Le BRADDY3000 a recupere suffisamment d'informations pour poursuivre les recherches.",
    `Total des donnees recoltees : ${total} Brad Coins`,
    "Repartition en cours...",
    `${share} Brad Coins attribues a chaque participant.`,
    "Excellent travail.",
    "Les recherches de Kirby 67 peuvent reprendre.",
  ];
  let i=0;
  const next=()=>{
    if(i>=endLines.length){
      setTimeout(()=>{
        R_KEYS.forEach(k=>{S.coins[k]=(S.coins[k]||0)+share;});
        S.doneDT=true;S.dtActive=false;save();
        ol.classList.add('hidden');
        renderGages();renderBraddy();
        checkPhase1Complete();
        bradMsg(`Retour au deroulement normal de l'operation Never 2 sans 3. ${share} BC ont ete crediteo a chacun de vous.`);
      },1200);
      return;
    }
    const p=document.createElement('p');p.className='dt-intro-line';p.textContent=endLines[i];p.style.opacity='0';
    linesEl.appendChild(p);setTimeout(()=>p.style.opacity='1',20);
    beep(200+Math.random()*300,.05,.05,'square');
    i++;setTimeout(next,650);
  };
  setTimeout(next,500);
}

// Resume check on load: if DT was active and time already expired while away, resolve it immediately.
function checkDTResumeOnLoad(){
  if(S.dtActive&&!S.doneDT){
    const rem=(S.dtStart+10*60*1000)-Date.now();
    if(rem<=0){setTimeout(()=>endDoubleTrouble(),800);}
  }
}

/* RESET ANIMATION */
function launchResetAnimation(){
  const ov=document.createElement('div');
  ov.style.cssText='position:fixed;inset:0;z-index:500;background:#000;display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-end;padding:30px 24px;overflow:hidden;font-family:var(--mono)';
  document.body.appendChild(ov);
  const lines=['> BRADDY3000 — PROCÉDURE DE RÉINITIALISATION INITIALISÉE...','> Déconnexion des agents en cours...','> Suppression des BradCoins. Toutes les richesses disparaissent.','> Effacement des gages accomplis. Impressionnant, mais terminé.','> MODE USINE BRAD™ ACTIVÉ.','> Kirby 67 est temporairement libre. Surveillez vos arrières.','> Données de localisation effacées.','> Je ne suis pas responsable de ce qui suit.','> Suppression de mes propres souvenirs... (ça fait un peu mal)','> Effacement du chat. Oubli mutuel.','> BRADDY3000 REBOOT EN COURS...','> .','> ..','> ...','> AU REVOIR.'];
  let i=0;
  const next=()=>{if(i>=lines.length){setTimeout(()=>{localStorage.removeItem('n2s3');S=loadState();location.reload();},900);return;}const p=document.createElement('p');p.textContent=lines[i];p.style.cssText='color:rgba(0,255,65,.8);font-size:11px;letter-spacing:.25em;margin:3px 0;opacity:0;transition:opacity .15s;';ov.insertBefore(p,ov.firstChild);setTimeout(()=>p.style.opacity='1',20);beep(180+Math.random()*200,.05,.05,'square');i++;setTimeout(next,lines[i-1].startsWith('> .')?350:300);};
  flash(300,true);setTimeout(next,500);
}

/* BOOTSTRAP */
window.addEventListener('resize',()=>{resizeBg();initParts();if(document.getElementById('app').classList.contains('show'))drawMap();});
resizeBg();initParts();tickParts();
if(S.introComplete){document.querySelectorAll('.ph').forEach(p=>p.classList.remove('on'));document.getElementById('app').classList.add('show');initApp();}
