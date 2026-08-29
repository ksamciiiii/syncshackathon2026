/* ============================= TOAST ============================= */
let toastTimer;
function toast(msg){
  const el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>el.classList.remove('show'), 2200);
}

/* ============================= ROUTER ============================= */
function nav(view){ location.hash = view; }
window.addEventListener('hashchange', render);

function tabsHtml(active){
  const tabs = [['discover','Discover'],['groups','Groups'],['events','Events'],['messages','Messages'],['profile','Profile']];
  return `<nav class="tabs">${tabs.map(([id,label])=>`<button class="${active===id?'active':''}" onclick="nav('${id}')">${label}</button>`).join('')}</nav>`;
}

/* ============================= ONBOARDING ============================= */
function renderOnboarding(){
  const app = document.getElementById('app');
  document.getElementById('meChipWrap').innerHTML = '';
  app.innerHTML = `
    <div class="onboard-wrap">
      <h1 style="font-size:28px;margin-bottom:6px;">Weave yourself in.</h1>
      <p style="color:#6b6455;margin-bottom:26px;">Pick a username — no email, no real name needed. This is not a dating app: no swiping, no looks-based matching. Tell us what you're into, what you'd like to learn, and — if you want — what you're missing right now.</p>

      <div class="field">
        <label>Username</label>
        <input id="ob-username" placeholder="e.g. quietcedar, papertrail99..." />
      </div>

      <div class="field">
        <label>Where are you based?</label>
        <select id="ob-location">${LOCATIONS.map((l,i)=>`<option value="${i}">${l.label}</option>`).join('')}</select>
        <div class="hint">We only ever show your neighborhood to others — never an exact pin.</div>
      </div>

      <div class="field">
        <label>One line about you (optional)</label>
        <textarea id="ob-bio" placeholder="What are you hoping to find here?"></textarea>
      </div>

      <hr class="section-divider"/>

      <div class="group-label">Things you already do (and could share with someone)</div>
      <div class="chip-grid" id="ob-hobbies">${HOBBIES.map(h=>`<div class="chip-toggle" data-val="${h}">${h}</div>`).join('')}</div>

      <div class="group-label">Things you'd like to learn</div>
      <div class="chip-grid" id="ob-learn">${HOBBIES.map(h=>`<div class="chip-toggle" data-val="${h}">${h}</div>`).join('')}</div>

      <div class="group-label">Cultures you're part of, curious about, or want to connect across</div>
      <div class="chip-grid" id="ob-cultures">${CULTURES.map(h=>`<div class="chip-toggle" data-val="${h}">${h}</div>`).join('')}</div>

      <div class="group-label">Languages</div>
      <div class="chip-grid" id="ob-languages">${LANGUAGES.map(h=>`<div class="chip-toggle" data-val="${h}">${h}</div>`).join('')}</div>

      <hr class="section-divider"/>

      <div class="group-label">Is there something specific you miss, or need right now? (optional — this powers your Reverse-Loneliness match)</div>
      <div class="chip-grid" id="ob-needs">${NEEDS.map(h=>`<div class="chip-toggle needvar" data-val="${h}">${h}</div>`).join('')}</div>
      <div class="field" style="margin-top:12px;">
        <label>In your own words (optional)</label>
        <div class="hint">This is shown to your matches to add warmth — matching itself only runs on the tags above, so it stays explainable, not a guessing game.</div>
        <textarea id="ob-needtext" placeholder="e.g. I miss cooking with my mom"></textarea>
      </div>

      <div class="row-actions" style="margin-top:26px;">
        <button class="btn btn-primary" onclick="submitOnboarding()">Enter Tapestry</button>
      </div>
    </div>
  `;
  document.querySelectorAll('#ob-hobbies .chip-toggle, #ob-cultures .chip-toggle, #ob-languages .chip-toggle').forEach(c=>{ c.onclick=()=>c.classList.toggle('on'); });
  document.querySelectorAll('#ob-learn .chip-toggle').forEach(c=>{ c.onclick=()=>c.classList.toggle('on-learn'); });
  document.querySelectorAll('#ob-needs .chip-toggle').forEach(c=>{ c.onclick=()=>c.classList.toggle('on-need'); });
}

