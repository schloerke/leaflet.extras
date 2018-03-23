/* global LeafletWidget, L */

LeafletWidget.methods.addBounceMarkers = function(lat, lng, duration, height) {
  (
    function() {
      L.marker(
        [lat, lng],
        {
          bounceOnAdd: true,
          bounceOnAddOptions: {
            duration: duration,
            height: height
          }
        }
      ).addTo(this);
    }
  ).call(this);
};
