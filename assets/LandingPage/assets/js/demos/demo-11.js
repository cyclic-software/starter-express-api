// Demo 11 Js file
$(document).ready(function () {
    'use strict';

    // Filter toggle
    $('.filter-toggler').on('click', function (e) {
    	$(this).toggleClass('active');
    	$('.product-filter').fadeToggle('fast');
    	$('.widget-filter-area').slideToggle('500');
    	e.preventDefault();
    });

    // Clear All checkbox/remove filters in filter area
    $('.widget-filter-clear').on('click', function (e) {
    	$('.widget-filter-area').find('input[type=checkbox]').prop('checked', false);
    	e.preventDefault();
    });
});