import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const clientId = "b0467750a6214385ae3cdbecbf9277cd"; 
const redirectUri = window.location.hostname === 'localhost' ? 'http://127.0.0.1:5173' : 'https://no2ta.github.io/listen-to-me/';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.FogExp2(0x000000, 0.06);
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 3;
controls.maxDistance = 15;
const homePosition = new THREE.Vector3(0, 0, 8); 
let isUserInteracting = false;
controls.addEventListener('start', () => {
  isUserInteracting = true;
});
controls.addEventListener('end', () => {
  isUserInteracting = false;
});





const geometry = new THREE.BoxGeometry( 5, 6, 0.2 );
const material = new THREE.MeshStandardMaterial( { color: 'rgb(130, 127, 120)' } );
const planeGeometry = new THREE.PlaneGeometry( 20, 20 );
const planeMaterial = new THREE.MeshStandardMaterial( { 
  color: '#050505',
  roughness: 0.3,
  metalness: 0.9
} );
const plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.rotation.x = -Math.PI / 2;
plane.position.y = -3.5; 
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
const pointLight = new THREE.PointLight(0xffffff, 5.0, 0, 1); pointLight.position.set(0, 5, 3); 
const pointLight2 = new THREE.PointLight(0xffffff, 5.0, 0, 1); pointLight2.position.set(0, 5, -3); 
const pointLight3 = new THREE.PointLight(0xffffff, 5.0, 0, 3); pointLight3.position.set(5, 0, 0); 
const pointLight4 = new THREE.PointLight(0xffffff, 5.0, 0, 3); pointLight4.position.set(-5, 0, 0); 
const pointLight5 = new THREE.PointLight(0xffffff, 5.0, 0, 3); pointLight5.position.set(0, -6, 0); 

scene.add(pointLight); scene.add(pointLight2); scene.add(pointLight3); scene.add(pointLight4); scene.add(pointLight5); scene.add(ambientLight);
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );
scene.add( plane );

camera.position.z = 8;

let currentTrackId = null;
let pendingTexture = null;
let animationPhase = 'idle';

function animate( time ) {
  const speed = time / 1500; 
  cube.rotation.y = Math.sin(speed) * (Math.PI / 4);
  if (!isUserInteracting) {
  camera.position.lerp(homePosition, 0.05); 
  }

  if (animationPhase === 'slideOutRight') {
    cube.position.x += 0.4;
    if (cube.position.x > 12) {
      if (pendingTexture) {
        material.map = pendingTexture; 
        material.color.set(0xffffff); 
        material.needsUpdate = true;
        pendingTexture = null;
      }
      cube.position.x = -12;
      animationPhase = 'slideInFromLeft';
    }
  } else if (animationPhase === 'slideInFromLeft') {
    cube.position.x += 0.4;
    if (cube.position.x >= 0) {
      cube.position.x = 0;
      animationPhase = 'idle';
    }
  }

  controls.update();
  renderer.render( scene, camera );
}




//the tuff spotify security basically generating password for spotify cause of the new system i guess (idk i read it) anyways its a function generating a random password from alaphpets and numbers 
//the crypto.getrandom values gives number from 0 to 256 and the modulus just simplifies the number to be from 0 to the length of the tottal letters (62) then it returns the password at the end
function generateRandomString(howManyCharacters) {
  const allowed = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const rawNumbers = crypto.getRandomValues(new Uint8Array(howManyCharacters));
  let finalWord = "";
  for (let i = 0; i < howManyCharacters; i = i + 1) {
    let currentRandomNumber = rawNumbers[i];
    let positionInMenu = currentRandomNumber % allowed.length;
    let picked = allowed[positionInMenu];
    finalWord = finalWord + picked;
    
  }
  return finalWord;
  
}

//please do not ask me how this work i found it online and it does work, iam grateful. that it just copy it and shut up.
async function sha256(plain) { return window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(plain)); }
function base64urlencode(a) { return btoa(String.fromCharCode(...new Uint8Array(a))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_'); }

async function getToken(code) {
    const proxyUrl = window.location.hostname === 'localhost' ? '/spotify-token' : 'https://spotify-proxy.abdelrahmanashraf1987.workers.dev/';
  const response = await fetch(proxyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId, grant_type: 'authorization_code', code: code,
      redirect_uri: redirectUri, code_verifier: localStorage.getItem('code_verifier')
    })
  });
  return await response.json();
}




const loginBtn = document.createElement('button');
loginBtn.textContent = 'Connect Spotify';
loginBtn.style.cssText = 'position:absolute;inset:0;margin:auto;width:fit-content;height:fit-content;z-index:100;padding:15px 30px;font-size:18px;background-color:#1DB954;color:white;border:none;border-radius:30px;cursor:pointer;';
document.body.appendChild(loginBtn);

const prevBtn = document.createElement('button');
prevBtn.innerHTML = '&#10094;';
prevBtn.style.cssText = 'position:absolute;left:0;top:50%;transform:translateY(-50%);background:rgba(0,0,0,0.5);color:white;border:none;padding:20px;cursor:pointer;font-size:24px;z-index:100;backdrop-filter:blur(5px);border-radius:0 10px 10px 0;display:none;';
document.body.appendChild(prevBtn);

