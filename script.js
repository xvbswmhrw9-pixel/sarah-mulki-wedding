// Tanggal Pernikahan: Sesuaikan dengan tanggal, bulan, tahun, dan waktu yang sebenarnya
const weddingDate = new Date("Jan 12, 2026 08:00:00").getTime();

// --- A. Fungsi Mengambil Nama Tamu dari URL ---
function getGuestName() {
    const urlParams = new URLSearchParams(window.location.search);
    let guestName = urlParams.get('to'); 
    
    // Ganti underscore (_) dengan spasi
    if (guestName) {
        guestName = guestName.replace(/_/g, ' ');
    } else {
        // Nama default jika tidak ada parameter 'to' di URL
        guestName = "Tamu Undangan"; 
    }
    
    // Tampilkan nama di Landing Screen
    document.getElementById('guest-name-display').textContent = guestName;
}
getGuestName(); // Panggil fungsi saat script dimuat

// --- B. Kontrol Page Awal (Open Invitations) ---
document.getElementById('open-invitation-btn').addEventListener('click', function() {
    const landingScreen = document.getElementById('landing-screen');
    const mainContent = document.getElementById('main-content');
    const openingPage = document.getElementById('opening-page');

    // 1. Sembunyikan Landing Screen dengan transisi opacity
    landingScreen.style.opacity = '0';
    
    setTimeout(() => {
        landingScreen.style.display = 'none'; // Hilangkan display setelah transisi
        mainContent.classList.remove('hidden');
        
        // 2. Tampilkan Opening Page dengan transisi Opacity
        openingPage.style.opacity = '1';

        // 3. Tambahkan sedikit delay lalu scroll ke konten utama untuk efek Cinematic Scroll
        setTimeout(() => {
            // Scroll ke bagian Opening Page
            openingPage.scrollIntoView({ behavior: 'smooth' });
        }, 500); 

    }, 1000); // Durasi ini harus sesuai dengan transisi CSS pada landing-screen
});

// --- C. Penanganan RSVP (Pesan untuk Pengantin) ---

// GANTI DENGAN URL ACTION DARI GOOGLE FORM ANDA (Langkah 1B)
const GOOGLE_FORM_URL = "https://docs.google.com/spreadsheets/d/1l0nLOiHtBL3kghdpDHf-2peZDZCeSgg-way3mh3beAE/edit?gid=0#gid=0";

document.getElementById('rsvp-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = this;
    const submitBtn = document.getElementById('rsvp-submit-btn');
    const statusMessage = document.getElementById('rsvp-message');

    // Matikan tombol saat proses kirim
    submitBtn.textContent = 'Mengirim...';
    submitBtn.disabled = true;
    statusMessage.style.display = 'none';

    // Buat objek FormData
    const formData = new FormData(form);

    // Kirim data menggunakan Fetch API
    fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Penting untuk menghindari CORS error karena kita mengirim ke domain lain
    })
    .then(response => {
        // Karena mode 'no-cors', kita tidak bisa memeriksa status 200/OK secara langsung.
        // Asumsi sukses jika tidak ada error jaringan.
        
        // Tampilkan pesan sukses
        statusMessage.textContent = `Terima kasih, konfirmasi Anda telah terkirim!`;
        statusMessage.style.display = 'block';
        form.reset(); // Kosongkan form

        // Kembalikan tombol ke kondisi awal setelah 3 detik
        setTimeout(() => {
            submitBtn.textContent = 'Kirim Konfirmasi';
            submitBtn.disabled = false;
        }, 3000); 
    })
    .catch(error => {
        console.error('Error saat mengirim RSVP:', error);
        statusMessage.textContent = 'Gagal mengirim konfirmasi. Silakan coba lagi.';
        statusMessage.style.color = 'red';
        statusMessage.style.display = 'block';

        // Kembalikan tombol ke kondisi awal
        submitBtn.textContent = 'Kirim Konfirmasi';
        submitBtn.disabled = false;
    });
});

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

    // ... (Kode sebelumnya: GOOGLE_FORM_URL untuk pengiriman data tetap sama) ...

// --- PENTING: GANTI DENGAN URL API/JSON PUBLIK GUESTBOOK ANDA ---
const GUESTBOOK_API_URL = "https://script.google.com/macros/s/AKfycbxVhd_RWOR0iOuK-WUkCMzvTmCLqYlhJQTxsfCfd2CX_8paG4otM0k3lyGcOFzpaWJg/exec"; 
// Pastikan URL ini mengembalikan array JSON dari data sheet Anda.

