let yearDomain = [1990, 1995, 2000, 2005, 2010, 2015];
let compositeChart = dc.compositeChart('#timeChart');

d3.csv("outflow_country.csv", function(data) {
  let dtgFormat = d3.time.format("%Y"),
    percentFormat = d3.format("+.2f");

  data.forEach(function(d) {
    d.destin = d.country_dest;
    d.origin = d.country_origin;
    d.total = +d.total;
    d.year = dtgFormat.parse(d.year);
  });

  let facts = crossfilter(data),
    dateDim = facts.dimension(d => d.year),
    originDim = facts.dimension(d => d.origin),
    destinDim = facts.dimension(d => d.destin);
  // referenceOutflow = facts.all()[0].origin,
  // referenceInflow = facts.all()[0].destin;

  let destinYearCount = dateDim.group().reduceSum(function(d) {
    return {
      d.destin,
      d.total
    }
  });
  // let applePercentByDayGroup = dateDim.group().reduceSum(function(d) {
  //   return (d.apple / referenceApple - 1) * 100;
  // });
  //
  // let fbPercentByDayGroup = dateDim.group().reduceSum(function(d) {
  //   return (d.facebook / referenceFacebook - 1) * 100;
  // });

  compositeChart
    .width(800)
    .height(400)
    .margins({
      top: 50,
      right: 50,
      bottom: 25,
      left: 40
    })
    .dimension(dateDim)
    .x(d3.time.scale().domain(yearDomain))
    .xUnits(d3.time.days)
    .renderHorizontalGridLines(true)
    .legend(dc.legend().x(700).y(5).itemHeight(13).gap(5))
    .mouseZoomable(true)
    .brushOn(false)
    .title(function(d) {
      return "Year: " + d.key + '\n' +
        "Value: " + d.value;
    })
    .compose([
      dc.lineChart(compositeChart)
      .group(destinYearCount, 'Pais')
      .ordinalColors(['steelblue']),
      dc.lineChart(compositeChart)
      .group(fbPercentByDayGroup, 'Facebook')
      .ordinalColors(['darkorange'])
    ])
    .yAxis().tickFormat(function(label) {
      return label + "%"
    });

  dc.renderAll();
});
