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

var clipText = function(svg) {
    svg.selectAll("path").append("clipPath")
            .attr("id", d => "clip-" + d.data.id)
            .append("use")
            .attr("xlink:href", d => "#" + d.data.id);
  
    d3.selectAll(".leaf text")
      .attr("clip-path", d => "url(#clip-" + d.data.id + ")");
}

var createViz = function(){
    console.log("Using D3 v"+d3.version);
    d3.select("body")
      .on("keydown", function(event, d){handleKeyEvent(event);});
    var svgEl = d3.select("#main").append("svg");
    svgEl.attr("width", ctx.w);
    svgEl.attr("height", ctx.h);
    loadData(svgEl);
};

var loadData = function(svgEl){
    // ...
    Promise.all([
        d3.json("custom.geojson"),
        d3.csv("langue.csv"),
        d3.csv("translations.csv")],
        d3.json("ne_50m_admin_0_countries.geojson"))
    .then(function(data){
        console.log(data);
        ctx.map = data[0];
        ctx.langue = data[1];
        createMap(svgEl);
        createWordCloud(svgEl);
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
			var sp2 = d3.schemePastel2;

			
			svg.append('g')
				.attr('class', 'map')
				.data(features)
				.join('path')
				.attr("fill", function(d, i) {
					return ss2[i % 3]
				})
				.attr('d', path)
				.on("mouseover", function(d, i) {
                    // console.log(d);
                    // var myWords = [];
                    // for(var i = 0 ; i < ctx.langue.length; i ++){
                    //     // console.log(ctx.langue[i].PopularWords);
                    //     if(ctx.langue[i].PopularWords.substr(0,4) == d.properties.name.substr(0,4)){
                    //         console.log(ctx.langue[i]);
                    //         myWords = Object.values(ctx.langue[i]);
                    //         myWords.shift();
                    //     }else{
                    //         myWords = Object.values(ctx.langue[i]);
                    //         myWords.shift();
                    //     }
                    // }
                
                    // // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
                    // var layout = d3.layout.cloud()
                    //     .size([450, 450])
                    //     .words(myWords.map(function(d) { return {text: d}; }))
                    //     .padding(10)
                    //     .fontSize(60)
                    //     .on("end", draw);
                    //     layout.start();

                    // d3.select(this)
                    //     .append("g")
                    //     .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
                    //     .selectAll("text")
                    //         .data(myWords)
                    //     .enter().append("text")
                    //     .style("font-size", function(d) { return d.size + "px"; })
                    //     .attr("text-anchor", "middle")
                    //     .attr("transform", function(d) {
                    //     return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                    //     })
                    //     .text(function(d) { return d.text; });
					
				})
				.on("mouseout", function(d, i) {
                    
					// d3.select(this)
					//   .attr("fill", ss2[i % 3]);
				});

       
}

var createWordCloud = function(svg) {
    for(var i = 0 ; i < ctx.langue.length; i ++){
        // List of words
        var myWords = Object.values(ctx.langue[i]);
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

}