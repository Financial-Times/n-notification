"use strict";

var Delegate = require('dom-delegate');

var template = require('./src/js/template');
var currentNotification = null;
var timeout;
var timeoutDuration = 5000;
var animDuration = 500;

function dispatchNotificationCloseEvent(){
	var event = new CustomEvent('nNotification.close');
	document.dispatchEvent(event);
}

function listenForCloseButtonClick(){
	var called = false;
	var func = function(){
		var delegate = new Delegate(document.body);
		delegate.on('click', '.n-notification__close-js', hide);
	};

	if(!called){
		func();
		called = true;
	}
}

function show(options){
	clearTimeout(timeout);

	options.title = options.title || '';
	options.content = options.content || '';
	options.type = options.type || 'default';
	options.trackable = options.trackable || 'notification-'+options.type;

	listenForCloseButtonClick();
	if(currentNotification){
		currentNotification.querySelector('.n-notification__title').innerHTML = options.title;
		currentNotification.querySelector('.n-notification__content').innerHTML = options.content;
	} else {
		var html = template(options);
		document.body.insertAdjacentHTML('afterbegin', html);
		currentNotification = document.querySelector('.n-notification');
	}
	if(options.close !== false) {
		currentNotification.classList.add('n-notification--show-close');
	}
	setTimeout(function() {
		currentNotification.classList.add('visible');
	}, 10); // delay so it animates in

	if(options.duration !== 0){
		timeout = setTimeout(hide, options.duration || timeoutDuration);
	}
}

function hide(){
	clearTimeout(timeout);
	currentNotification.classList.remove('visible');
	dispatchNotificationCloseEvent();
	setTimeout(function(){
		if(currentNotification && currentNotification.parentNode){
			currentNotification.parentNode.removeChild(currentNotification);
		}

		currentNotification = null;
	}, animDuration);
}

function init(){
	document.addEventListener("nNotification.show", function(e){
		show(e.detail);
	});
}

module.exports = {
	init : init,
	show: show,
	hide: hide
};