function collectChecked(containerId, cls){
  return [...document.querySelectorAll(`#${containerId} .chip-toggle.${cls||'on'}`)].map(el=>el.dataset.val);
}

function submitOnboarding(){
  const username = document.getElementById('ob-username').value.trim();
  if(!username){ toast("Pick a username first"); return; }
  const hobbies = collectChecked('ob-hobbies','on');
  const wantToLearn = collectChecked('ob-learn','on-learn');
  const cultures = collectChecked('ob-cultures','on');
  const languages = collectChecked('ob-languages','on');
  const needs = collectChecked('ob-needs','on-need');
  if(hobbies.length+cultures.length+languages.length+wantToLearn.length===0){ toast("Pick at least one interest so we can recommend things"); return; }
  const loc = LOCATIONS[+document.getElementById('ob-location').value];
  const bio = document.getElementById('ob-bio').value.trim();
  const needText = document.getElementById('ob-needtext').value.trim();
  setMe({username, hobbies, wantToLearn, cultures, languages, needs, needText, location:loc, bio});
  toast(`Welcome, @${username}`);
  nav('discover');
}

/* ============================= ME CHIP ============================= */
function renderMeChip(){
  const me = getMe();
  const wrap = document.getElementById('meChipWrap');
  if(!me){ wrap.innerHTML=''; return; }
  wrap.innerHTML = `<div class="me-chip" onclick="nav('profile')">
    <div class="avatar" style="width:22px;height:22px;font-size:10px;background:${colorFor(me.username)}">${initials(me.username)}</div>
    @${me.username}
  </div>`;
}

/* ============================= DISCOVER ============================= */
function tagChips(list, type, sharedList){
  return (list||[]).map(t=>`<span class="tag ${type} ${sharedList&&sharedList.includes(t)?'shared':''}">${t}</span>`).join('');
}

function renderDiscover(){
  const me = getMe();
  const app = document.getElementById('app');
  const blocked = getBlocked();
  const users = getUsers().filter(u=>!blocked.includes(u.username));
  const scored = users.map(u=>({u, s:scoreAgainstMe(me,u)})).sort((a,b)=>b.s.score-a.s.score);

  const heroCandidates = scored.filter(x=>x.s.needMatches.length>0).sort((a,b)=>b.s.needMatches.length-a.s.needMatches.length || b.s.score-a.s.score);
  const hero = heroCandidates[0];
  const rest = hero ? scored.filter(x=>x.u.username!==hero.u.username) : scored;

  app.innerHTML = `
    ${tabsHtml('discover')}
    ${!me.needs || me.needs.length===0 ? `
      <div class="card" style="border-style:dashed;">
        <div class="meta">Tell us what you miss or need right now to unlock your <strong style="color:var(--heart)">Reverse-Loneliness match</strong> — the feature that makes Tapestry different from a generic hobby app.</div>
        <div class="row-actions"><button class="btn btn-ghost btn-sm" onclick="nav('profile')">Add it to your profile</button></div>
      </div>
    ` : ''}
    ${hero ? `
      <div class="card hero-match">
        <div class="hero-label">💛 Your Tapestry match — reverse loneliness</div>
        ${me.needText ? `<div class="quote">"${escapeHtml(me.needText)}"</div>` : ''}
        <div class="card-row">
          <div style="display:flex;gap:12px;">
            <div class="avatar" style="background:${colorFor(hero.u.username)}">${initials(hero.u.username)}</div>
            <div>
              <div class="name-line"><span class="username">@${hero.u.username}</span><span class="score-pill">match score ${hero.s.score}</span></div>
              <div class="meta">${hero.u.location.label} · ${hero.s.dist} km away</div>
            </div>
          </div>
        </div>
        <div class="why-box">
          <div class="why-title">Matched because:</div>
          <ul>${whyReasons(hero.u, hero.s).map(r=>`<li>${r}</li>`).join('')}</ul>
        </div>
        <div class="row-actions">
          <button class="btn btn-primary btn-sm" onclick="openThread('${hero.u.username}')">Say hello</button>
          <button class="btn btn-ghost btn-sm" onclick="reportEntity('user','${hero.u.username}')">Report</button>
        </div>
      </div>
    ` : ''}

    <h2 style="margin-bottom:4px;">Recommended for you</h2>
    <p style="color:#8a8171;font-size:13.5px;margin-bottom:18px;">Ranked by shared hobbies, teach/learn fit, culture, language, and distance — every match shows exactly why.</p>
    ${rest.map(({u,s})=>`
      <div class="card">
        <div class="card-row">
          <div style="display:flex;gap:12px;">
            <div class="avatar" style="background:${colorFor(u.username)}">${initials(u.username)}</div>
            <div>
              <div class="name-line"><span class="username">@${u.username}</span><span class="score-pill">match score ${s.score}</span></div>
              <div class="meta">${u.location.label} · ${s.dist} km away</div>
              <div class="meta" style="margin-top:4px;">${u.bio}</div>
            </div>
          </div>
        </div>
        ${s.teachMatches.length ? s.teachMatches.map(t=>`<span class="badge-teach">🎓 Can teach you: ${t}</span>`).join('') : ''}
        ${s.needMatches.length ? s.needMatches.map(n=>`<span class="badge-need">💛 Can help with: ${n}</span>`).join('') : ''}
        <div style="margin-top:10px;">
          ${tagChips(u.hobbies,'hobby',s.sharedHobbies)}
          ${tagChips(u.wantToLearn,'learn')}
          ${tagChips(u.cultures,'culture',s.sharedCultures)}
          ${tagChips(u.languages,'language',s.sharedLanguages)}
        </div>
        <div class="why-box">
          <div class="why-title">Matched because:</div>
          <ul>${whyReasons(u,s).map(r=>`<li>${r}</li>`).join('')}</ul>
        </div>
        <div class="row-actions">
          <button class="btn btn-primary btn-sm" onclick="openThread('${u.username}')">Message</button>
          <button class="btn btn-ghost btn-sm" onclick="reportEntity('user','${u.username}')">Report</button>
          <button class="btn btn-danger btn-sm" onclick="blockUser('${u.username}')">Block</button>
        </div>
      </div>
    `).join('') || `<div class="empty"><h3>No one to show yet</h3><p>Add a few more interests in your profile.</p></div>`}
  `;
}

