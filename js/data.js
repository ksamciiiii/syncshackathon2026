/* ============================= DATA LAYER ============================= */
const HOBBIES = ["Hiking","Board Games","Photography","Cooking","Cycling","Painting","Rock Climbing","Gardening","Music Jamming","Reading","Dancing","Chess"];
const CULTURES = ["Japanese","Mexican","Nigerian","Korean","Italian","Indian","Brazilian","Lebanese","Filipino","Vietnamese"];
const LANGUAGES = ["English","Spanish","Mandarin","Japanese","Korean","Portuguese","Arabic","Hindi","Vietnamese","French"];
const NEEDS = [
  "Miss home-cooked meals from my culture",
  "Miss speaking my first language",
  "Want a walking or hiking buddy",
  "New to the city, want someone to explore with",
  "Miss having an elder to talk to",
  "Want to relearn a childhood hobby with someone patient",
  "Feeling isolated, just want regular company"
];

const LOCATIONS = [
  {label:"Sydney CBD", lat:-33.8688, lng:151.2093},
  {label:"Newtown", lat:-33.8964, lng:151.1794},
  {label:"Parramatta", lat:-33.8150, lng:151.0011},
  {label:"Bondi", lat:-33.8908, lng:151.2743},
  {label:"Chatswood", lat:-33.7969, lng:151.1830},
  {label:"Melbourne CBD", lat:-37.8136, lng:144.9631},
  {label:"Auckland", lat:-36.8485, lng:174.7633},
];

const AVATAR_COLORS = ["#2F6F62","#E2673B","#E3A857","#7A5FB0","#3C7DBF","#B3453A","#4C8C4A"];

function colorFor(name){ let h=0; for(const c of name) h=(h*31+c.charCodeAt(0))%AVATAR_COLORS.length; return AVATAR_COLORS[Math.abs(h)]; }
function initials(name){ return name.slice(0,2).toUpperCase(); }

function haversine(a,b){
  const R=6371, toRad=d=>d*Math.PI/180;
  const dLat=toRad(b.lat-a.lat), dLng=toRad(b.lng-a.lng);
  const x = Math.sin(dLat/2)**2 + Math.cos(toRad(a.lat))*Math.cos(toRad(b.lat))*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
}
function pick(arr,n){ const c=[...arr]; const out=[]; while(out.length<n && c.length){ out.push(c.splice(Math.floor(Math.random()*c.length),1)[0]); } return out; }

