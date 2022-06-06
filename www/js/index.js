//Decides which picture it will display first for the widget
var picnum = 1;
//Initializes the order Array
var orderDescription = [];
//will show the order for list purposes with child node
var orderedItems = [];
//shows how many of a certain item has been order
var orderItemsTotal = [0,0,0,0,0,0,0,0,0,0]
//Subtotal price
var orderSubotal = 0.0;
//Total Price
var orderTotal = 0.0;
//total vat
var orderVAT = 0.0;
//for the list of items added to the database
var newLi = document.createElement("li");
//will be uesd to count which element of the array is needed
var counter = 0;
//sets the table im going to use
var list = document.getElementById("ordered")
//sets the longitude and latitude variables
var lat = 0;
var long = 0;
//These are the password, username and clientId
var id = "";
var pass = "";
var clientId = "";
//Client Info
var cInfo = [];
//Todays date and then the correct format.
var date = new Date();
date = date.toISOString().split('T')[0]
//array for orders made for today
var ordersToday = []

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

//Getting the orders for the exact day for use in Begin Order FR2.2
request.open("GET", "http://137.108.92.9/openstack/api/orders?OUCU=zx403061&password=ilSR098R");

request.send();

request.onload = () => {

  if(request.status === 200){
    var data = JSON.parse(request.response);
  }else{
    console.log("Page Not Found")
  }
}

//Trying to get the plaform to work MAP API
var platform = new H.service.Platform({
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

//Begin order function
function begin(){

  //gets the long and lat position of where the order is being taken
  navigator.geolocation.getCurrentPosition(function(position){

    lat = position.coords.latitude;
    long = position.coords.longitude;

    console.log(lat, long)
  })

  id = document.getElementById("id").value;
  pass = document.getElementById("pass").value;
  clientId = document.getElementById("clientId").value;

  //FR1.1 Validing the OUCU
  const regex = new RegExp(/^[a-z]{1}[a-z0-9]{6}[0-9]{1}$/);
  
  if(regex.test(id)){
    //sets the variable for a new request
    let request = new XMLHttpRequest()
    //refreshes order array
    myArr = [];
    
    //sets the get request
    request.open("GET", "http://137.108.92.9/openstack/api/clients/" + clientId +"?OUCU="+ id +"&password="+pass);

    request.send();

    request.onload = () => {

      if(request.status === 200){
        data = JSON.parse(request.response)
        document.getElementById("order").innerHTML = "Dear, " + data.data[0].name + ", Your order at: " + data.data[0].address;
      }else{
        console.log("Page Not Found")
      }

    } 
  }else{
    console.log("Doesnt match a correct OUCU")
  }  
}

//next item widget button navigation
//FR1.2 Navigating between widgets
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
//FR1.2 Navigating the Widgets
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


//FR1.3&FR1.4 Adding current widget to the order, Changing Sum and VAT of order
function addOrder(){

  let request = new XMLHttpRequest()
  request.open("GET", "http://137.108.92.9/openstack/api/widgets/" + picnum +"?OUCU=zx403061&password=ilSR098R");

  request.send();

  request.onload = () => {

    if(request.status === 200){

      var data = JSON.parse(request.response);
      //adds order data to the order array
      orderDescription.push([data.data[0].description, data.data[0].pence_price]);
      //adds to the total items
      orderItemsTotal[(data.data[0].id)-1] += 1;
      if(orderedItems.includes(data.data[0].id)){
        pass;
      }else{
        orderedItems.push(data.data[0].id);
      }

      //Working out Prices for subtotal
      var price = parseFloat(data.data[0].pence_price)/100
      orderSubotal += price
      orderSubotal = parseFloat(orderSubotal.toFixed(2))

      //works out VAT
      orderVAT = orderSubotal / 5
      orderVAT = parseFloat(orderVAT.toFixed(2))

      //Works out Order Total
      orderTotal = orderSubotal + orderVAT
      orderTotal = parseFloat(orderTotal.toFixed(2))

      //adds to the list
      var index = orderedItems.indexOf(data.data[0].id)

      //sets the new element
      var newLi = document.createElement("li");
      var indexMany = (data.data[0].id)-1
      newLi.innerHTML = orderDescription[counter] + "(" + orderItemsTotal[indexMany] + ")";

      if(orderItemsTotal[indexMany] > 1){
        list.replaceChild(newLi, list.childNodes[index])
      }else{
        ordered.appendChild(newLi);
      }

      //Changes order Totals
      document.getElementById("subtot").innerHTML = "Subtotal: £" + orderSubotal + "GBP"
      document.getElementById("vat").innerHTML = "VAT: £" + orderVAT + "GBP"
      document.getElementById("tot").innerHTML = "Total: £" + orderTotal + "GBP"
      //adds to the counter ready for the next addition
      counter ++;
    }else{
      console.log("Page Not Found")
    }

    }
}

//FR1.5 Posting an order to the API
function endOrder(){
  
  var data = new FormData();
  data.append("OUCU", id);
  data.append("password", pass);
  data.append("client_id", clientId);
  data.append("latitude", String(lat));
  data.append("longitude", String(long));
  
  var xhr = new XMLHttpRequest();
  
  xhr.addEventListener("readystatechange", function() {
    if(this.readyState === 4) {
      console.log(this.responseText);
    }
  });
  
  xhr.open("POST", "http://137.108.92.9/openstack/api/orders");
  
  xhr.send(data);

  //FR2.1 sets the map to current location
  map.setCenter({lat: String(lat), lng:String(long)});
  map.setZoom(14);

}