var Accounts = (function() {
    function AccountViewModel() {
        var self = this;
        self.login = "";
        self.id = "";
        self.avatar = "";
        self.name = "";
        self.location = "";
        self.folllowers = "";
        self.bio = "";
        self.type = "";
    }

    function AccountApiService() {
        var self = this;

        self.get = function(name) {
            return new Promise(function(resolve, reject) {
                var request = new XMLHttpRequest();
                request.open('GET', 'https://api.github.com/users/' + name);

                request.onload = function() {
                    // success
                    if (request.status === 200) {
                        // resolve the promise with the parsed response text (assumes JSON)
                        resolve(JSON.parse(request.response));
                    } else {
                        // error retrieving file
                        reject(Error(request.statusText));
                    }
                };

                request.onerror = function() {
                    // network errors
                    reject(Error("Network Error"));
                };

                request.send();
            });
        };
    }

    function AccountAdapter() {
        var self = this;

        self.toAccountViewModel = function(data) {
            if (data) {
                var vm = new AccountViewModel();
                vm.login = data.title;
                vm.id = data.id;
                vm.avatar = data.avatar_url;
                vm.name = data.name;
                vm.bio = data.bio;
                vm.location = data.location;
                vm.followers = data.followers;
                vm.type = data.type;
                return vm;
            }
            return null;
        };

    }

    function AccountController(accountApiService, accountAdapter) {
        var self = this;

        self.get = function(name) {
            return accountApiService.get(name).then(function(response) {
                return accountAdapter.toAccountViewModel(response);
            });
        };
    }

    // initialize the services and adapters
    var accountApiService = new AccountApiService();
    var accountAdapter = new AccountAdapter();

    // initialize the controller
    var accountController = new AccountController(accountApiService, accountAdapter);

    return {
        loadData: function() {
            document.querySelector(".accounts-list").classList.add('loading');
            var accountNames = ['adobe', 'royfielding', 'eclipse', 'kentbeck'];
            var promises = [];
            var results = [];
            accountNames.forEach(function (name) {
              promises.push(accountController.get(name));
            });

            Promise.all(promises).then(function (dataArray) {
               dataArray.forEach(function (data) {
                   results.push(data);
               }) 
            }).then(function() {
                Page.vm.accounts(results);
                document.querySelector(".accounts-list").classList.remove('loading')
            });
        }
    }

})();
