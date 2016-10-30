//national results
var barData = [.067, .090, .068, .189, .147, .118, .102, .076, .065, .053];
var gap = 2;
var maxper= .5;
//padding for party labels
var left_padding = 60;
var w = 300,
    h = 215;

var x = d3.scale.linear()
        .domain([0, maxper])
        .range([0, w-30]);
var y = d3.scale.ordinal()
        .domain(barData)
        .rangeBands([0, h]);

var chart = d3.select(".chart").append("svg")
        .attr("class", "chart")
        .attr("width", w+left_padding+10)
        .attr("height", h)
        .append("g")
        .attr("transform", "translate(20,15)");

//the lines at 20,40,60
chart.selectAll("line")
    .data(x.ticks(5))
    .enter().append("line")
    .attr("x1", function(d) { return x(d) + left_padding; })
    .attr("x2", function(d) { return x(d) + left_padding; })
    .attr("y1", -3)
    .attr("y2", h - 10)
    .style("stroke", function(d, i) {return i == 0 ? "#000": "#bbb";});

//the text at the top of the lines
chart.selectAll(".rule")
    .data(x.ticks(5))
    .enter().append("text")
    .attr("class", "rule")
    .attr("x", function(d) { return x(d) + left_padding; })
    .attr("y", 0)
    .attr("dy", -4)
    .attr("text-anchor", "middle")
    .attr("font-size", 11)
    .text(function(d){return digit0(d)});

//the bars
chart.selectAll("rect")
    .data(barData)
    .enter().append("rect")
    .attr("x", function(d, i) { return left_padding; })
    .attr("y", function(d, i) { return i * 20; })
    .attr("width", x)
    .attr("height", 20)
    .attr("fill",  function(d, i) { if(i == 0) return "#0000FF";
				    if(i == 1) return "#00FF00";
                                    if(i == 2) return "#000000";
                                    if(i == 3) return "#D40000";
                                    if(i == 4) return "#FFFF00";
                                    if(i == 5) return "#8B0000";
                                    if(i == 6) return "#191970";
                                    if(i == 7) return "#0000FF";
                                    if(i == 8) return "#008000";
                                    if(i == 9) return "#FF7F00";});

//labels for the parties
chart.selectAll("text.name")
    .data(["Nasdem", "PKB", "PKS", "PDI-P", "Golkar", "Gerindra", "Demokrat", "PAN", "PPP", "Hanura"])
    .enter().append("text")
    .attr("x", 0)
    .attr("y", function(d, i){ return i * 20 + 10; } )
    .attr("dy", ".36em")
    .attr("text-anchor", "left")
    .attr('class', 'name')
    .attr("font-size", 12)
    .text(String);

function redraw() {

    // Update…
    chart.selectAll("rect")
        .data(barData)
	.transition()
        .duration(300)
        .attr("y", function(d, i) { return i * 20; })
	.attr("width", x);

    chart.selectAll("text")
	.data(barData)
	.enter().append("text")
	.attr("stroke", "black")
	.attr("x", x)
	.attr("y", function(d) { return y(d) + y.rangeBand() / 2; })
	.attr("dx", -3) // padding-right
	.attr("dy", ".35em") // vertical-align: middle
	.attr("text-anchor", "end") // text-align: right
	.text(String);
}
