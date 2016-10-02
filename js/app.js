if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('../sw.js', { scope: '/' }).then((reg) => {
		if (reg.installing) {
			console.log('Service worker installing');
		} else if(reg.waiting) {
			console.log('Service worker installed');
		} else if(reg.active) {
			console.log('Service worker active');
		}
		
	}).catch((error) => {
		console.log('Registration failed with ' + error); // Registration failed
	});

  // Communicate with the service worker using MessageChannel API.
  function sendMessage(message) {
    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = function(event) {
        resolve('Direct message from SW: ${event.data}');
      };

      navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2])
    });
  }
}

window.addEventListener('online', function(e) {
	console.log("You are online");
	Page.hideOfflineWarning();
	Accounts.loadData();
}, false);

window.addEventListener('offline', function(e) {
	console.log("You are offline");
	Page.showOfflineWarning();
}, false);

// check if the user is connected
if (navigator.onLine) {
	Accounts.loadData();
} else {
	// show offline message
	Page.showOfflineWarning();
	Accounts.loadData();
}


// set knockout view model bindings
ko.applyBindings(Page.vm);