function seedIfNeeded(){
  if(localStorage.getItem('tp_users')) return;

  const firstNames = ["riverwren","mossy_fox","paperlantern","quietcedar","saltybloom","tinkerbell_x","northwind","copperfinch","lunaleaf","brambleoak","wovenstar","softecho","clovertrail","amberdrift","pineandpaper","tidecarry"];

  // hand-crafted so a few produce strong, explainable matches (including reverse-loneliness ones)
  const overrides = {
    riverwren:   { hobbies:["Cooking","Gardening"], canHelpWith:["Miss home-cooked meals from my culture"], cultures:["Filipino"], languages:["Vietnamese","English"] },
    mossy_fox:   { hobbies:["Hiking","Photography"], canHelpWith:["Want a walking or hiking buddy"], cultures:["Italian"], languages:["English"] },
    paperlantern:{ hobbies:["Chess","Reading"], canHelpWith:[], cultures:["Vietnamese"], languages:["Vietnamese","English"] },
    quietcedar:  { hobbies:["Cooking","Dancing"], canHelpWith:["Miss home-cooked meals from my culture","Feeling isolated, just want regular company"], cultures:["Filipino","Mexican"], languages:["Spanish","English"] },
    saltybloom:  { hobbies:["Cycling","Board Games"], canHelpWith:["New to the city, want someone to explore with"], cultures:["Brazilian"], languages:["Portuguese","English"] },
    northwind:   { hobbies:["Painting","Music Jamming"], canHelpWith:["Miss having an elder to talk to"], cultures:["Korean"], languages:["Korean","English"] },
    copperfinch: { hobbies:["Rock Climbing","Hiking"], canHelpWith:["Want a walking or hiking buddy"], cultures:["Lebanese"], languages:["Arabic","English"] },
    lunaleaf:    { hobbies:["Cooking","Reading"], canHelpWith:["Miss speaking my first language"], cultures:["Japanese"], languages:["Japanese"] },
  };

  const users = firstNames.map((name,i)=>{
    const loc = LOCATIONS[i % (LOCATIONS.length-1)];
    const o = overrides[name];
    return {
      id:'u'+i,
      username:name,
      hobbies: o ? o.hobbies : pick(HOBBIES, 2+Math.floor(Math.random()*2)),
      wantToLearn: pick(HOBBIES.filter(h=>!(o?o.hobbies:[]).includes(h)), 1),
      cultures: o ? o.cultures : pick(CULTURES, 1+Math.floor(Math.random()*2)),
      languages: o ? o.languages : pick(LANGUAGES, 1+Math.floor(Math.random()*2)),
      canHelpWith: o ? o.canHelpWith : (Math.random()<0.2 ? pick(NEEDS,1) : []),
      location: loc,
      bio: "Here to meet people, not swipe on them.",
    };
  });
  users[users.length-1].location = LOCATIONS[5];
  users[users.length-2].location = LOCATIONS[6];
  localStorage.setItem('tp_users', JSON.stringify(users));

  const groups = [
    {id:'g1', name:"Sydney Hikers", tagType:'hobby', tag:'Hiking', description:"Weekend trail walks, all paces welcome.", memberIds:['u0','u3','u7']},
    {id:'g2', name:"K-Pop & Korean Language Exchange", tagType:'language', tag:'Korean', description:"Practice Korean over music and snacks.", memberIds:['u1','u4','u9']},
    {id:'g3', name:"Board Game Night — Newtown", tagType:'hobby', tag:'Board Games', description:"Casual games, new players very welcome.", memberIds:['u2','u5']},
    {id:'g4', name:"Nigerian Cooking Circle", tagType:'culture', tag:'Nigerian', description:"Cook, share, and swap family recipes.", memberIds:['u6','u10']},
    {id:'g5', name:"Latin Dance Crew", tagType:'culture', tag:'Brazilian', description:"No experience needed, just good energy.", memberIds:['u8','u11']},
    {id:'g6', name:"Chess Club Parramatta", tagType:'hobby', tag:'Chess', description:"Casual and rated games, Thursdays.", memberIds:['u12','u13']},
  ];
  localStorage.setItem('tp_groups', JSON.stringify(groups));

  const events = [
    {id:'e1', title:"Community Garden Working Bee", type:'volunteering', location:LOCATIONS[1], time:"Sat, 9:00 AM", description:"Help tend the shared garden beds — bring gloves, we bring the tea.", groupId:'g1', rsvpIds:['u0','u3']},
    {id:'e2', title:"Beach Cleanup + Boardwalk Walk", type:'volunteering', location:LOCATIONS[3], time:"Sun, 8:00 AM", description:"An easy, low-pressure way to meet people while doing something good.", groupId:null, rsvpIds:['u8']},
    {id:'e3', title:"Elderly Companion Visits — Chatswood", type:'volunteering', location:LOCATIONS[4], time:"Wed, 2:00 PM", description:"Pair up for a chat and a cup of tea with residents who'd love company.", groupId:null, rsvpIds:['u9','u12']},
    {id:'e4', title:"Language Exchange Coffee Meetup", type:'social', location:LOCATIONS[0], time:"Fri, 6:00 PM", description:"Bring one phrase to teach, leave with three new ones.", groupId:'g2', rsvpIds:['u1','u4']},
    {id:'e5', title:"Board Game Night", type:'social', location:LOCATIONS[1], time:"Thu, 7:00 PM", description:"Catan, Wingspan, and a very competitive Uno deck.", groupId:'g3', rsvpIds:['u2']},
    {id:'e6', title:"Cook & Share: Jollof Night", type:'social', location:LOCATIONS[2], time:"Sat, 5:00 PM", description:"Bring a dish or just an appetite.", groupId:'g4', rsvpIds:['u6','u10']},
  ];
  localStorage.setItem('tp_events', JSON.stringify(events));
}
seedIfNeeded();

function getMe(){ return JSON.parse(localStorage.getItem('tp_me')||'null'); }
function setMe(m){ localStorage.setItem('tp_me', JSON.stringify(m)); }
function getUsers(){ return JSON.parse(localStorage.getItem('tp_users')||'[]'); }
function getGroups(){ return JSON.parse(localStorage.getItem('tp_groups')||'[]'); }
function setGroups(g){ localStorage.setItem('tp_groups', JSON.stringify(g)); }
function getEvents(){ return JSON.parse(localStorage.getItem('tp_events')||'[]'); }
function setEvents(e){ localStorage.setItem('tp_events', JSON.stringify(e)); }
function getContacts(){ return JSON.parse(localStorage.getItem('tp_contacts')||'{}'); }
function setContacts(c){ localStorage.setItem('tp_contacts', JSON.stringify(c)); }
function getMessages(){ return JSON.parse(localStorage.getItem('tp_messages')||'{}'); }
function setMessages(m){ localStorage.setItem('tp_messages', JSON.stringify(m)); }
function getBlocked(){ return JSON.parse(localStorage.getItem('tp_blocked')||'[]'); }
function setBlocked(b){ localStorage.setItem('tp_blocked', JSON.stringify(b)); }

function displayName(username){ const c=getContacts(); return c[username] ? `${c[username]} (@${username})` : `@${username}`; }