function blockUser(username){
  const b = getBlocked(); if(!b.includes(username)) b.push(username); setBlocked(b);
  toast(`Blocked @${username}`); render();
}
function reportEntity(type, idOrName){ toast(`Reported. Our team will review this ${type}.`); }

/* ============================= GROUPS ============================= */
function renderGroups(){
  const groups = getGroups();
  const app = document.getElementById('app');
  app.innerHTML = `
    ${tabsHtml('groups')}
    <h2 style="margin-bottom:16px;">Groups near you</h2>
    ${groups.map(g=>{
      const joined = g.memberIds.includes('me');
      return `
      <div class="card">
        <div class="card-row">
          <div>
            <h3 style="margin:0 0 4px;font-size:17px;">${g.name}</h3>
            <div class="meta">${g.memberIds.length} members</div>
          </div>
          <span class="tag ${g.tagType}">${g.tag}</span>
        </div>
        <p style="font-size:13.5px;color:#5c5344;margin:10px 0 0;">${g.description}</p>
        <div class="row-actions">
          <button class="btn ${joined?'btn-ghost':'btn-primary'} btn-sm" onclick="toggleGroup('${g.id}')">${joined?'Leave group':'Join group'}</button>
        </div>
      </div>
    `}).join('')}
  `;
}
function toggleGroup(id){
  const groups = getGroups(); const g = groups.find(x=>x.id===id); const i = g.memberIds.indexOf('me');
  if(i>-1){ g.memberIds.splice(i,1); toast(`Left ${g.name}`); } else { g.memberIds.push('me'); toast(`Joined ${g.name}`); }
  setGroups(groups); render();
}

