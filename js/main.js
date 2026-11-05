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

// Audio Player Control
function updateAudioButtons(isPlaying) {
  const btnPlay = document.getElementById("btn-play-audio");
  const btnStop = document.getElementById("btn-stop-audio");
  if (btnPlay) btnPlay.classList.toggle("active-audio", isPlaying);
  if (btnStop) btnStop.classList.toggle("active-audio", !isPlaying);
}

function playAudio() {
  const lagu = document.getElementById("lagu");
  if (!lagu) return;
  lagu.muted = false;
  lagu.volume = 1.0;

  const playPromise = lagu.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        updateAudioButtons(true);
      })
      .catch((err) => {
        console.warn("Pemutaran audio tertahan:", err);
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
