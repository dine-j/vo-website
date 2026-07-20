// Mobile nav toggle
document.querySelectorAll('[data-nav-toggle]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var links = document.querySelector('.nav-links');
    links.classList.toggle('open');
  });
});

// Reveal-on-scroll
var revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealItems.length) {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealItems.forEach(function (el) { observer.observe(el); });
} else {
  revealItems.forEach(function (el) { el.classList.add('visible'); });
}

// Footer year
document.querySelectorAll('[data-year]').forEach(function (el) {
  el.textContent = new Date().getFullYear();
});

// Custom audio players
function formatTime(seconds) {
  if (!isFinite(seconds)) return '0:00';
  var m = Math.floor(seconds / 60);
  var s = Math.floor(seconds % 60);
  return m + ':' + (s < 10 ? '0' : '') + s;
}

document.querySelectorAll('.player').forEach(function (player) {
  var audio = player.querySelector('audio');
  var playBtn = player.querySelector('.play-btn');
  var track = player.querySelector('.track');
  var fill = player.querySelector('.fill');
  var timeEl = player.querySelector('.time');
  if (!audio || !playBtn) return;

  audio.addEventListener('error', function () {
    player.classList.add('unavailable');
    playBtn.disabled = true;
    playBtn.innerHTML = '';
    if (track) track.style.display = 'none';
    if (timeEl) {
      timeEl.classList.add('coming-soon');
      timeEl.textContent = 'Coming soon';
    }
  });

  playBtn.addEventListener('click', function () {
    document.querySelectorAll('.player audio').forEach(function (other) {
      if (other !== audio) other.pause();
    });
    if (audio.paused) {
      audio.play();
      playBtn.textContent = '❚❚';
    } else {
      audio.pause();
      playBtn.textContent = '▶';
    }
  });

  audio.addEventListener('pause', function () { playBtn.textContent = '▶'; });
  audio.addEventListener('ended', function () { playBtn.textContent = '▶'; });

  audio.addEventListener('timeupdate', function () {
    if (fill && audio.duration) {
      fill.style.width = (audio.currentTime / audio.duration * 100) + '%';
    }
    if (timeEl) {
      timeEl.textContent = formatTime(audio.duration - audio.currentTime);
    }
  });

  if (track) {
    track.addEventListener('click', function (e) {
      var rect = track.getBoundingClientRect();
      var ratio = (e.clientX - rect.left) / rect.width;
      if (audio.duration) audio.currentTime = ratio * audio.duration;
    });
  }
});