/* ============================= EVENTS ============================= */
function renderEvents(){
  const events = getEvents();
  const app = document.getElementById('app');
  app.innerHTML = `
    ${tabsHtml('events')}
    <h2 style="margin-bottom:4px;">Things happening near you</h2>
    <p style="color:#8a8171;font-size:13.5px;margin-bottom:18px;">Volunteering events are a low-pressure way to meet people — no small talk required, just show up and help.</p>
    ${events.map(e=>{
      const going = e.rsvpIds.includes('me');
      return `
      <div class="card">
        ${e.type==='volunteering'?'<div class="badge-vol">🤝 Volunteering</div>':''}
        <h3 style="margin:0 0 4px;font-size:17px;">${e.title}</h3>
        <div class="meta">${e.location.label} · ${e.time}</div>
        <p style="font-size:13.5px;color:#5c5344;margin:10px 0 0;">${e.description}</p>
        <div class="meta" style="margin-top:8px;">${e.rsvpIds.length} going</div>
        <div class="row-actions">
          <button class="btn ${going?'btn-ghost':'btn-primary'} btn-sm" onclick="toggleRsvp('${e.id}')">${going?"Can't make it":'RSVP'}</button>
          <button class="btn btn-ghost btn-sm" onclick="reportEntity('event','${e.id}')">Report</button>
        </div>
      </div>
    `}).join('')}
  `;
}
function toggleRsvp(id){
  const events = getEvents(); const e = events.find(x=>x.id===id); const i = e.rsvpIds.indexOf('me');
  if(i>-1){ e.rsvpIds.splice(i,1); toast('RSVP removed'); } else { e.rsvpIds.push('me'); toast(`You're going to ${e.title}`); }
  setEvents(events); render();
}

/* ============================= MESSAGES ============================= */
let activeThread = null;
function convoKey(a,b){ return [a,b].sort().join('::'); }

function renderMessages(){
  const me = getMe();
  const app = document.getElementById('app');
  const messages = getMessages();
  const threadUsers = Object.keys(messages).filter(k=>k.includes(me.username)).map(k=>k.split('::').find(u=>u!==me.username));

  if(activeThread){
    const key = convoKey(me.username, activeThread);
    const thread = messages[key] || [];
    app.innerHTML = `
      ${tabsHtml('messages')}
      <button class="link-btn" style="margin-bottom:14px;" onclick="activeThread=null;render()">← All conversations</button>
      <div class="card">
        <div class="name-line" style="margin-bottom:4px;"><span class="username">${displayName(activeThread)}</span></div>
        <button class="link-btn" onclick="editNickname('${activeThread}')">Set nickname</button>
        <div style="margin-top:16px;max-height:340px;overflow-y:auto;">
          ${thread.map(m=>`<div class="chat-bubble ${m.from===me.username?'me':'them'}">${escapeHtml(m.body)}</div>`).join('') || `<p style="color:#8a8171;font-size:13.5px;">Say hi — mention a shared tag or the thing they can help with, not a compliment on their profile.</p>`}
        </div>
        <div class="chat-input-row">
          <input id="chat-input" placeholder="Type a message..." onkeydown="if(event.key==='Enter')sendMessage()"/>
          <button class="btn btn-primary" onclick="sendMessage()">Send</button>
        </div>
        <div class="row-actions" style="margin-top:14px;">
          <button class="btn btn-ghost btn-sm" onclick="reportEntity('user','${activeThread}')">Report</button>
          <button class="btn btn-danger btn-sm" onclick="blockUser('${activeThread}');activeThread=null;">Block</button>
        </div>
      </div>
    `;
    return;
  }

  app.innerHTML = `
    ${tabsHtml('messages')}
    <h2 style="margin-bottom:16px;">Messages</h2>
    <div class="card">
      ${threadUsers.length ? threadUsers.map(u=>`
        <div class="thread-list-item" onclick="openThread('${u}')">
          <div class="avatar" style="background:${colorFor(u)}">${initials(u)}</div>
          <div><div class="username">${displayName(u)}</div><div class="meta">Tap to open conversation</div></div>
        </div>
      `).join('') : `<div class="empty"><h3>No conversations yet</h3><p>Message someone from Discover to start one.</p></div>`}
    </div>
  `;
}
function openThread(username){ activeThread = username; nav('messages'); }
function sendMessage(){
  const me = getMe(); const input = document.getElementById('chat-input'); const body = input.value.trim();
  if(!body) return;
  const messages = getMessages(); const key = convoKey(me.username, activeThread);
  if(!messages[key]) messages[key] = [];
  messages[key].push({from:me.username, to:activeThread, body, time:Date.now()});
  setMessages(messages); input.value=''; render();
}
function editNickname(username){
  const contacts = getContacts(); const current = contacts[username] || '';
  const nick = prompt(`Nickname for @${username} (only you will see this):`, current);
  if(nick===null) return;
  if(nick.trim()===''){ delete contacts[username]; } else { contacts[username] = nick.trim(); }
  setContacts(contacts); toast('Nickname saved'); render();
}
function escapeHtml(s){ const d=document.createElement('div'); d.textContent=s; return d.innerHTML; }

