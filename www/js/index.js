//Decides which picture it will display first for the widget
var picnum = 1;

//Initializes the order Array
var orderDescription = [];
//will show the order for list purposes with child node
var orderedItems = [];
//shows how many of a certain item has been order
var orderItemsTotal = [0,0,0,0,0,0,0,0,0,0]
//total price
var orderTotal = 0;
//total vat
var orderVAT = 0;
//for the list of items added to the database
var newLi = document.createElement("li");

//will be uesd to count which element of the array is needed
var counter = 0;

//sets the table im going to use
var list = document.getElementById("ordered")

//Sets the first widget for the webpage
let request = new XMLHttpRequest()
request.open("GET", "http://137.108.92.9/openstack/api/widgets/" + picnum +"?OUCU=zx403061&password=ilSR098R");

request.send();

request.onload = () => {

  if(request.status === 200){
    var data = JSON.parse(request.response);
    console.log(data.data[0].url);
    document.getElementById("widget").src = data.data[0].url;
    document.getElementById("description").innerHTML = data.data[0].description;
    document.getElementById("price").value = (data.data[0].pence_price / 100);
  }else{
    console.log("Page Not Found")
  }
}

//Trying to get the plaform to work MAP API
var platform = new H.serice.Platform({
    'apikey': "eYvI5v6nt48inOZIPdVmM9oEPgbM8KQ8LK8O8_OTVVo"
})


// configure an OMV service to use the `core` enpoint
var omvService = platform.getOMVService({path:  'v2/vectortiles/core/mc'});
var baseUrl = 'https://js.api.here.com/v3/3.1/styles/omv/oslo/japan/';

// create a Japan specific style
var style = new H.map.Style(`${baseUrl}normal.day.yaml`, baseUrl);

// instantiate provider and layer for the basemap
var omvProvider = new H.service.omv.Provider(omvService, style);
var omvlayer = new H.map.layer.TileLayer(omvProvider, {max: 22});

// instantiate (and display) a map:
var map = new H.Map(
    document.getElementById('mapContainer'),
    omvlayer,
    {
      zoom: 17,
      center: {lat: 35.68026, lng: 139.76744}
    });

 function endorder(){
	console.log("Hello")
}

//Begin order function
function begin(){

  //sets the variable for a new request
  let request = new XMLHttpRequest()
  //refreshes order array
  myArr = [];
  
  //zx40306, ilSR098R

  let id = document.getElementById("id").value;
  let pass = document.getElementById("pass").value;
  let clientId = document.getElementById("clientId").value;


  request.open("GET", "http://137.108.92.9/openstack/api/clients/" + clientId +"?OUCU="+ id +"&password="+pass+"");

  request.send();

  request.onload = () => {

    if(request.status === 200){
      console.log(JSON.parse(request.response))
    }else{
      console.log("Page Not Found")
    }

  } 
}

//next item widget button navigation
function next(){

  let request = new XMLHttpRequest()
  
  if(picnum == 10){
    alert("Last item on item list");
  }else{
    picnum += 1;
  }

  request.open("GET", "http://137.108.92.9/openstack/api/widgets/" + picnum +"?OUCU=zx403061&password=ilSR098R");

  request.send();

  request.onload = () => {

    if(request.status === 200){
      var data = JSON.parse(request.response);
      console.log(data.data[0].url);
      document.getElementById("widget").src = data.data[0].url;
      document.getElementById("description").innerHTML = data.data[0].description;
      document.getElementById("price").value = (data.data[0].pence_price / 100);
    }else{
      console.log("Page Not Found")
    }

  } 

}

//previous item widget button navigation
function prev(){

  let request = new XMLHttpRequest()
  
  if(picnum == 1){
    alert("First Item on the List");
  }else{
    picnum -= 1;
  }

  request.open("GET", "http://137.108.92.9/openstack/api/widgets/" + picnum +"?OUCU=zx403061&password=ilSR098R");

  request.send();

  request.onload = () => {

    if(request.status === 200){
      var data = JSON.parse(request.response);
      document.getElementById("widget").src = data.data[0].url;
      document.getElementById("description").innerHTML = data.data[0].description;
      document.getElementById("price").value = (data.data[0].pence_price / 100);
    }else{
      console.log("Page Not Found")
    }

  } 

}

function addOrder(){

  let request = new XMLHttpRequest()
  request.open("GET", "http://137.108.92.9/openstack/api/widgets/" + picnum +"?OUCU=zx403061&password=ilSR098R");

  request.send();

  request.onload = () => {

    if(request.status === 200){

      var data = JSON.parse(request.response);
      //adds order data to the order array
      orderDescription.push([data.data[0].description, data.data[0].pence_price]);
      console.log(orderDescription);
      //adds to the total items
      orderItemsTotal[(data.data[0].id)-1] += 1;
      console.log(orderItemsTotal)
      if(orderedItems.includes(data.data[0].id)){
        pass;
      }else{
        orderedItems.push(data.data[0].id);
      }
      //adds to the list
      //TRYING TO FIND AN ELEMENTS INDEX WITHIN AN ARRAY
      var index = orderedItems.indexOf(data.data[0].id)
      console.log("this is the index of the current widget in the orderedItems array: " + index)
      console.log((data.data[0].id)-1)
      if(orderItemsTotal[(data.data[0].id)-1] > 1){
        //gets the element that will be edited
        var element = document.getElementById("ordered").childNodes[0];
        console.log(element)
        //sets what the ned list item will be
        var newNode = document.createTextNode(orderDescription[counter] + "(" + orderItemsTotal[(data.data[0].id)-1] + ")")
        //then replaces the list item
        element.replaceChild(newNode, element.childNodes[index])
      }else{
        newLi.innerHTML = orderDescription[counter] + "(" + orderItemsTotal[(data.data[0].id)-1] + ")";
        ordered.appendChild(newLi);
      }
      //adds to the counter ready for the next addition
      counter ++;
    }else{
      console.log("Page Not Found")
    }

    }
}