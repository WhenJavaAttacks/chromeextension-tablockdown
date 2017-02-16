var TabLockdownController = {
	tabModels: {},
	init: function() { 
		console.log("TabLockdownController.init");
		chrome.browserAction.onClicked.addListener(function(tab) {
			TabLockdownController.toggleTabLock(TabLockdownController.getTabModelForTab(tab))
		});
	},
	getTabModelForTab: function(tab) {
		var tabModelKey = "id"+tab.id;

		if (!TabLockdownController.tabModels[tabModelKey]) {
			TabLockdownController.tabModels[tabModelKey] = {
				tabId: tab.id,
				isLocked: false,
				password: ""
			};
		}

		return TabLockdownController.tabModels[tabModelKey];
	},
	toggleTabLock: function(tabModel) {
		if (!tabModel.isLocked) TabLockdownController.lockTab(tabModel);
		else TabLockdownController.unlockTab(tabModel);
	},
	lockTab: function(tabModel) {
		var enteredPassword = window.prompt("Password");
		tabModel.password = enteredPassword;

		var codeJS = "document.body.style.cssText = 'display: none !important';";
		chrome.tabs.executeScript(tabModel.tabId, { code: codeJS });

		tabModel.isLocked = true;
		chrome.browserAction.setIcon({ path: "padlock_locked.png", tabId: tabModel.tabId });
	},
	unlockTab: function(tabModel) {
		var enteredPassword = window.prompt("Password");
		if (!enteredPassword || enteredPassword !== tabModel.password) return;

		var codeJS = "document.body.style.cssText = '';";
		chrome.tabs.executeScript(tabModel.tabId, { code: codeJS });
		
		tabModel.isLocked = false;
		chrome.browserAction.setIcon({ path: "padlock_unlocked.png", tabId: tabModel.tabId });
	}
};

TabLockdownController.init();
