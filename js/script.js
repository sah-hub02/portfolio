$(function () {
    "use strict";

    var typingWords = ["WordPress & Frontend Developer", "Elementor Website Designer", "Responsive UI Builder"];
    var wordIndex = 0;
    var charIndex = 0;
    var deleting = false;
    var countersStarted = false;
    var skillsStarted = false;
    var testimonialIndex = 0;

    AOS.init({
        duration: 850,
        easing: "ease-out-cubic",
        once: true,
        offset: 90
    });

    $("#year").text(new Date().getFullYear());

    setTimeout(function () {
        $(".loader").fadeOut(450);
    }, 700);

    function typeText() {
        var currentWord = typingWords[wordIndex];
        var visibleText = currentWord.substring(0, charIndex);
        $(".typing-text").text(visibleText);

        if (!deleting && charIndex < currentWord.length) {
            charIndex++;
            setTimeout(typeText, 78);
        } else if (deleting && charIndex > 0) {
            charIndex--;
            setTimeout(typeText, 38);
        } else {
            deleting = !deleting;
            if (!deleting) {
                wordIndex = (wordIndex + 1) % typingWords.length;
            }
            setTimeout(typeText, deleting ? 1200 : 260);
        }
    }

    typeText();

    function handleHeader() {
        var scrollTop = $(window).scrollTop();
        $(".site-header").toggleClass("scrolled", scrollTop > 20);
        $(".scroll-top").toggleClass("show", scrollTop > 500);
    }

    handleHeader();

    $(".nav-toggle").on("click", function () {
        var isOpen = $(".nav-menu").toggleClass("open").hasClass("open");
        $(this).attr("aria-expanded", isOpen);
    });

    $(".nav-menu a, .footer a, .hero-actions a[href^='#']").on("click", function () {
        $(".nav-menu").removeClass("open");
        $(".nav-toggle").attr("aria-expanded", "false");
    });

    $(".theme-toggle").on("click", function () {
        $("body").toggleClass("dark");
        var darkMode = $("body").hasClass("dark");
        $(".theme-toggle i").toggleClass("fa-moon", !darkMode).toggleClass("fa-sun", darkMode);
        localStorage.setItem("portfolio-theme", darkMode ? "dark" : "light");
    });

    if (localStorage.getItem("portfolio-theme") === "dark") {
        $("body").addClass("dark");
        $(".theme-toggle i").removeClass("fa-moon").addClass("fa-sun");
    }

    $("a[href^='#']").on("click", function (event) {
        var target = $($(this).attr("href"));
        if (target.length) {
            event.preventDefault();
            $("html, body").animate({ scrollTop: target.offset().top - 72 }, 650);
        }
    });

    $(".scroll-top").on("click", function () {
        $("html, body").animate({ scrollTop: 0 }, 650);
    });

    function inViewport($element) {
        if (!$element.length) {
            return false;
        }
        var top = $(window).scrollTop();
        var bottom = top + $(window).height();
        var elementTop = $element.offset().top;
        return elementTop < bottom - 80;
    }

    function startCounters() {
        if (countersStarted || !inViewport($(".stats"))) {
            return;
        }
        countersStarted = true;
        $(".counter").each(function () {
            var $counter = $(this);
            var target = Number($counter.data("target"));
            $({ value: 0 }).animate({ value: target }, {
                duration: 1600,
                easing: "swing",
                step: function () {
                    $counter.text(Math.ceil(this.value) + "+");
                },
                complete: function () {
                    $counter.text(target + "+");
                }
            });
        });
    }

    function startSkills() {
        if (skillsStarted || !inViewport($(".skills-grid"))) {
            return;
        }
        skillsStarted = true;
        $(".skill").each(function () {
            var percent = $(this).data("percent");
            $(this).find("em").animate({ width: percent + "%" }, 1200);
        });
    }

    function setActiveNav() {
        var scrollPosition = $(window).scrollTop() + 120;
        $("section[id]").each(function () {
            var sectionTop = $(this).offset().top;
            var sectionBottom = sectionTop + $(this).outerHeight();
            var id = $(this).attr("id");
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                $(".nav-menu a").removeClass("active");
                $(".nav-menu a[href='#" + id + "']").addClass("active");
            }
        });
    }

    $(window).on("scroll", function () {
        handleHeader();
        startCounters();
        startSkills();
        setActiveNav();
    });

    startCounters();
    startSkills();

    $(".filter-buttons button").on("click", function () {
        var filter = $(this).data("filter");
        $(".filter-buttons button").removeClass("active");
        $(this).addClass("active");

        $(".project-card").each(function () {
            var matches = filter === "all" || $(this).data("category") === filter;
            $(this).stop(true, true)[matches ? "fadeIn" : "fadeOut"](260);
        });
    });

    function showTestimonial(index) {
        var $items = $(".testimonial");
        $items.removeClass("active").fadeOut(160);
        $items.eq(index).fadeIn(220).addClass("active");
    }

    $(".next-testimonial").on("click", function () {
        testimonialIndex = (testimonialIndex + 1) % $(".testimonial").length;
        showTestimonial(testimonialIndex);
    });

    $(".prev-testimonial").on("click", function () {
        testimonialIndex = (testimonialIndex - 1 + $(".testimonial").length) % $(".testimonial").length;
        showTestimonial(testimonialIndex);
    });

    setInterval(function () {
        $(".next-testimonial").trigger("click");
    }, 5200);

    function setError($input, message) {
        $input.closest(".form-row").addClass("error").find("small").text(message);
    }

    function clearError($input) {
        $input.closest(".form-row").removeClass("error").find("small").text("");
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    $("#contactForm").on("submit", function (event) {
        event.preventDefault();
        var valid = true;
        var $name = $("#name");
        var $email = $("#email");
        var $subject = $("#subject");
        var $message = $("#message");

        $(".form-status").text("").css("color", "");
        $(".form-row input, .form-row textarea").each(function () {
            clearError($(this));
        });

        if ($.trim($name.val()).length < 2) {
            setError($name, "Please enter your name.");
            valid = false;
        }

        if (!isValidEmail($.trim($email.val()))) {
            setError($email, "Please enter a valid email address.");
            valid = false;
        }

        if ($.trim($subject.val()).length < 3) {
            setError($subject, "Please enter a subject.");
            valid = false;
        }

        if ($.trim($message.val()).length < 12) {
            setError($message, "Please write a short project message.");
            valid = false;
        }

        if (!valid) {
            $(".form-status").text("Please fix the highlighted fields.").css("color", "#ef4444");
            return;
        }

        $(".form-status").text("Thanks! Your message is ready to send. I will reply soon.").css("color", "#14b8a6");
        this.reset();
    });
});
