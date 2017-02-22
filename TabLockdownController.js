var TabLockdownController = {
	tabModels: {},
	init: function() { 
		chrome.browserAction.onClicked.addListener(function(tab) {
			TabLockdownController.toggleTabLock(TabLockdownController.getTabModelForTab(tab))
		});
		console.log("Tab Lockdown - Extension Initalized");
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

		chrome.tabs.executeScript(tabModel.tabId, { file: "TabLockdownClient.js" });

		return tabModel;
	},
	toggleTabLock: function(tabModel) {
		if (!tabModel.isLocked) TabLockdownController.lockTab(tabModel);
		else TabLockdownController.unlockTab(tabModel);
	},
	lockTab: function(tabModel) {
		tabModel.password = window.prompt("Password");

		var codeJS = "TabLockdownClient.lockTab();";
		chrome.tabs.executeScript(tabModel.tabId, { code: codeJS });

		tabModel.isLocked = true;
		chrome.browserAction.setIcon({ path: "padlock_locked.png", tabId: tabModel.tabId });
		console.log("Tab Lockdown - Tab " + tabModel.tabId + " Locked");
	},
	unlockTab: function(tabModel) {
		var enteredPassword = window.prompt("Password");
		if (!enteredPassword || enteredPassword !== tabModel.password) return;
		
		var codeJS = "TabLockdownClient.unlockTab();";
		chrome.tabs.executeScript(tabModel.tabId, { code: codeJS });
		
		tabModel.isLocked = false;
		chrome.browserAction.setIcon({ path: "padlock_unlocked.png", tabId: tabModel.tabId });
		console.log("Tab Lockdown - Tab " + tabModel.tabId + " Unlocked");
	}
};

TabLockdownController.init();