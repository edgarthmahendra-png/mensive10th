/* =====================================================
   10 MONTHS — MAHEN & SHAYLA (ISENG & SHAYLA-ONLY EDITION)
===================================================== */

const audio = document.getElementById("global-audio");
const screens = document.querySelectorAll(".screen");
const toast = document.getElementById("notification-toast");
const toastMessage = document.getElementById("toast-message");
const STORAGE_KEY = "mahen_shayla_10m_v1";

let state = {
  userName: "Shayla",
  discoveredRooms: [],
  secretUnlocked: false
};

/* =====================================================
   STORAGE & TOAST
===================================================== */
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (saved) state = { ...state, ...saved };
} catch (e) {
  console.log("Fresh start.");
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let toastTimer;
function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}

/* =====================================================
   SCREEN SYSTEM & CONFETTI
===================================================== */
function showScreen(id) {
  screens.forEach(s => s.classList.remove("active"));
  const target = document.getElementById(id);
  if (!target) return;
  target.classList.add("active");

  if (id === "room-final") {
    setupSecretVideo();
    if (typeof confetti === 'function') {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  } else {
    stopSecretVideo();
  }
  window.scrollTo(0, 0);
}

/* =====================================================
   TOGETHER TIMER
===================================================== */
const START_DATE = new Date("2025-11-19T00:00:00"); // Sesuaikan tanggal jadian kalian

function updateTimer() {
  const timerText = document.getElementById("timer-text");
  if (!timerText) return;

  const now = new Date();
  const diff = now - START_DATE;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);

  timerText.textContent = `${days} Days, ${hours} Hours, ${mins} Mins 💕`;
}
setInterval(updateTimer, 1000);

/* =====================================================
   LANDING (KHUSUS NAMA SHAYLA)
===================================================== */
const nameInput = document.getElementById("user-name-input");
const submitName = document.getElementById("btn-submit-name");

function startExperience() {
  let name = nameInput.value.trim();
  
  // Pengecekan nama: Wajib mengandung kata "shayla"
  if (!name || !name.toLowerCase().includes("shayla")) {
    showToast("Eits! Cuma SHAYLA yang boleh masuk! Siapa lu? 😜");
    nameInput.value = "";
    return;
  }

  state.userName = name;
  saveState();
  
  document.getElementById("opening-title").textContent = `Hi, ${name} Cantik! ✨`;
  document.getElementById("opening-text").textContent = "Aku udah siapin dunia kecil khusus buat kamu. Masuk yuk!";
  submitName.textContent = "Enter →";

  submitName.onclick = () => {
    updateHubName();
    updateTimer();
    showScreen("screen-hub");
  };
}

submitName.addEventListener("click", startExperience);
nameInput.addEventListener("keydown", e => e.key === "Enter" && startExperience());

/* =====================================================
   HUB NAVIGATION
===================================================== */
function updateHubName() {
  document.getElementById("display-user-name").textContent = state.userName;
}

function updateRoomCounter() {
  document.getElementById("rooms-discovered-count").textContent = state.discoveredRooms.length;
  updateSecretStatus();
}

function updateSecretStatus() {
  const badge = document.getElementById("badge-final");
  const subtitle = document.getElementById("final-card-sub");

  if (state.discoveredRooms.length >= 5) {
    state.secretUnlocked = true;
    badge.textContent = "OPEN";
    subtitle.textContent = "something's waiting ✨";
  } else {
    state.secretUnlocked = false;
    badge.textContent = "LOCKED";
    subtitle.textContent = `${5 - state.discoveredRooms.length} rooms left`;
  }
  saveState();
}

function discoverRoom(room) {
  if (!state.discoveredRooms.includes(room)) {
    state.discoveredRooms.push(room);
    saveState();
    updateRoomCounter();
  }
}

document.querySelectorAll(".room-card").forEach(card => {
  card.addEventListener("click", () => {
    const room = card.dataset.room;
    if (room === "final" && !state.secretUnlocked) {
      showToast("Eits! Selesaikan dulu 5 ruangan lain ya woi 😜");
      return;
    }
    if (room !== "final") discoverRoom(room);
    showScreen(`room-${room}`);
  });
});

document.querySelectorAll("[data-back='hub']").forEach(btn => {
  btn.addEventListener("click", () => showScreen("screen-hub"));
});

