var Settings = {
  "initial_SG_query": "tagcloud_demo/firstcloud.json",
  "initial_Map_query": "data/0-terms-terms-MainNodes.gexf",
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


// Function.prototype.index
(function(reComments, reParams, reNames) {
  Function.prototype.index = function(arrParamNames) {
    var fnMe = this;
    arrParamNames = arrParamNames
      || (((fnMe + '').replace(reComments, '')
           .match(reParams)[1] || '')
          .match(reNames) || []);
    return function(namedArgs) {
      var args = [], i = arrParamNames.length;
      args[i] = namedArgs;
      while(i--) {
        args[i] = namedArgs[arrParamNames[i]];
      }
      return fnMe.apply(this, args);
    };
  };
})(
  /\/\*[\s\S]*?\*\/|\/\/.*?[\r\n]/g,
  /\(([\s\S]*?)\)/,
  /[$\w]+/g
);
var AjaxSync = (function(TYPE, URL, DATA, CT , DT) {
    var Result = []
    TYPE = (!TYPE)?"GET":"POST"
    if(DT && (DT=="jsonp" || DT=="json")) CT="application/json";
    // console.log(TYPE, URL, DATA, CT , DT)
    $.ajax({
            type: TYPE,
            url: URL,
            data: DATA,
            contentType: CT,
            dataType: DT,
            async: false,
            success : function(data, textStatus, jqXHR) {
                header = jqXHR.getResponseHeader("Content-Type")
                header = (header)?"json":"gexf";
                Result = { "OK":true , "format":header , "data":data };
            },
            error: function(exception) { 
                Result = { "OK":false , "format":false , "data":exception.status };
            }
        });
    return Result;
}).index();


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
      console.log("\t et voila, new json for SG-tagclouds!:");
      console.log(data)

      // Cleaning the associative arrays and hoping the fake GC of the browser do his job
      partialGraph.emptyGraph();
      partialGraph.refresh();      
      partialGraph.draw();      
      for(var i in Nodes) 
        delete Nodes[i];
      for(var i in Edges) 
        delete Edges[i];

      // yo im the new gexf mofos \m/
      mainfile = [ "data/20150518t1052_phylograph.json" ] 
      The_Main( mainfile , "file");
      console.log(" - - -  -- - - - - - - -")
    },
    error: function(){ 
      console.log("Page Not found. parseCustom, inside the IF");
    }
  });
}

function ResizeTagClouds(){

  console.log(" - - -- - - ")
  console.log("Before:")
  console.log($("#Canvas_generic").height())
  console.log($("#Canvas_specific").height())
  console.log(" - - -- - - ")

  var the_width = $("#tagclouds").width()
  var the_height = $("#tagclouds").height()
  console.log("tagcloud canvas change: w="+the_width+" | h="+the_height)

  $("Canvas_generic").width( Math.round(the_width/1.1) );
  $("Canvas_generic").height( Math.round(the_height/2.05) );
  $("Canvas_specific").width( Math.round(the_width/1.1) );
  $("Canvas_specific").height(Math.round(the_height/2.05));

  console.log("After:")
  console.log($("#Canvas_generic").height())
  console.log($("#Canvas_specific").height())
  console.log(" = = = = = = = = = = = \n")
}


// Receives an array of nodes (e.g.: from data.generic )
// The most important is to pass the TagCanvas.js options for differentiating between the 2 tagclouds.
function Filling_Divs( nodes , type , options , custom_onclick) {


  var the_width = $("#tagclouds").width()
  var the_height = $("#tagclouds").height()
  console.log("w: "+the_width + " | h: "+the_height)

  var div_content = '<canvas width="'+Math.round(the_width/1.1)+'px" height="'+Math.round(the_height/2.05)+'px" id="Canvas_'+type+'"></canvas>'
  div_content += '<div id="'+type+'_nodes"></div>'
  console.log("\t"+div_content)
  console.log(" - - - - - - -")
  $("#CanvasContainer_"+type).html(div_content)
  
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



  var some_remote_url = Settings["initial_SG_query"] //"firstcloud.json";
  $.ajax({
      type: 'GET',
      url: some_remote_url,
      contentType: "application/json",
      // dataType: 'jsonp', // activate this when your API is ready
      success : function(data) {

        Filling_Divs( data.generic , "generic" , Settings.generic.options , Settings.generic.onclick);

        Filling_Divs( data.specific , "specific" , Settings.specific.options , Settings.specific.onclick)

         // $( window ).resize(function() {  ResizeTagClouds(); });

        
        // so this is a path to file: Settings["initial_Map_query"]
        var RES = AjaxSync({ URL: Settings["initial_Map_query"] });
        //Now in my RES["data"] i'll have my JSON
        // RES["OK"] = true
        // RES["data"] = THE JSON here
        // RES["format"] 
        if(RES["OK"])
          The_Main( RES, "json_content" );


      },
      error: function(){ 
          console.log("Page Not found. parseCustom, inside the IF");
      }
  });


});