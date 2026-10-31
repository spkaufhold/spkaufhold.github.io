/* The coverage list remains natively scrollable without JavaScript. */
(function () {
	'use strict';

	var section = document.getElementById('media');
	if (!section) return;

	var rail = section.querySelector('.media-rail');
	var controls = section.querySelector('.media-controls');
	var previous = section.querySelector('[data-media-direction="-1"]');
	var next = section.querySelector('[data-media-direction="1"]');
	if (!rail || !controls || !previous || !next) return;

	function updateControls() {
		var end = rail.scrollWidth - rail.clientWidth;
		controls.hidden = end <= 1;
		previous.disabled = rail.scrollLeft <= 1;
		next.disabled = rail.scrollLeft >= end - 1;
	}

	function move(direction) {
		var card = rail.querySelector('.media-card');
		if (!card) return;
		var gap = parseFloat(window.getComputedStyle(rail).columnGap) || 0;
		var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		rail.scrollBy({
			left: direction * (card.getBoundingClientRect().width + gap),
			behavior: reduceMotion ? 'auto' : 'smooth'
		});
	}

	previous.addEventListener('click', function () { move(-1); });
	next.addEventListener('click', function () { move(1); });

	// A tap highlights a card until the reader scrolls or interacts elsewhere.
	// Native links, audio controls, and swipe scrolling keep their normal behavior.
	var touchedCard = null;
	function clearTouchHighlight() {
		if (touchedCard) touchedCard.classList.remove('is-touched');
		touchedCard = null;
	}

	document.addEventListener('pointerdown', function (event) {
		clearTouchHighlight();
		if (event.pointerType !== 'touch' && event.pointerType !== 'pen') return;
		if (!(event.target instanceof Element)) return;
		var card = event.target.closest('.media-card');
		if (card && rail.contains(card)) {
			card.classList.add('is-touched');
			touchedCard = card;
		}
	}, { passive: true });

	rail.addEventListener('scroll', clearTouchHighlight, { passive: true });
	rail.addEventListener('scroll', updateControls, { passive: true });
	window.addEventListener('resize', updateControls);
	updateControls();
}());
