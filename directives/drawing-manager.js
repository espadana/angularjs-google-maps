/**
 * @ngdoc directive
 * @name drawing-manager
 * @param Attr2Options {service} convert html attribute to Google map api options
 * @description
 *   Requires:  map directive
 *   Restrict To:  Element
 *
 * @example
 * Example:
 *
 *  <map zoom="13" center="37.774546, -122.433523" map-type-id="SATELLITE">
 *    <drawing-manager
 *      on-overlaycomplete="onMapOverlayCompleted()"
 *      position="ControlPosition.TOP_CENTER"
 *      drawingModes="POLYGON,CIRCLE"
 *      drawingControl="true"
 *      circleOptions="fillColor: '#FFFF00';fillOpacity: 1;strokeWeight: 5;clickable: false;zIndex: 1;editable: true;" >
 *    </drawing-manager>
 *  </map>
 *
 *  TODO: Add remove button.
 *  currently, for our solution, we have the shapes/markers in our own
 *  controller, and we use some css classes to change the shape button
 *  to a remove button (<div>X</div>) and have the remove operation in our own controller.
 */
(function() {
  'use strict';
  angular.module('PageBuilderApplication').directive('drawingManager', [
    'Attr2MapOptions', function(Attr2MapOptions) {
    var parser = Attr2MapOptions;

    return {
      restrict: 'E',
      require: ['?^map','?^ngMap'],

      link: function(scope, element, attrs, mapController) {
        mapController = mapController[0]||mapController[1];

        var filtered = parser.filter(attrs);
        var options = parser.getOptions(filtered, {scope: scope});
        var controlOptions = parser.getControlOptions(filtered);
        var events = parser.getEvents(scope, filtered);

        /**
         * set options
         */
        var drawingManager = new google.maps.drawing.DrawingManager({
          drawingMode: options.drawingmode,
          drawingControl: options.drawingcontrol,
          drawingControlOptions: controlOptions.drawingControlOptions,
          circleOptions:options.circleoptions,
          markerOptions:options.markeroptions,
          polygonOptions:options.polygonoptions,
          polylineOptions:options.polylineoptions,
          rectangleOptions:options.rectangleoptions
        });

        //Observers
        attrs.$observe('drawingControlOptions', function (newValue) {
          drawingManager.drawingControlOptions = parser.getControlOptions({drawingControlOptions: newValue}).drawingControlOptions;
          drawingManager.setDrawingMode(null);
          drawingManager.setMap(mapController.map);
        });


        /**
         * set events
         */
        for (var eventName in events) {
          google.maps.event.addListener(drawingManager, eventName, events[eventName]);
        }

        mapController.addObject('mapDrawingManager', drawingManager);

        element.bind('$destroy', function() {
          mapController.deleteObject('mapDrawingManager', drawingManager);
        });
      }
    }; // return
  }]);
})();
