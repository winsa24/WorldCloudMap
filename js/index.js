var ctx = {
    w: 1600,
    h: 800,
    mapMode: false,
    map: [],
    langue: [],
};

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
        d3.json("data/custom.geojson"),
        d3.csv("data/langue.csv"),
        d3.csv("data/language-location-family.csv"),
    ])
    .then(function(data){
        console.log(data);
        let popwords = [];
        for(var i = 0; i < data[2].length; i ++){
            for(var j = 0; j < data[1].length; j ++){
                if(data[2][i].Name == data[1][j].PopularWords){
                    let tmp = {};
                    tmp.language_name = data[1][j].PopularWords;
                    delete data[1][j].PopularWords;
                    tmp.PopularWords = data[1][j];
                    tmp.country_code = data[2][i].countrycodes; 
                    popwords.push(tmp);
                }
            }
        }

        ctx.map = data[0]
        for(var i = 0; i < data[0].features.length; i ++){
            for(var j = 0; j < popwords.length; j ++){
                if(data[0].features[i].properties.iso_a2 == popwords[j].country_code){
                    ctx.map.features[i].properties.PopularWords = popwords[j].PopularWords;
                    ctx.map.features[i].properties.language_name = popwords[j].language_name;
                }
            }
        }
        ctx.langue = popwords;

        createMap(svgEl);
        // allWordCloudMap();
        // drawChina();
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
    var sp2 = d3.schemeCategory10;

    svg.selectAll('#map').append('g')
        .attr('class', 'map')
        .data(features)
        .join('path')
        .attr("fill", function(d, i) {
            return ss2[i % 3]
        })
        .attr('d', path)
        .attr('id', (d) => d.properties.iso_a2)
        .on("mouseover", function(d, i) {
            if(i.properties.PopularWords){
                console.log(i.properties.PopularWords);
                drawOneWC(i.properties)
            }
            
        })
        .on("mouseout", function(d, i) {
            d3.select(this)
              .attr("fill", (d,i) => ss2[i % 3]);

            // d3.select('#mydraw').remove();
        });

}

var drawOneWC = function(p){    
    
    const svg = d3.select('#main').append('svg')
                .attr("id", "mydraw")
                .attr("width", 1600)
                .attr("height", 800)
                .style("background-color", "red")
                .attr('clip-path', 'url(#clip-'+ p.iso_a2 + ')');

     // define the clipPath
     let x, y, dx, dy;

     const defs =  svg.append('defs')
             .append('clipPath')  
             .attr('id', 'clip-'+ p.iso_a2) 
             .append("use")
             .attr("xlink:href", "#" + p.iso_a2)
             .attr('x',function(d,i){
                 // get x coord
                 x = this.getBBox().x;
                 y = this.getBBox().y;
                 dx = this.getBBox().width;
                 dy = this.getBBox().height;
             });
    if(p.iso_a2 == "RU"){
        console.log(x,y,dx,dy);
    }
    // List of words
    var myWords = Object.values(p.PopularWords);

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
            .fontSize(5)
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

var allWordCloudMap = function() {
    const wcBasedSVG = d3.select('#main').append('svg')
                        .attr("width", 1600)
                        .attr("height", 800)
                        .style("background-color", "green")
                        .attr("id", "wcBasedSVG");


    const clipPath =  wcBasedSVG.append('defs')
                    .append('clipPath') 
                    .attr('id', 'circle-clip'); 

    for(var i = 0 ; i < ctx.langue.length; i ++){
        // define the clipPath
        let x, y, dx, dy;
 
        clipPath.append("use")
                .attr("xlink:href", "#" + ctx.langue[i].country_code)
                .attr('x',function(d,i){
                    // get x coord
                    x = this.getBBox().x;
                    y = this.getBBox().y;
                    dx = this.getBBox().width;
                    dy = this.getBBox().height;
                });

        // List of words
        var myWords = Object.values(ctx.langue[i].PopularWords);

        const wc = wcBasedSVG.append('g')
                .attr("transform", "translate(" + x + "," + y + ")")
                .append('svg')
                .attr("width", dx)
                .attr("height", dy);
                

        // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
        var layout = d3.layout.cloud()
                        .size([dx, dy])
                        .words(myWords.map(function(d) { return {text: d}; }))
                        .padding(1)
                        .fontSize(5)
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
    wcBasedSVG.attr('clip-path', 'url(#circle-clip)');
}


//draw china
var drawChina = function(){
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