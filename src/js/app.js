App = {
  web3Provider: null,
  contracts: {},

  asciiToHex: function(str) {
    if(!str)
        return "0x00";
    var hex = "";
    for(var i = 0; i < str.length; i++) {
        var code = str.charCodeAt(i);
        var n = code.toString(16);
        hex += n.length < 2 ? '0' + n : n;
    }

    return "0x" + hex;
  },

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Diamond.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var DiamondContract = data;
      App.contracts.DiamondContract = TruffleContract(DiamondContract);

      // Set the provider for our contract.
      App.contracts.DiamondContract.setProvider(App.web3Provider);
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#transferButton', App.handleTransfer);
    web3.eth.getAccounts(function(error, accounts) {
      App.contracts.DiamondContract.deployed().then(function(instance) {
        diamondInstance = instance
        events =  instance.MajorEvent({}, {fromBlock: 0, toBlock: 'latest'});
        events.watch((err, res) => {
          console.log(res);
          let row = document.getElementById('blocks').insertRow(1);
          row.insertCell(0).innerHTML = res['blockNumber'];
          row.insertCell(1).innerHTML = web3.toAscii(res['args']['boy']);
          row.insertCell(2).innerHTML = web3.toAscii(res['args']['girl']);
          row.insertCell(3).innerHTML = web3.toAscii(res['args']['date']);
          row.insertCell(4).innerHTML = res['args']['status'];
          row.insertCell(5).innerHTML = web3.toAscii(res['args']['image']);
        })
      })
    });
  },

  handleTransfer: function(event) {
    event.preventDefault();

    var husbandName = $('#husbandName').val();
    var wifeName = $('#wifeName').val();
    var sendDate = $('#sendDate').val();
    var imageHash = $('#imageHash').val();
    var descriptionText = $('#descriptionText').val();
    var status = $('#status')[0].selectedIndex;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      return App.contracts.DiamondContract.deployed().then(function(instance) {
        diamondInstance = instance
        instance.createDiamond(App.asciiToHex(husbandName), App.asciiToHex(wifeName), App.asciiToHex(sendDate), status, App.asciiToHex(imageHash), App.asciiToHex(descriptionText), {from: account, gas: 1000000});
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
