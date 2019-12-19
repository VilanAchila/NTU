function DrawTree(location, source, config){
  var svg = d3.select(location);
  svg.selectAll("*").remove();

  function displayTextWidth(text1, text2, font) {
    let contextString = "2d";
    var myCanvas1  = displayTextWidth.canvas || (displayTextWidth.canvas = document.createElement("canvas"))
    , myCanvas2 = displayTextWidth.canvas || (displayTextWidth.canvas = document.createElement("canvas"));

    var context1 = myCanvas1.getContext(contextString)
    ,context2 = myCanvas2.getContext(contextString);

    context1.font = font,
    context2.font = font;

    var metrics1 = context1.measureText(text1)
    ,metrics2 = context2.measureText(text2);

    return metrics1.width+metrics2.width;
  };

  // ************** Generate the tree diagram	 *****************
  var margin = {top: 20, right: 120, bottom: 20, left: 150},
    width = 1200 - margin.right - margin.left,
    height = (1250/29)*source.children.length - margin.top - margin.bottom;

var i = 0,
    duration = 750,
    root;
var tree = d3.layout.tree()
    .size([height, width]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var svg = d3.select(location).append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

root = source;
root.x0 = height / 2;
root.y0 = 0;

  update(root);
  d3.select(self.frameElement).style("height", "500px");

  function update(source) {
    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);
    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 300; });
    // Update the nodes…
    var node = svg.selectAll("g.node")
        .data(nodes, function(d) { return d.id || (d.id = ++i); });
    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
        .on("click", click);
    //nodeEnter.append("circle")


    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
    nodeUpdate.select("circle")
    //nodeUpdate.select("rect")
        .attr("r", 10)
        .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
    nodeUpdate.select("text")
        .style("fill-opacity", 1);
    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
        .remove();
    nodeExit.select("circle")
    //nodeExit.select("rect")
        .attr("r", 1e-6);
    nodeExit.select("text")
        .style("fill-opacity", 1e-6);
    // Update the links…
    var link = svg.selectAll("path.link")
        .data(links, function(d) { return d.target.id; });
    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function(d) {
          var o = {x: source.x0, y: source.y0};
        //var o = {x: (source.x0 + 100), y: (source.y0 + 100)};
          return diagonal({source: o, target: o});
        })
      .style("fill", function(d) { return "none"; })
        .style("stroke", function(d) { return "#ccc"; })
        .style("stroke-width", function(d) { return "2px"; });;
    // Transition links to their new position.
    link.transition()
        .duration(duration)
        .attr("d", function(d){
          var s = {
            x: d.source.x,
            y: d.source.y
          }, t = {
            x: d.target.x,
            y: d.target.y
          }
          return diagonal({source: s, target: t});

        });

      var getTagRecX = function(d) {
        if(d.parent != null){
          return 0;
        }else{
          return -(((displayTextWidth(d.name, '',"13px poppins"))+10)+(displayTextWidth('', d.consumption,"13px poppins")+15))+5;
        }
      };

      var getTagTextX = function(d) {
        if(d.parent != null){
          return 5;
        }else{
          return -(((displayTextWidth(d.name, '',"13px poppins"))+10)+(displayTextWidth('', d.consumption,"13px poppins")+15))+10;
        }
      };
    var getValueRecX = function(d) {
        return  d.parent != null ?(d.meterConsumptions || d._children ? displayTextWidth(d.name, '',"13px poppins")+10: displayTextWidth(d.name, '',"13px poppins")+10):-(displayTextWidth(d.consumption, '',"16px poppins")+10)
      }

      var getValueTextX = function(d) {
        return d.parent != null ? (d.meterConsumptions || d._children ? displayTextWidth(d.name, '',"13px poppins")+15: displayTextWidth(d.name, '',"13px poppins")+15):-(displayTextWidth(d.consumption, '',"16px poppins")+10)+5
      };
    var strokeTagRec = function(d) {
        let color = '';
        parseInt(d.consumption, 10)<=0? color =  "#11b72c": color = "#11b72c";
        return color;
      };

     var fillValueRec = function(d) {
        let color = '';
        parseInt(d.consumption, 10)<=0? color =  "#11b72c": color = '#11b72c';
        return color;
      };


      var strokeValRec = function(d) {
        let color = '';
        parseInt(d.consumption, 10)<=0? color =  "#11b72c": color = '#11b72c';
        return color;
      };


   nodeEnter.append('rect')
        .attr("width", function(d){return displayTextWidth(d.name, '',"13px poppins")+15;})
        .attr('x',  getTagRecX)
        .attr('y', -12)
        .style("fill", '#242C33' )
        .style("stroke", strokeTagRec)
        .style("stroke-width", function(d) { return '1px'; })
        .attr("ry", 3)
        .attr("rx", 3)
        .attr("height", '30px');

   nodeEnter.append('rect')
        .attr("width",  function(d){return displayTextWidth(d.consumption, '',"13px poppins")+10;})
        .attr('x', getValueRecX)
        .attr('y', -12)
        .attr("ry", 3)
        .attr("rx", 3)
        .style("fill", fillValueRec)
        .style("stroke", strokeValRec)
        .style("stroke-width", "1px")
        .attr("height", '30px');

    nodeEnter.append('rect')
        .attr("width",  20)
        .attr('x', getValueRecX)
        .attr('y', -12)
        .style("fill", fillValueRec)
        .style("stroke", strokeValRec)
        .style("stroke-width", "1px")
        .attr("height", '30px');

     nodeEnter.append("text")
        .attr("x", getTagTextX)
        .attr("dy", ".50em")
        .attr("fill", "#FFFFFF")
        .text(function(d) { return d.name; })
        .attr("font-size", "13px");

    nodeEnter.append("text")
        .attr("x", getValueTextX)
        .attr("dy", ".50em")
        .attr("fill", "#FFFFFF")
        .text(function(d) { return d.consumption === null? 'N/A':d.consumption; })
        .attr("font-size", "13px");


    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(duration)
        .attr("d", function(d) {
          var o = {x: source.x, y: source.y};
          return diagonal({source: o, target: o});
        })
        .remove();
    // Stash the old positions for transition.
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }
  // Toggle children on click.
  function click(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    update(d);
  }
}
