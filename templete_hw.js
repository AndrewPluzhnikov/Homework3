// Load the data
const socialMedia = d3.csv("socialMedia.csv");

// Once the data is loaded, proceed with plotting
socialMedia.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
        d.Likes = +d.Likes;
    });

    // Define the dimensions and margins for the SVG
    const width = 1000, height = 1000;
    const margin = {top: 50, bottom: 50, left: 50, right: 50};

    // Create the SVG container
    const svg1 = d3.select("#boxplot")
    .attr("width", width)
    .attr("height", height)
    .attr("margin", margin);

    // Set up scales for x and y axes
    // You can use the range 0 to 1000 for the number of Likes, or if you want, you can use
    // d3.min(data, d => d.Likes) to achieve the min value and 
    // d3.max(data, d => d.Likes) to achieve the max value
    // For the domain of the xscale, you can list all four platforms or use
    // [...new Set(data.map(d => d.Platform))] to achieve a unique list of the platform
    
    const yScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.Likes), d3.max(data, d => d.Likes)])
        .range([height - margin.bottom, margin.top]);

    const xScale = d3.scaleBand()
        .domain(["LinkedIn", "Facebook", "Twitter", "Instagram"])
        .range([margin.left, width - margin.right]);


    // Add scales     

    svg1.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale));

    svg1.append('g')
          .attr('transform', `translate(0,${height - margin.bottom})`)
          .call(d3.axisBottom().scale(xScale));

    // Add x-axis label
    
    svg1.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("Platform");

    // Add y-axis label
    
    svg1.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Like Count");

    const rollupFunction = function(groupData) {
        const values = groupData.map(d => d.Likes).sort(d3.ascending); //this aggregates the data by summing the like counts and sorting it by ascending values
        const min = d3.min(values); 
        const q1 = d3.quantile(values, 0.25);
        const med = d3.quantile(values, 0.5);
        const q3 = d3.quantile(values, 0.75);
        const max = d3.max(values);
        const iqr = q3 - q1;
        return {min, q1, med, q3, max, iqr};
    };

    const quantilesByGroups = d3.rollup(data, rollupFunction, d => d.Platform);

    quantilesByGroups.forEach((quantiles, Platform) => {
        const x = xScale(Platform);
        const boxWidth = xScale.bandwidth(); //these lines of code compute the x position and box sizes for each platform while also taking the quartile values in

        // Draw vertical lines
        //const line = d3.line((d) => x(quantiles.min), (d) => y(quantiles.max));

        const valuey1 = quantiles.q1 - 1.5 * quantiles.iqr;
        const valuey2 = quantiles.q3 + 1.5 * quantiles.iqr;

        const normalizey1 = (valuey1 - quantiles.min) / (quantiles.max - quantiles.min) * 1000
        const normalizey2 = (valuey2 - quantiles.min) / (quantiles.max - quantiles.min) * 1000

        svg1.append("line").style("stroke", "black").attr("x1", x + boxWidth/2).attr("y1", quantiles.min + margin.bottom)
        .attr("x2",  x + boxWidth/2).attr("y2", quantiles.max - margin.top);

        // Draw box
        
        svg1.append("rect").attr("stroke", "black").attr("fill", "white").attr("x", x).attr("y", quantiles.q1).attr("width", boxWidth).attr("height", quantiles.q3 - quantiles.q1);

        // Draw median line
        svg1.append("line").style("stroke", "black").attr("x1", x).attr("y1", quantiles.med).attr("x2", x + boxWidth).attr("y2", quantiles.med)
        
    });
});

// Prepare you data and load the data again. 
// This data should contains three columns, platform, post type and average number of likes. 
// const socialMediaAvg = d3.csv("socialMediaAverages.csv");

// socialMediaAvg.then(function(data) {
//     // Convert string values to numbers

//     data.forEach(function(d) {
//       d.Likes = +d.Likes;
//   });

//     // Define the dimensions and margins for the SVG
//     const width = 1000, height = 1000;
//     const margin = {top: 50, bottom: 50, left: 50, right: 50};

//     // Create the SVG container
//     const svg2 = d3.select("#barplot")
//     .attr("width", width)
//     .attr("height", height)
//     .attr("margin", margin);
//     //.attr('transform', `translate(0,${height})`);

//     // Define four scales
//     // Scale x0 is for the platform, which divide the whole scale into 4 parts
//     // Scale x1 is for the post type, which divide each bandwidth of the previous x0 scale into three part for each post type
//     // Recommend to add more spaces for the y scale for the legend
//     // Also need a color scale for the post type

//     const x0 = d3.scaleBand()
//     .domain(["LinkedIn", "Facebook", "Twitter", "Instagram"])
//     .range([margin.left, width - margin.right]);
      

//     const x1 = d3.scaleBand().domain(["Image", "Link", "Video"])
//     .range([0, d3.bandwidth]);
      

//     const y = d3.scaleLinear()
//     .domain([d3.min(data, d => d.avg_likes), d3.max(data, d => d.avg_likes)])
//     .range([height - margin.bottom, margin.top]);
      

//     const color = d3.scaleOrdinal()
//       .domain([...new Set(data.map(d => d.PostType))])
//       .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);    
         
//     // Add scales x0 and y     
//     svg2.append('g')
//         .attr('transform', `translate(${margin.left},0)`)
//         .call(d3.axisLeft().scale(y));

//     svg2.append('g')
//           .attr('transform', `translate(0,${height - margin.bottom})`)
//           .call(d3.axisBottom().scale(x0));

//     // Add x-axis label
//     svg2.append("text")
//     .attr("class", "x label")
//     .attr("text-anchor", "end")
//     .attr("x", width)
//     .attr("y", height - 6)
//     .text("Like count");

//     // Add y-axis label
    
//     svg2.append("text")
//     .attr("class", "y label")
//     .attr("text-anchor", "end")
//     .attr("y", 6)
//     .attr("dy", ".75em")
//     .attr("transform", "rotate(-90)")
//     .text("Platform");

//   // Group container for bars
//     const barGroups = svg.selectAll("bar")
//       .data(data)
//       .enter()
//       .append("g")
//       .attr("transform", d => `translate(${x0(d.Platform)},0)`);

//   // Draw bars
//     barGroups.append("rect")
      

//     // Add the legend
//     const legend = svg.append("g")
//       .attr("transform", `translate(${width - 150}, ${margin.top})`);

//     const types = [...new Set(data.map(d => d.PostType))];
 
//     types.forEach((type, i) => {

//     // Alread have the text information for the legend. 
//     // Now add a small square/rect bar next to the text with different color.
//       legend.append("text")
//           .attr("x", 20)
//           .attr("y", i * 20 + 12)
//           .text(type)
//           .attr("alignment-baseline", "middle");
//   });

// });

// Prepare you data and load the data again. 
// This data should contains two columns, date (3/1-3/7) and average number of likes. 

//const socialMediaTime = d3.csv("socialMediaTime.csv");

socialMediaTime.then(function(data) {
    // Convert string values to numbers
    

    // Define the dimensions and margins for the SVG
    

    // Create the SVG container
    

    // Set up scales for x and y axes  


    // Draw the axis, you can rotate the text in the x-axis here


    // Add x-axis label
    

    // Add y-axis label


    // Draw the line and path. Remember to use curveNatural. 

});
