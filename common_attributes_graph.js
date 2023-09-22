export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["attributes.csv",new URL("./files/d07babaea8a5926578e0c35bb73f13c6157cc01d5be625bd699b9d6597a98c299ea22cf1600e724e66b242445ee9e17f18e73451d0a160711c2d3627642bc231",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`## Yelp Five Star Restaurant Common Characteristics
We could represent each attribute with a pie chart, where the slices are the true or the false or not availbale`
)});
  main.variable(observer("data")).define("data", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("attributes.csv").csv()
)});
  main.variable(observer("attributes")).define("attributes", ["d3","data"], function(d3,data){return(
Array.from(d3.rollup(data,
                                counts => d3.sum(counts, c => c.true),
                                d => d.attributes),
                     ([key, value]) => ({key, value}))
  .map(d => d.key)
)});
  main.variable(observer("classes")).define("classes", function(){return(
["true","false","NA"]
)});
  main.variable(observer("dataByAttributes")).define("dataByAttributes", ["data"], function(data){return(
data.map(d => ({
  attributes: d.attributes,
  true:+d.true,
  false:+d.false,
  NA:+d.NA,
  total:(+d.true)+(+d.false)+(+d.NA)
}))
)});
  main.variable(observer("dataByAttributesWithClassArray")).define("dataByAttributesWithClassArray", ["dataByAttributes","classes"], function(dataByAttributes,classes){return(
dataByAttributes.map(d => ({
  attributes: d.attributes,
  total: d.total,
  classes: classes.map(b => ({class: b, count: d[b]}))
}))
)});
  main.variable(observer()).define(["legend"], function(legend){return(
legend()
)});
  main.variable(observer()).define(["width","d3","attributes","dataByAttributesWithClassArray","color"], function(width,d3,attributes,dataByAttributesWithClassArray,color)
{
  const margin = {top: 20, right: 35, bottom: 40, left: 35};
  const visWidth = width - margin.left - margin.right;
  const visHeight = 200 - margin.top - margin.bottom;
  
  const svg = d3.create('svg')
      .attr('width', visWidth + margin.left + margin.right)
      .attr('height', visHeight + margin.top + margin.bottom);

  const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
  // title
  g.append('text')
      .attr('x', visWidth / 2)
      .attr('y', -margin.top)
      .attr('font-family', 'sans-serif')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'hanging')
      .text('Yelp Five Star Restaurant Common Characteristics');
  
  const x = d3.scalePoint()
      .domain(attributes)
      .range([0, visWidth]);

  // the radius of the pie charts
  const outerRadius = x.step() / 2.1;
  
  // this axis will show the attributes labels
  const xAxis = d3.axisBottom(x)

  g.append('g')
    .attr('transform', `translate(0,${(visHeight / 2) + outerRadius + 5})`)
    .call(xAxis)
    .call(g => g.selectAll('.domain').remove());
  
  // create the pie and area generators

  const pie = d3.pie()
      .value(d => d.count);

  const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(outerRadius);

  const pieGroups = g.append('g')
    .selectAll('g')
    .data(dataByAttributesWithClassArray)
    .join('g')
      .attr('transform', d => `translate(${x(d.attributes)},${visHeight / 2})`);

  pieGroups.selectAll('path')
    .data(d => pie(d.classes))
    .join('path')
      .attr('d', d => arc(d))
      .attr('fill', d => color(d.data.class))
  
  return svg.node();
}
);
  main.variable(observer("legend")).define("legend", ["d3","DOM","width","color"], function(d3,DOM,width,color){return(
function legend() {
  const size = 10;
  const lineHeight = size * 1.5;
  
  const svg =  d3.select(DOM.svg(width, color.domain().length * lineHeight));
  
  const rows = svg
    .selectAll("g")
    .data(color.domain())
    .join("g")
      .attr("transform", (d, i) => `translate(0, ${i * lineHeight})`);
  
  rows.append("rect")
      .attr("height", size)
      .attr("width", size)
      .attr("fill", d => color(d));
  
  rows.append("text")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("dominant-baseline", "hanging")
      .attr("x", lineHeight)
      .text(d => d);
  
  return svg.node();
}
)});
  main.variable(observer("color")).define("color", ["d3","classes"], function(d3,classes){return(
d3.scaleOrdinal()
    .domain(classes)
    .range(d3.schemeTableau10)
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6")
)});
  return main;
}
