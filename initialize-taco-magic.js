$(function() {
  
  var app = {}

  function showMap(container) {
    app.map = new L.Map(container || 'mapbox', {zoom: 12, attributionControl: false, zoomControl: false})
    var tiles ="http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg"
    var layer = new L.TileLayer(tiles, {maxZoom: 16, minZoom: 3, detectRetina: true})
    app.map.setView(new L.LatLng(37.79513541839677, -122.34580993652344), 12)
    
    app.map.scrollWheelZoom.disable()
    app.map.addLayer(layer)
  }

  function showEventOnMap(ev) {
    
    var avocadoIcon = L.Icon.extend({
        iconUrl: 'avocado.png',
        shadowUrl: 'marker-shadow.png',
        iconSize: new L.Point(97, 224),
        shadowSize: new L.Point(68, 95),
        iconAnchor: new L.Point(45, 223),
        popupAnchor: new L.Point(0, -230)
    });
    
    var markerLocation = ev.location
    var avocado = new avocadoIcon()
    var marker = new L.Marker(markerLocation, {icon: avocado})
    marker.bindPopup("<b>"+ev.name+"</b>" + "<br>" + ev.description + "<br>" + ev.address, {closeButton: false})
    app.map.addLayer(marker)
  }
  
  showMap('third')
  
  showEventOnMap({
    name: "Mission Dolores Park",
    location: new L.LatLng(37.76069823122058, -122.42650151252747),
    address: '<a href="http://g.co/maps/dxmye">19th and Dolores St, SF</a>',
    description: "Meet here at 11 AM on Sunday, May 13th"
  })
  
  showEventOnMap({
    name: "Henry J. Kaiser Memorial Park",
    location: new L.LatLng(37.80884307543321, -122.27114260196686),
    address: '<a href="http://g.co/maps/5xh3r">19th and & Rashida Muhammad St (near Telegraph), Oakland</a>',    
    description: "Meet here at 11 AM on Saturday, May 12th"
  })
  
  var toppings = [
    {
      d:"m 743.85545,1007.0041 c -1.02192,-0.9654 0.74685,-1.3882 -1.90097,-2.6245 -11.24358,-5.24947 -11.98631,6.2146 -3.95715,9.9634 4.89618,2.286 12.29991,-3.4117 5.85812,-7.3389 z",
      style: "fill:#b34620; fill-opacity:1; stroke:#000000; stroke-width:0.88133264px; stroke-linecap:butt; stroke-linejoin:miter; stroke-opacity:1"
    },
    { 
      d:"m 698.63001,949.31073 c -1.18609,1.7141 -0.89028,3.3848 -0.89028,5.3417 0,14.3122 11.00755,2.1047 5.34168,-3.5612 -1.89039,-1.8904 -0.3553,-2.5998 -4.4514,-1.7805 z",
      style: "fill:#b34620; fill-opacity:1; stroke:#000000; stroke-width:0.88133264px; stroke-linecap:butt; stroke-linejoin:miter; stroke-opacity:1"
    },
    { 
      d:"m 693.28833,903.01613 c -2.58012,-0.2058 -4.6373,1.141 -6.6771,2.6708 -4.43133,3.3235 -5.56364,11.4993 2.2257,8.9028 3.07373,-1.0245 11.76792,-9.2508 8.01252,-11.1285 -1.06998,-0.535 -2.38808,-0.2105 -3.56112,-0.4451 z",
      style: "fill:#b34620; fill-opacity:1; stroke:#000000; stroke-width:0.88133264px; stroke-linecap:butt; stroke-linejoin:miter; stroke-opacity:1"
    },
    { 
      d:"m 612.27281,932.39543 c 0.91561,2.5239 2.05444,5.3073 3.56112,7.5674 1.97483,2.9622 3.5319,5.3417 7.12224,5.3417 7.28422,0 -0.53731,-21.026 -10.68336,-12.9091 z",
      style: "fill:#b34620; fill-opacity:1; stroke:#000000; stroke-width:0.88133264px; stroke-linecap:butt; stroke-linejoin:miter; stroke-opacity:1"
    }
  ]

  var w = document.body.offsetWidth
  var h = "800"

  var nodes = d3.range(200).map(function() { return {radius: Math.random() * 12 + 4}; }),
      colors = ["#B34620", "#B34620", "#BE3B66", "#BFE165", "#7BA120"]

  var force = d3.layout.force()
      .gravity(0.05)
      .charge(function(d, i) { return i ? 0 : -2000; })
      .nodes(nodes)
      .size([w, h]);

  var root = nodes[0];
  root.radius = 0;
  root.fixed = true;

  force.start();

  var tacoLeft = w/2 - 373
  var taco = d3.select("#tacoconf-logo-g")
    .attr('transform', 'translate(' + tacoLeft + ',-350)')

  var svg = d3.select("#floating-tacos svg")
    .attr("width", w)
    .attr("height", h)

  svg.selectAll("circle")
      .data(nodes.slice(1))
    .enter().append("svg:circle")
      .attr("r", function(d) { return d.radius - 2; })
      .style("fill", function(d, i) {
        return colors[~~(Math.random() * colors.length)];
      });

  force.on("tick", function(e) {
    var q = d3.geom.quadtree(nodes),
        i = 0,
        n = nodes.length;

    while (++i < n) {
      q.visit(collide(nodes[i]));
    }

    svg.selectAll("circle")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });

  svg.on("mousemove", function() {
    var p1 = d3.svg.mouse(this);
    root.px = p1[0];
    root.py = p1[1];
    force.resume();
  });

  function collide(node) {
    var r = node.radius + 16,
        nx1 = node.x - r,
        nx2 = node.x + r,
        ny1 = node.y - r,
        ny2 = node.y + r;
    return function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== node)) {
        var x = node.x - quad.point.x,
            y = node.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = node.radius + quad.point.radius;
        if (l < r) {
          l = (l - r) / l * .5;
          node.x -= x *= l;
          node.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2
          || x2 < nx1
          || y1 > ny2
          || y2 < ny1;
    };
  }
  
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
        var coords = '50% '+ yPos + 'px';

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
