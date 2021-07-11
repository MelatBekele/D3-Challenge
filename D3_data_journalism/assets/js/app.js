var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(scatter)
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

d3.csv("assets/data/data.csv").then(function(Healthdata){
    console.log(Healthdata);

    // parse data
    Healthdata.forEach(function(Hdata) {
        Hdata.healthcare = +Hdata.healthcare;
        Hdata.poverty = +Hdata.poverty;
        Hdata.smokes = +Hdata.smokes;
        Hdata.age = +Hdata.age;
        //Hdata.state = +Hdata.state;

    });

    // Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([2, d3.max(Healthdata, d => d.healthcare)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(Healthdata, d => d.poverty)])
      .range([height, 0]);


    //  Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);


    // Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);
    


    // Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(Healthdata)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.healthcare))
    .attr("cy", d => yLinearScale(d.poverty))
    .attr("r", "15")
    .attr("fill", "black")
    .attr("opacity", ".4");
  
     //adding state attribute 
    //=======================
    svg.selectAll('text')
    .data(Healthdata)
    .enter()
    .append('text')
    .attr('x', d => xLinearScale(d.healthcare)+87)
    .attr('y', d => yLinearScale(d.poverty)+25)
    .text(d=>d.abbr);
      
    // Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Health Care: ${d.healthcare}<br>Poverty: ${d.poverty}`);
      });

    // Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);



    // Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    console.log(Healthdata);

  // Create axes labels Poverty/ healthcare
  chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 40)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .attr("class", "axisText")
  .text("Lacks Health Care (%)");

  chartGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
  .attr("class", "axisText")
  .text("Poverty (%)");

});
    