const nextBtn = document.createElement('button');
nextBtn.innerHTML = '&#10095;';
nextBtn.style.cssText = 'position:absolute;right:0;top:50%;transform:translateY(-50%);background:rgba(0,0,0,0.5);color:white;border:none;padding:20px;cursor:pointer;font-size:24px;z-index:100;backdrop-filter:blur(5px);border-radius:10px 0 0 10px;display:none;';
document.body.appendChild(nextBtn);


function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

const playerUI = document.createElement('div');
playerUI.style.cssText = 'position:absolute;top:20px;left:50%;transform:translateX(-50%);width:320px;background:rgba(18,18,18,0.95);padding:15px 20px;border-radius:15px;border:1px solid rgba(255,255,255,0.1);text-align:center;font-family:sans-serif;z-index:100;display:none;box-shadow:0 4px 15px rgba(0,0,0,0.5);backdrop-filter:blur(10px);';

const trackInfo = document.createElement('div');
trackInfo.style.cssText = 'color:#ffffff;font-size:13px;font-weight:600;margin-bottom:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:0.5px;';

const progressContainer = document.createElement('div');
progressContainer.style.cssText = 'width:100%;height:4px;background:rgba(255,255,255,0.1);border-radius:2px;margin-bottom:8px;cursor:pointer;';

const progressBar = document.createElement('div');
progressBar.style.cssText = 'width:0%;height:100%;background:#1DB954;border-radius:2px;transition:width 0.5s linear;';
progressContainer.appendChild(progressBar);

const timeInfo = document.createElement('div');
timeInfo.style.cssText = 'color:#b3b3b3;font-size:11px;display:flex;justify-content:space-between;';

const currentTimeEl = document.createElement('span');
const totalTimeEl = document.createElement('span');
timeInfo.appendChild(currentTimeEl);
timeInfo.appendChild(totalTimeEl);

playerUI.appendChild(trackInfo);
playerUI.appendChild(progressContainer);
playerUI.appendChild(timeInfo);
document.body.appendChild(playerUI);








async function startSpotify() {
  const token = sessionStorage.getItem('access_token');
  
  if (token) {
    loginBtn.style.display = 'none';
    setupControls(token);
    startFetchingSong(token);
  } else {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      loginBtn.textContent = "Logging in...";
      const data = await getToken(code);
      
      if (data.access_token) {
        const token = data.access_token;
        sessionStorage.setItem('access_token', token);
        window.history.replaceState({}, document.title, "/");
        loginBtn.style.display = 'none';
        setupControls(token);
        startFetchingSong(token);
      } else {
        window.history.replaceState({}, document.title, "/");
        loginBtn.textContent = "Connect Spotify";
        loginBtn.disabled = false;
      }
    } else {
      loginBtn.onclick = async () => {
        loginBtn.disabled = true;
        loginBtn.textContent = "Redirecting to Spotify...";
        const codeVerifier = generateRandomString(64);
        localStorage.setItem('code_verifier', codeVerifier);
        const hashed = await sha256(codeVerifier);
        const codeChallenge = base64urlencode(hashed);
        window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=user-read-currently-playing user-modify-playback-state&code_challenge=${codeChallenge}&code_challenge_method=S256`;      };
    }
  }
}

function setupControls(token) {
  prevBtn.style.display = 'block';
  nextBtn.style.display = 'block';

  prevBtn.onclick = async () => {
    await fetch('https://api.spotify.com/v1/me/player/previous', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  };

  nextBtn.onclick = async () => {
    await fetch('https://api.spotify.com/v1/me/player/next', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  };
}

function startFetchingSong(token) {
  setInterval(async () => {
    try {
      const result = await fetch('https://api.spotify.com/v1/me/player/currently-playing', { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });

      
      if (result.status === 204) return; // No song playing
      const data = await result.json();
      if (data.error) return; // Token expired or error

      if (data && data.item) {
        const newTrackId = data.item.id;
        
        playerUI.style.display = 'block';
        const songName = data.item.name;
        const artistName = data.item.artists.map(a => a.name).join(', ');
        trackInfo.textContent = `${artistName} - ${songName}`;

        const progress = data.progress_ms || 0;
        const duration = data.item.duration_ms || 1;

        currentTimeEl.textContent = formatTime(progress);
        totalTimeEl.textContent = formatTime(duration);

        const percent = (progress / duration) * 100;
        progressBar.style.width = `${percent}%`;

        if (newTrackId !== currentTrackId) {
          currentTrackId = newTrackId;
          const imgUrl = data.item.album.images[0].url;
          const loader = new THREE.TextureLoader();
          loader.crossOrigin = "anonymous";
          loader.load(imgUrl, (texture) => {
            pendingTexture = texture;
            animationPhase = 'slideOutRight';
          });
        }
      }
    } catch (err) {
    }
  }, 3000);
}

startSpotify();
