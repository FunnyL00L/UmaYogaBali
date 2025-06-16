        document.addEventListener('DOMContentLoaded', () => {

            /**
             * Memuat konten HTML dari file eksternal (partials) ke dalam elemen placeholder.
             * @param {string} placeholderId - ID elemen di index.html yang akan diisi.
             * @param {string} filePath - Path ke file .html yang akan dimuat.
             */
            async function loadPartial(placeholderId, filePath) {
                try {
                    const response = await fetch(filePath);
                    if (!response.ok) {
                        throw new Error(`Gagal memuat file: ${filePath}. Status: ${response.status}`);
                    }
                    const html = await response.text();
                    const placeholder = document.getElementById(placeholderId);
                    
                    if (!placeholder) {
                        console.error(`Error: Placeholder dengan ID '${placeholderId}' tidak ditemukan di DOM.`);
                        return false;
                    }

                    if (placeholderId === 'main-content') {
                        placeholder.insertAdjacentHTML('beforeend', html);
                    } else {
                        placeholder.innerHTML = html;
                    }
                    return true;
                } catch (e) {
                    console.error(`Kesalahan fatal saat memuat ${filePath}:`, e);
                    return false;
                }
            }

            // --- TAHAP 1: MUAT SEMUA KONTEN HTML ---
            // Memastikan semua bagian halaman dimuat sebelum script lain berjalan.
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
                // --- TAHAP 2: INISIALISASI SEMUA FITUR ---
                // Setelah semua HTML ada di halaman, panggil semua fungsi untuk
                // mengaktifkan interaktivitas.
                console.log("Semua partials berhasil dimuat. Menginisialisasi skrip...");
                initializeMusicControls();
                initializeMobileMenu();
                initializeProgramTabs();
                initializeGallery();
                initializeBookingModals();
                initializePageScrolling();

            }).catch(error => {
                console.error("Kesalahan kritis: Gagal memuat satu atau lebih file partial. Skrip tidak dapat diinisialisasi.", error);
            });

            // ===================================================================
            // KUMPULAN FUNGSI INISIALISASI
            // (Setiap fungsi bertanggung jawab untuk satu fitur spesifik)
            // ===================================================================

            /** Mengatur tombol musik dan memainkannya setelah interaksi pengguna dari layar selamat datang. */
            function initializeMusicControls() {
                const music = document.getElementById("music");
                const playIcon = document.getElementById("play-icon");
                const pauseIcon = document.getElementById("pause-icon");
                const musicButton = document.getElementById("music-button");

                // Elemen dari Modal Selamat Datang
                const welcomeModal = document.getElementById("welcome-modal");
                const enterButton = document.getElementById("enter-website-btn");

                if (!music || !musicButton || !playIcon || !pauseIcon || !welcomeModal || !enterButton) {
                    console.warn("Elemen kontrol musik atau modal selamat datang tidak lengkap. Fitur musik mungkin tidak berjalan.");
                    return;
                }

                // Set state ikon awal
                pauseIcon.classList.add("hidden");
                playIcon.classList.remove("hidden");

                // Listener untuk tombol masuk
                enterButton.addEventListener('click', () => {
                    // Mainkan musik (INI DIJAMIN BERHASIL KARENA ADA INTERAKSI PENGGUNA)
                    music.play();
                    
                    // Update ikon
                    playIcon.classList.add("hidden");
                    pauseIcon.classList.remove("hidden");

                    // Sembunyikan modal dengan efek fade out
                    welcomeModal.classList.add('opacity-0');
                    setTimeout(() => {
                        welcomeModal.classList.add('hidden');
                    }, 500); // Samakan dengan durasi transisi di CSS/Tailwind
                }, { once: true }); // Opsi { once: true } agar event listener ini hanya berjalan sekali

                // Fungsionalitas tombol musik manual
                musicButton.addEventListener("click", () => {
                    if (music.paused) {
                        music.play();
                        playIcon.classList.add("hidden");
                        pauseIcon.classList.remove("hidden");
                    } else {
                        music.pause();
                        pauseIcon.classList.add("hidden");
                        playIcon.classList.remove("hidden");
                    }
                });
            }

            /** Mengatur fungsionalitas menu mobile (hamburger). */
            function initializeMobileMenu() {
                const mobileMenuButton = document.getElementById('mobile-menu-button');
                const mobileMenu = document.getElementById('mobile-menu');
                if (!mobileMenuButton || !mobileMenu) return;

                mobileMenuButton.addEventListener('click', () => {
                    mobileMenu.classList.toggle('hidden');
                });
            }

            /** Mengatur sistem tab pada bagian program (Yoga, Spa, VCO). */
            function initializeProgramTabs() {
                const yogaTab = document.getElementById('tab-yoga');
                const spaTab = document.getElementById('tab-spa');
                const vcoTab = document.getElementById('tab-vco');
                const yogaContent = document.getElementById('content-yoga');
                const spaContent = document.getElementById('content-spa');
                const vcoContent = document.getElementById('content-vco');

                if (!yogaTab || !spaTab || !vcoTab || !yogaContent || !spaContent || !vcoContent) return;

                function switchTabs(activeTab, activeContent, inactiveTabs, inactiveContents) {
                    activeTab.classList.replace('tab-inactive', 'tab-active');
                    activeContent.classList.remove('hidden');
                    inactiveTabs.forEach(tab => tab.classList.replace('tab-active', 'tab-inactive'));
                    inactiveContents.forEach(content => content.classList.add('hidden'));
                }

                yogaTab.addEventListener('click', () => switchTabs(yogaTab, yogaContent, [spaTab, vcoTab], [spaContent, vcoContent]));
                spaTab.addEventListener('click', () => switchTabs(spaTab, spaContent, [yogaTab, vcoTab], [yogaContent, vcoContent]));
                vcoTab.addEventListener('click', () => switchTabs(vcoTab, vcoContent, [yogaTab, spaTab], [yogaContent, spaContent]));
            }

            /** Mengisi galeri dengan gambar dan membuat efek auto-scroll. */
            function initializeGallery() {
                const galleryWrapper = document.getElementById('galleryWrapper');
                if (!galleryWrapper) return;

                const galleryImages = [
                    { src: "asset/image/yogaa.jpg", alt: "Sesi prenatal yoga" }, { src: "asset/image/spaaa.jpg", alt: "Ruang perawatan spa" }, { src: "asset/image/kolam bunga.png", alt: "Kolam dengan taburan bunga" }, { src: "asset/image/area.jpg", alt: "Area outdoor yang asri" }, { src: "asset/image/aula.jpg", alt: "Aula atau studio utama" }, { src: "asset/image/halam.jpg", alt: "Halaman depan dengan taman" }, { src: "asset/image/image.png", alt: "Wanita melakukan yoga" }, { src: "asset/image/kori.jpg", alt: "Gerbang Kori khas Bali" }, { src: "asset/image/utama.jpg", alt: "Pemandangan utama lokasi" }, { src: "asset/image/VCO.png", alt: "Produk Minyak Uma VCO" }, { src: "asset/image/airlangga.png", alt: "Detail arsitektur Airlangga" }, { src: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop", alt: "Kolam renang di malam hari" },
                ];
                
                const galleryItemsForCarousel = [...galleryImages, ...galleryImages]; 
                
                galleryWrapper.innerHTML = '';
                galleryItemsForCarousel.forEach(item => {
                    const div = document.createElement('div');
                    div.className = "flex-shrink-0 w-1/2 md:w-1/3 lg:w-1/4 p-2";
                    div.innerHTML = `<img src="${item.src}" alt="${item.alt}" class="w-full h-60 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">`;
                    galleryWrapper.appendChild(div);
                });

                let scrollInterval = setInterval(autoScroll, 50);

                function autoScroll() {
                    galleryWrapper.scrollBy({ left: 1, behavior: 'auto' });
                    if (galleryWrapper.scrollLeft >= galleryWrapper.scrollWidth / 2) {
                        galleryWrapper.scrollTo({ left: 0, behavior: 'auto' });
                    }
                }

                galleryWrapper.addEventListener('mouseenter', () => clearInterval(scrollInterval));
                galleryWrapper.addEventListener('mouseleave', () => {
                    scrollInterval = setInterval(autoScroll, 50);
                });
            }

            /** Mengatur fungsionalitas modal booking (buka/tutup dan pengisian data). */
            function initializeBookingModals() {
                const bookingModal = document.getElementById('booking-modal');
                if (!bookingModal) return;

                const programs = { 'yoga-package': { title: 'Booking Uma Prenatal Yoga', description: 'Pilih paket yoga yang paling sesuai untuk Anda. Setiap sesi dirancang khusus untuk memberikan kenyamanan dan kekuatan selama masa kehamilan.', features: ['<strong>Basic Yoga:</strong> Sesi yoga fundamental untuk relaksasi dan peregangan.', '<strong>Premium Yoga:</strong> Sesi yoga lengkap, termasuk bonus gratis 1 botol Minyak Uma VCO.', 'Dipandu oleh instruktur bersertifikasi.', 'Gerakan aman dan disesuaikan untuk setiap trimester.'], price: 'Mulai dari IDR 170.000', whatsappMessage: 'Halo Uma Yoga Bali, saya tertarik dengan paket Uma Prenatal Yoga. Bisakah saya mendapatkan informasi lebih lanjut mengenai paket Basic dan Premium?' }, 'spa-package': { title: 'Booking Uma Prenatal Spa', description: 'Manjakan diri Anda dengan perawatan spa yang menenangkan dan aman untuk ibu hamil. Pilih dari paket Classic atau Modern kami.', features: ['<strong>Classic Spa:</strong> Perawatan spa esensial untuk meredakan ketegangan.', '<strong>Modern Spa:</strong> Pengalaman spa premium, termasuk bonus gratis 1 botol Minyak Uma VCO.', 'Menggunakan bahan-bahan alami dan tradisional Bali.', 'Terapis profesional yang berpengalaman dalam perawatan prenatal.'], price: 'Mulai dari IDR 350.000', whatsappMessage: 'Halo Uma Yoga Bali, saya tertarik dengan paket Uma Prenatal Spa. Bisakah saya mendapatkan informasi lebih lanjut mengenai paket Classic dan Modern?' }, 'bundle-package': { title: 'Booking Bundle Package', description: 'Dapatkan pengalaman lengkap dengan paket kombinasi Yoga dan Spa kami untuk relaksasi maksimal.', features: ['<strong>Gold (Yoga + Spa):</strong> Kombinasi sesi yoga dan spa untuk kebugaran dan ketenangan menyeluruh.', '<strong>Diamond (Yoga + Spa + Free VCO):</strong> Paket termewah dengan sesi yoga, spa, dan bonus gratis 1 botol Minyak Uma VCO.', 'Nilai terbaik untuk pengalaman prenatal yang komprehensif.'], price: 'Mulai dari IDR 500.000', whatsappMessage: 'Halo Uma Yoga Bali, saya tertarik dengan Bundle Package. Bisakah saya mendapatkan informasi lebih lanjut mengenai paket Gold dan Diamond?' } };
                
                const openModalBtns = document.querySelectorAll('.open-modal-btn');
                const closeModalBtns = document.querySelectorAll('.close-modal-btn');
                const modalDialog = bookingModal.querySelector('div[role="dialog"]');

                function openModal(programKey) {
                    const program = programs[programKey];
                    if (!program) return;
                    
                    bookingModal.querySelector('#modal-title').textContent = program.title;
                    bookingModal.querySelector('#modal-description').textContent = program.description;
                    bookingModal.querySelector('#modal-price').textContent = program.price;
                    bookingModal.querySelector('#modal-booking-link').href = `https://wa.me/+6281337382746?text=${encodeURIComponent(program.whatsappMessage)}`;
                    
                    const featuresList = bookingModal.querySelector('#modal-features');
                    featuresList.innerHTML = '';
                    program.features.forEach(featureText => {
                        const li = document.createElement('li');
                        li.innerHTML = featureText;
                        featuresList.appendChild(li);
                    });

                    bookingModal.classList.remove('hidden');
                    setTimeout(() => {
                        bookingModal.classList.remove('opacity-0');
                        if(modalDialog) modalDialog.classList.remove('scale-95');
                    }, 10);
                }

                function closeModal() {
                    bookingModal.classList.add('opacity-0');
                    if(modalDialog) modalDialog.classList.add('scale-95');
                    setTimeout(() => bookingModal.classList.add('hidden'), 300);
                }

                openModalBtns.forEach(button => button.addEventListener('click', () => openModal(button.dataset.program)));
                closeModalBtns.forEach(button => button.addEventListener('click', closeModal));
                bookingModal.addEventListener('click', (e) => {
                    if (e.target === bookingModal) closeModal();
                });
            }

            /** Mengatur fungsionalitas scroll snap antar section. */
            function initializePageScrolling() {
                const sections = document.querySelectorAll('main section, footer');
                const navLinks = document.querySelectorAll('.nav-link');
                const mobileMenu = document.getElementById('mobile-menu');
                if (sections.length === 0) {
                    console.warn("Tidak ada 'section' yang ditemukan. Scroll-snap dinonaktifkan.");
                    return;
                }

                let currentSectionIndex = 0;
                let isScrolling = false;

                function scrollToSection(index) {
                    if (isScrolling || index < 0 || index >= sections.length) return;

                    isScrolling = true;
                    const targetSection = sections[index];
                    targetSection.scrollIntoView({ behavior: 'smooth' });

                    const targetId = targetSection.id;
                    navLinks.forEach(link => {
                        link.classList.toggle('active-nav', link.getAttribute('href') === `#${targetId}`);
                    });

                    setTimeout(() => {
                        isScrolling = false;
                        currentSectionIndex = index;
                    }, 1000); 
                }

                const initialHash = window.location.hash.substring(1);
                if (initialHash) {
                    const initialIndex = Array.from(sections).findIndex(s => s.id === initialHash);
                    if (initialIndex !== -1) {
                        setTimeout(() => scrollToSection(initialIndex), 100);
                    }
                }
                
                window.addEventListener('wheel', (event) => {
                    const isModalOpen = !document.getElementById('booking-modal').classList.contains('hidden');
                    if (isScrolling || isModalOpen) return; // Jangan scroll jika modal terbuka

                    event.preventDefault(); 
                    const direction = event.deltaY > 0 ? 1 : -1;
                    scrollToSection(currentSectionIndex + direction);
                }, { passive: false });

                navLinks.forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const targetId = link.getAttribute('href').substring(1);
                        const targetIndex = Array.from(sections).findIndex(s => s.id === targetId);

                        if (targetIndex !== -1) {
                            scrollToSection(targetIndex);
                        }
                        
                        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                            mobileMenu.classList.add('hidden');
                        }
                    });
                });
            }

        });