/* =====================================================
   MUSIC PLAYER
===================================================== */
const tracks = [
  { title: "Akad", artist: "Payung Teduh", file: "image/Akad.mp3" },
  { title: "Panasea", artist: "Rumah Sakit", file: "image/Panasea.mp3" },
  { title: "Kita Lewati Berdua", artist: "Overnight", file: "image/Kita Lewati Berdua.mp3" },
  { title: "Tunggu Aku di Jakarta", artist: "Sheila On 7", file: "image/Tunggu Aku di Jakarta.mp3" },
  { title: "Hanya Untukmu", artist: "Ten2Five", file: "image/Hanya Untukmu.mp3" }
];

let currentTrack = 0, isPlaying = false;
const playPauseButton = document.getElementById("btn-play-pause");
const cdDisc = document.getElementById("cd-disc");

function loadTrack(index) {
  if (!tracks[index]) return;
  currentTrack = index;
  audio.src = tracks[currentTrack].file;
  document.getElementById("current-song-title").textContent = tracks[currentTrack].title;
  document.getElementById("current-artist").textContent = tracks[currentTrack].artist;
  audio.load();
  renderPlaylist();
}

function renderPlaylist() {
  const playlist = document.getElementById("playlist");
  playlist.innerHTML = "";
  tracks.forEach((track, index) => {
    const item = document.createElement("button");
    item.className = `playlist-item ${index === currentTrack ? "active" : ""}`;
    item.innerHTML = `
      <span class="playlist-number">${String(index + 1).padStart(2, "0")}</span>
      <span class="playlist-info"><strong>${track.title}</strong><small>${track.artist}</small></span>
    `;
    item.addEventListener("click", () => { loadTrack(index); playAudio(); });
    playlist.appendChild(item);
  });
}

function playAudio() {
  audio.play().then(() => {
    isPlaying = true;
    playPauseButton.textContent = "❚❚";
    cdDisc.classList.add("spinning");
  }).catch(() => showToast("Klik tombol Play untuk putar musik."));
}

function pauseAudio() {
  audio.pause();
  isPlaying = false;
  playPauseButton.textContent = "▶";
  cdDisc.classList.remove("spinning");
}

playPauseButton.addEventListener("click", () => isPlaying ? pauseAudio() : playAudio());
document.getElementById("btn-prev-track").addEventListener("click", () => {
  currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
  loadTrack(currentTrack); playAudio();
});
document.getElementById("btn-next-track").addEventListener("click", () => {
  currentTrack = (currentTrack + 1) % tracks.length;
  loadTrack(currentTrack); playAudio();
});
audio.addEventListener("ended", () => {
  currentTrack = (currentTrack + 1) % tracks.length;
  loadTrack(currentTrack); playAudio();
});

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  document.getElementById("progress-bar").style.width = `${(audio.currentTime / audio.duration) * 100}%`;
  document.getElementById("curr-time").textContent = formatTime(audio.currentTime);
});
audio.addEventListener("loadedmetadata", () => {
  document.getElementById("dur-time").textContent = formatTime(audio.duration);
});
document.getElementById("progress-container").addEventListener("click", e => {
  if (!audio.duration) return;
  const rect = e.currentTarget.getBoundingClientRect();
  audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
});
document.getElementById("volume-slider").addEventListener("input", e => audio.volume = Number(e.target.value));

