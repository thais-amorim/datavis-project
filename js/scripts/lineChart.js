let timeChart = dc.seriesChart('#timeChart');

d3.csv("data/flowsByDestinOrigin.csv", function(data) {
  let dtgFormat = d3.time.format("%Y"),
    percentFormat = d3.format("+.2f");

  data.forEach(function(d) {
    d.destin = d.country_dest;
    d.origin = d.country_origin;
    d.total = +d.total;
    d.yearOfMigration = dtgFormat.parse(d.year);
  });

  let flowFacts = crossfilter(data),
    destinDimension = flowFacts.dimension(d => [d.destin, d.yearOfMigration]),
    originDimension = flowFacts.dimension(d => [d.origin, d.yearOfMigration]);

  let minYear = destinDimension.bottom(1)[0].yearOfMigration,
    maxYear = destinDimension.top(1)[0].yearOfMigration;

  let totalByDestinGroup = destinDimension.group().reduceSum(d => d.total),
    totalByOriginGroup = originDimension.group().reduceSum(d => d.total);

  timeChart.width(800)
    .height(400)
    .xUnits(d3.time.years)
  	.x(d3.scale.linear().domain([1990,2015]))
    .renderHorizontalGridLines(true)
    .brushOn(false)
    .yAxisLabel("", 60)
    .seriesAccessor(d => d.key[0])
    .keyAccessor(d => d.key[1])
    .dimension(destinDimension)
    .group(totalByDestinGroup);

  dc.renderAll();
});
