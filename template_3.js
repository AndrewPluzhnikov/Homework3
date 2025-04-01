// Prepare you data and load the data again. 
// This data should contains two columns, date (3/1-3/7) and average number of likes. 

const socialMediaTime = d3.csv("socialMediaTime.csv");

socialMediaTime.then(function(data) {
    // Convert string values to numbers
    
    data.forEach(function(d) {
        d.Likes = +d.Likes;
    });

    // Define the dimensions and margins for the SVG
    const width = 1000, height = 1000;
    const margin = {top: 50, bottom: 50, left: 50, right: 50};

    // Create the SVG container
    const svg3 = d3.select("#lineplot")
    .attr("width", width)
    .attr("height", height)
    .attr("margin", margin);
    

    // Set up scales for x and y axes  

    const yScale = d3.scaleLinear()
        .domain([400, d3.max(data, d => d.avg_likes)])
        .range([height - margin.bottom, margin.top]);

    const xScale = d3.scaleBand()
        .domain(["3/1/2024 (Friday)", "3/2/2024 (Saturday)", "3/3/2024 (Sunday)", "3/4/2024 (Monday)", "3/5/2024 (Tuesday)", "3/6/2024 (Wednesday)", "3/7/2024 (Thursday)"])
        .range([margin.left, width - margin.right]);

    

    // Draw the axis, you can rotate the text in the x-axis here

    svg3.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale));

    svg3.append('g')
          .attr('transform', `translate(0,${height - margin.bottom})`)
          .call(d3.axisBottom().scale(xScale));

    // Add x-axis label
    svg3.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("Date");

    // Add y-axis label
    
    svg3.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Like Count");


    // Draw the line and path. Remember to use curveNatural. 

    const line = d3.line() 
    .x(d => xScale(d.Date)) 
    .y(d => yScale(d.avg_likes)) 
    .curve(d3.curveNatural);

    svg3.append("path").datum(data).attr("d", line(data)).attr("stroke", "black").attr("fill", "none");

});
