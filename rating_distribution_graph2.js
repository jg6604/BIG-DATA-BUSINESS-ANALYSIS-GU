import define1 from "./a33468b95d0b15b0@808.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["yelp_business.csv",new URL("./files/cf70cdb16f56c08bd375141dee9da93930f22740d2f556bbd490ec1d58b563d9629a5175c59920d836b50dbfc67ebc151b2a30d4d512d6237cb00e5b1cf6b342",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Yelp Rating Distribution By State By Star`
)});
  main.variable(observer("dataset")).define("dataset", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("yelp_business.csv").csv()
)});
  main.variable(observer("stars")).define("stars", ["d3","dataset"], function(d3,dataset){return(
Array.from(d3.rollup(dataset,
                                counts => d3.sum(counts, c => c.count),
                                d => d.star),
                     ([key, value]) => ({key, value}))
  .map(d => d.key)
)});
  main.variable(observer("states")).define("states", ["d3","dataset"], function(d3,dataset){return(
Array.from(d3.rollup(dataset,
                                counts => d3.sum(counts, c => c.count),
                                d => d.state),
                     ([key, value]) => ({key, value}))
  //.sort((a, b) => d3.descending(a.value, b.value))
  .map(d => d.key)
)});
  main.variable(observer("dataByStars")).define("dataByStars", ["d3","dataset"], function(d3,dataset)
{
  const data = d3.rollup(dataset,
                         counts => d3.sum(counts, c => c.count),
                         d => d.star,
                         d => d.state);
  
  return Array.from(data, ([star, states]) => ({
    star: star,
    counts: Array.from(states, ([state, count]) => ({state: state, count}))
  }));
}
);
  main.variable(observer("maxSingleStarCount")).define("maxSingleStarCount", ["d3","dataByStars"], function(d3,dataByStars){return(
d3.max(dataByStars, d => d3.max(d.counts, e => e.count))
)});
  main.variable(observer("dataByState")).define("dataByState", ["d3","dataset"], function(d3,dataset)
{
  const counts = d3.rollup(dataset,
         cos => d3.sum(cos, c => c.count),
         d => d.state,
         d => d.star);
  
  return Array.from(counts, (([state, map]) => {
    map.set('total', d3.sum(map.values()));
    map.set('state', state);
    return Object.fromEntries(map)
  }));
}
);
  main.variable(observer("maxTotalCounts")).define("maxTotalCounts", ["d3","dataByState"], function(d3,dataByState){return(
d3.max(dataByState, d => d.total)
)});
  main.variable(observer("dataByStateWithStarArray")).define("dataByStateWithStarArray", ["dataByState","stars"], function(dataByState,stars){return(
dataByState.map(d => ({
  state: d.state,
  total: d.total,
  stars: stars.map(b => ({star: b, counts: d[b]}))
}))
)});
  main.variable(observer("stacked")).define("stacked", ["d3","stars","dataByState"], function(d3,stars,dataByState){return(
d3.stack()
    .keys(stars)(dataByState)
)});
  main.variable(observer("stackedBarChart")).define("stackedBarChart", ["width","d3","states","color"], function(width,d3,states,color){return(
function stackedBarChart(data, yMax, yFormat, yLabel) {
  const margin = {top: 10, right: 0, bottom: 20, left: 120};
  const visWidth = width - margin.left - margin.right;
  const visHeight = 500 - margin.top - margin.bottom;
  
  const svg = d3.create('svg')
      .attr('width', visWidth + margin.left + margin.right)
      .attr('height', visHeight + margin.top + margin.bottom);
  
  const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
  const x = d3.scaleBand()
      .domain(states)
      .range([0, visWidth])
      .padding(0.25)
  
  const y = d3.scaleLinear()
      .domain([0, yMax]).nice()
      .range([visHeight, 0]);
  
  const xAxis = d3.axisBottom(x)
  
  const yAxis = d3.axisLeft(y).tickFormat(d3.format(yFormat))
  
  g.append('g')
      .attr('transform', `translate(0,${visHeight})`)
      .call(xAxis)
      .call(g => g.selectAll('.domain').remove());
  
  g.append("g")
      .call(yAxis)
      .call(g => g.selectAll('.domain').remove())
    .append('text')
      .attr('fill', 'black')
      .attr('x', -40)
      .attr('y', visHeight / 2)
      .text(yLabel);
  
  const series = g.append('g')
    .selectAll('g')
    .data(data)
    .join('g')
      .attr('fill', d => color(d.key));
  
  series.selectAll('rect')
    .data(d => d)
    .join('rect')
      .attr('y', d => y(d[1]))
      .attr('height', d => y(d[0]) - y(d[1]))
      .attr('x', d => x(d.data.state))
      .attr('width', x.bandwidth());
  
  return svg.node();
}
)});
  main.variable(observer()).define(["md"], function(md){return(
md`**use stacked bar chart to visualize data**`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`**Yelp Rating Distribution By State By Star**`
)});
  main.variable(observer()).define(["swatches","color"], function(swatches,color){return(
swatches({ color })
)});
  main.variable(observer()).define(["stackedBarChart","stacked","maxTotalCounts"], function(stackedBarChart,stacked,maxTotalCounts){return(
stackedBarChart(stacked, maxTotalCounts, '', 'Rating Count')
)});
  main.variable(observer("color")).define("color", ["d3","stars"], function(d3,stars){return(
d3.scaleOrdinal()
    .domain(stars)
    .range(d3.schemeTableau10)
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6")
)});
  const child1 = runtime.module(define1);
  main.import("legend", child1);
  main.import("swatches", child1);
  return main;
}
