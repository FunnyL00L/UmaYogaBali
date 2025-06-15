document.addEventListener('DOMContentLoaded', () => {

    // --- Fungsi untuk Memuat HTML Parsial ---
    // Fungsi ini akan mengambil konten HTML dari file terpisah
    // dan memasukkannya ke dalam elemen placeholder di index.html.
    async function loadPartial(placeholderId, filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                // Memberikan pesan error yang lebih informatif jika file tidak ditemukan
                throw new Error(`Gagal memuat file: ${filePath}. Status HTTP: ${response.status}`);
            }
            const html = await response.text();
            // Jika placeholder adalah 'main-content', kita akan menambahkan konten
            // ke bagian akhir, bukan menimpa, karena main-content akan berisi banyak section.
            if (placeholderId === 'main-content') {
                document.getElementById(placeholderId).insertAdjacentHTML('beforeend', html);
            } else {
                document.getElementById(placeholderId).innerHTML = html;
            }
            return true; // Berhasil dimuat
        } catch (e) {
            console.error(`Kesalahan saat memuat ${filePath}:`, e);
            return false; // Gagal dimuat
        }
    }

    // --- Muat Semua Bagian HTML ---
    // Promise.all memastikan semua partial HTML dimuat sebelum melanjutkan
    // ke inisialisasi JavaScript lainnya.
    // Urutan di sini penting, sesuai dengan urutan section di halaman.
    Promise.all([
        loadPartial('header-placeholder', 'partials/header.html'),
        loadPartial('main-content', 'partials/home.html'),
        loadPartial('main-content', 'partials/philosophy.html'),
        loadPartial('main-content', 'partials/benefits.html'),
        loadPartial('main-content', 'partials/programs.html'),
        loadPartial('main-content', 'partials/pricing.html'),
        loadPartial('main-content', 'partials/gallery.html'),
        loadPartial('main-content', 'partials/testimonials.html'),
        loadPartial('footer-placeholder', 'partials/footer.html'),
        loadPartial('modals-placeholder', 'partials/modals.html')
    ]).then(() => {
        // --- Inisialisasi Elemen HTML Setelah Semua Bagian Dimuat ---
        // PENTING: Semua inisialisasi elemen DOM harus dilakukan di dalam blok ini,
        // setelah semua partials berhasil dimuat dan tersedia di DOM.
        const music = document.getElementById("music");
        const playIcon = document.getElementById("play-icon");
        const pauseIcon = document.getElementById("pause-icon");
        const musicButton = document.getElementById("music-button"); 
        
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');

        const yogaTab = document.getElementById('tab-yoga');
        const spaTab = document.getElementById('tab-spa');
        const vcoTab = document.getElementById('tab-vco');
        const yogaContent = document.getElementById('content-yoga');
        const spaContent = document.getElementById('content-spa');
        const vcoContent = document.getElementById('content-vco');

        const navLinks = document.querySelectorAll('.nav-link');
        // Ambil semua section utama dan footer setelah semua partials dimuat.
        const sections = document.querySelectorAll('main section, footer'); 
        
        // Modal Booking Elements
        const bookingModal = document.getElementById('booking-modal');
        const closeModalBtns = document.querySelectorAll('.close-modal-btn');
        const openModalBtns = document.querySelectorAll('.open-modal-btn');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        const modalFeatures = document.getElementById('modal-features');
        const modalPrice = document.getElementById('modal-price');
        const modalBookingLink = document.getElementById('modal-booking-link');


      // --- Data Program (untuk Modal Booking) - DIPERBARUI ---
const programs = {
    'yoga-package': { // Sesuai dengan data-program="yoga-package" di HTML
        title: 'Booking Uma Prenatal Yoga',
        description: 'Pilih paket yoga yang paling sesuai untuk Anda. Setiap sesi dirancang khusus untuk memberikan kenyamanan dan kekuatan selama masa kehamilan.',
        features: [
            '<strong>Basic Yoga:</strong> Sesi yoga fundamental untuk relaksasi dan peregangan.',
            '<strong>Premium Yoga:</strong> Sesi yoga lengkap, termasuk bonus gratis 1 botol Minyak Uma VCO.',
            'Dipandu oleh instruktur bersertifikasi.',
            'Gerakan aman dan disesuaikan untuk setiap trimester.'
        ],
        price: 'Mulai dari IDR 170.000',
        whatsappMessage: 'Halo Uma Yoga Bali, saya tertarik dengan paket Uma Prenatal Yoga. Bisakah saya mendapatkan informasi lebih lanjut mengenai paket Basic dan Premium?'
    },
    'spa-package': { // Sesuai dengan data-program="spa-package" di HTML
        title: 'Booking Uma Prenatal Spa',
        description: 'Manjakan diri Anda dengan perawatan spa yang menenangkan dan aman untuk ibu hamil. Pilih dari paket Classic atau Modern kami.',
        features: [
            '<strong>Classic Spa:</strong> Perawatan spa esensial untuk meredakan ketegangan.',
            '<strong>Modern Spa:</strong> Pengalaman spa premium, termasuk bonus gratis 1 botol Minyak Uma VCO.',
            'Menggunakan bahan-bahan alami dan tradisional Bali.',
            'Terapis profesional yang berpengalaman dalam perawatan prenatal.'
        ],
        price: 'Mulai dari IDR 350.000',
        whatsappMessage: 'Halo Uma Yoga Bali, saya tertarik dengan paket Uma Prenatal Spa. Bisakah saya mendapatkan informasi lebih lanjut mengenai paket Classic dan Modern?'
    },
    'bundle-package': { // Sesuai dengan data-program="bundle-package" di HTML
        title: 'Booking Bundle Package',
        description: 'Dapatkan pengalaman lengkap dengan paket kombinasi Yoga dan Spa kami untuk relaksasi maksimal.',
        features: [
            '<strong>Gold (Yoga + Spa):</strong> Kombinasi sesi yoga dan spa untuk kebugaran dan ketenangan menyeluruh.',
            '<strong>Diamond (Yoga + Spa + Free VCO):</strong> Paket termewah dengan sesi yoga, spa, dan bonus gratis 1 botol Minyak Uma VCO.',
            'Nilai terbaik untuk pengalaman prenatal yang komprehensif.'
        ],
        price: 'Mulai dari IDR 500.000',
        whatsappMessage: 'Halo Uma Yoga Bali, saya tertarik dengan Bundle Package. Bisakah saya mendapatkan informasi lebih lanjut mengenai paket Gold dan Diamond?'
    }
};


        // --- Data Gambar Galeri ---
       const galleryImages = [
    { src: "asset/image/yogaa.jpg", alt: "Sesi prenatal yoga" },
    { src: "asset/image/spaaa.jpg", alt: "Ruang perawatan spa" },
    { src: "asset/image/kolam bunga.png", alt: "Kolam dengan taburan bunga" },
    { src: "asset/image/area.jpg", alt: "Area outdoor yang asri" },
    { src: "asset/image/aula.jpg", alt: "Aula atau studio utama" },
    { src: "asset/image/halam.jpg", alt: "Halaman depan dengan taman" },
    { src: "asset/image/image.png", alt: "Wanita melakukan yoga" },
    { src: "asset/image/kori.jpg", alt: "Gerbang Kori khas Bali" },
    { src: "asset/image/utama.jpg", alt: "Pemandangan utama lokasi" },
    { src: "asset/image/VCO.png", alt: "Produk Minyak Uma VCO" },
    { src: "asset/image/airlangga.png", alt: "Detail arsitektur Airlangga" },
    // Menambahkan gambar dari URL eksternal jika masih diperlukan
    { src: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop", alt: "Kolam renang di malam hari" },
];
        const galleryWrapper = document.getElementById('galleryWrapper');


        // --- Variabel untuk Scroll Snap ---
        let currentSectionIndex = 0;
        let isScrolling = false;


        // --- Fungsionalitas Umum ---

// Autoplay Musik saat DOM dimuat (mungkin diblokir browser)
if (music) { // Pastikan elemen musik ada
    music.play().catch(error => {
        console.log("Autoplay musik gagal:", error);
    });
    // Tampilkan ikon pause dan sembunyikan ikon play jika autoplay berhasil/dicoba
    if (playIcon && pauseIcon) {
        playIcon.classList.add("hidden"); 
        pauseIcon.classList.remove("hidden"); 
    }
}

        // Fungsionalitas Tombol Musik
        if (musicButton && music && playIcon && pauseIcon) { // Pastikan semua elemen ada
            musicButton.addEventListener("click", () => {
                if (music.paused) {
                    music.play().catch(error => {
                        console.log("Audio play error:", error);
                    });
                    playIcon.classList.add("hidden");
                    pauseIcon.classList.remove("hidden");
                } else {
                    music.pause();
                    pauseIcon.classList.add("hidden");
                    playIcon.classList.remove("hidden");
                }
            });
        }

        // Fungsionalitas Header & Mobile Menu
        if (mobileMenuButton && mobileMenu) { // Pastikan elemen ada
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }

 if (yogaTab && spaTab && vcoTab && yogaContent && spaContent && vcoContent) {

    /**
     * Fungsi untuk mengganti tab yang aktif beserta kontennya.
     * @param {HTMLElement} activeTab - Tombol tab yang akan diaktifkan.
     * @param {HTMLElement} activeContent - Konten yang akan ditampilkan.
     * @param {Array<HTMLElement>} inactiveTabs - Array tombol tab lain yang akan dinonaktifkan.
     * @param {Array<HTMLElement>} inactiveContents - Array konten lain yang akan disembunyikan.
     */
    function switchTabs(activeTab, activeContent, inactiveTabs, inactiveContents) {
        // Aktifkan tab dan konten yang dipilih
        activeTab.classList.replace('tab-inactive', 'tab-active');
        activeContent.classList.remove('hidden');

        // Nonaktifkan semua tab lainnya
        inactiveTabs.forEach(tab => tab.classList.replace('tab-active', 'tab-inactive'));
        
        // Sembunyikan semua konten lainnya
        inactiveContents.forEach(content => content.classList.add('hidden'));
    }

    // Tambahkan event listener untuk Tab Yoga
    yogaTab.addEventListener('click', () => {
        switchTabs(
            yogaTab, 
            yogaContent, 
            [spaTab, vcoTab], 
            [spaContent, vcoContent]
        );
    });

    // Tambahkan event listener untuk Tab Spa
    spaTab.addEventListener('click', () => {
        switchTabs(
            spaTab, 
            spaContent, 
            [yogaTab, vcoTab], 
            [yogaContent, vcoContent]
        );
    });

    // Tambahkan event listener untuk Tab VCO
    vcoTab.addEventListener('click', () => {
        switchTabs(
            vcoTab, 
            vcoContent, 
            [yogaTab, spaTab], 
            [yogaContent, spaContent]
        );
    });

}

        // Fungsionalitas Galeri Carousel
        if (galleryWrapper) { // Pastikan elemen galeri ada
            const galleryItemsForCarousel = [...galleryImages, ...galleryImages]; // Duplikasi untuk efek looping
            galleryItemsForCarousel.forEach(item => {
                const div = document.createElement('div');
                div.className = "min-w-[33.3333%] px-2"; // Lebar 1/3 untuk 3 item terlihat
                div.innerHTML = `
                    <img src="${item.src}" alt="${item.alt}" class="w-full h-60 object-cover rounded-lg transition-transform duration-300 hover:scale-110">
                `;
                galleryWrapper.appendChild(div);
            });

            let currentGalleryIndex = 0;
            const visibleItemsInGallery = 3; // Jumlah item yang terlihat sekaligus

            // Fungsi ini dibuat global agar bisa dipanggil dari atribut onclick di HTML
            window.scrollGallery = function(direction) {
                const totalItems = galleryItemsForCarousel.length;
                currentGalleryIndex = (currentGalleryIndex + direction + totalItems) % totalItems;
                galleryWrapper.scrollTo({
                    left: currentGalleryIndex * galleryWrapper.clientWidth / visibleItemsInGallery,
                    behavior: 'smooth'
                });
            }
        }


        // Fungsionalitas Modal Booking
        if (bookingModal) { // Pastikan modal ada
            openModalBtns.forEach(button => {
                button.addEventListener('click', () => {
                    const programKey = button.dataset.program;
                    const program = programs[programKey];

                    if (program) {
                        modalTitle.textContent = program.title;
                        modalDescription.textContent = program.description;
                        modalPrice.textContent = program.price;
                        modalBookingLink.href = `https://wa.me/+6281337382746?text=${encodeURIComponent(program.whatsappMessage)}`;

                        modalFeatures.innerHTML = ''; // Bersihkan fitur sebelumnya
                        program.features.forEach(feature => {
                            const li = document.createElement('li');
                            li.textContent = feature;
                            modalFeatures.appendChild(li);
                        });

                        bookingModal.classList.remove('hidden');
                        setTimeout(() => {
                            bookingModal.classList.remove('opacity-0');
                            bookingModal.querySelector('div').classList.remove('scale-95');
                        }, 50); // Sedikit tunda untuk transisi
                    }
                });
            });

            closeModalBtns.forEach(button => {
                button.addEventListener('click', () => {
                    bookingModal.classList.add('opacity-0');
                    bookingModal.querySelector('div').classList.add('scale-95');
                    setTimeout(() => {
                        bookingModal.classList.add('hidden');
                    }, 300); // Tunggu transisi selesai
                });
            });

            // Tutup modal saat mengklik di luar konten modal
            bookingModal.addEventListener('click', (e) => {
                if (e.target === bookingModal) {
                    bookingModal.classList.add('opacity-0');
                    bookingModal.querySelector('div').classList.add('scale-95');
                    setTimeout(() => {
                        bookingModal.classList.add('hidden');
                    }, 300);
                }
            });
        }


        // --- Fungsionalitas Scroll Snap / Mengunci Scroll ---
        // PENTING: Pastikan sections sudah terisi saat ini dipanggil
        if (sections.length > 0) {
            // Kita sudah set 'overflow: hidden' di style.css untuk body
            // document.body.style.overflow = 'hidden'; 
            
            // Fungsi untuk menggulir ke section tertentu
            function scrollToSection(index) {
                // Pengecekan tambahan untuk memastikan sections sudah ada dan tidak kosong
                if (!sections || sections.length === 0) {
                    console.warn("Sections belum dimuat atau kosong saat scrollToSection dipanggil.");
                    return;
                }

                if (index >= 0 && index < sections.length) {
                    isScrolling = true;
                    sections[index].scrollIntoView({ behavior: 'smooth' });

                    // Perbarui kelas 'active-nav' pada link navigasi
                    navLinks.forEach(link => {
                        link.classList.remove('active-nav');
                        // Pastikan link navigasi yang sesuai dengan section yang sedang aktif
                        if (link.getAttribute('href') && link.getAttribute('href').substring(1) === sections[index].id) {
                            link.classList.add('active-nav');
                        }
                    });

                    // Set timeout agar isScrolling kembali false setelah animasi selesai
                    setTimeout(() => {
                        isScrolling = false;
                        currentSectionIndex = index; // Pastikan index saat ini diperbarui setelah scroll selesai
                    }, 700); // Sesuaikan durasi timeout dengan 'behavior: smooth'
                }
            }

            // Inisialisasi posisi saat halaman pertama dimuat
            // Ini harus dipanggil setelah semua sections dimuat dan diinisialisasi.
            // Cek jika ada hash di URL (misal: #programs), gulir ke sana. Jika tidak, ke section 0.
            let initialLoadSectionIndex = 0;
            if (window.location.hash) {
                const initialSectionElement = document.getElementById(window.location.hash.substring(1));
                if (initialSectionElement) {
                    const foundIndex = Array.from(sections).indexOf(initialSectionElement);
                    if (foundIndex !== -1) {
                        initialLoadSectionIndex = foundIndex;
                    }
                }
            }
            // Gulir awal setelah semua content dimuat dan diukur
            scrollToSection(initialLoadSectionIndex);


            // Listener untuk event wheel (scroll mouse)
            window.addEventListener('wheel', (event) => {
                if (isScrolling) return; // Jangan lakukan apa-apa jika sedang menggulir

                if (event.deltaY > 0) { // Gulir ke bawah
                    if (currentSectionIndex < sections.length - 1) {
                        scrollToSection(currentSectionIndex + 1);
                    }
                } else { // Gulir ke atas
                    if (currentSectionIndex > 0) {
                        scrollToSection(currentSectionIndex - 1);
                    }
                }
            });

            // Listener untuk klik pada link navigasi
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault(); // Mencegah scroll default browser
                    const targetId = link.getAttribute('href').substring(1);
                    const targetSection = document.getElementById(targetId);
                    if (targetSection) {
                        const index = Array.from(sections).indexOf(targetSection);
                        if (index !== -1) {
                            scrollToSection(index);
                        }
                    }
                    // Tutup menu mobile jika terbuka setelah klik link
                    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                        mobileMenu.classList.add('hidden');
                    }
                });
            });
        } else {
            console.warn("Array 'sections' kosong. Pastikan semua partials dimuat dengan benar.");
        }

    }).catch(error => {
        console.error("Kesalahan fatal: Tidak dapat memuat semua partials atau menginisialisasi script:", error);
    });
}); // Akhir dari DOMContentLoaded
