var TabLockdownClient = {
	interceptClick: function(e) {
		console.log('TabLockdown - Intercepted Click');
		e.stopPropagation();
		return false;
	},
	lockTab: function() {
		document.addEventListener('click', TabLockdownClient.interceptClick, true);
		document.body.style.cssText = 'filter: blur(10px) !important; pointer-events: none !important;';
	},
	unlockTab: function() {
		document.removeEventListener('click', TabLockdownClient.interceptClick, true);
		document.body.style.cssText = '';
	}
};

console.log("Tab Lockdown - Tab Initialized");