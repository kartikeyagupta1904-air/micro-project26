applyUI();init();try{me=JSON.parse(sessionStorage.getItem('gh.me'));if(me)me.roll=String(me.roll)}catch(e){me=null}auth();
