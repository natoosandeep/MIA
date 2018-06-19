#Scale value:
1. With ng-model, scale value not get changed on different point selection(on repeatation).
2. Value we are getting by id and assigning to id.

##---$apply();---##
1. $apply(); is used to reflect view when dynamically array get added and removed

##Dir-Pagination
1. To make use of dir-pagination table on two times on same page, please differentiate it with id as
pagination-id="abc" && pagination-id="xyz"

2. To display id as 0-n please use following
<td>{{itemPerPageCount * (currentPage-1)+($index+1)}}</td>
will print 1,2,3,4,5 and so on. 
currentPage, itemPerPageCount these variable should be declared in getList from controller


## TO remove on load:
$('#imageCanvasForGatewaySetup').removeLayerGroup('myarcs');
$('#imageCanvasForGatewaySetup').drawLayers();

For specific time and more:
	var $canvas = $('canvas');
	for (i = 0; i < 3; i++) {
	  $canvas.drawArc({
	    draggable: true,
	    groups: ['myarcs'],
	    fillStyle: 'red',
	    x: 30 * (i + 1), y: 30 * (i + 1),
	    radius: 15,
	    dragstart: function() {
	      // code to run when dragging starts
	    },
	    drag: function(layer) {
	      // code to run as layer is being dragged
	    },
	    dragstop: function(layer) {
	      // code to run when dragging stops
	    }
	  });
	}
	setTimeout(function() {
	  $canvas.removeLayerGroup('myarcs');
	  $canvas.drawLayers();
	},1000);
	
###TO set COntainement with draggable point:
	$('canvas').drawArc({
	  draggable: true,
	  fillStyle: '#c33',
	  x: 100, y: 100,
	  radius: 50,
	  drag: function(layer) {
	  //This code works for containment
	    // Set boundary at left edge of canvas
	    layer.x = Math.max(layer.radius, layer.x);
	    // Set boundary at right edge of canvas
	    layer.x = Math.min(layer.x, layer.canvas.width - layer.radius);
	    // Set boundary at top edge of canvas
	    layer.y = Math.max(layer.radius, layer.y);
	    // Set boundary at bottom edge of canvas
	    layer.y = Math.min(layer.y, layer.canvas.height - layer.radius);
	  }
	});
	
### Live tracking
 - To set circle background and text color on canvas differently use context.fill(); before context.fillText;
 and after context.fill(); use context.fillStyle ="#ff0000"; context.fillText = ('example',10,20);
 #### ui search key name - 
 -please do not change key name like venueId,beaconId,major,minor key name,as error message depends on it