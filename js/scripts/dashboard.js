let dataTable       = dc.dataTable('#dc-table-graph'),
    magnitudeChart  = dc.barChart('#magnitude-chart'),
    depthChart      = dc.barChart('#depth-chart'),
    timeChart       = dc.lineChart('#time-chart');

d3.csv("earthquakes.csv", function (data) {
    let dtgFormat           = d3.time.format.utc("%Y-%m-%dT%H:%M:%S"),
        americanDtgFormat   = d3.time.format("%m/%d/%Y");

    data.forEach(function(d){
        d.dtg       = dtgFormat.parse(d.origintime.substr(0,19));
        d.magnitude = d3.round(+d.magnitude,1);
        d.depth     = d3.round(+d.depth,0);
    });

    let facts = crossfilter(data);

    let dateDimension       = facts.dimension(function(d){return d.dtg; }),
        magnitudeDimension  = facts.dimension(function(d){return d.magnitude; }),
        depthDimension        = facts.dimension(function(d){return d.depth; }),
        hourDimension       = facts.dimension(function(d){return d3.time.hour(d.dtg); });

    let magnitudeDimensionCount = magnitudeDimension.group(),
        depthDimensionCount     = depthDimension.group(),
        hourDimensionCount      = hourDimension.group();

  magnitudeChart.width(480)
    .height(150)
    .margins({top: 10, right: 10, bottom: 20, left: 40})
    .dimension(magnitudeDimension)
    .group(magnitudeDimensionCount)
    .transitionDuration(500)
    .centerBar(true)
    .gap(56)
    .x(d3.scale.linear().domain([0, 8]))
    .elasticY(true);

  depthChart.width(480)
    .height(150)
    .margins({top: 10, right: 10, bottom: 20, left: 40})
    .dimension(depthDimension)
    .group(depthDimensionCount)
    .x(d3.scale.linear().domain([0, 100]))
    .transitionDuration(500)
    .elasticY(true);
 
  timeChart.width(960)
    .height(150)
    .margins({top: 10, right: 10, bottom: 20, left: 40})
    .dimension(hourDimension)
    .group(hourDimensionCount)
    .x(d3.time.scale().domain(d3.extent(data, function(d) { return d.dtg; })))
    .xUnits(d3.time.days)
    .renderHorizontalGridLines(true)
    .elasticY(true)
    .brushOn(false);

  dataTable.width(960)
    .height(800)
    .dimension(dateDimension)
    .group(function(d){ return "Earthquake Table"; })
    .size(10)
    .columns([
      function(d){ return d.dtg; },
      function(d){ return d.magnitude; },
      function(d){ return d.depth; },
      function(d){ return d.latitude; },
      function(d){ return d.longitude; },
      ])
    .sortBy(function(d){ return d.dtg; })
    .order(d3.ascending);

  dc.renderAll();
  
});