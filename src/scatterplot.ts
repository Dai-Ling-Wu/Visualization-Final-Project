import * as d3 from "d3";
import { Int32, Table, Utf8 } from "apache-arrow";
import { db } from "./duckdb";
// import parquet from "./airquality.parquet?url";
import { arrowToSQLField } from "@duckdb/duckdb-wasm/dist/types/src/json_typedef";
// Load a Parquet file and register it with DuckDB. We could request the data from a URL instead.
// const res = await fetch(parquet);
// await db.registerFileBuffer(
//   "airquality.parquet",
//   new Uint8Array(await res.arrayBuffer())
// );

// // Query DuckDB for the locations.
// const conn = await db.connect();




export function scatterplot(){
    const margin = { top: 30, right: 30, bottom: 30, left: 50 };
    const width = document.body.clientWidth;
    const height = 300;
    const appint_time = [
        '08:00AM','08:10AM','08:20AM','08:30AM','08:40AM','08:50AM',
        '09:00AM','09:10AM','09:20AM','09:30AM','09:40AM','09:50AM',
        '10:00AM','10:10AM','10:20AM','10:30AM','10:40AM','10:50AM',
        '11:00AM','11:10AM','11:20AM','11:30AM','11:40AM','11:50AM',
        '12:00PM','12:10PM','12:20PM','12:30PM','12:40PM','12:50PM',
        '01:00PM','01:10PM','01:20PM','01:30PM','01:40PM','01:50PM',
    ]
   
    const xRange = [0, width - margin.right];
    const yRange = [height - margin.bottom-20,margin.top];
    const xScale = d3.scaleBand().range(xRange).domain(appint_time);
    const yScale = d3.scaleLinear().range(yRange).domain([0,100]);
    

    const xAxis = d3.axisBottom(xScale).ticks(width / 10);
    const yAxis = d3.axisLeft(yScale).tickSizeOuter(height / 50);
    const xasispos = 2*height - margin.bottom-30
    
    
    
    
    const svg = d3
        .create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, height, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");


    // Add the y axis
    svg
        .append("g")
        .attr("class", "yaxis_scatter")
        .attr("transform", `translate(${margin.left},${height-10})`)
        .call(yAxis)

        ;

    // Add the x axis
    const xais = svg
        .append("g")
        .attr("class", "xaxis_scatter")
        .attr("transform", `translate(${margin.left},${xasispos})`) 
        .call(xAxis)
        .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");


   
    const scatter = svg 
        .append("g")
        .attr("class","scatter")
        .attr("transform", `translate(${margin.left},${height})`)
   
    const legend = svg
        .append("g")
        .attr("class","legend")
        .attr("transform",`translate(${width-margin.right/2},${height*3/2})`)

   

    svg
        .append("text")
        .text("appointment time")
        .attr("transform", `translate(${width/2},${xasispos+60})`)
        .style("font-size","10px")
    svg
        .append("text")
        .text("wait time (minutes)")
        .attr("transform", `translate(${margin.left/2},${height*3/2}) rotate(-90)`)
        .style("font-size","10px")
    
    svg 
        .append("circle")
        .attr("class","enter_clinic_time")
    
    async function getdata(){
        const data =  await d3.csv("/pplinclinc.csv",(d) => {
            return {
              patientid: d.PatientMRN,
              appoint: d.Appt_Time,
              pplinclinc: d.pplinclinic,
              waittime:d.Wait_Time,
              early_late : d.early_late,
              enter_clinic_time:d.enter_clinic_time
            }}
          )
          const patientid =  data.map(function(d) { return d.patientid })
          const appoint = data.map(function(d) { return d.appoint })
          const pplinclinc =  data.map(function(d) { return d.pplinclinc })
          const waittime =  data.map(function(d) { return d.waittime })
          const enter_clinic_time =  data.map(function(d) { return d.enter_clinic_time})
          const early_late =  data.map(function(d) { return d.early_late })

        const x_axis_appointment =   d3.csv("/appointment_time.csv",(d) => {
            return {
              time: d.time,
              
            }}
          )
        const time = x_axis_appointment.then(function(d) { return d.time })
        
       
        
        const legend_lebal = ['E','L']
        const legend_map = {'E':'Early','L':'Late'}

        const color = d3.scaleOrdinal()
            .domain(legend_lebal)
            .range(d3.schemeTableau10)

        const circlesize = d3.scaleLinear()
            .domain(d3.extent(pplinclinc))
            .range([2,8])

        

        const dt = d3.range(appoint.length)
       
        
        scatter    
            .selectAll("circle")
            .data(dt)
            .join("circle")
                .attr('opacity', 0.75)
                .attr("cx",i => xScale(appoint[i]))
                .attr("cy",i => yScale(waittime[i]))
                .attr("fill",i => color(early_late[i]))
                .attr("r",i => circlesize(pplinclinc[i]))
                .on("mouseover",function(event,d){onmouseover(d)} )
                .on("mouseleave",function(event,d){onmouseleave(d)})
    
        
        
        function onmouseover(d){
            if (xScale(appoint[d])<=width-80){
                scatter
                    .append("text")
                    .attr("class","tooltip")
                    .attr("x", xScale(appoint[d])+8)		
                    .attr("y", yScale(waittime[d]))
                    .text(`number of patient in clinic:${pplinclinc[d]}`)
                    .style("opacity",1)
                    .attr("font-size",12)
                scatter
                    .append("text")
                    .attr("class","tooltip")
                    .attr("x", xScale(appoint[d])+8)		
                    .attr("y", yScale(waittime[d]))
                    // .attr("dx",12)
                    .attr("dy",12)
                    .text(`appintment time:${appoint[d]}`)
                    .style("opacity",1)
                    .attr("font-size",12)
               
                scatter
                    .selectAll(".enter_clinic_time")
                    .data(dt)
                    .join(".enter_clinic_time")
                        .attr('opacity', 0.5)
                        .attr("cx",i => xScale(enter_clinic_time[i]))
                        .attr("cy",i => yScale(waittime[i]))
                        .attr("fill",i => color(early_late[i]))
                        .attr("r",i => circlesize(pplinclinc[i]))
                        
            }else{
                scatter
                    .append("text")
                    .attr("class","tooltip")
                    .attr("x", xScale(appoint[d])-40)		
                    .attr("y", yScale(waittime[d]))
                    .text(`number of patient in clinic:${pplinclinc[d]}`)
                    .style("opacity",1)
                    .attr("font-size",12)
                scatter
                    .append("text")
                    .attr("class","tooltip")
                    .attr("x", xScale(appoint[d])-40)		
                    .attr("y", yScale(waittime[d]))
                    // .attr("dx",12)
                    .attr("dy",12)
                    .text(`appintment time:${appoint[d]}`)
                    .style("opacity",1)
                    .attr("font-size",12)
                
                scatter
                    .selectAll(".enter_clinic_time")
                    .data(dt)
                    .join(".enter_clinic_time")
                        .attr('opacity', 0.5)
                        .attr("cx",i => xScale(enter_clinic_time[i]))
                        .attr("cy",i => yScale(waittime[i]))
                        .attr("fill",i => color(early_late[i]))
                        .attr("r",i => circlesize(pplinclinc[i]))
            }
    }   
    console.log(xScale(enter_clinic_time[1]))
    function onmouseleave(d){
       scatter
        .selectAll(".tooltip")
        .style("opacity",0)
    }
       
    const legend_size = [0,2,6,8,10]
    
        
         // legend for circle size 
         svg
            .append("text")
            .text("Number of patient")
            .attr("x",`${width-margin.right-80}`)
            .attr("y",height + 8 )
            .style("font-size","10px")
            .attr("fill","grey")
     
        svg
            .append("text")
            .attr("x",`${width-margin.right-30}`)
            .attr("y",height + 10 )
            .text("in clinic")
            .style("font-size","10px")
            .attr("fill","grey")
            .attr("dy",10)

       
        svg
            .selectAll("legendcircle")
            .data(dt)
            .enter()
                .append("circle")
                .attr("cx",`${width-margin.right-15}`)
                .attr("cy",i =>  height + 20+i*20)
                .attr("r",i=>circlesize(legend_size[i]))
                .attr("fill","grey")

        svg
                .selectAll("mylegendlebal")
                .data(dt)
                .enter()
                    .append("text")
                    .text( i=>legend_size[i])
                    .attr("x",`${width-margin.right-2}`)
                    .attr("y",i =>  height + 23 + i*20)
                    .style("font-size","10px")
                    .attr("fill","grey")

        // legend for circle color 
        
        svg
            .append("text")
            .attr("x",`${width-margin.right-80}`)
            .attr("y",height + 120 )
            .text("Arrived early or late")
            .style("font-size","10px")
            .attr("fill","grey")
            .attr("dy",10)

        svg
            .selectAll("mylegendcircle")
            
            .data(d3.range(2))
            .enter()
                .append("circle")
                .attr("cx",`${width-margin.right-10}`)
                .attr("cy",i =>  height +140 + i*12)
                .attr("r","5px")
                .attr("fill",i=>color(legend_lebal[i]))
        
        
        svg
            .selectAll("mylegendlebal")
            .data(d3.range(2))
            .enter()
                .append("text")
                .text( i=>legend_map[legend_lebal[i]])
                .attr("x",`${width-margin.right}`)
                .attr("y",i =>  height + 142+ i*12)
                .style("font-size","10px")
                .attr("fill",i=>color(legend_lebal[i]))
    
       
        
            

        
        return svg.node()
        ;

    }
    
    svg.select<SVGSVGElement>(".xaxis_scatter").call(xAxis);    
    svg.select<SVGSVGElement>(".yaxis_scatter").call(yAxis);  
    
    return {
        element: svg.node()!,
        getdata
        };

}