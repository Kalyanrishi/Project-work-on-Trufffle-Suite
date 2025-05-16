App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
    $.getJSON('../pets.json', function (data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);
        petTemplate.find('.panel-pet').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function () {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }

    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: async function () {
    const data = await $.getJSON('Adoption.json');
    App.contracts.Adoption = TruffleContract(data);
    App.contracts.Adoption.setProvider(App.web3Provider);

    App.bindEvents();
    return App.markAdopted();
  },

  bindEvents: function () {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: async function () {
    const instance = await App.contracts.Adoption.deployed();
    const adopters = await instance.getAdopters.call();

    for (let i = 0; i < adopters.length; i++) {
      if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
        const btn = $(`.panel-pet[data-id="${i}"]`).find('.btn-adopt');
        btn.text('Success').attr('disabled', true);
      }
    }
  },

  handleAdopt: async function (event) {
    event.preventDefault();

    const petId = parseInt($(event.target).data('id'));
    const instance = await App.contracts.Adoption.deployed();
    const accounts = await web3.eth.getAccounts();

    await instance.adopt(petId, { from: accounts[0] });
    await App.markAdopted();
  }
};

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = App;
}

// Attach to window for browser
window.App = App;

$(function () {
  $(window).on('load', function () {
    App.init();
  });
});
