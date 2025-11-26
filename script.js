// --- CONFIGURATION ---
const WEDDING_DATE = new Date("Jan 26, 2026 08:00:00").getTime();
// GANTI DENGAN URL ACTION DARI GOOGLE FORM ANDA
const GOOGLE_FORM_URL = "https://docs.google.com/forms/u/0/d/e/XXXXXXXXXXXXX/formResponse"; 
// GANTI DENGAN URL WEB APP API GOOGLE APPS SCRIPT ANDA
const GUESTBOOK_API_URL = "https://script.google.com/macros/s/AKfycbXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec"; 

// --- 1. Fungsi Mendapatkan Nama Tamu dari URL ---
function getGuestName() {
    const urlParams = new URLSearchParams(window.location.search);
    let guestName = urlParams.get('to');
    
    if (guestName) {
        // Ganti '+' menjadi spasi, lalu decode URI
        guestName = decodeURIComponent(guestName.replace(/\+/g, ' '));
    } else {
        guestName = 'Keluarga/Kerabat Kami'; // Default jika parameter 'to' tidak ada
    }
    
    document.getElementById('guest-name-display').textContent = guestName;
    
    // Isi otomatis nama tamu ke form RSVP (jika ada)
    const guestNameFormInput = document.getElementById('guest-name-form');
    if (guestNameFormInput && guestName !== 'Keluarga/Kerabat Kami') {
        guestNameFormInput.value = guestName;
    }
    
    return guestName;
}

// --- 2. Fungsi Countdown Timer ---
function updateCountdown() {
    const now = new Date().getTime();
    const distance = WEDDING_DATE - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Pastikan elemen ada sebelum diupdate
    if (document.getElementById("days")) {
        document.getElementById("days").textContent = days < 10 ? "0" + days : days;
        document.getElementById("hours").textContent = hours < 10 ? "0" + hours : hours;
        document.getElementById("minutes").textContent = minutes < 10 ? "0" + minutes : minutes;
        document.getElementById("seconds").textContent = seconds < 10 ? "0" + seconds : seconds;
    }

    // Hentikan timer jika sudah melewati tanggal
    if (distance < 0) {
        clearInterval(countdownInterval);
        if (document.getElementById("countdown-timer")) {
            document.getElementById("countdown-timer").innerHTML = "<h3>Our Wedding Day!</h3>";
        }
    }
}

// Setel interval countdown
let countdownInterval = setInterval(updateCountdown, 1000);

// --- 3. Fungsi Copy to Clipboard ---
function copyToClipboard(textToCopy) {
    // Gunakan execCommand untuk kompatibilitas yang lebih baik dalam iframe
    const tempInput = document.createElement('input');
    tempInput.value = textToCopy;
    document.body.appendChild(tempInput);
    tempInput.select();
    
    try {
        document.execCommand('copy');
        // Gunakan pesan custom (bukan alert)
        const btn = document.getElementById('copy-bca-btn');
        btn.textContent = 'Copied!';
        setTimeout(() => {
            btn.textContent = 'Copy No. Rekening';
        }, 2000);
    } catch (err) {
        console.error('Failed to copy text: ', err);
        // Fallback jika gagal
    }
    document.body.removeChild(tempInput);
}

// --- 4. Fungsi RSVP Form Submission ---
document.addEventListener('DOMContentLoaded', () => {
    getGuestName(); // Panggil saat DOM dimuat
    updateCountdown(); // Panggil sekali saat DOM dimuat

    const form = document.getElementById('rsvp-form');
    const submitBtn = document.getElementById('rsvp-submit-btn');
    const statusMessage = document.getElementById('rsvp-message');
    const copyBtn = document.getElementById('copy-bca-btn');

    // Listener untuk Copy Button
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const rekening = copyBtn.getAttribute('data-rekening');
            copyToClipboard(rekening);
        });
    }

    // Listener untuk RSVP Submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            const formData = new FormData(form);
            const url = GOOGLE_FORM_URL + '?' + new URLSearchParams(formData).toString();

            fetch(url, {
                method: 'POST',
                mode: 'no-cors' // Penting untuk Google Form
            })
            .then(() => {
                statusMessage.textContent = 'Terima kasih, konfirmasi Anda telah terkirim!';
                statusMessage.style.display = 'block';
                form.reset(); // Kosongkan form setelah sukses
                loadGuestMessages(); // Muat ulang Guestbook untuk menampilkan pesan baru
            })
            .catch(error => {
                console.error('Error submitting form:', error);
                statusMessage.textContent = 'Gagal mengirim konfirmasi. Silakan coba lagi.';
                statusMessage.style.display = 'block';
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send >';
            });
        });
    }

    // Listener untuk tombol Muat Ulang Pesan
    document.getElementById('load-messages-btn').addEventListener('click', loadGuestMessages);
});

