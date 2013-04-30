$(function() {
  
  var app = {}
  
  var avocadoIcon = L.Icon.extend({
      iconUrl: 'avocado.png',
      shadowUrl: 'marker-shadow.png',
      iconSize: new L.Point(97, 224),
      shadowSize: new L.Point(1, 1),
      iconAnchor: new L.Point(45, 223),
      popupAnchor: new L.Point(0, -230)
  });
  
  var tacoIcon = L.Icon.extend({
      iconUrl: 'taco.png',
      shadowUrl: 'marker-shadow.png',
      iconSize: new L.Point(60, 60),
      shadowSize: new L.Point(1, 1),
      iconAnchor: new L.Point(30, 59),
      popupAnchor: new L.Point(0, -65)
  });

  function showMap(container) {
    app.map = new L.Map(container || 'mapbox', {zoom: 13, attributionControl: false, zoomControl: false})
    var tiles ="http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg"
    var layer = new L.TileLayer(tiles, {maxZoom: 16, minZoom: 3, detectRetina: true})
    app.map.setView(new L.LatLng(37.808189310373415, -122.29409108886722), 13)
    app.map.scrollWheelZoom.disable()
    app.map.addLayer(layer)
    
  }

  function showEventOnMap(ev) {
    var markerLocation = ev.location
    var marker = new L.Marker(markerLocation, {icon: ev.icon})
    marker.bindPopup("<b>"+ev.name+"</b>" + "<br>" + ev.description + "<br>" + ev.address, {closeButton: false})
    app.map.addLayer(marker)
  }
  
  showMap('third')
  
  showEventOnMap({
    name: "La Borinquena",
    location: new L.LatLng(37.80128785959947, -122.27722945819704),
    address: '7th and Jefferson St.',    
    description: "We will end at this taqueria that has been in business since 1944, one of only two left in the neighborhood.",
    icon: new tacoIcon()
  })
  
  showEventOnMap({
    name: "Snow Park",
    location: new L.LatLng(37.80693786232111, -122.2644712),
    address: '<a href="http://goo.gl/maps/V3xVC"> Downtown near Lake Merritt, Oakland',
    description: "Meet here at 11 AM on Sunday, May 5th",
    icon: new avocadoIcon()
  })
  
  showEventOnMap({
    name: "Taqueria Mi Rancho",
    location: new L.LatLng(37.79338892937019, -122.2524905204773),
    address: '1st ave and 15th st',
    description: "AKA 'Tacos by the Lake'. We will stop here on the way to Fruitvale.",
    icon: new tacoIcon()
  })

  showEventOnMap({
    name: "El Grullo/Tacos Alonzo",
    location: new L.LatLng(37.78508003870297, -122.22838041111447),
    address: '27th and Foothill',
    description: "There are two great taco trucks within a block of each other here that we will stop by and try",
    icon: new tacoIcon()
  })

  showEventOnMap({
    name: "Taqueria Sinaloa",
    location: new L.LatLng(37.7783929161717, -122.22718261242674),
    address: 'Fruitvale Ave and E 12th',
    description: "This bright orange and green taqueria has a large indoor seating area as well as a taco truck parked outside. It is across the street from the Fruitvale BART station.",
    icon: new tacoIcon()
  })

  // Cache the Window object
  $window = $(window);
  
  // Cache the Y offset and the speed of each sprite
  $('[data-type]').each(function() {  
    $(this).data('offsetY', parseInt($(this).attr('data-offsetY')));
    $(this).data('Xposition', $(this).attr('data-Xposition'));
    $(this).data('speed', $(this).attr('data-speed'));
  });
  
  // For each element that has a data-type attribute
  $('section[data-type="background"]').each(function(){
  
  
    // Store some variables based on where we are
    var $self = $(this),
      offsetCoords = $self.offset(),
      topOffset = offsetCoords.top;
    
    // When the window is scrolled...
      $(window).scroll(function() {
  
      // If this section is in view
      if ( ($window.scrollTop() + $window.height()) > (topOffset) &&
         ( (topOffset + $self.height()) > $window.scrollTop() ) ) {
  
        // Scroll the background at var speed
        // the yPos is a negative value because we're scrolling it UP!                
        var yPos = -($window.scrollTop() / $self.data('speed')); 
        
        // If this element has a Y offset then add it on
        if ($self.data('offsetY')) {
          yPos += $self.data('offsetY');
        }
        
        // Put together our final background position
        var coords = '80% '+ yPos + 'px';

        // Move the background
        $self.css({ backgroundPosition: coords });
        
        // Check for other sprites in this section  
        $('[data-type="sprite"]', $self).each(function() {
          
          // Cache the sprite
          var $sprite = $(this);
          
          // Use the same calculation to work out how far to scroll the sprite
          var yPos = -($window.scrollTop() / $sprite.data('speed'));          
          var coords = $sprite.data('Xposition') + ' ' + (yPos + $sprite.data('offsetY')) + 'px';
          
          $sprite.css({ backgroundPosition: coords });                          
          
        }); // sprites
      
      
      }; // in view
  
    }); // window scroll
      
  });  // each data-type
})
