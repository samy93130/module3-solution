(function(){
    "use strict"
    angular.module("NarrowItDownApp",[])
    .controller("NarrowItDownController",NarrowItDownController)
    .service("MenuSearchService",MenuSearchService)
    .constant("MenuUrl","https://davids-restaurant.herokuapp.com/menu_items.json")
    .directive("foundItems",FoundItems);

    function FoundItems(){
        var ddo={
            templateUrl: "founditems.html",
            scope:{
            found:"<",
            isEmpty:"<",
            delete:"&"
          }
        }
        return ddo;
    }

    NarrowItDownController.$inject=["MenuSearchService"];
    function NarrowItDownController(MenuSearchService){
        var narrow=this;
        narrow.found=[];
        narrow.searchItem="";
        narrow.isEmpty=0;
        narrow.search=function(searchTerm){
            MenuSearchService.getMatchedMenuItems(searchTerm).then(
            function(result){
                narrow.found=result;
                narrow.isEmpty=MenuSearchService.isEmpty;
            }
            );}
        narrow.delete=function(item){
            narrow.found.splice(narrow.found.indexOf(item),1);
        }

    }

    MenuSearchService.$inject=["$http","MenuUrl"];
    function MenuSearchService($http,MenuUrl){
        var menu=this;
        menu.isEmpty=0;
        menu.getMatchedMenuItems=function(searchTerm){
            return $http({
                method: "GET",
                url: MenuUrl
            }).then(function(result){
            var foundItems=[];
            var response=result.data.menu_items;
           for (var i=0;i<response.length;i++){
               if (response[i].description.indexOf(searchTerm)!=-1){
                   foundItems.push(response[i]);
               }
           }
                if (foundItems.length==0 || searchTerm.trim()==""){
                    menu.isEmpty=1;
                    foundItems=[];
                }
                else {
                    menu.isEmpty=0;
                }
            return foundItems;}
            );
        }
    }


})();
