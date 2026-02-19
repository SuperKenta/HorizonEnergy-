// ==================== BACKGROUND PARTICLES ====================
function createParticles() {
    // Hapus particle lama kalau ada
    const oldParticles = document.querySelectorAll('.particle');
    oldParticles.forEach(p => p.remove());
    
    const particleCount = 40; // Jumlah particle
    const colors = ['#7fffd4', '#667eea', '#764ba2', '#4ecdc4']; // Warna gradien
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Posisi random
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Ukuran random (2px - 6px)
        const size = Math.random() * 4 + 2;
        
        // Warna random
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Durasi animasi random (10s - 25s)
        const duration = Math.random() * 15 + 10;
        
        // Delay random
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            left: ${posX}%;
            top: ${posY}%;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            box-shadow: 0 0 ${size * 3}px ${color};
            animation: floatParticle ${duration}s linear infinite;
            animation-delay: -${delay}s;
            opacity: ${Math.random() * 0.3 + 0.2};
        `;
        
        document.body.appendChild(particle);
    }
}

// Di bagian inisialisasi
if (typeof feather !== 'undefined') {
    feather.replace();
}

// ==================== INISIALISASI ====================
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi Feather Icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
    // Inisialisasi semua komponen
    initMobileMenu();
    initAlert();
    initEnergyCards();
    initSmoothScroll();
    initScrollEffect();
    initParticles();
    initKeyboardNav();
});

// ==================== MOBILE MENU ====================
function initMobileMenu() {
    const navbarNav = document.querySelector('.navbar-nav');
    const menu = document.querySelector('#menu');
    const overlay = document.querySelector('.overlay');
    
    if (!navbarNav || !menu) return;
    
    // Toggle menu saat hamburger diklik
    menu.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        navbarNav.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');
        
        // Animasi icon menu 
        const menuIcon = menu.querySelector('i');
        if (menuIcon) {
            menuIcon.setAttribute('data-feather', 
                navbarNav.classList.contains('active') ? 'x' : 'menu'
            );
            feather.replace();
        }
        
        // Prevent body scroll saat menu terbuka
        document.body.style.overflow = navbarNav.classList.contains('active') ? 'hidden' : '';
    };
    
    // Klik di luar menu
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !navbarNav.contains(e.target)) {
            if (navbarNav.classList.contains('active')) {
                navbarNav.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
                document.body.style.overflow = '';
                
                // Kembalikan icon menu
                const menuIcon = menu.querySelector('i');
                if (menuIcon) {
                    menuIcon.setAttribute('data-feather', 'menu');
                    feather.replace();
                }
            }
        }
    });
    
    // Tutup menu saat resize ke desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            if (navbarNav.classList.contains('active')) {
                navbarNav.classList.remove('active');
                if (overlay) overlay.classList.remove('active');
                document.body.style.overflow = '';
                
                const menuIcon = menu.querySelector('i');
                if (menuIcon) {
                    menuIcon.setAttribute('data-feather', 'menu');
                    feather.replace();
                }
            }
        }
    });
}

// ==================== ALERT ====================
function initAlert() {
    const alertBox = document.getElementById("customAlert");
    if (!alertBox) return;
    
    // Tampilkan alert
    setTimeout(() => {
        alertBox.classList.add("show");
        
        // Auto hide setelah 3 detik
        setTimeout(() => {
            alertBox.classList.remove("show");
        }, 3000);
    }, 500);
    
    // Bisa ditutup dengan klik
    alertBox.addEventListener('click', () => {
        alertBox.classList.remove("show");
    });
}

// ==================== ENERGY CARDS (ENHANCED) ====================
function initEnergyCards() {
    const cards = document.querySelectorAll(".energy-card");
    if (cards.length === 0) return;
    
    // Fungsi untuk menutup semua card
    function closeAllCards(exceptCard = null) {
        cards.forEach(card => {
            if (card !== exceptCard) {
                card.classList.remove('active');
                
                // Trigger event untuk animasi
                card.dispatchEvent(new CustomEvent('cardClosed'));
            }
        });
    }
    
    cards.forEach((card, index) => {
        // State awal
        card.setAttribute('data-index', index);
        
        card.addEventListener("click", function(e) {
            e.stopPropagation();
            
            const wasActive = this.classList.contains('active');
            
            // Efek ripple
            createRipple(e, this);
            
            if (wasActive) {
                // Jika aktif, tutup
                this.classList.remove('active');
                this.dispatchEvent(new CustomEvent('cardClosed'));
            } else {
                // Jika tidak aktif, tutup semua lalu buka ini
                closeAllCards(this);
                this.classList.add('active');
                this.dispatchEvent(new CustomEvent('cardOpened'));
            }
        });
        
        // Event listener untuk animasi
        card.addEventListener('cardOpened', () => {
            console.log(`Card ${index + 1} dibuka`);
            // Bisa tambahkan tracking atau efek lain
        });
        
        card.addEventListener('cardClosed', () => {
            console.log(`Card ${index + 1} ditutup`);
        });
    });
    
    // Buka card pertama setelah delay
    setTimeout(() => {
        if (cards.length > 0) {
            cards[0].classList.add('active');
            cards[0].dispatchEvent(new CustomEvent('cardOpened'));
        }
    }, 800);
}

// ==================== EFFECT RIPPLE ====================
function createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.className = 'ripple';
    
    // Hapus ripple sebelumnya
    const oldRipple = element.querySelector('.ripple');
    if (oldRipple) oldRipple.remove();
    
    element.appendChild(ripple);
    
    // Hapus setelah animasi
    setTimeout(() => {
        if (ripple && ripple.parentNode) {
            ripple.remove();
        }
    }, 600);
}

// ==================== SMOOTH SCROLL ====================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ==================== SCROLL EFFECT ====================
function initScrollEffect() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Navbar hide/show on scroll
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scroll down
            navbar.style.transform = 'translateY(-100%)';
            navbar.style.transition = 'transform 0.3s ease';
        } else {
            // Scroll up
            navbar.style.transform = 'translateY(0)';
        }
        
        // Navbar background change
        if (currentScroll > 50) {
            navbar.style.background = 'rgba(10, 15, 30, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(10, 15, 30, 0.8)';
            navbar.style.backdropFilter = 'blur(15px)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
        }
        
        lastScroll = currentScroll;
    });
}

// ==================== PARTICLES BACKGROUND ====================
function initParticles() {
    const colors = ['#7fffd4', '#667eea', '#764ba2', '#ff6b6b'];
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle-enhanced';
        
        // Random properties
        const size = Math.random() * 8 + 2;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            left: ${left}%;
            top: ${top}%;
            opacity: ${Math.random() * 0.3 + 0.1};
            pointer-events: none;
            z-index: -1;
            animation: floatParticle ${duration}s linear infinite;
            animation-delay: -${delay}s;
            filter: blur(${Math.random() * 2}px);
        `;
        
        document.body.appendChild(particle);
    }
}

