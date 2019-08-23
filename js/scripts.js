
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

  function addListItem(pokemon){
     var $pokemonlist = $(".pokemon-list");
  var $listItem = $('<button type="button" class="pokemon-list_item list-group-item list-group-item-action" data-toggle="modal" data-target="#pokemon-modal">');

  $listItem.text(pokemon.name);

   $pokemonlist.append($listItem);
   $listItem.on('click', function(event) {
			showDetails(pokemon);
     		});
  }
  function showDetails(pokemon) {
pokemonRepository.loadDetails(pokemon).then(function() {
     var modal = $('.modal-body');
     var name = $('.modal-title').text(pokemon.name);
     var height = $('<p class="pokemon-height"></p>').text('Height: ' + pokemon.height);

     var type = $('<p class="pokemon-type"></p>').text('Type: ' + pokemon.types);
     var weight= $('<p class="pokemon-weight"></p>').text('Weight: ' + pokemon.weight);
     var image = $('<img class="pokemon-picture">');

     image.attr('src', pokemon.imageUrl);
     modal.append(name)
          .append(image)
          .append(height)
          .append(weight)
          .append(type);
  });
}




      return {
      add: add,
      getAll: getAll,
      addListItem: addListItem,
      showDetails: showDetails,
      loadList: loadList,
      loadDetails:loadDetails,

    };
 })();

pokemonRepository.loadList().then(function() {
pokemonRepository.getAll().forEach(function(pokemon){
pokemonRepository.addListItem(pokemon);
});
});
