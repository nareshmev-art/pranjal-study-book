const KEY="pranjal-study-book-v1";
let questions=load();
const $=id=>document.getElementById(id);
const SUBJECTS=["Computer","English Reader","English Grammar","EVS","GK","Hindi","Hindi Vyakaran","Maths"];
function load(){
 try {
   const saved=JSON.parse(localStorage.getItem(KEY)||"[]");
   if(!Array.isArray(saved)) return [];
   // पुराने प्रश्नों को उनके जोड़े जाने के क्रम में स्थायी नंबर दें।
   const ordered=[...saved].sort((a,b)=>(a.created||a.id||0)-(b.created||b.id||0));
   let next=1;
   ordered.forEach(q=>{if(!Number.isFinite(q.serialNo)) q.serialNo=next; next=Math.max(next,q.serialNo+1)});
   return saved;
 } catch { return [] }
}
function save(){localStorage.setItem(KEY,JSON.stringify(questions));renderAll()}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function toast(s){const t=$("toast");t.textContent=s;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2300)}
function go(page){document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===page));document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.page===page));if(page==="revise")renderRevision();window.scrollTo({top:0,behavior:"smooth"})}
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>go(b.dataset.page)));
document.querySelectorAll("[data-goto]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.goto)));
$("type").addEventListener("change",()=>{$("optionsWrap").style.display=$("type").value==="MCQ"?"block":"none"});
$("questionForm").addEventListener("submit",e=>{
 e.preventDefault();
 const type=$("type").value, options=$("options").value.trim();
 if(type==="MCQ"&&!options){toast("MCQ के विकल्प भी लिखें");return}
 const now=Date.now();
 const nextNumber=questions.reduce((max,q)=>Math.max(max,Number(q.serialNo)||0),0)+1;
 questions.unshift({id:now,serialNo:nextNumber,subject:$("subject").value,chapter:$("chapter").value.trim(),type,question:$("question").value.trim(),answer:$("answer").value.trim(),options,page:$("pageNo").value.trim(),wrong:false,created:now});
 save();
 // केवल प्रश्न-संबंधी फील्ड साफ करें; विषय, अध्याय और प्रकार अगले प्रश्न के लिए बने रहें।
 $("question").value="";
 $("options").value="";
 $("answer").value="";
 $("pageNo").value="";
 $("optionsWrap").style.display=type==="MCQ"?"block":"none";
 $("question").focus();
 toast(`प्रश्न क्रमांक ${nextNumber} सेव हो गया`);
});
function typeName(t){return ({MCQ:"MCQ",FILL:"Fill in the blanks",TF:"True / False",SHORT:"Short answer"})[t]||t}
function card(q,withControls=true){
 const d=document.createElement("article");d.className="q-card";
 d.innerHTML=`<div class="q-meta"><strong class="question-number">प्रश्न ${esc(q.serialNo||"–")}</strong> · ${esc(q.subject)} › ${esc(q.chapter)} · ${typeName(q.type)} ${q.page?`· पेज ${esc(q.page)}`:""} ${q.wrong?'· <b style="color:#b13b43">गलत चिह्नित</b>':""}</div><h4>${esc(q.question)}</h4>${q.options?`<div class="q-options">${esc(q.options)}</div>`:""}<div class="answer" hidden><b>सही उत्तर:</b><br>${esc(q.answer)}</div><div class="q-actions"><button class="show-answer">उत्तर दिखाएँ</button>${withControls?`<button class="speak-question">🔊 प्रश्न सुनें</button><button class="voice-answer">🎙️ बोलकर उत्तर</button><button class="wrong">${q.wrong?"गलत सूची से हटाएँ":"गलत प्रश्न में जोड़ें"}</button>`:""}<button class="delete-question">🗑️ डिलीट</button></div><div class="feedback" aria-live="polite"></div>`;
 d.querySelector(".delete-question").onclick=()=>{
   if(confirm("क्या आप इस प्रश्न को हमेशा के लिए डिलीट करना चाहते हैं?")){
     questions=questions.filter(item=>item.id!==q.id);
     save();
     toast("प्रश्न डिलीट कर दिया गया");
   }
 };
 d.querySelector(".show-answer").onclick=()=>{const a=d.querySelector(".answer");a.hidden=!a.hidden;d.querySelector(".show-answer").textContent=a.hidden?"उत्तर दिखाएँ":"उत्तर छिपाएँ"};
 const speak=(txt)=>{if(!("speechSynthesis"in window)){toast("इस ब्राउज़र में आवाज़ उपलब्ध नहीं");return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(txt);u.lang="hi-IN";speechSynthesis.speak(u)};
 d.querySelector(".speak-question").onclick=()=>speak(q.question);
 d.querySelector(".wrong").onclick=()=>{q.wrong=!q.wrong;save();toast(q.wrong?"गलत प्रश्न में जोड़ा":"गलत सूची से हटाया")};
 d.querySelector(".voice-answer").onclick=()=>{
   const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;
   if(!Speech){toast("इस ब्राउज़र में Speech Recognition उपलब्ध नहीं है");return}
   const rec=new Speech();rec.lang="hi-IN";rec.interimResults=false;rec.maxAlternatives=1;
   const f=d.querySelector(".feedback");f.textContent="सुन रहा हूँ…";
   rec.onresult=e=>{const spoken=e.results[0][0].transcript;const norm=s=>s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu," ").trim();const a=norm(spoken),b=norm(q.answer);const match=a===b||(b.length>8&&a.includes(b))||(a.length>8&&b.includes(a));f.textContent=`आपका उत्तर: “${spoken}” — ${match?"संभावित रूप से सही ✓":"उत्तर मेल नहीं खाया। सही उत्तर नीचे देखें।"}`;f.style.color=match?"#197b59":"#b13b43";if(!match){d.querySelector(".answer").hidden=false;d.querySelector(".show-answer").textContent="उत्तर छिपाएँ";q.wrong=true;save()}};
   rec.onerror=()=>{f.textContent="आवाज़ पहचान नहीं हो पाई। फिर कोशिश करें या उत्तर लिखकर मिलाएँ।"};
   rec.start();
 };
 return d;
}
function renderAll(){
 $("totalCount").textContent=questions.length;
 $("wrongCount").textContent=questions.filter(q=>q.wrong).length;
 $("subjectCount").textContent=new Set(questions.map(q=>q.subject)).size;
 const recent=$("recentList");recent.innerHTML="";if(!questions.length){recent.className="question-list empty";recent.textContent="अभी कोई प्रश्न नहीं है। “प्रश्न जोड़ें” से शुरुआत करें।"}else{recent.className="question-list";questions.slice(0,3).forEach(q=>recent.append(card(q,false)))}
 fillFilters();renderRevision();
}
function fillFilters(resetChapter=false){
 const oldS=$("filterSubject").value,oldC=$("filterChapter").value;
 // सभी तय विषय हमेशा दिखें, भले उनमें अभी प्रश्न न जोड़े गए हों।
 $("filterSubject").innerHTML='<option value="">All Subjects</option>'+SUBJECTS.map(s=>`<option value="${esc(s)}">${esc(s)}</option>`).join("");
 $("filterSubject").value=SUBJECTS.includes(oldS)?oldS:"";
 // अध्याय सेव किए गए प्रश्नों से लिए जाते हैं; चुने विषय के अनुसार सूची बदलती है।
 const chapters=[...new Set(questions.filter(q=>!$("filterSubject").value||q.subject===$("filterSubject").value).map(q=>q.chapter).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
 $("filterChapter").innerHTML='<option value="">All Chapters</option>'+chapters.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join("");
 $("filterChapter").value=!resetChapter&&chapters.includes(oldC)?oldC:"";
}
["filterSubject","filterChapter","filterType","wrongOnly"].forEach(id=>$(id).addEventListener("change",()=>{if(id==="filterSubject")fillFilters(true);renderRevision()}));
function renderRevision(){
 if(!$("revisionList"))return;
 const list=questions.filter(q=>(!$("filterSubject").value||q.subject===$("filterSubject").value)&&(!$("filterChapter").value||q.chapter===$("filterChapter").value)&&(!$("filterType").value||q.type===$("filterType").value)&&(!$("wrongOnly").checked||q.wrong));
 $("resultCount").textContent=`${list.length} प्रश्न`;
 const box=$("revisionList");box.innerHTML="";box.className="question-list"+(list.length?"":" empty");
 if(!list.length){box.textContent="इस फ़िल्टर में कोई प्रश्न नहीं मिला।";return}
 list.forEach(q=>box.append(card(q)));
}
$("shuffleBtn").onclick=()=>{questions.sort(()=>Math.random()-.5);renderRevision();toast("प्रश्नों का क्रम बदल दिया")};
$("exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify({app:"Pranjal Study Book",version:1,questions},null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="pranjal-study-book-backup.json";a.click();URL.revokeObjectURL(a.href)};
$("importFile").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const data=JSON.parse(await f.text());const incoming=Array.isArray(data)?data:data.questions;if(!Array.isArray(incoming))throw Error();if(confirm(`${incoming.length} प्रश्न इम्पोर्ट करें? मौजूदा प्रश्न भी सुरक्षित रहेंगे।`)){questions=[...incoming,...questions];save();toast("बैकअप इम्पोर्ट हो गया")}}catch{toast("यह सही बैकअप फ़ाइल नहीं है")}e.target.value=""};
$("scanFiles").onchange=e=>{const files=[...e.target.files];$("scanPreview").innerHTML=files.length?`<b>चुनी गई फ़ाइलें:</b><br>${files.map(f=>esc(f.name)).join("<br>")}`:"";};
if("serviceWorker"in navigator && location.protocol!=="file:"){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}))}
if(navigator.onLine){$("connectionState").textContent="ऑनलाइन"}else{$("connectionState").textContent="ऑफलाइन"}
window.addEventListener("online",()=>$("connectionState").textContent="ऑनलाइन");
window.addEventListener("offline",()=>$("connectionState").textContent="ऑफलाइन");
renderAll();
