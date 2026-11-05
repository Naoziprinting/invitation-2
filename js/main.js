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
      0: {
        items: 1,
        dots: true,
      },
      600: {
        items: 2,
        dots: true,
      },
      1000: {
        items: 3,
        dots: true,
      },
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

// Copy nomor rekening
function copyAcc() {
  const rek1 = document.getElementById("rek1");
  const accVal = rek1 ? rek1.value || rek1.innerText : "";

  if (navigator.clipboard && accVal) {
    navigator.clipboard.writeText(accVal).catch(() => {
      if (rek1 && rek1.select) {
        rek1.select();
        document.execCommand("copy");
      }
    });
  } else if (rek1 && rek1.select) {
    rek1.select();
    document.execCommand("copy");
  }

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
}

const salin1 = document.getElementById("salin1");
if (salin1) {
  salin1.onclick = copyAcc;
}

// Audio Player Control
function playAudio() {
  const lagu = document.getElementById("lagu");
  if (!lagu) return;
  const playPromise = lagu.play();
  if (playPromise !== undefined) {
    playPromise.catch((e) => console.log("Auto-play prevented:", e));
  }
}
function stopAudio() {
  const lagu = document.getElementById("lagu");
  if (!lagu) return;
  lagu.pause();
}
function toggleAudio() {
  const lagu = document.getElementById("lagu");
  if (!lagu) return;
  if (lagu.paused) {
    playAudio();
  } else {
    stopAudio();
  }
}
