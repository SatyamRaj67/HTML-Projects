// =========================
// ===    VISUALIZER & UI LOGIC     ===
// =========================

document.addEventListener("DOMContentLoaded", () => {
  // --- Audio Player Setup ---
  const audio = new Audio();
  let songs = [];
  let currentSongIndex = 0;
  let isPlaying = false;

  // --- Visualizer Setup ---
  const canvas = document.getElementById("visualizer-canvas");
  const ctx = canvas.getContext("2d");
  let bars = [];
  let isVisualizerAnimating = false;
  let animationFrameId;

  const config = {
    barWidth: 5,
    gap: 5,
    minHeight: 2,
    maxHeight: 20,
    color: "#fff",
  };

  class Bar {
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.currentSize = config.minHeight;
      this.targetSize = this.currentSize;
      this.speed = Math.random() * 1.5 + 0.5;
    }

    update() {
      if (isVisualizerAnimating) {
        if (Math.abs(this.targetSize - this.currentSize) < 1) {
          this.targetSize =
            Math.random() * (config.maxHeight - config.minHeight) +
            config.minHeight;
        }
      } else {
        this.targetSize = config.minHeight;
      }
      this.currentSize +=
        (this.targetSize - this.currentSize) * 0.1 * this.speed;
    }

    draw() {
      ctx.fillStyle = config.color;
      ctx.fillRect(this.x, this.y, this.currentSize, this.height);
    }
  }

  function initVisualizer() {
    canvas.width = 320;
    canvas.height = 500;
    bars = [];
    const totalBarSpace = config.barWidth + config.gap;

    for (let i = 0; i < canvas.height; i += totalBarSpace) {
      bars.push(new Bar(0, i, 0, config.barWidth, true));
    }

    for (let i = 0; i < canvas.height; i += totalBarSpace) {
      const bar = new Bar(0, i, 0, config.barWidth, true);
      bar.draw = function () {
        ctx.fillStyle = config.color;
        ctx.fillRect(
          canvas.width - this.currentSize,
          this.y,
          this.currentSize,
          this.height
        );
      };
      bars.push(bar);
    }
  }

  function animateVisualizer() {
    let allBarsAtMin = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bars.forEach((bar) => {
      bar.update();
      bar.draw();
      if (Math.ceil(bar.currentSize) > config.minHeight) {
        allBarsAtMin = false;
      }
    });

    if (isVisualizerAnimating || !allBarsAtMin) {
      animationFrameId = requestAnimationFrame(animateVisualizer);
    }
  }

  function startVisualizer() {
    if (isVisualizerAnimating) return;
    isVisualizerAnimating = true;
    cancelAnimationFrame(animationFrameId);
    animateVisualizer();
  }

  function stopVisualizer() {
    isVisualizerAnimating = false;
  }

  initVisualizer();

  window.addEventListener("resize", initVisualizer);

  // ========================
  // ===           UI ELEMENTS            ===
  // ========================
  const aboutViewBtn = document.getElementById("about-view-btn");
  const playerTabBtn = document.getElementById("player-tab-btn");
  const playlistTabBtn = document.getElementById("playlist-tab-btn");
  const wrapper = document.querySelector(".wrapper");
  const navButtons = document.querySelectorAll(".navbar button");

  const handleTabClick = (transform, clickedBtn) => {
    wrapper.style.transform = transform;
    navButtons.forEach((btn) => btn.classList.remove("current"));
    clickedBtn.classList.add("current");
  };

  if (playerTabBtn && playlistTabBtn && aboutViewBtn && wrapper) {
    playerTabBtn.addEventListener("click", () => {
      document.body.classList.remove("active");
      handleTabClick("translateX(0%)", playerTabBtn);
    });
    playlistTabBtn.addEventListener("click", () => {
      document.body.classList.add("active");
      handleTabClick("translateX(-33.33%)", playlistTabBtn);
    });
    aboutViewBtn.addEventListener("click", () => {
      document.body.classList.add("active");
      handleTabClick("translateX(-66.67%)", aboutViewBtn);
    });
    playerTabBtn.classList.add("current");
  }

  // =====================
  // ===      Playlist Loading      ===
  // =====================
  const playlistContainer = document.getElementById("playlist-container");
  if (playlistContainer) {
    fetch("data.json")
      .then((response) => response.json())
      .then((data) => {
        songs = data.songs;
        data.songs.forEach((song, index) => {
          const songItem = document.createElement("div");
          songItem.classList.add("playlist-item");
          songItem.innerHTML = `
            <img src="${song.cover_img}" alt="${song.title}">
            <div >
              <h3 >${song.title}</h3>
              <p>${song.artists.join(", ")}</p>
            </div>
          `;
          playlistContainer.appendChild(songItem);
          songItem.addEventListener("click", () => {
            playSong(index);
          });
        });
        // Load the first song initially
        if (songs.length > 0) {
          loadSong(currentSongIndex);
        }
      })
      .catch((error) => console.error("Error loading playlist:", error));
  }

  // ========================
  // ===          Player Controls           ===
  // ========================
  const playPauseBtn = document.getElementById("play-pause-btn");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const songImg = document.getElementById("song-img");
  const controlsSongImg = document.getElementById("controls-song-img");
  const songTitle = document.getElementById("song-title");
  const songArtist = document.getElementById("song-artist");
  const timeline = document.getElementById("timeline");
  const currentTimeEl = document.querySelector(".current-time");
  const songLengthEl = document.querySelector(".song-length");
  const volumeBtn = document.getElementById("volume-btn");
  const volumeSlider = document.getElementById("volume-slider");
  const volumeControl = document.querySelector(".volume-control");

  function loadSong(index) {
    const song = songs[index];
    audio.src = song.music;
    updateUI(song);
  }

  function playSong(index) {
    currentSongIndex = index;
    loadSong(currentSongIndex);
    audio.play();
  }

  function updateUI(song) {
    songImg.src = song.cover_img;
    controlsSongImg.src = song.cover_img;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artists.join(", ");
    document.documentElement.style.setProperty("--accent", song.accent_color);
  }

  function togglePlayPause() {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }

  function playNext() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playSong(currentSongIndex);
  }

  function playPrev() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSong(currentSongIndex);
  }

  audio.addEventListener("play", () => {
    isPlaying = true;
    playPauseBtn.checked = true;
    startVisualizer();
  });

  audio.addEventListener("pause", () => {
    isPlaying = false;
    playPauseBtn.checked = false;
    stopVisualizer();
  });

  audio.addEventListener("ended", () => {
    playNext();
  });

  audio.addEventListener("timeupdate", () => {
    const { currentTime, duration } = audio;
    timeline.max = duration || 0;
    timeline.value = currentTime;
    currentTimeEl.textContent = formatTime(currentTime);
    if (duration) {
      songLengthEl.textContent = formatTime(duration);
    }
  });

  audio.addEventListener("loadedmetadata", () => {
    songLengthEl.textContent = formatTime(audio.duration);
    timeline.max = audio.duration;
  });

  volumeBtn.addEventListener("click", () => {
    volumeControl.classList.toggle("active");
  });

  volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value;
  });

  volumeSlider.addEventListener("change", () => {
    volumeControl.classList.remove("active");
  });

  playPauseBtn.addEventListener("click", togglePlayPause);
  prevBtn.addEventListener("click", playPrev);
  nextBtn.addEventListener("click", playNext);

  timeline.addEventListener("input", () => {
    audio.currentTime = timeline.value;
  });
});

// ========================
// ===          Helper Functions        ===
// ========================
const formatTime = (time) => {
  if (isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};