// --- 5. Fungsi Memuat Pesan Tamu (Guestbook) dan Update Statistik Kehadiran ---
function loadGuestMessages() {
    const messageContainer = document.getElementById('guest-messages');
    const statNotSure = document.getElementById('stat-not-sure');
    const statAttending = document.getElementById('stat-attending');
    const statNotAttending = document.getElementById('stat-not-attending');

    if (!messageContainer) return; // Guard clause

    messageContainer.innerHTML = '<p>Sedang memuat pesan...</p>'; 
    
    let countNotSure = 0;
    let countAttending = 0;
    let countNotAttending = 0;

    fetch(GUESTBOOK_API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Gagal memuat data dari API. Cek URL API Anda.');
            }
            return response.json();
        })
        .then(data => {
            messageContainer.innerHTML = ''; 
            
            if (!Array.isArray(data) || data.length === 0) {
                messageContainer.innerHTML = '<p>Belum ada ucapan dari tamu.</p>';
                statNotSure.textContent = '0';
                statAttending.textContent = '0';
                statNotAttending.textContent = '0';
                return;
            }

            data.reverse(); // Pesan terbaru di atas

            data.forEach(message => { 
                // Ganti key ini sesuai dengan Header di Google Sheet Anda!
                const senderName = message['Name'] || message['Nama Anda'] || 'Anonim';
                const content = message['Message'] || message['Pesan / Doa Terbaik'] || 'Tidak ada pesan.';
                const attendance = message['Attendance'] || message['Konfirmasi Kehadiran'] || 'Belum Yakin';
                
                // Hitung statistik
                if (attendance === 'Hadir' || attendance === "I'm planning to attend") {
                    countAttending++;
                } else if (attendance === 'Tidak Hadir' || attendance === "Can't attend") {
                    countNotAttending++;
                } else {
                    countNotSure++;
                }

                const statusLabel = attendance === 'Hadir' || attendance === "I'm planning to attend" ? 'Planning to attend' : attendance === 'Tidak Hadir' || attendance === "Can't attend" ? "Can't attend" : 'Not sure';

                const messageHtml = `
                    <div class="message-item">
                        <strong>${senderName}</strong>
                        <span class="attendance-status">${statusLabel}</span>
                        <p>${content}</p>
                    </div>
                `;
                messageContainer.innerHTML += messageHtml;
            });

            // Tampilkan statistik yang sudah dihitung
            statNotSure.textContent = countNotSure;
            statAttending.textContent = countAttending;
            statNotAttending.textContent = countNotAttending;

        })
        .catch(error => {
            console.error("Error memuat pesan:", error);
            messageContainer.innerHTML = '<p style="color: red;">Maaf, gagal memuat pesan tamu. Cek koneksi API.</p>';
            statNotSure.textContent = '0';
            statAttending.textContent = '0';
            statNotAttending.textContent = '0';
        });
}

// --- 6. Observer untuk Animasi On Scroll (Slide-In) ---
function setupScrollAnimation() {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    const elementsToAnimate = document.querySelectorAll('.hidden-animate');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}


// --- 7. Logika Pembukaan Undangan ---
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
            // Scroll ke opening page (awal konten utama)
            openingPage.scrollIntoView({ behavior: 'smooth' });
            // Panggil fungsionalitas interaktif
            loadGuestMessages(); 
            setupScrollAnimation(); 
        }, 500); 

    }, 1000); 
});
