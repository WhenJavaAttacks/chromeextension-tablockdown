var TabLockdownController = {
	tabModels: {},
	init: function() { 
		chrome.browserAction.onClicked.addListener(function(tab) {
			TabLockdownController.toggleTabLock(TabLockdownController.getTabModelForTab(tab))
		});
		console.log("TabLockdown - Extension Initalized");
	},
	getTabModelForTab: function(tab) {
		var tabModelKey = "id"+tab.id;

		if (!TabLockdownController.tabModels[tabModelKey]) TabLockdownController.tabModels[tabModelKey] = TabLockdownController.initTabModel(tab);
		return TabLockdownController.tabModels[tabModelKey];
	},
	initTabModel: function (tab) {
		var tabModel = {
			tabId: tab.id,
			isLocked: false,
			password: ""
		};

		var tabLockdownClientCode = "var TabLockdownClient = {};";
		tabLockdownClientCode += "TabLockdownClient.interceptClick = function(e) { console.log('TabLockdown - Intercepted Click'); e.stopPropagation(); return false; };";
		tabLockdownClientCode += "console.log('TabLockdown - Tab " + tabModel.tabId + " Initalized');"
		chrome.tabs.executeScript(tabModel.tabId, { code: tabLockdownClientCode });

		return tabModel;
	},
	toggleTabLock: function(tabModel) {
		if (!tabModel.isLocked) TabLockdownController.lockTab(tabModel);
		else TabLockdownController.unlockTab(tabModel);
	},
	lockTab: function(tabModel) {
		var enteredPassword = window.prompt("Password");
		tabModel.password = enteredPassword;

		var codeJS = "";
		//codeJS += "document.body.style.cssText = 'visibility: none !important';";
		//codeJS += "document.body.style.cssText = 'display: none !important';";
		//codeJS += "document.onclick = function() { return false; };";
		codeJS += "document.addEventListener('click', TabLockdownClient.interceptClick, true);";
		codeJS += "document.body.style.cssText = 'filter: blur(10px) !important; pointer-events: none !important;';";
		
		chrome.tabs.executeScript(tabModel.tabId, { code: codeJS });

		tabModel.isLocked = true;
		chrome.browserAction.setIcon({ path: "padlock_locked.png", tabId: tabModel.tabId });
		console.log("TabLockdown - Tab " + tabModel.tabId + " Locked");
	},
	unlockTab: function(tabModel) {
		var enteredPassword = window.prompt("Password");
		if (!enteredPassword || enteredPassword !== tabModel.password) return;
		
		var codeJS = "";
		//codeJS += "document.onclick = null;";
		codeJS += "document.removeEventListener('click', TabLockdownClient.interceptClick, true);";
		codeJS += "document.body.style.cssText = '';";
		
		chrome.tabs.executeScript(tabModel.tabId, { code: codeJS });
		
		tabModel.isLocked = false;
		chrome.browserAction.setIcon({ path: "padlock_unlocked.png", tabId: tabModel.tabId });
		console.log("TabLockdown - Tab " + tabModel.tabId + " Unlocked");
	}
};

TabLockdownController.init();
