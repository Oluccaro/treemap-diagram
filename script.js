const projectName = "tree-map Diagram";

//Data URL
let dataInfo={
  'kick': {
    'url':"https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json",
    'title': "Kickstarter Pledge",
    'description': "Top 100 Most Pledged Kickstarter Campaigns Grouped by Category"
  },
  'movies': {
    'url': "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json",
    'title': "Movie Sales",
    'description': "Top 100 Highest Grossing Movies Grouped By Genre"
  },
  'games': {
    'url':"https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json",
    'title': "Video Game Sales",
    'description': "Top 100 Most Sold Video Games Grouped by Platform"
  }
}
let currentURL = dataInfo.movies.url;
let currentTitle = dataInfo.movies.title;
let currentDescription = dataInfo.movies.description;

//Array of colors to use in the project
let colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
		  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
		  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
		  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
		  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
		  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
		  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
		  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
		  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
		  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];
//size of svg elements

let w = 1200;
let h = 680;
let p = 20;

//Creating svg elements

let canvas = d3.select("#tree-map")
    .append("svg")
    .attr("height",h)
    .attr("width", w)
    .attr("id", "canvas");

// tooltip element

let tooltip = d3.select("#tree-map").append("div")
                      .attr("class", "tooltip-class")
                      .attr("id", "tooltip")
                      .style("opacity", 0)

//legend Element

let legend = d3.select("#legend")
  .attr("width",1000)


/*+--------------------------------------------------------------+
|                       FUNCTIONS                                |
+----------------------------------------------------------------+

*/
// This will fetch the data as soon as the the document load;

async function getData(url) {
  let response = await fetch(url);
  let data = await response.json();
  return data;
}

function setData(option) {
  switch (option) {
    case 'movies':
      currentURL = dataInfo.movies.url;
      currentTitle = dataInfo.movies.title;
      currentDescription = dataInfo.movies.description;
      break;
    case 'kick':
      currentURL = dataInfo.kick.url;
      currentTitle = dataInfo.kick.title;
      currentDescription = dataInfo.kick.description;
      break;
    case 'games':
      currentURL = dataInfo.games.url;
      currentTitle = dataInfo.games.title;
      currentDescription = dataInfo.games.description;
    default:
      break;
  }
  main();
}
//-----------------------------------------------------------------------


async function main() {
    
    //Creating title and description
    const title = document.getElementById("title");
    const description = document.getElementById("description");
    
    title.innerHTML = currentTitle;
    description.innerHTML = currentDescription;

    //fecthing data and converting to an array


    let data = await getData(currentURL);
    const root = d3.hierarchy(data).sum((d)=>{ return d.value});
    //d3.treemap computes the position of each element
    
    d3.treemap()
    .size([w,h])
    .padding(2)(root)

    //Now adding the rectangles
    //creating variables to keep track of the current parent and index of array
    let i=-1;
    let parent1 = ""
    canvas.selectAll("rect")
    .data(root.leaves())
    .join("rect")
      .attr("class","tile")
      .attr("data-name",(d)=>d.data.name)
      .attr("data-category", (d)=>d.data.category)
      .attr("data-value",(d)=>d.data.value)
      .attr("x",(d)=>d.x0)
      .attr("y",(d)=>d.y0)
      .attr("width", (d)=>d.x1-d.x0)
      .attr("height",(d)=>d.y1-d.y0)
      .style("stroke","white")
      .style("fill",(d)=>{
        let parent2 = d.data.category;
        if(parent1!=parent2){
          i+=1;
        }
        parent1=parent2;
        return colorArray[i];
      })
      .on("mouseover", (event,d)=>{
        tooltip.attr("data-value", d.data.value);
        tooltip.style("left", event.pageX +15+ "px")
        .style("top", event.pageY+ "px");
        tooltip.transition()
        .duration(200)
        .style("opacity", 0.9)
        .style("background-color","black")
        .style("color", "white")
        tooltip.html("<p> Name: " + d.data.name + "<br>"
          + "Category: " + d.data.category + "<br>" 
          + "Value: " + d.data.value +
           "</p>")
    })
      .on("mouseout", ()=>{
      tooltip.transition()
      .duration(200)
      .style("opacity",0)
    })

    //Creating the legend elements
    
    legend.selectAll("rect")
          .data((d)=>root.data.children)
          .join("rect")
          .attr("x",(d,i)=> 50*(i+1))
          .attr("y", (d,i)=> 50)
          .attr("height", 49)
          .attr("width", 49)
          .attr("color", (d,i)=>{
            return colorArray[i]
          })
          .attr("class","legend-item")
          .style("fill", (d,i)=>{
            return colorArray[i]
          })
          .on("mouseover", (event,d)=>{
            element = event.target || event.currentTarget;
            color = element.getAttribute("color");
            tooltip.style("left", event.pageX + "px")
            .style("top", event.pageY+ 50+"px");
            tooltip.attr("width", 100)
            .attr("height", 50)
            .attr("font-size", "30px");
            tooltip.transition()
            .duration(200)
            .style("opacity", 1)
            .style("background-color",color)
            .style("color", "black")
            .style("width","200px")

            tooltip.html("<p>"+d.name+
               "</p>")
        })
          .on("mouseout", ()=>{
          tooltip.transition()
          .duration(200)
          .style("opacity",0)
        })
}
main();