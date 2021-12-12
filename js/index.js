var ctx = {
    w: 1600,
    h: 800,
    mapMode: false,
    MIN_COUNT: 3000,
    ANIM_DURATION: 600, // ms
    NODE_SIZE_NL: 5,
    NODE_SIZE_MAP: 3,
    LINK_ALPHA: 0.2,
    map: [],
    langue: [],
};

var clipCloud = function(svg) {
    d3.selectAll("#map path").append("clipPath")
            .attr("id", (d, i) => "clip-" + d.properties.name)
            .append("use")
            .attr("xlink:href", (d, i) => "#" + d.properties.name);
  
    d3.selectAll("#map text")
      .attr("clip-path", (d, i) => "url(#clip-" + d.properties.name + ")");
}


var createViz = function(){
    console.log("Using D3 v"+d3.version);
    var svgEl = d3.select("#main").append("svg");
    svgEl.attr("width", ctx.w);
    svgEl.attr("height", ctx.h);
    svgEl.attr("id", "map")
    loadData(svgEl);
};

var loadData = function(svgEl){
    // ...
    Promise.all([
        d3.json("custom.geojson"),
        d3.csv("langue.csv"),
    ])
    .then(function(data){
        console.log(data);
        ctx.map = data[0];
        ctx.langue = data[1];
        createMap(svgEl);
        // createWordCloud(svgEl);
        // clipImage();
        tmp();
    })
};

var createMap = function(svg) {
    var projection = d3.geoMercator()
				.center([0, 0])
				.scale(200)
				.translate([ctx.w / 2, ctx.h / 2]);

    var path = d3.geoPath().projection(projection);

    var features = ctx.map.features;

    var ss2 = d3.schemeSet2;

    svg.selectAll('#map').append('g')
        .attr('class', 'map')
        .data(features)
        .join('path')
        .attr("fill", function(d, i) {
            return ss2[i % 3]
        })
        .attr('d', path)
        .attr('id', (d) => d.properties.name);
       
    clipCloud();
    // createANDclipWC();
   
    
}

var createANDclipWC = function(){
    var myWords = Object.values(ctx.langue[14]);
        myWords.shift();
        
        // set the dimensions and margins of the graph
        var margin = {top: 10, right: 10, bottom: 10, left: 10},
            width = 1600 - margin.left - margin.right,
            height = 800 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#main").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("class","wordcloud");

        // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
        var layout = d3.layout.cloud()
                        .size([width, height])
                        .words(myWords.map(function(d) { return {text: d}; }))
                        .padding(10)
                        .fontSize(60)
                        .on("end", draw);
                        layout.start();

        // This function takes the output of 'layout' above and draw the words
        // Better not to touch it. To change parameters, play with the 'layout' variable above
        function draw(words) {
            svg
                .append("g")
                .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", function(d) { return d.size + "px"; })
                .attr("text-anchor", "middle")
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function(d) { return d.text; });
        }


    d3.selectAll(".wordcloud g")
        .attr("clip-path", (d, i) => "url(#clip-China");

}


var createWordCloud = function(n) {
    for(var i = 0 ; i < 10; i ++){
        // List of words
        var myWords = Object.values(ctx.langue[n]);
        myWords.shift();
        
        // set the dimensions and margins of the graph
        var margin = {top: 10, right: 10, bottom: 10, left: 10},
            width = 450 - margin.left - margin.right,
            height = 450 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#main").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
        var layout = d3.layout.cloud()
                        .size([width, height])
                        .words(myWords.map(function(d) { return {text: d}; }))
                        .padding(10)
                        .fontSize(60)
                        .on("end", draw);
                        layout.start();

        // This function takes the output of 'layout' above and draw the words
        // Better not to touch it. To change parameters, play with the 'layout' variable above
        function draw(words) {
            svg
                .append("g")
                .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
                .selectAll("text")
                    .data(words)
                .enter().append("text")
                    .style("font-size", function(d) { return d.size + "px"; })
                    .attr("text-anchor", "middle")
                    .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                    })
                    .text(function(d) { return d.text; });
        }
    }

    clipCloud(svg);

}


var clipImage = function(){
    const margin = { top: 10, right: 30, bottom: 30, left: 30 }
    const width = 1600 - margin.left - margin.right
    const height = 800 - margin.top - margin.bottom
    // have a radius for clipping mask
    let radius = 100

    const svg = d3.select('.wc').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

    const defs = svg.append('defs')
    // define the clipPath
    defs.append('clipPath')  // define a clip path
        .attr('id', 'circle-clip') // give the clipPath an ID
        .append("use")
        .attr("xlink:href", "#China")
        .attr('x',function(d,i){
            // get x coord
            console.log(this.getBBox().x)
        })
        .attr('y',function(d,i){
            // get y coord
            console.log(this.getBBox().y)
        })
        .attr('dx',function(d,i){
            // get dx coord
            console.log(parseInt(d3.select(this).attr('dx')))
        })
        // .attr("transform", "translate(-" + this.getBBox().x +", -" + this.getBBox().y + ")");

    d3.select('.wc')
        .attr('clip-path', 'url(#circle-clip)');


}

var tmp = function(){
    const svg = d3.select('#main').append('svg')
                .attr("width", 1600)
                .attr("height", 800)
                .style("background-color", "green")
                .attr('clip-path', 'url(#circle-clip)');

    // define the clipPath
    let x, y, dx, dy;

    const defs =  svg.append('defs')
                    .append('clipPath')  
                    .attr('id', 'circle-clip') 
                    .append("use")
                    .attr("xlink:href", "#China")
                    .attr('x',function(d,i){
                        // get x coord
                        x = this.getBBox().x;
                        y = this.getBBox().y;
                        dx = this.getBBox().width;
                        dy = this.getBBox().height;
                    });

    
    // List of words
    var myWords = Object.values(ctx.langue[14]);
    myWords.shift();

    const wc = svg.append('g')
        .attr("transform", "translate(" + x + "," + y + ")")
        .append('svg')
        .attr("width", dx)
        .attr("height", dy);
                

    // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
    var layout = d3.layout.cloud()
                    .size([dx, dy])
                    .words(myWords.map(function(d) { return {text: d}; }))
                    .padding(1)
                    .fontSize(10)
                    .on("end", draw);
                    layout.start();

    // This function takes the output of 'layout' above and draw the words
    // Better not to touch it. To change parameters, play with the 'layout' variable above
    function draw(words) {
        wc.append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
                .data(words)
            .enter().append("text")
                .style("font-size", function(d) { return d.size + "px"; })
                .attr("text-anchor", "middle")
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function(d) { return d.text; });
    }
}