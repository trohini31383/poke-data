
var pokemonRepository = (function () {
var  repository= [];

   var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
   function add(pokemon) {
     if (
       typeof pokemon === "object" &&
       "name" in pokemon &&
       "detailsUrl" in pokemon
     ) {
       repository.push(pokemon);
     } else {

       console.log("add an object");
      }
    }

    function getAll() {
      return repository;
    }
  function addListItem(pokemon){
     var $pokemonlist = $(".pokemon-list");
  var $listItem = $('<li>');
  var $newButton =$('<button class="buttonstyle"> ' + pokemon.name + ' </button>');
   $listItem.append($newButton);
   $pokemonlist.append($listItem);
   $newButton.on('click', function(event) {
			showDetails(pokemon);
     		});
  }
  function showDetails(pokemon) {
  pokemonRepository.loadDetails(pokemon).then(function () {
      console.log(pokemon);
      showModal(pokemon);
  });
}
   function loadList() {
    return $.ajax(apiUrl).then(function (json) {
      json.results.forEach(function (pokemon) {
        var pokemon = {
          name: pokemon.name,
          detailsUrl: pokemon.url
        };
        add(pokemon);
        console.log(pokemon)
        });
    }).catch(function (e) {
      console.error(e);
    });
  }
   function loadDetails(pokemon) {
    var url = pokemon.detailsUrl;
    return $.ajax(url).then(function (details) {
      pokemon.imageUrl = details.sprites.front_default;
      pokemon.height = details.height;
      pokemon.weight = details.weight;
      pokemon.types = [];

        for (var i = 0; i < details.types.length; i++) {

          pokemon.types.push(details.types[i].type.name);

        }
      }).catch(function (e) {
      console.error(e);
    });
  }
   function showModal(pokemon) {
    var $modalContainer =$("#modal-container");
    $modalContainer.empty();
    var modal = $('<div class ="modal" ></div>');

    var closeButtonElement = $('<button class="modal-close"> close </button>');


    closeButtonElement.on("click", hideModal);
     var titleElement = $('<h1>  Name : '+ pokemon.name + '</h1>');
     var contentElement = $('<p> Height : '+ pokemon.height + '</p>');
     var weightElement = $('<p> Weight :'+ pokemon.weight + '</p>');
     var imageElement = $('<img class="modal-img">');
     imageElement.attr("src", pokemon.imageUrl);
     var typesElement= $('<p> Type: '+ pokemon.types +'  </p>');

    modal.append(closeButtonElement);
    modal.append(titleElement);
    modal.append(imageElement);
    modal.append(contentElement);
    modal.append(weightElement);
    modal.append(typesElement);
    $modalContainer.append(modal);
    $modalContainer.addClass("is-visible");
  }

  function hideModal() {
    var $modalContainer = $("#modal-container");
    $modalContainer.removeClass("is-visible");
  }

  /*(window).on("keydown", e => {
    var $modalContainer = $("#modal-container");

    if (
      e.key === "Escape" &&
      $modalContainer.hasClass("is-visible")
       ) {

          hideModal();

        }
    });*/
  var $modalContainer= $("#modal-container");
                          $modalContainer.on("click", e => {

    var target = e.target;

    if (target === $modalContainer) {
      hideModal();
    }
  });
      return {
      add: add,
      getAll: getAll,
      addListItem: addListItem,
      showDetails: showDetails,
      loadList: loadList,
      loadDetails:loadDetails,
      showModal: showModal,
      hideModal: hideModal,
    };
 })();

pokemonRepository.loadList().then(function() {
pokemonRepository.getAll().forEach(function(pokemon){
pokemonRepository.addListItem(pokemon);
});
});
