/*Colors for the clustering*/
var clusterColors = ["#214AA0", "#000000","#00FF00","#D40000", "#FFFF00","#8B0000", "#191970","#0000FF", "#008000", "#FF7F00"];
/*Intuitive names of the clusters*/
var clusterNames = ["Nasdem", "PKB", "PKS","PDIP", "Golkar", "Gerindra", "Demokrat", "PAN", "PPP", "Hanura"];

//legend labels
var cutPoints = ["0% - 5%", "5% - 10%", "10% - 15%","15% - 20%","20% - 25%", "25% - 30%","30% - 35%", "35% - 40%", "40% - 45%", "45% - 50%"];

var feature, selection = "";
var digit = d3.format(".1%");
var digit0 = d3.format(".0%");

var choose_scale=function(party){
    switch(party) {
    case "Nasdem":
        return nasdem_scale;
        break;
    case "PKB":
        return pkb_scale;
        break;
    case "PKS":
        return pks_scale;
        break;
    case "PDIP":
        return pdip_scale;
        break;
    case "Golkar":
        return golkar_scale;
        break;
    case "Gerindra":
        return gerindra_scale;
        break;
    case "Demokrat":
        return demokrat_scale;
        break;
    case "PAN":
        return pan_scale;
        break;
    case "PPP":
        return ppp_scale;
        break;
    case "Hanura":
        return hanura_scale;
        break;

    }
}

var color = function() { return d3.scale.quantize()
			 .domain([0, .5])
			 .range(colorScale());};

var caption = d3.select('#caption')
, starter = caption.html();
function showCaption(d, i) {
    barData = [d.properties.Nasdem, d.properties.PKB, d.properties.PKS, d.properties.PDIP, d.properties.Golkar, d.properties.Gerindra, d.properties.Demokrat, d.properties.PAN, d.properties.PPP, d.properties.Hanura];
    redraw();
    caption.html(d.properties.area);
}

var map = L.map('map').setView([-4, 120], 4);

var cloudmade = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    subdomains: 'abcd',
    minZoom: 4,
    maxZoom: 20}).addTo(map);

/* Initialize the SVG layer */
map._initPathRoot()  ;
/* We simply pick up the SVG from the map object */
var svg = d3.select("#map").select("svg"),
    g = svg.append("g");

var svg = d3.select(map.getPanes().overlayPane).append("svg"),
    g = svg.append("g").attr("class", "leaflet-zoom-hide");

var nasdem_scale = chroma.scale([chroma('#214AA0').brighten(100).hex() , '#214AA0']).domain([0,.5], 10),
    pks_scale = chroma.scale([chroma('#000000').brighten(100).hex(), '#000000']).domain([0,.5], 10),
    pkb_scale = chroma.scale([chroma('#00FF00').brighten(100).hex(), '#00FF00']).domain([0,.5], 10),
    pdip_scale = chroma.scale([chroma('#D40000').brighten(100).hex(), '#D40000']).domain([0,.5], 10),
    golkar_scale = chroma.scale([chroma('#FFFF00').brighten(100).hex(), '#FFFF00']).domain([0,.5], 10),
    gerindra_scale = chroma.scale([chroma('#8B0000').brighten(100).hex(), '#8B0000']).domain([0,.5], 10)
    demokrat_scale = chroma.scale([chroma( '#191970').brighten(100).hex(), '#191970']).domain([0,.5], 10),
    pan_scale = chroma.scale([chroma('#0000FF').brighten(100).hex(), '#0000FF']).domain([0,.5], 10),
    ppp_scale = chroma.scale([chroma('#008000').brighten(100).hex(), '#008000']).domain([0,.5], 10),
    hanura_scale = chroma.scale([chroma('#FF7F00').brighten(100).hex(), '#FF7F00']).domain([0,.5], 10);

//Initial color legend
for(i=0;i<10;i++) {
    d3.select("#n" + i).style("fill", choose_scale("Nasdem")(choose_scale("Nasdem").domain()[(i)]).hex());
    d3.select("#t" + i).html(clusterNames[i]);
}

d3.json("final.json", function(topology) {
    var bounds = d3.geo.bounds(topojson.object(topology, topology.objects.areas)),
	path = d3.geo.path().projection(project);

    feature = g.selectAll("path")
	.data(topojson.object(topology, topology.objects.areas).geometries)
	.enter().append("path")
	.style("fill",function(d) { return d.properties.color;  })
        .on('click', showCaption)
	.on('mouseover', showCaption)
//	.on('mousemove', showCaption)
	.on('mouseout', function() {
	    caption.html(starter);
	    barData = [.067, .090, .068, .189, .147, .118, .102, .076, .065, .053];
	    redraw();
	});
    ;

    map.on("viewreset", reset);
    reset();

    // Reposition the SVG to cover the features.
    function reset() {
	var bottomLeft = project(bounds[0]),
	    topRight = project(bounds[1]);

	svg .attr("width", topRight[0] - bottomLeft[0])
	    .attr("height", bottomLeft[1] - topRight[1])
	    .style("margin-left", bottomLeft[0] + "px")
	    .style("margin-top", topRight[1] + "px");

	g   .attr("transform", "translate(" + -bottomLeft[0] + "," + -topRight[1] + ")");

	feature.attr("d", path);
    }

    // Use Leaflet to implement a D3 geographic projection.
    function project(x) {
	var point = map.latLngToLayerPoint(new L.LatLng(x[1], x[0]));
	return [point.x, point.y];
    }
});

d3.select("select").on("change", function() {
    selection = this.value.toString();
    if(selection != "Winner")
	for(i=0;i<10;i++) {
	    d3.select("#n" + i).style("background", choose_scale(selection)(choose_scale(selection).domain()[(i)]).hex());
	    d3.select("#t" + i).html(cutPoints[i]);
	}
    else
	for(i=0;i<10;i++) {
	    d3.select("#n" + i).style("background",clusterColors[i]);
	    d3.select("#t" + i).html(clusterNames[i]);
	}
    d3.selectAll("path").style("fill",function(d) {
	if (selection == "Winner")
	    return d.properties.color;
	else
            return choose_scale(selection)(d.properties[selection]).hex();
    });
});
