// Granthalaya: security
/* ---------- security: passwords are stored only as SHA-256 hashes ---------- */
const sha=async(r,p)=>{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(r).toUpperCase()+'|'+p));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')};

