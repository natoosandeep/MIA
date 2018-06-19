'use strict';
window.mlaApp.directive('draggable', function($rootScope) {
	$rootScope.left;
	$rootScope.top;
	return {
		restrict : 'A',
		
		link : function postLink(elem) {
			
			elem.draggable({
							revert: 'invalid',
					        start: function(event) {
					        	$rootScope.currentGatewayOnSetupMap = event.target;
				             }
					    });
			
			$('#imageCanvasForGatewaySetup').droppable({
							accept:'span',	
							drop: function(event,ui){
								var canvas=document.getElementById("imageCanvasForGatewaySetup");
								var x;
								var y;
								var rect = canvas.getBoundingClientRect(),
					            scaleX = canvas.width / rect.width,    
					            scaleY = canvas.height / rect.height;
					        	x =(event.clientX - rect.left) * scaleX;
					        	y = (event.clientY - rect.top) * scaleY;
					        	$rootScope.top = x;
								$rootScope.left = y;
								
								if(ui.draggable[0].className.includes("unassignedGateway")){
									var coordinates = $rootScope.top +":"+$rootScope.left;
									$rootScope.assignDeviceAndOnMap(ui.draggable[0].id,ui.draggable[0].textContent,coordinates);
									/***
									 * console.log(ui.draggable[0].className);
									 */
								}else{
									var elseCordinates = $rootScope.top +":"+$rootScope.left;
									$rootScope.editGatewayOnMap(ui.draggable[0].id,ui.draggable[0].textContent,elseCordinates);
									/***
									console.log(ui.draggable[0].className);
									*/
								}
								if(/^\d+$/.test(ui.draggable[0].id)){
									ui.draggable[0].textContent = '';
								}
								$rootScope.$apply();
							}
						 });
			
		      }
	      };
})