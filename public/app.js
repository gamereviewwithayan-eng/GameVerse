const socket=io();let game="ludo",room=null,me=-1,chess=null,from=null;
const el=id=>document.getElementById(id);
document.querySelectorAll("[data-game]").forEach(b=>b.onclick=()=>{document.querySelectorAll("[data-game]").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");game=b.dataset.game});
el("create").onclick=()=>socket.emit("room:create",{game,name:el("name").value});
el("join").onclick=()=>socket.emit("room:join",{code:el("roomCode").value,name:el("name").value});
el("leave").onclick=()=>location.reload();
el("copy").onclick=()=>navigator.clipboard?.writeText(room.code);
socket.on("notice",m=>el("notice").textContent=m);
socket.on("room:joined",r=>show(r));socket.on("room:update",r=>show(r));
function esc(s){return String(s).replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]))}
function act(a){socket.emit("game:action",a)}
function show(r){room=r;el("lobby").classList.add("hidden");el("room").classList.remove("hidden");me=r.players.findIndex(p=>p.id===socket.id);el("title").textContent=r.game.toUpperCase();el("code").textContent=r.code;el("players").innerHTML=r.players.map(p=>`<span class="player">${esc(p.name)}${p.id===socket.id?" (you)":""}</span>`).join("");let s=r.state;if(!s){el("status").textContent=`Waiting for players: ${r.players.length}/${r.game==="ludo"?4:2}`;el("board").innerHTML="";el("controls").innerHTML="";return}el("status").textContent=s.winner!==null&&s.winner!==undefined?(s.winner==="draw"?"Draw!":`${r.players[s.winner]?.name||"Player"} wins!`):`${r.players[s.turn]?.name||"Player"}'s turn`;draw(r)}
function draw(r){let s=r.state,b=el("board"),c=el("controls");b.className="board "+r.game;c.innerHTML="";
if(r.game==="ttt"){b.innerHTML=s.board.map((v,i)=>`<button class="cell" data-i="${i}">${v}</button>`).join("");b.querySelectorAll("button").forEach(x=>x.onclick=()=>act({index:+x.dataset.i}))}
if(r.game==="rps"){b.innerHTML=["rock","paper","scissors"].map((v)=>`<button class="cell" data-v="${v}">${{rock:"✊",paper:"✋",scissors:"✌️"}[v]}</button>`).join("");b.querySelectorAll("button").forEach(x=>x.onclick=()=>act({choice:x.dataset.v}));c.innerHTML=`${esc(s.result)}<p>Score ${s.scores[0]} — ${s.scores[1]}</p>`}
if(r.game==="chess"){if(!window.Chess){b.textContent="Chess library unavailable. Check internet.";return}chess=new Chess(s.fen);let g={p:"♟",r:"♜",n:"♞",b:"♝",q:"♛",k:"♚"};b.innerHTML=chess.board().flatMap((row,y)=>row.map((p,x)=>`<button class="cell ${(x+y)%2?"dark":""}" data-s="${"abcdefgh"[x]+(8-y)}">${p?(p.color==="w"?g[p.type]:g[p.type]):""}</button>`)).join("");b.querySelectorAll("button").forEach(x=>x.onclick=()=>{if(!from){from=x.dataset.s;return}act({from,to:x.dataset.s,promotion:"q"});from=null});c.textContent="Tap a piece, then its destination. Promotions become queens."}
if(r.game==="checkers"){let g={r:"🔴",b:"🔵",R:"🔴♛",B:"🔵♛"};b.innerHTML=s.board.map((p,i)=>`<button class="cell ${(i/8|0)%2===i%2?"dark":""}" data-i="${i}">${p?g[p]:""}</button>`).join("");b.querySelectorAll("button").forEach(x=>x.onclick=()=>{let i=+x.dataset.i;if(from===null){from=i;act({from:i,to:i})}else{act({from,to:i});from=null}})}
if(r.game==="ludo"){let icons=["🔴","🔵","🟢","🟡"];b.innerHTML=s.tokens.map((arr,p)=>arr.map((v,i)=>`<button class="cell" data-p="${p}" data-t="${i}">${icons[p]}<small>${v<0?"Home":v===56?"🏁":v}</small></button>`).join("")).join("");b.querySelectorAll("button").forEach(x=>x.onclick=()=>{if(+x.dataset.p===me)act({type:"move",token:+x.dataset.t})});c.innerHTML=`${esc(s.message)} ${s.dice||""}<p><button class="primary" id="roll" ${s.rolled||s.turn!==me?"disabled":""}>Roll dice</button></p>`;el("roll").onclick=()=>act({type:"roll"})}
}