/* ============================= PROFILE ============================= */
function renderProfile(){
  const me = getMe();
  const app = document.getElementById('app');
  app.innerHTML = `
    ${tabsHtml('profile')}
    <div class="card">
      <div class="card-row">
        <div style="display:flex;gap:12px;align-items:center;">
          <div class="avatar" style="background:${colorFor(me.username)}">${initials(me.username)}</div>
          <div><div class="username" style="font-size:17px;">@${me.username}</div><div class="meta">${me.location.label}</div></div>
        </div>
      </div>
      <p style="font-size:13.5px;color:#5c5344;margin-top:10px;">${me.bio || 'No bio yet.'}</p>
      <div style="margin-top:12px;">
        ${tagChips(me.hobbies,'hobby')}
        ${tagChips(me.wantToLearn,'learn')}
        ${tagChips(me.cultures,'culture')}
        ${tagChips(me.languages,'language')}
        ${tagChips(me.needs,'need')}
      </div>
      ${me.needText ? `<div class="quote">"${escapeHtml(me.needText)}"</div>` : ''}
    </div>

    <div class="card">
      <h3 style="margin:0 0 10px;font-size:15px;">Edit what you're missing right now</h3>
      <div class="meta" style="margin-bottom:10px;">This drives your Reverse-Loneliness match on Discover.</div>
      <div class="chip-grid" id="pf-needs">${NEEDS.map(h=>`<div class="chip-toggle ${me.needs.includes(h)?'on-need':''}" data-val="${h}">${h}</div>`).join('')}</div>
      <div class="field" style="margin-top:12px;">
        <textarea id="pf-needtext" placeholder="In your own words...">${escapeHtml(me.needText||'')}</textarea>
      </div>
      <button class="btn btn-primary btn-sm" onclick="saveNeeds()">Save</button>
    </div>

    <div class="card">
      <h3 style="margin:0 0 10px;font-size:15px;">Your nicknames</h3>
      ${Object.entries(getContacts()).length ? Object.entries(getContacts()).map(([u,n])=>`
        <div class="meta" style="margin-bottom:6px;">@${u} → <strong style="color:var(--ink)">${n}</strong> <button class="link-btn" onclick="editNickname('${u}')">edit</button></div>
      `).join('') : `<p class="meta">You haven't nicknamed anyone yet — do it from a chat.</p>`}
    </div>

    <div class="card">
      <h3 style="margin:0 0 10px;font-size:15px;">Blocked</h3>
      ${getBlocked().length ? getBlocked().map(u=>`<div class="meta">@${u} <button class="link-btn" onclick="unblock('${u}')">unblock</button></div>`).join('') : `<p class="meta">No one blocked.</p>`}
      <div class="safety-note">Your exact location is never shown — only your neighborhood. Anyone can be reported or blocked in one tap, from any screen.</div>
    </div>

    <div class="row-actions">
      <button class="btn btn-ghost" onclick="resetDemo()">Reset demo data</button>
    </div>
    <p class="footer-note">Tapestry is not a dating app — no swiping, no match percentages on looks, no romantic filters. Just shared interests, real proximity, and the specific things people can teach each other or help with.</p>
  `;
  document.querySelectorAll('#pf-needs .chip-toggle').forEach(c=>{ c.onclick=()=>c.classList.toggle('on-need'); });
}
function saveNeeds(){
  const me = getMe();
  me.needs = collectChecked('pf-needs','on-need');
  me.needText = document.getElementById('pf-needtext').value.trim();
  setMe(me);
  toast('Saved');
  render();
}
function unblock(u){ setBlocked(getBlocked().filter(x=>x!==u)); render(); }
function resetDemo(){
  if(!confirm('This clears your profile and all demo data. Continue?')) return;
  localStorage.clear(); location.hash=''; seedIfNeeded(); render();
}

