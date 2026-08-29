/* ============================= SCORING (fully explainable, no black box) ============================= */
function scoreAgainstMe(me, other){
  const sharedHobbies = other.hobbies.filter(t=>me.hobbies.includes(t));
  const sharedCultures = other.cultures.filter(t=>me.cultures.includes(t));
  const sharedLanguages = other.languages.filter(t=>me.languages.includes(t));
  const teachMatches = other.hobbies.filter(t=>(me.wantToLearn||[]).includes(t));
  const needMatches = (other.canHelpWith||[]).filter(n=>(me.needs||[]).includes(n));
  const dist = haversine(me.location, other.location);

  const raw = sharedHobbies.length*3
            + sharedCultures.length*4
            + sharedLanguages.length*4
            + teachMatches.length*6
            + needMatches.length*10
            - Math.min(dist*0.04, 20);

  return {score: Math.round(raw*10)/10, sharedHobbies, sharedCultures, sharedLanguages, teachMatches, needMatches, dist: Math.round(dist)};
}

function whyReasons(u, s){
  const reasons = [];
  s.needMatches.forEach(n=>reasons.push(`They can help with: "${n}"`));
  s.teachMatches.forEach(t=>reasons.push(`They can teach you ${t}`));
  s.sharedHobbies.forEach(t=>reasons.push(`Shared hobby: ${t}`));
  s.sharedCultures.forEach(t=>reasons.push(`Shared culture: ${t}`));
  s.sharedLanguages.forEach(t=>reasons.push(`Shared language: ${t}`));
  reasons.push(`${s.dist} km away (${u.location.label})`);
  return reasons;
}

