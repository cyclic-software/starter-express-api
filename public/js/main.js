(function ($) {
    "use strict";

    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });


    // Date and time picker
    $('.date').datetimepicker({
        format: 'L'
    });
    $('.time').datetimepicker({
        format: 'LT'
    });


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });


    // Price carousel
    $(".price-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 45,
        dots: false,
        loop: true,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0: {
                items: 1
            },
            992: {
                items: 2
            },
            1200: {
                items: 3
            }
        }
    });


    // Team carousel
    $(".team-carousel, .related-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 45,
        dots: false,
        loop: true,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0: {
                items: 1
            },
            992: {
                items: 2
            }
        }
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        dots: true,
        loop: true,
    });

})(jQuery);




$(document).ready(function () {
    $("#searchNewsInput").on("input", function () {
        var inputValue = $(this).val();
        console.log("Input value changed: " + inputValue);


        // Fetch the data from the API
        $.ajax({
            url: "ASdAs",
            type: "GET",
            success: function (response) {
                // Update the dropdown options with the response
                var dropdownMenu = $(".SearchdropdownMenu");
                dropdownMenu.empty(); // Clear existing options

                // Iterate over the response and create new options
                for (var i = 0; i < response.length; i++) {
                    console.log(response)
                    var optionText = response[i].text;
                    var optionLink = response[i].link;
                    var optionHtml = '<li><a class="dropdown-item" href="news/:' + id + '">' + title + '</a></li>';
                    dropdownMenu.append(optionHtml);
                }
            },
            error: function (error) {
                console.error("Error occurred during the API request: " + error);
            }
        });

        // Handle form submission
      
    });




});




// 


//CHANGE LANGUAGE REQUEST
// $(document).ready(function() {
//     $(".changeLang").click(function(event) {
//       event.preventDefault(); // Prevent the default link behavior

//       var selectedLang = $(this).data("lang");
//       console.log("Selected language: " + selectedLang);

//       var returnUrl = window.location.href; // Get the current URL as the returnUrl

//       // Send AJAX request to handle language change
//       $.ajax({
//         url: "/changeLanguage",
//         method: "POST",
//         data: { language: selectedLang, returnUrl: returnUrl },
//         success: function(response) {
//           // Handle the response from the server
//           console.log("AJAX request successful. Response:", response);
//         },
//         error: function(xhr, status, error) {
//           // Handle error if the AJAX request fails
//           console.log("AJAX request failed:", error);
//         }
//       });
//     });
//   });