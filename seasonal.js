/* ══════════════════════════════════════════════════════
   SEASONAL THEMES + ANNIVERSARY ANIMATION
   Automatically applied based on current date
══════════════════════════════════════════════════════ */
(function(){
  const now=new Date();
  const month=now.getMonth()+1; // 1-12
  const day=now.getDate();

  /* ── SEASONAL THEME ── */
  const SEASONS={
    halloween:{
      check:()=>month===10,
      class:'theme-halloween',
      css:`
        :root.theme-halloween{
          --conch:#ff6b00;
          --cmdr:#7c3aed;
          --bg:#0d0a0f;
          --surface:#130f1a;
          --surface2:#1c1526;
          --border:rgba(255,107,0,0.12);
        }
        .seasonal-banner{background:linear-gradient(135deg,rgba(255,107,0,.12),rgba(124,58,237,.08));border-color:rgba(255,107,0,.25)}
        .seasonal-banner-text{color:#ff6b00}
      `,
      banner:'🎃 Happy Halloween! Spooky season is here.',
      particles:['🎃','👻','🕷️','🦇','🕸️','💀','🌙'],
    },
    christmas:{
      check:()=>month===12,
      class:'theme-christmas',
      css:`
        :root.theme-christmas{
          --conch:#34d399;
          --cmdr:#ef4444;
          --bg:#080d0a;
          --surface:#0f1a12;
          --surface2:#162219;
          --border:rgba(52,211,153,0.1);
        }
        .seasonal-banner{background:linear-gradient(135deg,rgba(52,211,153,.1),rgba(239,68,68,.08));border-color:rgba(52,211,153,.25)}
        .seasonal-banner-text{color:#34d399}
      `,
      banner:'🎄 Merry Christmas! Happy holidays from Conch & Cmdr.',
      particles:['🎄','❄️','⭐','🎁','🔔','🦌','☃️'],
    },
    easter:{
      check:()=>month===4,
      class:'theme-easter',
      css:`
        :root.theme-easter{
          --conch:#f472b6;
          --cmdr:#a78bfa;
          --bg:#0d0a0d;
          --surface:#170f17;
          --surface2:#1f1520;
          --border:rgba(244,114,182,0.1);
        }
        .seasonal-banner{background:linear-gradient(135deg,rgba(244,114,182,.1),rgba(167,139,250,.08));border-color:rgba(244,114,182,.25)}
        .seasonal-banner-text{color:#f472b6}
      `,
      banner:'🐣 Happy Easter! Spring is here.',
      particles:['🐣','🐰','🌸','🌷','🥚','🌼','🦋'],
    },
    newyear:{
      check:()=>month===1&&day===1,
      class:'theme-newyear',
      css:`
        :root.theme-newyear{
          --conch:#fbbf24;
          --cmdr:#f97316;
          --bg:#0a0a08;
          --surface:#141410;
          --surface2:#1c1c16;
          --border:rgba(251,191,36,0.1);
        }
        .seasonal-banner{background:linear-gradient(135deg,rgba(251,191,36,.12),rgba(249,115,22,.08));border-color:rgba(251,191,36,.3)}
        .seasonal-banner-text{color:#fbbf24}
      `,
      banner:'🎆 Happy New Year! Welcome to a new chapter.',
      particles:['🎆','🎇','✨','🥂','🎉','🎊','⭐'],
    },
    birthday:{
      check:()=>month===5&&day===7&&now.getFullYear()>2026,
      class:'theme-birthday',
      css:`
        :root.theme-birthday{
          --conch:#f472b6;
          --cmdr:#fbbf24;
          --bg:#0a080d;
          --surface:#130f1a;
          --surface2:#1c1526;
          --border:rgba(244,114,182,0.15);
        }
        :root.theme-birthday .nav-logo .c{color:#f472b6}
        :root.theme-birthday .nav-logo .r{color:#fbbf24}
        .seasonal-banner{background:linear-gradient(135deg,rgba(244,114,182,.15),rgba(251,191,36,.1));border-color:rgba(244,114,182,.35)}
        .seasonal-banner-text{color:#f472b6}
        :root.theme-birthday .file-card{border-color:rgba(244,114,182,.15)}
        :root.theme-birthday .file-card:hover{border-color:rgba(244,114,182,.35)}
        :root.theme-birthday .auth-btn-primary{background:rgba(244,114,182,.15);color:#f472b6;border-color:rgba(244,114,182,.35)}
        :root.theme-birthday .auth-btn-primary:hover{background:rgba(244,114,182,.25)}
      `,
      banner:`🎂 Conch & Cmdr is ${now.getFullYear()-2026} year${now.getFullYear()-2026>1?'s':''} old today! Happy Birthday! 🎉`,
      particles:['🎂','🎉','🎊','🎈','✨','🎁','🌟','🥳','💫','🎀'],
    },
  };

  /* Find active season */
  let activeSeason=null;
  for(const[name,season] of Object.entries(SEASONS)){
    if(season.check()){activeSeason={name,...season};break;}
  }

  if(activeSeason){
    /* Inject CSS */
    const style=document.createElement('style');
    style.textContent=activeSeason.css+`
      .seasonal-banner{
        position:fixed;top:0;left:0;right:0;z-index:9999;
        padding:.5rem 1rem;text-align:center;
        border-bottom:1px solid;
        font-family:'JetBrains Mono',monospace;font-size:.78rem;
        animation:sbIn .5s ease;
        display:flex;align-items:center;justify-content:center;gap:.5rem;
      }
      @keyframes sbIn{from{transform:translateY(-100%)}to{transform:translateY(0)}}
      .seasonal-banner-close{
        background:none;border:none;cursor:pointer;
        font-size:.85rem;opacity:.5;transition:opacity .2s;
        position:absolute;right:1rem;
      }
      .seasonal-banner-close:hover{opacity:1}
      .seasonal-particle{
        position:fixed;pointer-events:none;z-index:9998;
        font-size:1.4rem;animation:particle-fall linear infinite;
        opacity:0;
      }
      @keyframes particle-fall{
        0%{transform:translateY(-20px) rotate(0deg);opacity:0}
        10%{opacity:.8}
        90%{opacity:.5}
        100%{transform:translateY(100vh) rotate(360deg);opacity:0}
      }
    `;
    document.head.appendChild(style);
    document.documentElement.classList.add(activeSeason.class);

    /* Show banner (once per day) */
    const bannerKey='cc_seasonal_banner_'+activeSeason.name+'_'+new Date().toDateString();
    if(!localStorage.getItem(bannerKey)){
      document.addEventListener('DOMContentLoaded',()=>{
        const banner=document.createElement('div');
        banner.className='seasonal-banner';
        banner.innerHTML=`<span class="seasonal-banner-text">${activeSeason.banner}</span><button class="seasonal-banner-close" onclick="this.parentElement.remove();localStorage.setItem('${bannerKey}','1')">✕</button>`;
        document.body.prepend(banner);
        /* Push nav down */
        const nav=document.querySelector('nav,.top-nav,.topnav');
        if(nav)nav.style.top='38px';
      });
    }

    /* Subtle falling particles */
    document.addEventListener('DOMContentLoaded',()=>{
      const emojis=activeSeason.particles;
      for(let i=0;i<12;i++){
        setTimeout(()=>{
          const p=document.createElement('div');
          p.className='seasonal-particle';
          p.textContent=emojis[Math.floor(Math.random()*emojis.length)];
          p.style.left=Math.random()*100+'vw';
          p.style.animationDuration=(8+Math.random()*12)+'s';
          p.style.animationDelay=(Math.random()*10)+'s';
          p.style.fontSize=(1+Math.random())+'rem';
          document.body.appendChild(p);
          /* Remove after animation */
          setTimeout(()=>p.remove(),(20+Math.random()*10)*1000);
        },i*800);
      }
    });
  }

  /* ── ANNIVERSARY ANIMATION ── */
  /* Site launch date: 07.05.2026 */
  const LAUNCH=new Date('2026-05-07');
  const isAnniversary=month===5&&day===7&&now.getFullYear()>2026;

  /* User registration anniversary */
  function checkUserAnniversary(){
    try{
      const auth=JSON.parse(localStorage.getItem('cc_auth')||'{}');
      if(!auth.created_at)return;
      const reg=new Date(auth.created_at);
      const regMonth=reg.getMonth()+1;
      const regDay=reg.getDate();
      if(regMonth===month&&regDay===day&&now.getFullYear()>reg.getFullYear()){
        const years=now.getFullYear()-reg.getFullYear();
        showAnniversaryAnimation(years,auth.username||'');
      }
    }catch{}
  }

  function showAnniversaryAnimation(years,username){
    const overlay=document.createElement('div');
    overlay.style.cssText='position:fixed;inset:0;z-index:99999;pointer-events:none;overflow:hidden';
    document.body.appendChild(overlay);

    /* Confetti burst */
    const colors=['#0ff4c6','#ff4f5e','#ffc832','#a78bfa','#34d399','#f97316','#f472b6'];
    for(let i=0;i<80;i++){
      const c=document.createElement('div');
      const color=colors[Math.floor(Math.random()*colors.length)];
      const size=6+Math.random()*8;
      c.style.cssText=`
        position:absolute;
        width:${size}px;height:${size}px;
        background:${color};
        border-radius:${Math.random()>.5?'50%':'2px'};
        left:${Math.random()*100}%;
        top:-10px;
        animation:confetti-fall ${2+Math.random()*3}s ${Math.random()*2}s ease-in forwards;
        opacity:${0.7+Math.random()*.3};
        transform:rotate(${Math.random()*360}deg);
      `;
      overlay.appendChild(c);
    }

    /* Anniversary card */
    const card=document.createElement('div');
    card.style.cssText=`
      position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
      background:var(--surface,#13151a);border:1px solid rgba(255,200,50,.4);
      border-radius:20px;padding:2rem 2.5rem;text-align:center;z-index:99999;
      box-shadow:0 24px 60px rgba(0,0,0,.6),0 0 40px rgba(255,200,50,.15);
      animation:annIn .5s cubic-bezier(.34,1.56,.64,1);
      font-family:'Syne',sans-serif;
      pointer-events:all;
      min-width:280px;
    `;
    card.innerHTML=`
      <div style="font-size:3rem;margin-bottom:.75rem">🎂</div>
      <div style="font-size:1.3rem;font-weight:800;color:#ffc832;margin-bottom:.4rem">
        Happy ${years} Year${years>1?'s':''}!
      </div>
      <div style="font-family:'JetBrains Mono',monospace;font-size:.8rem;color:var(--muted,#6b7280);line-height:1.7;margin-bottom:1.2rem">
        ${username?`<strong style="color:var(--text,#e8eaf0)">${username}</strong>,<br>`:''}
        You've been a member for <strong style="color:#ffc832">${years} year${years>1?'s':''}</strong>!<br>
        Thanks for being part of Conch & Cmdr. 🎉
      </div>
      <button onclick="this.closest('div[style]').remove();document.getElementById('ann-overlay')?.remove()" style="
        font-family:'JetBrains Mono',monospace;font-size:.78rem;padding:.55rem 1.3rem;
        border-radius:8px;border:1px solid rgba(255,200,50,.35);
        background:rgba(255,200,50,.1);color:#ffc832;cursor:pointer;transition:all .2s
      ">🎊 Celebrate!</button>
    `;
    overlay.id='ann-overlay';
    overlay.style.pointerEvents='none';
    overlay.appendChild(card);
    card.style.pointerEvents='all';

    const style=document.createElement('style');
    style.textContent=`
      @keyframes confetti-fall{
        0%{transform:translateY(0) rotate(0deg);opacity:1}
        100%{transform:translateY(100vh) rotate(720deg);opacity:0}
      }
      @keyframes annIn{
        from{opacity:0;transform:translate(-50%,-50%) scale(.8)}
        to{opacity:1;transform:translate(-50%,-50%) scale(1)}
      }
    `;
    document.head.appendChild(style);

    /* Auto-remove after 8 seconds */
    setTimeout(()=>overlay.remove(),8000);
  }

  /* Also show site anniversary */
  if(isAnniversary){
    document.addEventListener('DOMContentLoaded',()=>{
      const years=now.getFullYear()-2026;
      const toast=document.createElement('div');
      toast.style.cssText=`
        position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;
        background:var(--surface,#13151a);border:1px solid rgba(255,200,50,.35);
        border-radius:10px;padding:.75rem 1.1rem;font-family:'JetBrains Mono',monospace;
        font-size:.75rem;color:#ffc832;box-shadow:0 8px 24px rgba(0,0,0,.4);
        animation:tIn .3s ease;display:flex;align-items:center;gap:.5rem
      `;
      toast.innerHTML=`🎂 <span>Conch & Cmdr is <strong>${years} year${years>1?'s':''} old</strong> today!</span><button onclick="this.parentElement.remove()" style="background:none;border:none;cursor:pointer;color:#ffc832;opacity:.5;font-size:.85rem;margin-left:.3rem">✕</button>`;
      document.body.appendChild(toast);
      setTimeout(()=>toast.remove(),6000);
    });
  }

  /* Run user anniversary check after auth is loaded */
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>setTimeout(checkUserAnniversary,1500));
  }else{
    setTimeout(checkUserAnniversary,1500);
  }

})();