function formatTime(sec) {
  if (!Number.isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60), s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/* =====================================================
   ALBUM
===================================================== */
const albumItems = [
  { type: "image", file: "image/Dino.jpeg", title: "Dino Jakaltim Jaktim Kaltim", caption: "HAHAHA AWAL AWAL PAP PAP NIH UHUY:V" },
  { type: "image", file: "image/Chat.jpeg", title: "Apa apa", caption: "Bilang aje nape kalo kamu mau sama ADAM ADAM itu beyy" },
  { type: "image", file: "image/190925.jpeg", title: "19.09.25", caption: "Apa nih, oh pas mengajak pacaran ye?? Alamak gacor betul wakk" },
  { type: "image", file: "image/Freak chat.jpeg", title: "Freak Chat", caption: "WTFFF, INI PAS SESI AKU NGAJAK KAMU PACARAN BUKAN BEY??? HAH PLENGER COKKKKK baru beberapa hari anjirr woilah aku masih malu bey jujur tapi masuk album ini HAHAHAAHAAHAHH BODOAMAT AKU PLENGERRRR" },
  { type: "image", file: "image/pasang preset.jpeg", title: "Preset cok", caption: "Oh pasang preset? 64gb itu ye yang mau pasang preset? astaga lupa ey kirain fans kemain mah ternyata PACARKU COK anjay kelass" },
  { type: "image", file: "image/Sv kizu.jpeg", title: "Kizu Nak Di Save", caption: "Minta di save apa minta hatiku ini kak? kakak panitia? lupain aja yang di coret-_" },
  { type: "video", file: "image/Mukbang.mp4", title: "Mukbang", caption: "Dari banyaknya rec roblox kita bey, ini yang abadi HAHAHAAH bismillah14" }
];

function renderAlbum() {
  const grid = document.getElementById("album-grid");
  grid.innerHTML = "";
  albumItems.forEach((item, index) => {
    const card = document.createElement("button");
    card.className = "album-card";
    card.innerHTML = `
      <div class="album-media">${item.type === "video" ? `<video src="${item.file}" muted playsinline></video>` : `<img src="${item.file}">`}</div>
      <div class="album-card-info"><strong>${item.title}</strong><span>${item.caption}</span></div>
    `;
    card.addEventListener("click", () => openAlbumModal(index));
    grid.appendChild(card);
  });
}

let currentAlbumIndex = 0;
const photoModal = document.getElementById("photo-modal");

function openAlbumModal(index) {
  currentAlbumIndex = index;
  const item = albumItems[index];
  document.getElementById("modal-title").textContent = item.title;
  document.getElementById("modal-caption").textContent = item.caption;

  const img = document.getElementById("modal-img");
  const vid = document.getElementById("modal-video");
  img.style.display = "none"; vid.style.display = "none"; vid.pause();

  if (item.type === "image") {
    img.src = item.file; img.style.display = "block";
  } else {
    vid.querySelector("source").src = item.file; vid.load(); vid.style.display = "block";
  }
  photoModal.classList.add("show");
}

document.getElementById("modal-close").addEventListener("click", () => {
  photoModal.classList.remove("show");
  document.getElementById("modal-video").pause();
});
document.getElementById("modal-prev").addEventListener("click", () => openAlbumModal((currentAlbumIndex - 1 + albumItems.length) % albumItems.length));
document.getElementById("modal-next").addEventListener("click", () => openAlbumModal((currentAlbumIndex + 1) % albumItems.length));

/* =====================================================
   GAME SUPER ISENG
===================================================== */
const gameStage = document.getElementById("game-stage");
let currentGameLevel = 0;

const gameLevels = [
  {
    title: "Level 1 — Catch Me",
    render() {
      gameStage.innerHTML = `
        <div class="game-message">
          <h2>Tekan tombolnya.</h2>
          <p>Gampang kan?</p>
          <button id="game-target">KLIK AKU</button>
        </div>`;
      document.getElementById("game-target").onclick = nextGameLevel;
    }
  },
  {
    title: "Level 2 — Tombol Kabur",
    render() {
      gameStage.innerHTML = `
        <div class="game-message">
          <h2>Sini klik kalo bisa BOTT 😜</h2>
          <button id="game-target" style="transition: 0.1s ease;">EITS GAK BISA</button>
        </div>`;
      const btn = document.getElementById("game-target");
      const dodge = () => {
        btn.style.position = "absolute";
        btn.style.left = `${Math.random() * 60 + 10}%`;
        btn.style.top = `${Math.random() * 60 + 10}%`;
      };
      btn.addEventListener("mouseenter", dodge);
      btn.addEventListener("touchstart", dodge);
      btn.onclick = nextGameLevel;
    }
  },
  {
    title: "Level 3 — Status Hubungan",
    render() {
      gameStage.innerHTML = `
        <div class="game-message">
          <h2>Aku ini siapanya kamu bey 🤔</h2>
          <div class="game-options" style="display:flex; gap:10px; justify-content:center; margin-top:15px; flex-wrap:wrap;">
            <button data-ans="teman">Teman Biasa</button>
            <button data-ans="musuh">Musuh Bebuyutan</button>
            <button data-ans="right">Kekasih pujaan hati</button>
            <button data-ans="asing">Orang Asing</button>
          </div>
        </div>`;
      
      gameStage.querySelectorAll("[data-ans]").forEach(b => {
        b.onclick = () => {
          const type = b.dataset.ans;
          if (type === "right") {
            nextGameLevel();
          } else if (type === "teman") {
            showToast("Teman biasa palamu! Masa udah 10 bulan cuma temenan? 😭 teman hidup kali??");
          } else if (type === "musuh") {
            showToast("Musuh tapi kok kalo kangen nyariin?? 😜");
          } else if (type === "asing") {
            showToast("Sok-sokan asing, ntar aku pergi beneran nangis LAP INGUS eeemaap bey");
          }
        };
      });
    }
  },
  {
    title: "Level 4 — Ujian Kesabaran",
    render() {
      gameStage.innerHTML = `
        <div class="game-message">
          <h2>Satu pertanyaan penting:</h2>
          <p>Mau lanjut terus sama KAFKA GANTENK?</p>
          <div class="game-options" style="display:flex; gap:15px; justify-content:center; margin-top:15px;">
            <button id="game-yes">MAU BANGET!</button>
            <button id="game-no" style="position:relative;">ENGGAK</button>
          </div>
        </div>`;
      document.getElementById("game-yes").onclick = nextGameLevel;
      
      const noBtn = document.getElementById("game-no");
      const responsesNo = [
        "Tombol 'ENGGAK' lagi mogok! 😜",
        "Eits gabisa! Jawabannya cuma satu woi",
        "Yakin ga mau? Nanti nyesel loh!",
        "Dibilang gabisa dipencet juga! Harus mau 🤪"
      ];
      let noCount = 0;
      
      noBtn.onclick = () => {
        showToast(responsesNo[noCount % responsesNo.length]);
        noCount++;
      };
    }
  },
  {
    title: "Level 5 — WARNING ALERT! ⚠️",
    render() {
      gameStage.innerHTML = `
        <div class="game-message">
          <h2 style="color:#ff4d4d;">⚠️ HP KAMU DIPATUK DINO! ⚠️</h2>
          <p>Sistem akan menghapus semua foto kenangan dalam 3 detik...</p>
          <button id="game-finish" style="margin-top:15px; background: #e74c3c;">BATALKAN DENGAN PELUK!</button>
        </div>`;
      document.getElementById("game-finish").onclick = finishGame;
    }
  }
];

function startGame() { currentGameLevel = 0; renderGameLevel(); }
function renderGameLevel() {
  const level = gameLevels[currentGameLevel];
  if (!level) return;
  document.getElementById("game-level-title").textContent = level.title;
  document.getElementById("game-level-indicator").textContent = `${currentGameLevel + 1} / ${gameLevels.length}`;
  level.render();
}
function nextGameLevel() {
  if (currentGameLevel < gameLevels.length - 1) { currentGameLevel++; renderGameLevel(); }
}
function finishGame() {
  discoverRoom("game");
  showToast("Selamat! yayaya selamat pasti cit");
  showScreen("screen-hub");
}

const gameRoom = document.getElementById("room-game");
new MutationObserver(() => {
  if (gameRoom.classList.contains("active")) startGame();
}).observe(gameRoom, { attributes: true, attributeFilter: ["class"] });

document.getElementById("btn-game-exit").onclick = () => document.getElementById("bot-exit-modal").classList.add("show");
document.getElementById("btn-bot-stay").onclick = () => document.getElementById("bot-exit-modal").classList.remove("show");
document.getElementById("btn-bot-leave").onclick = () => {
  document.getElementById("bot-exit-modal").classList.remove("show");
  showToast("YAHAHAH BOT KABUR!");
  setTimeout(() => showScreen("screen-hub"), 900);
};

/* =====================================================
   LETTERS & ARCHIVE
===================================================== */
const letters = [
  { tag: "01", title: "OPEN WHEN... MISS ME", text: "bebey kalo kangen bilang aja, soalnya aku juga kangen hehehe. don't be shy to text me first, okey beyy?" },
  { tag: "02", title: "OPEN WHEN... BAD DAY", text: "take a deep breath. bad days happen, but you don't have to go through them alone anymore. I'm right here." },
  { tag: "03", title: "OPEN WHEN... NEED A LAUGH", text: "remember when I hid in that brown Roblox tree while you spent 10 minutes searching? 10/10 stealth movee." },
  { tag: "04", title: "OPEN WHEN... JUST WANNA HEAR FROM ME", text: "nothing crazy to say, just wanted to remind you that choosing you was the best decision I ever made." }
];

function renderLetters() {
  const grid = document.getElementById("envelopes-grid");
  grid.innerHTML = "";
  letters.forEach((l, i) => {
    const card = document.createElement("button");
    card.className = "letter-card";
    card.innerHTML = `<span class="letter-number">${l.tag}</span><div class="envelope">💌</div><h2>${l.title}</h2>`;
    card.onclick = () => {
      document.getElementById("letter-modal-tag").textContent = l.title;
      document.getElementById("letter-modal-text").textContent = l.text;
      document.getElementById("letter-modal").classList.add("show");
    };
    grid.appendChild(card);
  });
}
document.getElementById("letter-modal-close").onclick = () => document.getElementById("letter-modal").classList.remove("show");

const chapters = [
  { date: "11 APRIL 2025", title: "WHERE IT ALL STARTED", text: "Bebeyy, p info pasang preset HAHAHAHA. Bey bercanda ya Allah jangan marah, I’m just tryna remember how we even started. Like, it all began with me wanting to help and u needing some help, padahal isi LPM tuh rame banget sama orang kinda funny ngl… out of all those people, somehow it was us. I wanna remember this forever, sampe mampus HAHAHA." },
  { date: "MID 2025", title: "THE RECHAT ERA", text: "Nah ini, beyy. Makasih ya udah selalu rechat temen-temen kamu, including me. Kalo waktu itu kamu nggak rechat, maybe we’d never get this far. Paling cuma stuck jadi temen, saling sv terus yaudah kelar HAHAHA. But you kept rechatting, and you were fun as hell to talk to. So yeah, I started getting interested in being friends with you. Lama lama kita sering temp bareng, ketawa ketawa, lucu lucuan, even roasting each other like it was nothing. Makasih bey, because of you I ended up having someone I can actually walk through life with. Even if we’re walking on our own paths, at least there’s someone holding my hand so I don’t accidentally jump into a crocodile pit WKWKWK. Ntar aku di makan idup idup lagi." },
  { date: "2025", title: "THE “NEW PAGE” INCIDENT", text: "Maaf bey, this is probably the freakiest chapter setelah aku ngasih kamu link gift itu… surat itu bey malu banget aku kalo inget, bebeyy. Maafin ya bey hehehe. I really went “let’s turn a new page” jirrr, gaya banget si Kafka waktu itu. Terus kelar itu kamu terima kan? I mean, aku emang maunya kita pacaran, terus aku berpesan disitu kalo aku juga nggak siap kek dahlah. BUT WHY WAS I SO PLENGER BEY 😭 ASTAGA HAHAHA. P sorry bey, akuu malu banget. I was acting like some dumb lil kid, demi dah ✌🏻 Mana baru awal kenal, belum genap sebulan udah sok gaya ngajak buka lembaran baru WKWKWK. Untung aku plenger, kalo nggak makin malu kali aku sekarang. Tapi tetap aja malu bey… soalnya sekarang kamu beneran pacar akuu. Looking back at that shit is crazy, love you HAHAHA ❤️" },
  { date: "2025", title: "THE VANISHING CHAPTER", text: "Terus ada satu momen kita nggak komunikasi for months karena waktu itu aku milih buat kelarin RL dulu, terus sekalian lepas dari Tele. For a while, I really thought that was probably the end of our little story. We went our separate ways, masing-masing dengan hidup masing-masing, tanpa tau bakal ketemu dan ngobrol lagi atau nggak." },
  { date: "LATE 2025", title: "YOU WERE STILL THERE?!", text: "But then I came back and somehow… plot twistnya kamu masih ngumpet di ch aku. Bey, kamu ngapain masih stay di sana waktu itu HAHAHA? Emang takdir Tuhan kali ya yang bikin aku kepikiran buat chat kamu lagi? Thanks to God and you, bebey, karena kamu masih mau stay di ch itu. And thanks to me too WKWKWK, karena waktu itu aku ada niatan buat rombak akun, terus tiba tiba keinget sama channel itu dan kepo isinya satu siapa tuh. Ternyata ada 1 orangg AND IT WAS STILL YOU HAHAHA. Sampai sekarang juga masih kamu yang stay di situ. Lucu banget dah, pacar aku sendiri ternyata masih jadi penghuni pertama di channel jelek itu." },
  { date: "LATE 2025", title: "THE CHAT THAT BROUGHT US BACK", text: "Makasih ya bey, masih aktif di Tele waktu itu. Makasih juga karena masih mau respon pesan aku setelah sekian lama. Kalo waktu itu kamu udah nggak aktif atau nggak bales, mungkin cerita kita bakal berhenti sampai situ aja. Crazy how one random chat brought us back here. Now look at you… masih di sini, malah jadi pacar akuu. Nicee alur jirlahh." },
  { date: "2025", title: "BEFORE “BEBEY” EXISTED", text: "Bey mau nanya, before we started calling each other bebey, we had baby dulu kan? Terus ada bubi juga. Before that we were always like “sayangg” and before sayang was there the whole “kakak sayang” era?? Kakak nggak tuh, dan p adek sayangg. Terus sebelum itu apa bey? Emo? Ompong? HAHAHAHA WOI OMPONG DUA, EEE TERBANG eh bukan maaf bey kepencet WKWKWK. Then there was the topi ijo sama baju oren era kan bey? BESTIIIIIII OI OI NANDE NANDEE BESTI BESTIIIII. Gila ya, dari semua panggilan random itu, akhirnya sekarang jadi bebey. Lucu juga kalo diinget lagi HAHAHA." },
  { date: "19 NOVEMBER 2025", title: "THE DUMBRET FELL FIRST", text: "Dan pas kita jadian, you literally taught me to use “aku kamu”. Padahal itu bahasa keseharian aku dari mini sampai segede gini, bey. Unik juga ya pacaran sama orang yang “gua elu, gua elu” HAHAHAHA. Bercanda bey jangan marahh. Terus pas aku nembak kamu, tangan aku gemeteran bey. My whole body turned into a vibrating phone kalau lagi ditelpon HAHAHAHA 😭 Demi apa, nervous banget waktu itu. Ngalahin pas mau present depan atasan pas PKL dahlah. Karena aku jadian sama sahabat aku sendiri hellnahh, musuh bebuyutan ini mah aslinya. Somehow I still fell in love with you, jir. Berhasil dia bikin si dombret jatuh cinta… terus si dombret malah bikin si mukbang jatuh cinta jugaa. Timbal balik namanya bey. And just like that, their little ship sailed across the oceannn ⛵ HAHAHAHA." },
  { date: "EARLY 2026", title: "LEARNING US", text: "We learned each other slowly. The good days, the bad days, the jokes, the silence, and everything between them." },
  { date: "19 SEPTEMBER 2026", title: "TEN MONTHS LATER", text: "Ten months later, we're still writing the story. And this chapter isn't the ending." }
];

function renderArchive() {
  const list = document.getElementById("chapter-list");
  list.innerHTML = "";
  chapters.forEach((c, i) => {
    const btn = document.createElement("button");
    btn.className = "chapter-button";
    btn.innerHTML = `<span>${String(i + 1).padStart(2, "0")}</span><strong>${c.title}</strong>`;
    btn.onclick = () => {
      document.getElementById("archive-file-title").textContent = c.title;
      document.getElementById("archive-content-area").innerHTML = `<span class="archive-date">${c.date}</span><p>${c.text}</p>`;
    };
    list.appendChild(btn);
  });
}

/* =====================================================
   SECRET VIDEO
===================================================== */
const secretVideo = document.getElementById("secret-video");
const videoOverlay = document.getElementById("video-overlay-play");

function setupSecretVideo() {
  const source = secretVideo.querySelector("source");
  if (source && (!source.src || !source.src.includes("image/"))) {
    source.src = "image/video.shayla.mp4";
    secretVideo.load();
  }
  videoOverlay.classList.add("show");
}

function stopSecretVideo() {
  secretVideo.pause();
  secretVideo.currentTime = 0;
  videoOverlay.classList.remove("show");
}

document.getElementById("btn-play-secret-video").onclick = () => {
  secretVideo.play().catch(() => showToast("Klik video sekali lagi untuk play."));
};
secretVideo.onplay = () => videoOverlay.classList.remove("show");
secretVideo.onpause = () => videoOverlay.classList.add("show");

/* =====================================================
   INIT
===================================================== */
updateHubName();
updateRoomCounter();
renderAlbum();
renderLetters();
renderArchive();
loadTrack(0);
audio.volume = Number(document.getElementById("volume-slider").value);
console.log("Full Script Ready & Clean!");