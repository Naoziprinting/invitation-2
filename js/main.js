// Inisialisasi Owl Carousel (dapat dipanggil ulang setelah data galeri dinamis dimuat)
function initGalleryCarousel() {
  if (typeof $ === "undefined" || !$.fn.owlCarousel) return;
  const $carousel = $(".owl-carousel");
  if (!$carousel.length) return;

  if ($carousel.hasClass("owl-loaded")) {
    $carousel.trigger("destroy.owl.carousel");
    $carousel.removeClass("owl-loaded owl-drag");
  }

  $carousel.owlCarousel({
    loop: true,
    nav: true,
    margin: 15,
    autoplay: true,
    autoplayHoverPause: true,
    autoplayTimeout: 2500,
    responsive: {
      0: { items: 1, dots: true },
      600: { items: 2, dots: true },
      1000: { items: 3, dots: true },
    },
  });
}

$(document).ready(function () {
  initGalleryCarousel();

  // Hover blur effect pada kartu amplop
  $(".blur").mouseenter(function () {
    $(".blur").css("filter", "blur(5px)");
    $(this).css("filter", "blur(0px)");
  });
  $(".blur").mouseleave(function () {
    $(".blur").css("filter", "blur(0px)");
  });
});

// Helper salin teks ke clipboard dengan fallback aman untuk mobile & desktop
function copyTextToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
  }
  return Promise.resolve(fallbackCopy(text));
}

function fallbackCopy(text) {
  const temp = document.createElement("textarea");
  temp.value = text;
  temp.style.position = "fixed";
  temp.style.opacity = "0";
  document.body.appendChild(temp);
  temp.focus();
  temp.select();
  try {
    document.execCommand("copy");
  } catch (e) {
    console.warn("Copy failed:", e);
  }
  document.body.removeChild(temp);
}

// Copy nomor rekening
function copyAcc() {
  const rek1 = document.getElementById("rek1");
  const accVal = rek1 ? rek1.value : "";
  if (!accVal) return;

  copyTextToClipboard(accVal).then(() => {
    if (typeof Swal !== "undefined") {
      Swal.fire({
        icon: "success",
        title: "No. Rekening Berhasil Disalin",
        text: accVal,
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      alert("No. Rekening disalin ke clipboard: " + accVal);
    }
  });
}

// Audio Player Control dengan Auto-Fallback Multi-Sumber
window.currentInvitationType = "wedding";

function getAudioCandidates(isWedding) {
  return isWedding
    ? ["audio/audio.mp3", "assets/music.mp3", "audio.mp3", "music.mp3"]
    : ["assets/music.mp3", "audio/audio.mp3", "music.mp3", "audio.mp3"];
}

function updateAudioButtons(isPlaying) {
  const btnPlay = document.getElementById("btn-play-audio");
  const btnStop = document.getElementById("btn-stop-audio");
  if (btnPlay) btnPlay.classList.toggle("active-audio", isPlaying);
  if (btnStop) btnStop.classList.toggle("active-audio", !isPlaying);
}

function setAudioTrackByType(isWedding, shouldAutoPlay) {
  window.currentInvitationType = isWedding ? "wedding" : "khitan";
  const lagu = document.getElementById("lagu");
  if (!lagu) return;

  const targetSrc = isWedding ? "audio/audio.mp3" : "assets/music.mp3";
  const currentAttrSrc = (lagu.getAttribute("src") || "").trim();
  const hasLoadError = Boolean(lagu.error) || lagu.networkState === 3;

  if (currentAttrSrc !== targetSrc || hasLoadError) {
    lagu.setAttribute("src", targetSrc);
    lagu.load();
    if (shouldAutoPlay) {
      playAudio(0);
    }
  } else if (shouldAutoPlay && lagu.paused) {
    playAudio(0);
  }
}

function playAudio(fallbackIndex) {
  const idx = typeof fallbackIndex === "number" ? fallbackIndex : 0;
  const lagu = document.getElementById("lagu");
  if (!lagu) return;

  const isWedding = window.currentInvitationType !== "khitan";
  const candidates = getAudioCandidates(isWedding);
  const currentAttrSrc = (lagu.getAttribute("src") || "").trim();

  if (!currentAttrSrc || idx > 0) {
    const chosenSrc = candidates[idx] || candidates[0];
    if (currentAttrSrc !== chosenSrc) {
      lagu.setAttribute("src", chosenSrc);
      lagu.load();
    }
  }

  lagu.muted = false;
  lagu.volume = 1.0;

  const playPromise = lagu.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        updateAudioButtons(true);
      })
      .catch((err) => {
        const isSourceError =
          err.name === "NotSupportedError" ||
          Boolean(lagu.error) ||
          lagu.networkState === 3;

        if (isSourceError && idx + 1 < candidates.length) {
          console.warn(
            `Sumber audio "${lagu.getAttribute("src")}" tidak ditemukan/didukung, mencoba cadangan "${candidates[idx + 1]}"...`
          );
          playAudio(idx + 1);
          return;
        }

        console.warn(
          `Pemutaran audio tertahan pada sumber "${lagu.currentSrc || lagu.getAttribute("src")}":`,
          err
        );
        updateAudioButtons(false);
      });
  } else {
    updateAudioButtons(true);
  }
}

function stopAudio() {
  const lagu = document.getElementById("lagu");
  if (!lagu) return;
  lagu.pause();
  updateAudioButtons(false);
}