// --- 5. Fungsi Memuat Pesan Tamu (Guestbook) ---
function loadGuestMessages() {
    const messageContainer = document.getElementById('guest-messages');
    messageContainer.innerHTML = '<p>Sedang memuat pesan...</p>'; // Tampilkan status loading
// --- 6. Observer untuk Animasi On Scroll (Slide-In) ---

function setupScrollAnimation() {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Jika elemen terlihat di viewport
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Hentikan pemantauan setelah animasi terpicu
                observer.unobserve(entry.target);
            }
        });
    }, {
        // Root: null (viewport), Threshold: 0.1 (memicu saat 10% elemen terlihat)
        threshold: 0.1
    });

    // Ambil semua elemen yang memiliki kelas 'hidden-animate' (yaitu bride & groom)
    const elementsToAnimate = document.querySelectorAll('.hidden-animate');
    
    // Mulai pemantauan untuk setiap elemen
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}


// Modifikasi Logika Pembukaan Undangan: Panggil setupScrollAnimation() setelah konten utama muncul
document.getElementById('open-invitation-btn').addEventListener('click', function() {
    const landingScreen = document.getElementById('landing-screen');
    const mainContent = document.getElementById('main-content');
    const openingPage = document.getElementById('opening-page');

    landingScreen.style.opacity = '0';
    
    setTimeout(() => {
        landingScreen.style.display = 'none';
        mainContent.classList.remove('hidden');
        openingPage.style.opacity = '1';

        setTimeout(() => {
            openingPage.scrollIntoView({ behavior: 'smooth' });
            loadGuestMessages(); 
            setupScrollAnimation(); // Panggil observer setelah konten utama terlihat
        }, 500); 

    }, 1000); 
});
    // Lakukan fetching data dari API
    fetch(GUESTBOOK_API_URL)
        .then(response => {
            if (!response.ok) {
                // Tangani respons non-OK
                throw new Error('Gagal memuat data dari API. Cek URL API Anda.');
            }
            return response.json();
        })
        .then(data => {
            messageContainer.innerHTML = ''; // Kosongkan container
            
            // Pastikan 'data' adalah array
            if (!Array.isArray(data) || data.length === 0) {
                messageContainer.innerHTML = '<p>Belum ada ucapan dari tamu.</p>';
                return;
            }

            // Urutkan data agar pesan terbaru muncul di atas (jika API tidak mengurutkan)
            // Asumsi: pesan terbaru ada di akhir array, jadi kita gunakan reverse()
            data.reverse(); 

            // Iterate dan tampilkan setiap pesan
            data.forEach(message => { 
                // PERHATIAN: Sesuaikan KUNCI ini ('Nama Anda', 'Pesan / Doa Terbaik', 'Konfirmasi Kehadiran') 
                // dengan header kolom di Google Sheet Anda
                const senderName = message['Nama Anda'] || 'Anonim';
                const content = message['Pesan / Doa Terbaik'] || 'Tidak ada pesan.';
                const attendance = message['Konfirmasi Kehadiran'] || 'Status tidak diketahui';
                
                const messageHtml = `
                    <div class="message-item">
                        <strong>${senderName}</strong>
                        <span class="attendance-status">(${attendance})</span>
                        <p>${content}</p>
                    </div>
                `;
                messageContainer.innerHTML += messageHtml;
            });
        })
        .catch(error => {
            console.error("Error memuat pesan:", error);
            messageContainer.innerHTML = '<p style="color: red;">Maaf, gagal memuat pesan tamu. Cek koneksi API.</p>';
        });
}

// Panggil fungsi saat tombol muat ulang diklik
document.getElementById('load-messages-btn').addEventListener('click', loadGuestMessages);


// Modifikasi Logic Pembukaan Undangan: Panggil loadGuestMessages() setelah undangan dibuka
document.getElementById('open-invitation-btn').addEventListener('click', function() {
    const landingScreen = document.getElementById('landing-screen');
    const mainContent = document.getElementById('main-content');
    const openingPage = document.getElementById('opening-page');

    landingScreen.style.opacity = '0';
    
    setTimeout(() => {
        landingScreen.style.display = 'none';
        mainContent.classList.remove('hidden');
        openingPage.style.opacity = '1';

        setTimeout(() => {
            openingPage.scrollIntoView({ behavior: 'smooth' });
            // PANGGIL FUNGSI MUAT PESAN DI SINI
            loadGuestMessages(); 
        }, 500); 

    }, 1000); 
});

// ... (Sisa kode JS lainnya: Countdown, RSVP form submission) ...
    
    // Contoh Sederhana:
    console.log("Data RSVP yang dikirim:", data);
    alert(`Terima kasih, ${data.name}! Konfirmasi ${data.attendance} telah terkirim.`);

    this.reset(); // Kosongkan form setelah kirim
});

// Update countdown saat load pertama
updateCountdown();
