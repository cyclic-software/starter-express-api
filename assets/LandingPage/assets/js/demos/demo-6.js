// Demo 6 Js file
$(document).ready(function () {
    'use strict';

    // Deal of the day countdown
	if ( $.fn.countdown ) {
		$('.deal-countdown').each(function () {
			var $this = $(this), 
				untilDate = $this.data('until'),
				compact = $this.data('compact');

			$this.countdown({
			    until: untilDate, // this is relative date +10h +5m vs..
			    format: 'HMS',
			    padZeroes: true,
			    labels: ['years', 'months', 'weeks', 'days', 'hrs', 'mins', 'secs'],
			    labels1: ['year', 'month', 'week', 'day', 'hr', 'min', 'sec']
			});
		});

		// Pause
		// $('.deal-countdown').countdown('pause');
	}
});