// ==================== KEYBOARD NAVIGATION ====================
function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        // ESC untuk menutup menu mobile
        if (e.key === 'Escape') {
            const navbarNav = document.querySelector('.navbar-nav');
            const menu = document.querySelector('#menu');
            const overlay = document.querySelector('.overlay');
            
            if (navbarNav?.classList.contains('active')) {
                navbarNav.classList.remove('active');
                overlay?.classList.remove('active');
                document.body.style.overflow = '';
                
                const menuIcon = menu?.querySelector('i');
                if (menuIcon) {
                    menuIcon.setAttribute('data-feather', 'menu');
                    feather.replace();
                }
            }
            
            // Tutup semua cards
            document.querySelectorAll('.energy-card.active').forEach(card => {
                card.classList.remove('active');
            });
        }
        
        // Arrow keys untuk navigasi cards
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            const cards = document.querySelectorAll('.energy-card');
            const activeIndex = Array.from(cards).findIndex(card => 
                card.classList.contains('active')
            );
            
            if (activeIndex !== -1) {
                e.preventDefault();
                
                let nextIndex;
                if (e.key === 'ArrowDown') {
                    nextIndex = (activeIndex + 1) % cards.length;
                } else {
                    nextIndex = (activeIndex - 1 + cards.length) % cards.length;
                }
                
                cards[activeIndex].classList.remove('active');
                cards[nextIndex].classList.add('active');
                cards[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}

// ==================== ADD RIPPLE CSS ====================
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .energy-card {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        background: rgba(127, 255, 212, 0.4);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
        z-index: 10;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes floatParticle {
        0% {
            transform: translateY(0) translateX(0);
        }
        25% {
            transform: translateY(-50px) translateX(20px);
        }
        50% {
            transform: translateY(-80px) translateX(-20px);
        }
        75% {
            transform: translateY(-30px) translateX(30px);
        }
        100% {
            transform: translateY(0) translateX(0);
        }
    }
    
    .particle-enhanced {
        will-change: transform;
        transition: all 0.3s ease;
    }
`;

document.head.appendChild(rippleStyle);

// ==================== LAZY LOADING (untuk gambar) ====================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==================== ERROR HANDLING ====================
window.addEventListener('error', (e) => {
    console.error('Error detected:', e.message);
});

// ==================== PERFORMANCE ====================
// Debounce function untuk optimasi
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimasi scroll event
window.addEventListener('scroll', debounce(() => {
    // Lakukan sesuatu saat scroll
}, 100));

// ==================== EXPORT ) ====================
// Untuk penggunaan modular
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initMobileMenu,
        initAlert,
        initEnergyCards,
        initSmoothScroll,
        initScrollEffect,
        initParticles,
        initKeyboardNav
    };
}

// ==================== COMPARISON SLIDER ====================
function initComparisonSlider() {
    const slider = document.getElementById('comparisonSlider');
    const lowImage = document.querySelector('.comparison-low');
    const handle = document.getElementById('compareHandle');
    
    if (!slider || !lowImage || !handle) return;
    
    let isDragging = false;
    
    function setPosition(x) {
        const rect = slider.getBoundingClientRect();
        let percent = ((x - rect.left) / rect.width) * 100;
        
        // Batasi antara 5% - 95%
        percent = Math.min(95, Math.max(5, percent));
        
        // Update clip-path (low image muncul dari kiri)
        lowImage.style.clipPath = `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%)`;
        
        // Update posisi handle
        handle.style.left = percent + '%';
    }
    
    // Mouse events
    handle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDragging = true;
    });
    
    slider.addEventListener('mousedown', (e) => {
        e.preventDefault();
        setPosition(e.clientX);
        isDragging = true;
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        setPosition(e.clientX);
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    // Touch events untuk mobile
    handle.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isDragging = true;
    });
    
    slider.addEventListener('touchstart', (e) => {
        e.preventDefault();
        setPosition(e.touches[0].clientX);
        isDragging = true;
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        setPosition(e.touches[0].clientX);
    });
    
    document.addEventListener('touchend', () => {
        isDragging = false;
    });
    
    // Set posisi awal (50%)
    lowImage.style.clipPath = 'polygon(0 0, 50% 0, 50% 100%, 0 100%)';
    handle.style.left = '50%';
}

// Panggil setelah DOM siap
document.addEventListener('DOMContentLoaded', function() {
    // Tunggu feather icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
    initComparisonSlider();
});

// ==================== QUIZ SECTION ====================
function initQuiz() {
    const quizSection = document.querySelector('.quiz-section');
    if (!quizSection) return;
    
    // Data quiz
  const questions = [
  {
    question: "Apa yang dimaksud dengan energi terbarukan?",
    options: [
      "Energi yang akan habis dalam waktu dekat",
      "Energi yang berasal dari sumber yang dapat diperbarui secara alami",
      "Energi dari batu bara",
      "Energi dari minyak bumi"
    ],
    correct: 1
  },
  {
    question: "Berikut ini yang termasuk energi terbarukan adalah?",
    options: [
      "Minyak bumi",
      "Batu bara",
      "Energi surya",
      "Gas alam"
    ],
    correct: 2
  },
  {
    question: "Alat yang digunakan untuk mengubah energi matahari menjadi listrik disebut?",
    options: [
      "Turbin",
      "Generator",
      "Panel surya",
      "Transformator"
    ],
    correct: 2
  },
  {
    question: "PLTA memanfaatkan energi dari?",
    options: [
      "Angin",
      "Air",
      "Matahari",
      "Panas bumi"
    ],
    correct: 1
  },
  {
    question: "Contoh energi yang tidak terbarukan adalah?",
    options: [
      "Angin",
      "Air",
      "Batu bara",
      "Matahari"
    ],
    correct: 2
  },
  {
    question: "Keuntungan utama energi terbarukan adalah?",
    options: [
      "Menyebabkan polusi tinggi",
      "Sumbernya terbatas",
      "Ramah lingkungan",
      "Sulit diperoleh"
    ],
    correct: 2
  },
  {
    question: "Energi angin diubah menjadi listrik menggunakan?",
    options: [
      "Panel surya",
      "Turbin angin",
      "Baterai",
      "Mesin diesel"
    ],
    correct: 1
  },
  {
    question: "Biogas biasanya dihasilkan dari?",
    options: [
      "Sampah organik dan kotoran ternak",
      "Minyak bumi",
      "Air laut",
      "Batu bara"
    ],
    correct: 0
  },
  {
    question: "Energi panas bumi disebut juga dengan?",
    options: [
      "Geothermal",
      "Solar cell",
      "Hidro power",
      "Biofuel"
    ],
    correct: 0
  },
  {
    question: "Menggunakan energi terbarukan dapat membantu mengurangi?",
    options: [
      "Penggunaan air",
      "Pemanasan global",
      "Jumlah kendaraan",
      "Jumlah penduduk"
    ],
    correct: 1
  }
];

    
    let currentQuestion = 0;
    let score = 0;
    let selectedOption = null;
    let answered = false;
    
    // DOM elements
    const quizCard = document.querySelector('.quiz-card');
    const scoreCard = document.querySelector('.score-card');
    const questionEl = document.querySelector('.quiz-question');
    const optionsEl = document.querySelector('.quiz-options');
    const feedbackEl = document.querySelector('.quiz-feedback');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const restartBtn = document.querySelector('.restart-btn');
    const currentQEl = document.querySelector('.current-question');
    const progressFill = document.querySelector('.quiz-progress .progress-fill');
    const scoreValue = document.querySelector('.score-value');
    
    // Load question
    function loadQuestion(index) {
        const q = questions[index];
        questionEl.textContent = q.question;
        
        // Render options
        optionsEl.innerHTML = '';
        q.options.forEach((opt, i) => {
            const option = document.createElement('div');
            option.className = 'quiz-option';
            option.dataset.index = i;
            option.dataset.correct = i === q.correct;
            option.innerHTML = `
                <span class="option-letter">${String.fromCharCode(65 + i)}</span>
                <span class="option-text">${opt}</span>
            `;
            optionsEl.appendChild(option);
        });
        
        // Reset state
        selectedOption = null;
        answered = false;
        feedbackEl.style.display = 'none';
        feedbackEl.className = 'quiz-feedback';
        
        // Update progress
        currentQEl.textContent = index + 1;
        progressFill.style.width = `${((index + 1) / questions.length) * 100}%`;
        
        // Update buttons
        prevBtn.disabled = index === 0;
        if (index === questions.length - 1) {
            nextBtn.innerHTML = `Selesai <i data-feather="check"></i>`;
        } else {
            nextBtn.innerHTML = `Selanjutnya <i data-feather="arrow-right"></i>`;
        }
        
        feather.replace();
    }
    
    // Handle option click
    function handleOptionClick(e) {
        const option = e.currentTarget;
        if (answered) return;
        
        // Remove selected from others
        document.querySelectorAll('.quiz-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Add selected to this
        option.classList.add('selected');
        selectedOption = parseInt(option.dataset.index);
        
        // Check if correct
        const isCorrect = option.dataset.correct === 'true';
        
        if (isCorrect) {
            option.classList.add('correct');
            feedbackEl.textContent = '✅ Benar! Jawabanmu tepat.';
            feedbackEl.className = 'quiz-feedback correct';
            if (!answered) score++;
        } else {
            option.classList.add('wrong');
            // Show correct answer
            document.querySelectorAll('.quiz-option').forEach(opt => {
                if (opt.dataset.correct === 'true') {
                    opt.classList.add('correct');
                }
            });
            feedbackEl.textContent = '❌ Maaf, jawabanmu kurang tepat.';
            feedbackEl.className = 'quiz-feedback wrong';
        }
        
        answered = true;
        feedbackEl.style.display = 'block';
    }
    
    // Next question
    function nextQuestion() {
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            loadQuestion(currentQuestion);
        } else {
            // Show score
            showScore();
        }
    }
    
    // Show score
    function showScore() {
        quizCard.style.display = 'none';
        scoreCard.style.display = 'block';
        scoreValue.textContent = score;
        
        // Update message based on score
        const messageEl = document.querySelector('.score-message');
        if (score === questions.length) {
            messageEl.textContent = 'Sempurna! Kamu ahli energi terbarukan! 🌟';
        } else if (score >= questions.length / 2) {
            messageEl.textContent = 'Bagus! Terus belajar tentang energi terbarukan! 🌱';
        } else {
            messageEl.textContent = 'Ayo belajar lagi! Energi terbarukan itu penting! 💚';
        }
        
        feather.replace();
    }
    
    // Restart quiz
    function restartQuiz() {
        currentQuestion = 0;
        score = 0;
        selectedOption = null;
        answered = false;
        
        quizCard.style.display = 'block';
        scoreCard.style.display = 'none';
        
        loadQuestion(0);
    }
    
    // Event listeners
    optionsEl.addEventListener('click', (e) => {
        const option = e.target.closest('.quiz-option');
        if (option) handleOptionClick({ currentTarget: option });
    });
    
    prevBtn.addEventListener('click', () => {
        if (currentQuestion > 0) {
            currentQuestion--;
            loadQuestion(currentQuestion);
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (answered || currentQuestion === questions.length - 1) {
            nextQuestion();
        } else {
            alert('Pilih jawaban dulu!');
        }
    });
    
    restartBtn.addEventListener('click', restartQuiz);
    
    // Load first question
    loadQuestion(0);
}

// Panggil di inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    // ... kode lain ...
    initQuiz();
});

// ==================== DATA COMPARISON SLIDER ====================
function initDataComparison() {
    const slider = document.getElementById('energyComparison');
    const handle = document.getElementById('dataCompareHandle');
    const nonrenewableSide = document.querySelector('.nonrenewable-side');
    const renewableSide = document.querySelector('.renewable-side');
    
    if (!slider || !handle || !nonrenewableSide || !renewableSide) return;
    
    let isDragging = false;
    
    function setPosition(x) {
        const rect = slider.getBoundingClientRect();
        let percent = ((x - rect.left) / rect.width) * 100;
        
        // Batasi antara 10% - 90%
        percent = Math.min(90, Math.max(10, percent));
        
        // Atur lebar kedua sisi
        nonrenewableSide.style.flex = `0 0 ${percent}%`;
        renewableSide.style.flex = `0 0 ${100 - percent}%`;
        
        // Update posisi handle
        handle.style.left = percent + '%';
    }
    
    // Mouse events
    handle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDragging = true;
    });
    
    slider.addEventListener('mousedown', (e) => {
        e.preventDefault();
        setPosition(e.clientX);
        isDragging = true;
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        setPosition(e.clientX);
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    // Touch events
    handle.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isDragging = true;
    });
    
    slider.addEventListener('touchstart', (e) => {
        e.preventDefault();
        setPosition(e.touches[0].clientX);
        isDragging = true;
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        setPosition(e.touches[0].clientX);
    });
    
    document.addEventListener('touchend', () => {
        isDragging = false;
    });
    
    // Set posisi awal
    nonrenewableSide.style.flex = '0 0 50%';
    renewableSide.style.flex = '0 0 50%';
    handle.style.left = '50%';
}

// Panggil di inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    initDataComparison();
});

