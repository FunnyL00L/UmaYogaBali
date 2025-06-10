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
        const yogaContent = document.getElementById('content-yoga');
        const spaContent = document.getElementById('content-spa');

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


        // --- Data Program (untuk Modal Booking) ---
        const programs = {
            'yoga-class': {
                title: 'Kelas Yoga Prenatal',
                description: 'Kelas yoga yang dirancang khusus untuk ibu hamil, membantu meningkatkan fleksibilitas, kekuatan, dan ketenangan batin. Setiap sesi berdurasi 60 menit.',
                features: [
                    'Sesi dipimpin oleh instruktur bersertifikasi',
                    'Fokus pada pernapasan dan relaksasi',
                    'Gerakan aman untuk setiap trimester',
                    'Lingkungan yang mendukung'
                ],
                price: 'IDR 150.000/sesi',
                whatsappMessage: 'Halo Uma Yoga Bali, saya tertarik dengan program Kelas Yoga Prenatal (IDR 150.000/sesi). Bisakah saya mendapatkan informasi lebih lanjut atau melakukan booking?'
            },
            'spa-package': {
                title: 'Paket Spa Prenatal',
                description: 'Paket spa mewah yang menenangkan, dirancang untuk meredakan ketegangan dan memanjakan tubuh ibu hamil. Termasuk pijat prenatal, lulur, dan masker tubuh.',
                features: [
                    'Pijat prenatal 60 menit',
                    'Lulur dan masker tubuh alami',
                    'Perawatan wajah organik',
                    'Minuman herbal penyegar'
                ],
                price: 'IDR 400.000/paket',
                whatsappMessage: 'Halo Uma Yoga Bali, saya tertarik dengan program Paket Spa Prenatal (IDR 400.000/paket). Bisakah saya mendapatkan informasi lebih lanjut atau melakukan booking?'
            },
            'private-yoga': {
                title: 'Yoga Prenatal Privat',
                description: 'Sesi yoga personal yang disesuaikan sepenuhnya dengan kebutuhan dan kondisi Anda. Ideal untuk perhatian penuh dari instruktur.',
                features: [
                    'Sesi privat 1-on-1 dengan instruktur',
                    'Program yang disesuaikan personal',
                    'Fleksibilitas jadwal',
                    'Fokus pada area yang Anda butuhkan'
                ],
                price: 'IDR 250.000/sesi',
                whatsappMessage: 'Halo Uma Yoga Bali, saya tertarik dengan program Yoga Prenatal Privat (IDR 250.000/sesi). Bisakah saya mendapatkan informasi lebih lanjut atau melakukan booking?'
            }
        };


        // --- Data Gambar Galeri ---
        const galleryImages = [
            { src: "asset/image/yogaa.jpg", alt: "Studio yoga" },
            { src: "asset/image/spaaa.jpg", alt: "Spa" },
            { src: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop", alt: "Kolam renang" },
            { src: "asset/image/kolam bunga.png", alt: "Kolam bunga" },
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

        // Fungsionalitas Tabs Program (Yoga/Spa)
        if (yogaTab && spaTab && yogaContent && spaContent) { // Pastikan semua elemen tab ada
            function switchTabs(activeTab, inactiveTab, activeContent, inactiveContent) {
                activeTab.classList.remove('tab-inactive');
                activeTab.classList.add('tab-active');
                inactiveTab.classList.remove('tab-active');
                inactiveTab.classList.add('tab-inactive');
                activeContent.classList.remove('hidden');
                inactiveContent.classList.add('hidden');
            }

            yogaTab.addEventListener('click', () => {
                switchTabs(yogaTab, spaTab, yogaContent, spaContent);
            });
            spaTab.addEventListener('click', () => {
                switchTabs(spaTab, yogaTab, spaContent, yogaContent);
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