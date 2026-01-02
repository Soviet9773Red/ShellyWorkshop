// 1.82

fetch("/rpc/Shelly.GetDeviceInfo")
  .then(r => r.json())
  .then(info => {
    const dev = `${info.model || 'unknown'} (${info.id || ''})`;
    const fw  = `${info.ver || ''} ${info.fw_id ? '(' + info.fw_id + ')' : ''}`;
    document.getElementById('device').innerHTML =
      `<b>Device:</b> ${dev}<br><b>Firmware:</b> ${fw}`;
  })
  .catch(() => {
    document.getElementById('device').innerText = "Device info not available.";
  });

//
Promise.all([
  fetch('es6a').then(r => r.json()),
  fetch('es6b').then(r => r.json()),
  fetch('es6c').then(r => r.json())
])
.then(v => {
	const info = v[0].info; // info placed to the first json endpojnt
	document.getElementById('title').textContent =
	  info && info.name
		? info.name + " (ver." + info.ver + ", bld " + info.build + ")"
		: "Shelly Scripting (MJS) vs JavaScript Features (info unavailable)";
	  
  // v = [{t,p,r}, {t,p,r}, {t,p,r}]
  const all =
    (v[0].r || [])
    .concat(v[1].r || [], v[2].r || []);

  const tbl = document.getElementById('tbl');
  let ok=0, decl=0, no=0;

  for (let i=0; i<all.length; i++) {
    const r = all[i];

    if (r.s === 'OK') ok++;
    else if (r.l === 'Declared') decl++;
    else no++;

    const emoji =
      r.l === 'Full' ? '✅' :
      r.l === 'Declared' ? '⚠️' : '❌';

    const cls =
      r.l === 'Full' ? 'ok' :
      r.l === 'Declared' ? 'decl' : 'no';

    tbl.insertAdjacentHTML(
      'beforeend',
      `<tr><td>${i+1}</td><td>${r.f}</td><td class="${cls}">${emoji} ${r.s}</td><td class="${cls}">${r.l}</td></tr>`
    );
  }

  document.getElementById('sum').innerHTML = `<b>Test results</b> — Total: ${all.length}&nbsp;|&nbsp;✅&nbsp;Full: ${ok}&nbsp;|&nbsp;⚠️ Declared:&nbsp;${decl}&nbsp;|&nbsp;❌&nbsp;Missing:&nbsp;${no}`;

  let esLevel = "ECMAScript 3–5 (1999–2009)";
  if (ok > all.length * 0.6) esLevel = "ECMAScript 5 + partial ES6 (2015)";
  if (ok > all.length * 0.8) esLevel = "ECMAScript 6 (2015) level features";

  document.getElementById('sum').insertAdjacentHTML(
    'beforeend',
    `<br><b>JS Level:</b> ${esLevel}`
  );
})
.catch(err => {
  console.log("⚠️ Error loading ES6 test data:", err);
  document.getElementById('sum').innerHTML =
    `<b style="color:#e74c3c;">Error loading JSON data</b><br>${err}`;
});