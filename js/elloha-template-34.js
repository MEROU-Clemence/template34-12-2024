$(document).ready(function () {
    // ****** Mobile Nav
    var MobNav = $('.navbar-toggler');
    MobNav.on('click', function () {
        $('.mobile-nav').toggleClass('menu-mobile-active');
        $('.navbar-toggler .btn-menu').toggleClass('d-none');
        $('.btn-infos-menu').addClass('d-none');

        if ($('.navbar-toggler .btn-menu.la-bars').hasClass('d-none')) {
            $('.btn-infos-menu').addClass('d-none');
            $('.first-nav').addClass('first-nav-fixed');
            $('main').addClass('main-hidden');
        } else {
            $('.btn-infos-menu').removeClass('d-none');
            $('.first-nav').removeClass('first-nav-fixed');
            $('main').removeClass('main-hidden');
        }
    });

    // ****** Menu computer
    $('.btn-menu-2').on('click', function () {
        $('.mobile-nav').removeClass('menu-mobile-active');
        $('.btn-menu.las.la-bars').removeClass('d-none');
        $('.first-nav').removeClass('first-nav-fixed');
    });

    // ****** Sous-menu
    $('.clic-sub-menu').on('click', function () {
        if ($(this).children('.sub-menu').hasClass('sub-menu-active')) {
            $(this).children('.sub-menu').removeClass('sub-menu-active');
            $(this).children('a').removeClass('menu-mobile-color-title');
        } else {
            $('.clic-sub-menu .sub-menu').removeClass('sub-menu-active');
            $('.clic-sub-menu > a').removeClass('menu-mobile-color-title');
            $(this).children('.sub-menu').addClass('sub-menu-active');
            $(this).children('a').addClass('menu-mobile-color-title');
        }
    });


    // ****** Sous-menu langues
    $('.languages').on('click', function () {
        if ($(this).children('.dropdown-menu').hasClass('dropdown-menu-active')) {
            $('.languages .dropdown-menu').removeClass('dropdown-menu-active');
        } else {
            $('.languages .dropdown-menu').removeClass('dropdown-menu-active');
            $(this).children('.dropdown-menu').addClass('dropdown-menu-active');
        }
    });

    // ****** Météo: applique l'image de fond correspondante
    $('.weather-icon').each(function () {
        var weatherIcon = $(this).attr('data');
        var $meteoModule = $(this).closest('.meteo-module');
        var baseUrl = $meteoModule.data('url');

        // Vérifie si weatherIcon est défini et non vide
        if (weatherIcon && weatherIcon.trim() !== '') {
            var iconPath = baseUrl + weatherIcon + '.jpeg';

            // Ajoute une classe basée sur l'icône météo
            $meteoModule.addClass('weather-' + weatherIcon);
        } else {
            // Image par défaut si aucune icône n'est trouvée
            var iconPath = baseUrl + 'clear-day.jpeg';

            // Ajoute une classe par défaut si souhaité
            $meteoModule.addClass('weather-clear-day');
        }

        // Applique l'image de fond
        $meteoModule.css({
            'background-image': 'url(' + iconPath + ')',
            'background-size': 'cover'
        });
    });

    // ****** Texte presentation page Home
    if ($(".description").length > 0) {
        var $description = $(".description");
        var $seeMore2 = $("#seeMore2");
        var $seeLess2 = $("#seeLess2");

        // Check si le texte est limité, on affiche pas les boutons
        if ($description[0].scrollHeight <= $description.height()) {
            $seeMore2.hide();
            $seeLess2.hide();
        } else {
            $seeMore2.show();
            $seeLess2.hide();
        }

        // Voir plus presentation
        $seeMore2.on('click', function (e) {
            e.preventDefault();
            $description.css('height', 'auto').addClass("expanded");
            $seeMore2.hide();
            $seeLess2.show();
        });

        // Voir moins presentation
        $seeLess2.on('click', function (e) {
            e.preventDefault();
            $description.css('height', 'auto').removeClass("expanded");
            $seeMore2.show();
            $seeLess2.hide();
        });
    };

    // ****** Déclenchement effet (Titles et Pictos)
    function setupObserver(targetSelector, hiddenClass, animateClass) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                const target = entry.target;

                if (entry.isIntersecting && !target.classList.contains(animateClass)) {
                    target.classList.add(animateClass);
                    target.classList.remove(hiddenClass);
                    observer.unobserve(target);
                }
            });
        }, observerOptions);

        const targets = document.querySelectorAll(targetSelector);
        targets.forEach(target => {
            if (target.classList.contains(hiddenClass)) {
                target.dataset.animClass = animateClass;
            }
            observer.observe(target);
        });
    }

    // Setup for titles and pictos
    setupObserver('.hidden-title', 'hidden-title', 'animate-title');
    setupObserver('.hidden-title-banner', 'hidden-title-banner', 'animate-title-banner');
    setupObserver('.hidden-pictos', 'hidden-pictos', 'animate-pictos');


    // ****** SCEA + / -
    // Voir plus SCEA
    $(".options-scea").hide();
    $(".options-scea").slice(0, 8).show();

    $("#seeMore1").on('click', function (e) {
        e.preventDefault();

        $(".options-scea:hidden").slideDown();

        $("#seeMore1").hide();
        $("#seeLess1").show();
    });

    // Voir moins SCEA
    $("#seeLess1").on('click', function (e) {
        e.preventDefault();

        $(".options-scea").not(":lt(8)").slideUp();

        $("#seeMore1").show();
        $("#seeLess1").hide();
    });

    // ****** Galerie images
    const $slider = $('.slider-gallery');

    // Attendre l'initialisation du carrousel
    $slider.on('initialized.owl.carousel', function (event) {
        const $totalPhotos = $('.total-photos');
        const $currentPhoto = $('.current-photo');

        // Trouver le nombre d'éléments sans les clones et les empty
        const totalItems = $slider.find('.owl-item:not(.cloned)').filter(function () {
            return !$(this).find('.empty-item').length;
        }).length;
        $totalPhotos.text(totalItems);

        // Ajoute l'écouteur sur l'événement de changement
        $slider.on('changed.owl.carousel', function (event) {
            const currentIndex = event.item.index - event.relatedTarget._clones.length / 2;
            const normalizedIndex = ((currentIndex % totalItems) + totalItems) % totalItems + 1;
            $currentPhoto.text(normalizedIndex);
            
            const totalPhotos = parseInt($totalPhotos.text());

            // Comparer si current-photo est égal à total-photos
            if (currentIndex === totalPhotos) {
                $slider.trigger('to.owl.carousel', [0, 300]);
            }
        });   
    });

    // Ajout de classes pour différencier les items actifs entre eux
    $slider.on('changed.owl.carousel', function (event) {
        // Sélectionner tous les éléments du carrousel
        const $owlItems = $('.slider-gallery .owl-item');

        // Retirer les classes existantes
        $owlItems.removeClass('item-principal item-secondary first-secondary effect-start');

        // Récupérer les indices actifs
        const activeIndices = event.item.index;
        const visibleCount = event.page.size;

        for (let i = activeIndices; i < activeIndices + visibleCount; i++) {
            const $item = $owlItems.eq(i);

            if (i === activeIndices) {
                // Ajouter `item-principal` au premier élément actif
                $item.addClass('item-principal effect-start');
            } else {
                // Ajouter `owl-item-secondary` aux autres éléments actifs
                $item.addClass('item-secondary');
            }
        }

        // Ajouter une classe spécifique au premier élément `item-secondary`
        const $firstSecondary = $owlItems.filter('.item-secondary').first();
        if ($firstSecondary.length > 0) {
            $firstSecondary.addClass('first-secondary');
        }
    });

    // Écouter les clics uniquement sur first-secondary + gestion du timing rewind/not-rewind
    $slider.on('click', '.first-secondary', function () {
        const $clickedItem = $(this);
        const totalItems = $slider.find('.owl-item:not(.cloned)').filter(function () {
            return $(this).find('.empty-item').length === 0;
        }).length;

        const currentIndex = $slider.find('.owl-item.active').first().index();
        const clickedIndex = $clickedItem.index();

        const normalizedCurrentIndex = (currentIndex % totalItems + totalItems) % totalItems;
        const normalizedClickedIndex = (clickedIndex % totalItems + totalItems) % totalItems;

        const isRewind = normalizedClickedIndex < normalizedCurrentIndex;
        const speed = isRewind ? 300 : 1000;

        $slider.trigger('to.owl.carousel', [clickedIndex, speed]);
    });

    // ****** News et replace infos click
    const newsItems = document.querySelectorAll(".clickable-news");
    const newsTitle = document.querySelector(".title-news-home-outside");
    const newsDescription = document.querySelector(".description-news-home");

    // Ajoute un gestionnaire de clic à chaque élément de news
    newsItems.forEach((newsItem) => {
        newsItem.addEventListener("click", () => {
            // Récupérer les données de l'élément cliqué
            const title = newsItem.getAttribute("data-title");
            const description = newsItem.getAttribute("data-description");

            // Mettre à jour les champs de la section "outside-news-click"
            if (newsTitle) newsTitle.textContent = title;
            if (newsDescription) newsDescription.innerHTML = description;
        });
    });

    // ****** Caroussel pages
    const $sliderOthersPages = $('.slider-others-pages');
    const $photoCounter = $('.others-pages .photo-counter');

    // Attendre l'initialisation du carrousel
    $sliderOthersPages.on('initialized.owl.carousel', function (event) {
        const $totalPages = $('.total-photos-pages');
        const $currentPage = $('.current-photo-pages');

        // Trouver le nombre d'éléments sans les clones
        const totalItems = $sliderOthersPages.find('.owl-item:not(.cloned)').length;
        $totalPages.text(totalItems);

        // Ajouter une fonction pour cacher/afficher le compteur si tous les items sont visibles
        function togglePhotoCounter() {
            const $activeItems = $sliderOthersPages.find('.owl-item.active');
            const allVisible = $activeItems.length === totalItems;

            if (allVisible) {
                $photoCounter.hide();
            } else {
                $photoCounter.show();
            }
        }

        // Vérifier l'état initial
        togglePhotoCounter();

        // Ajoute l'écouteur sur l'événement de changement
        $sliderOthersPages.on('changed.owl.carousel', function (event) {
            const currentIndex = event.item.index - event.relatedTarget._clones.length / 2;
            const normalizedIndex = ((currentIndex % totalItems) + totalItems) % totalItems + 1;
            $currentPage.text(normalizedIndex);

            // Vérifier à nouveau si le nav est désactivé
            togglePhotoCounter();
        });

        // Écouteur pour gérer le redimensionnement
        $(window).on('resize', function () {
            togglePhotoCounter();
        });
    });

    // ****** Clic description AROUND
    // Clic sur "Voir plus" 
    $(".seeMore3").on("click", function (e) {
        e.preventDefault();
        var $container = $(this).closest(".around-item-content-big");
        var $description = $container.find(".description-around");
        $description.addClass("expanded");
        $container.find(".seeMore3").hide();
        $container.find(".seeLess3").show();
    });

    // Clic sur "Voir moins"
    $(".seeLess3").on("click", function (e) {
        e.preventDefault();
        var $container = $(this).closest(".around-item-content-big");
        var $description = $container.find(".description-around");
        $description.removeClass("expanded");
        $container.find(".seeMore3").show();
        $container.find(".seeLess3").hide();
    });

    // ****** VOUCHERS
    // Clics sur les liens des prix chèques cadeaux
    $('.all-prices-vouchers a').on('click', function (event) {
        event.preventDefault();

        var targetId = $(this).attr('id');

        // Trouver l'élément correspondant dans le slider
        var targetElement = $(targetId);
        if (targetElement.length) {
            var index = $('.vouchers-slider').find('.owl-item').filter(function () {
                return $(this).find(targetId).length > 0;
            }).index();

            // Si un index valide est trouvé, déplacer le slider
            if (index !== -1) {
                $('.vouchers-slider').trigger('to.owl.carousel', [index, 600]);
            } else {
                console.error("Impossible de trouver l'index dans Owl Carousel pour :", targetId);
            }
        } else {
            console.error("Cible non trouvée pour :", targetId);
        }
    });

    // Détecter le changement dans Owl Carousel pour le .active
    $('.vouchers-slider').on('changed.owl.carousel', function (event) {
        var currentIndex = event.item.index;

        // Sélectionner l'élément actif dans le slider
        var activeSlide = $(event.target).find('.owl-item').eq(currentIndex).find('.voucher-contain');

        if (activeSlide.length) {
            var activeId = activeSlide.attr('id');
            console.log("Élément actif dans le slider :", activeId);

            $('.all-prices-vouchers a').removeClass('active');

            $('.all-prices-vouchers a[href="#' + activeId + '"]').addClass('active');

        }
    });

    // Tronquer le titre si trop long au dela de 40 charactères uniquement en vue desktop

    function truncateText(selector, maxLength) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            // Sauvegarder le texte original dans un attribut "data-original-text" pour restaurer en cas de besoin
            if (!element.hasAttribute('data-original-text')) {
                element.setAttribute('data-original-text', element.textContent.trim());
            }

            const originalText = element.getAttribute('data-original-text');
            if (window.matchMedia("(min-width: 1220px)").matches) {
                if (originalText.length > maxLength) {
                    element.textContent = originalText.substring(0, maxLength) + '...';
                } else {
                    element.textContent = originalText;
                }
            } else {
                element.textContent = originalText;
            }
        });
    }

    // Troncature à 35 charactères
    function applyTruncateOnScreenSize() {
        truncateText('.logo.logo-w .title', 35);
    }

    applyTruncateOnScreenSize();
    window.addEventListener('resize', applyTruncateOnScreenSize);

});

