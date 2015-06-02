var Settings = {
  "initial_query": "firstcloud.json",
  "specific": {
    "onclick":"Click_Node", //please make sure is implemented first    
    // for more tunning options please see: http://www.goat1000.com/tagcanvas-options.php
    "options": {
          "textColour": '#000000',
          "outlineColour": '#0000ff',
          "reverse": true,
          "depth": 0.7,
          "maxSpeed": 0.05,
          "shape" : "sphere",
          "shadowBlur": 1,
          "shadowOffset": [1,1],
          "initial": [0,0.1],
          "dragControl": true,
          "dragThreshold":4
    }
  },
  "generic": {
    "onclick":"Click_Node",//please make sure is implemented first
    // for more tunning options please see: http://www.goat1000.com/tagcanvas-options.php
    "options": { 
          "textColour": '#ff0000',
          "outlineColour": '#ff00ff',
          "reverse": true,
          "depth": 0.7,
          "maxSpeed": 0.05,
          "shape" : "sphere",
          "shadowBlur": 1,
          "shadowOffset": [1,1],
          "initial": [0,0.1],
          "dragControl": true,
          "dragThreshold":4
    }
  }
}



// Defines what to do onclick the node... receives the node_div itself as element
// element.text should have the node_label content.
function Click_Node(element) {

  var query = element.text.replace(" ","+")
  // var url_query = "http://localhost/api/?query="+query
  var url_query = Settings.initial_query;

  console.log("\nNODE CLICKED: "+query);
  console.log(" and now ajaxing this: "+url_query)
  
  $.ajax({
    type: 'GET',
    url: url_query,
    contentType: "application/json",
    // dataType: 'jsonp', // activate this when your API is ready
    success : function(data) {
      console.log("\t et voila, new json!:");
      console.log(data)
      console.log(" - - -  -- - - - - - - -")
    },
    error: function(){ 
      console.log("Page Not found. parseCustom, inside the IF");
    }
  });
}


// Receives an array of nodes (e.g.: from data.generic )
// The most important is to pass the TagCanvas.js options for differentiating between the 2 tagclouds.
function Filling_Divs( nodes , type , options , custom_onclick) {
  
  var Nodes = nodes;
  
  var html = '<ul>'+'\n';
  
  for(var t in Nodes) {
    html+= '\t'+'<li><a href="javaScript:void(0);" onclick="'+custom_onclick+'(this)" style="cursor: pointer;">'+Nodes[t]["name"]+'</a></li>'+"\n";
  }
  
  html+="</ul>"
  $("#"+type+"_nodes").html(html);

  if(!$('#Canvas_'+type).tagcanvas(options, type+'_nodes')) {
    // something went wrong, hide the canvas container
    $('#CanvasContainer_'+type).hide();
  }
}


// The Main:
$(document).ready(function() {

  var some_remote_url = Settings.initial_query//"firstcloud.json";
  $.ajax({
      type: 'GET',
      url: some_remote_url,
      contentType: "application/json",
      // dataType: 'jsonp', // activate this when your API is ready
      success : function(data) {

        Filling_Divs( data.generic , "generic" , Settings.generic.options , Settings.generic.onclick);

        Filling_Divs( data.specific , "specific" , Settings.specific.options , Settings.specific.onclick)

      },
      error: function(){ 
          console.log("Page Not found. parseCustom, inside the IF");
      }
  });


});