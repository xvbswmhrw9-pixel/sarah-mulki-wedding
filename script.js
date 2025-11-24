// Tanggal Pernikahan: Sesuaikan dengan tanggal, bulan, tahun, dan waktu yang sebenarnya
const weddingDate = new Date("Jan 12, 2026 08:00:00").getTime();

// --- 1. Fungsi Hitungan Mundur (Counting Hours) ---
function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    // Perhitungan waktu
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Tampilkan hasil di elemen HTML
    if (document.getElementById("days")) {
        document.getElementById("days").innerHTML = days < 10 ? "0" + days : days;
        document.getElementById("hours").innerHTML = hours < 10 ? "0" + hours : hours;
        document.getElementById("minutes").innerHTML = minutes < 10 ? "0" + minutes : minutes;
        document.getElementById("seconds").innerHTML = seconds < 10 ? "0" + seconds : seconds;
    }

    // Jika hitungan mundur selesai
    if (distance < 0) {
        clearInterval(countdownInterval);
        document.getElementById("countdown-timer").innerHTML = "ACARA SEDANG BERLANGSUNG!";
    }
}

// Jalankan fungsi setiap 1 detik
const countdownInterval = setInterval(updateCountdown, 1000);


// --- 2. Kontrol Page Awal (Open Invitations) ---
document.getElementById('open-invitation-btn').addEventListener('click', function() {
    const landingScreen = document.getElementById('landing-screen');
    const mainContent = document.getElementById('main-content');
    const openingPage = document.getElementById('opening-page');

    // Sembunyikan Landing Screen dengan transisi
    landingScreen.style.opacity = '0';
    
    // Tunda penghilangan elemen fisik
    setTimeout(() => {
        landingScreen.classList.add('hidden');
        mainContent.classList.remove('hidden');

        // Tampilkan Opening Page dengan transisi Opacity
        openingPage.style.opacity = '1';
    }, 1000); // Sesuaikan dengan durasi transisi CSS
});


// --- 3. Fungsi Salin No Rekening (Wedding Gift) ---
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        alert('Nomor rekening berhasil disalin!');
    }, function(err) {
        console.error('Gagal menyalin: ', err);
    });
}


// --- 4. Penanganan RSVP (Pesan untuk Pengantin) ---
document.getElementById('rsvp-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Ambil data form
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    // --- PENTING ---
    // Logika pengiriman data ke backend/service (Google Form/Sheets, Firebase, dll.) harus ditambahkan di sini.
    // GitHub Pages HANYA menyediakan hosting statis, tidak ada server-side scripting (PHP, Python) untuk memproses form.
    // Contoh Sederhana:
    console.log("Data RSVP yang dikirim:", data);
    alert(`Terima kasih, ${data.name}! Konfirmasi ${data.attendance} telah terkirim.`);

    this.reset(); // Kosongkan form setelah kirim
});

// Update countdown saat load pertama
updateCountdown();
