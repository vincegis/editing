var lyrJawg;
var editmap;
var zoomHome;
var dataEdits;
var lyrEdits;

editmap = L.map('mapdiv', 
                {center:[39.1352, -77.1882], 
                 zoomControl: false, 
                 zoom:11,
                 contextmenu: true,
                 contextmenuWidth: 140,
                 contextmenuItems: [{
                     text: "Update data",
                     callback: dataUpdated
                 },{
                     text: "Insert new data",
                     callback: dataInserted
                  }]
                 });

lyrJawg = L.tileLayer.provider('Jawg.Light');
lyrOSM = L.tileLayer.provider('OpenStreetMap.Mapnik');
editmap.addLayer(lyrJawg);

dataEdits = 'data/edits.geojson';

// add leaflet-geoman controls with some options to the map  
editmap.pm.addControls({  
  position: 'topright'
});


// custom xoom to the orig extent ccontrol
zoomHome = L.Control.zoomHome();
zoomHome.addTo(editmap);


//options for the polyline control
var options = {
    position: 'topleft',
    unit: 'miles',
    useSubunits: true
}


// polyline measure contro;
L.control.polylineMeasure(options).addTo(editmap);

//toastr options
toastr.options = {
    "positionClass": "toast-top-center",
    "closeButton": true
}


// ###  Editing Code ### //

// geoman pm, enable the drawing of polygons
editmap.pm.enableDraw('Polygon');

// add the edit layer to the map
lyrEdits = L.geoJSON.ajax(dataEdits).addTo(editmap);

//enable geoman pm on the layer and set some options
lyrEdits.pm.enable({
    snappable: true,
    allowCutting: true,
    allowRotation: true,
    draggable: true,
    allowSelfIntersection: false
})



// event handlers for the map - On Create
editmap.on('pm:create', function(e){
    
    console.log(e.layer.getLatLngs())
    
    // set the property to false
    e.layer.pm.enable({allowSelfIntersection: false});
    
    // listen for the event
    if (e.layer.pm.hasSelfIntersection()){
        toastr.error("Error: self intersection!");
        };
    
     e.layer.on('pm:drag', function(y) {
        console.log('layer drag', y);   
    })
    
    e.layer.on('pm:edit', function(e){
        alert('edit');
    })
})

// map event listener On: Remove a layer shape
editmap.on('pm:remove', function(e){
    toastr.success("Shape removed!");
})


// event handlers for the layer - On Edit
lyrEdits.on("pm:edit", function(e){
   
   
    // set the property to false
    e.layer.pm.enable({allowSelfIntersection: false});
    
    // listen for the event
    if (e.layer.pm.hasSelfIntersection()){
        toastr.error("Error: self intersection!");
        };
})


function dataUpdated(){
    toastr.success("Data has been updated!");
}

function dataInserted(){
    toastr.success("Data has been inserted!");
}


