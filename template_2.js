// Prepare you data and load the data again. 
// This data should contains three columns, platform, post type and average number of likes. 
const socialMediaAvg = d3.csv("socialMediaAverages.csv");

socialMediaAvg.then(function(data) {
    // Convert string values to numbers

    data.forEach(function(d) {
      d.Likes = +d.Likes;
  });

    // Define the dimensions and margins for the SVG
    const width = 1000, height = 1000;
    const margin = {top: 50, bottom: 50, left: 50, right: 50};

    // Create the SVG container
    const svg2 = d3.select("#barplot")
    .attr("width", width)
    .attr("height", height)
    .attr("margin", margin);
    //.attr('transform', `translate(0,${height})`);

    // Define four scales
    // Scale x0 is for the platform, which divide the whole scale into 4 parts
    // Scale x1 is for the post type, which divide each bandwidth of the previous x0 scale into three part for each post type
    // Recommend to add more spaces for the y scale for the legend
    // Also need a color scale for the post type

    const x0 = d3.scaleBand()
    .domain(["LinkedIn", "Facebook", "Twitter", "Instagram"])
    .range([margin.left, width - margin.right]);
      

    const x1 = d3.scaleBand().domain(["Image", "Link", "Video"])
    .range([margin.left, (width - margin.right)/4]);
      

    const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.avg_likes)])
    .range([height - margin.bottom, margin.top]);
      

    const color = d3.scaleOrdinal()
      .domain([...new Set(data.map(d => d.PostType))])
      .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);    
         
    // Add scales x0 and y     
    svg2.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(y));

    svg2.append('g')
          .attr('transform', `translate(0,${height - margin.bottom})`)
          .call(d3.axisBottom().scale(x0));

    // Add x-axis label
    svg2.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("Platform");

    // Add y-axis label
    
    svg2.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Like Count");

  // Group container for bars
    const barGroups = svg2.selectAll("bar")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", d => `translate(${x0(d.Platform)},0)`);

  // Draw bars
    //barGroups.append("rect").attr("stroke", "black").attr("fill", color(d.PostType)).attr("x", x0(d.Platform)).attr("y", 0).attr("width", x1(d.PostType)).attr("height", d3.max(data, d => d.avg_likes));
      
    barGroups.append("rect").attr("stroke", "black").attr("fill", d => color(d.PostType)).attr("x", d => (x1(d.PostType)) - margin.left / 2).attr("y", d =>  y(d.avg_likes)).attr("width", 50).attr("height", d=> height - y(d.avg_likes) - margin.bottom);
      

    // Add the legend
    const legend = svg2.append("g")
      .attr("transform", `translate(${width - 150}, ${margin.top})`);

    const types = [...new Set(data.map(d => d.PostType))];
 
    types.forEach((type, i) => {

    // Alread have the text information for the legend. 
    // Now add a small square/rect bar next to the text with different color.
      legend.append("text")
          .attr("x", 20)
          .attr("y", i * 20 + 12)
          .text(type)
          .attr("alignment-baseline", "middle");

      legend.append("rect").attr("x", 7).attr("y", i * 20 + 6).attr("stroke", "black").attr("fill", color(type)).attr("width", 10).attr("height", 10)
  });

});