$(document).ready(function () {
    $('.slider-gallery').owlCarousel({
        rtl: true,
        loop: false,
        rewind: true,
        dots: false,
        nav: false,
        navText: ["<i class='las la-arrow-left'></i>", "<i class='las la-arrow-right'></i>"],
        responsiveClass: true,
        responsive: {
            0: {
                autoplay: true,
                touchDrag: true,
                mouseDrag: true,
                items: 1,
                margin: 20,
            },
            768: {
                autoplay: false,
                touchDrag: true,
                mouseDrag: true,
                items: 3,
                margin: 20,
            },
            1024: {
                autoplay: false,
                touchDrag: true,
                mouseDrag: true,
                items: 4,
                margin: 20,
            },
            1220: {
                autoplay: false,
                touchDrag: false,
                mouseDrag: true,
                items: 4,
                margin: 30,
            },
        }
    });
    $('.avis-slider').owlCarousel({
        loop: false,
        rewind: true,
        autoplay: true,
        dots: false,
        nav: false,
        navText: ["<i class='las la-arrow-left'></i>", "<i class='las la-arrow-right'></i>"],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                margin: 10,
                touchDrag: true,
                mouseDrag: true,
            },
            768: {
                items: 2,
                margin: 10,
                touchDrag: true,
                mouseDrag: true,
            },
            1024: {
                items: 3,
                margin: 10,
                touchDrag: true,
                mouseDrag: true,
            },
            1220: {
                items: 3,
                margin: 20,
                touchDrag: false,
                mouseDrag: true,
            },
        }
    });
    $('.slider-others-pages').owlCarousel({
        loop: false,
        rewind: true,
        autoplay: false,
        margin: 20,
        dots: false,
        nav: true,
        navText: ["<i class='las la-angle-left'></i>", "<i class='las la-angle-right'></i>"],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                touchDrag: true,
                mouseDrag: true,
            },
            768: {
                items: 3,
                touchDrag: true,
                mouseDrag: true,
            },
            1024: {
                items: 3,
                touchDrag: true,
                mouseDrag: true,

            },
            1220: {
                items: 3,
                touchDrag: false,
                mouseDrag: true,
            },
        }
    });
    $('.detail-slider_img').owlCarousel({
        loop: true,
        rewind: false,
        autoplay: true,
        items: 1,
        margin: 20,
        dots: false,
        nav: false,
        navText: ["<i class='las la-arrow-left'></i>", "<i class='las la-arrow-right'></i>"],
        responsiveClass: true,
        responsive: {
            0: {
                touchDrag: true,
                mouseDrag: true,
            },
            768: {
                touchDrag: true,
                mouseDrag: true,
            },
            1024: {
                touchDrag: true,
                mouseDrag: true,

            },
            1220: {
                touchDrag: false,
                mouseDrag: true,
            },
        }
    });
    $('.slider-options').owlCarousel({
        loop: false,
        rewind: true,
        autoplay: true,
        dots: false,
        nav: false,
        margin: 20,
        navText: ["<i class='las la-arrow-left'></i>", "<i class='las la-arrow-right'></i>"],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                touchDrag: true,
                mouseDrag: true,
            },
            768: {
                items: 1,
                touchDrag: true,
                mouseDrag: true,
            },
            1024: {
                items: 2,
                touchDrag: true,
                mouseDrag: true,
            },
            1220: {
                items: 2,
                touchDrag: false,
                mouseDrag: true,
            },
        }
    });
    $('.slider-other-offers').owlCarousel({
        loop: false,
        rewind: true,
        autoplay: true,
        dots: false,
        nav: false,
        margin: 20,
        navText: ["<i class='las la-arrow-left'></i>", "<i class='las la-arrow-right'></i>"],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                touchDrag: true,
                mouseDrag: true,
            },
            768: {
                items: 1,
                touchDrag: true,
                mouseDrag: true,
            },
            1024: {
                items: 2,
                touchDrag: true,
                mouseDrag: true,
            },
            1220: {
                items: 2,
                touchDrag: false,
                mouseDrag: true,
            },
        }
    });
    $('.vouchers-slider').owlCarousel({
        loop: false,
        rewind: true,
        autoplay: false,
        navText: ["<i class='las la-angle-left'></i>", "<i class='las la-angle-right'></i>"],
        margin: 20,
        items: 1,
        dots: false,
        nav: false,
        autoHeight: true,
        responsiveClass: true,
        responsive: {
            0: {
                touchDrag: true,
                mouseDrag: true,
            },
            768: {
                touchDrag: true,
                mouseDrag: true,
            },
            1024: {
                touchDrag: true,
                mouseDrag: true,
            },
            1220: {
                touchDrag: false,
                mouseDrag: true,
            },
        }
    });
});