/* ============================= MAIN RENDER ============================= */
function render(){
  const me = getMe();
  renderMeChip();
  if(!me){ renderOnboarding(); return; }
  const view = (location.hash||'#discover').slice(1);
  if(view==='discover') renderDiscover();
  else if(view==='groups') renderGroups();
  else if(view==='events') renderEvents();
  else if(view==='messages') renderMessages();
  else if(view==='profile') renderProfile();
  else renderDiscover();
}
render();
