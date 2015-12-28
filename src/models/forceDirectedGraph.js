nv.models.forceDirectedGraph = function() {
    "use strict";

    //============================================================
    // Public Variables with Default Settings
    //------------------------------------------------------------

    var margin = {top: 2, right: 0, bottom: 2, left: 0}
        , width = 400
        , height = 32
        , container = null
        , dispatch = d3.dispatch('renderEnd')
        // Force directed graph specific parameters [default values]
        , linkStrength = 0.1
        , friction = 0.9
        , linkDist = 30
        , charge = -120
        , gravity = 0.1
        , theta = 0.8
        , alpha = 0.1
        , color = nv.utils.getColor(['#000'])
        , radius = 5
        ;

    //============================================================
    // Private Variables
    //------------------------------------------------------------

    var renderWatch = nv.utils.renderWatch(dispatch);

    function chart(selection) {
        renderWatch.reset();
        selection.each(function(data) {
          container = d3.select(this);
          nv.utils.initSVG(container);

          var availableWidth = nv.utils.availableWidth(width, container, margin),
              availableHeight = nv.utils.availableHeight(height, container, margin);

          container
                  .attr("width", availableWidth)
                  .attr("height", availableHeight);

          var force = d3.layout.force()
                .nodes(data.nodes)
                .links(data.links)
                .size([availableWidth, availableHeight])
                .linkStrength(linkStrength)
                .friction(friction)
                .linkDistance(linkDist)
                .charge(charge)
                .gravity(gravity)
                .theta(theta)
                .alpha(alpha)
                .start();

          var link = container.selectAll(".link")
                .data(data.links)
                .enter().append("line")
                .attr("class", "link")
                .style("stroke-width", function(d) { return Math.sqrt(d.value); });

            var node = container.selectAll(".node")
                .data(data.nodes)
                .enter().append("circle")
                .attr("class", "node")
                .attr("r", radius)
                .style("fill", function(d) { return color(d.group); })
                .call(force.drag);

            node.append("title")
                .text(function(d) { return d.name; });

            force.on("tick", function() {
              link.attr("x1", function(d) { return d.source.x; })
                  .attr("y1", function(d) { return d.source.y; })
                  .attr("x2", function(d) { return d.target.x; })
                  .attr("y2", function(d) { return d.target.y; });

              node.attr("cx", function(d) { return d.x; })
                  .attr("cy", function(d) { return d.y; });
            });
        });

        return chart;
    }

    //============================================================
    // Expose Public Variables
    //------------------------------------------------------------

    chart.options = nv.utils.optionsFunc.bind(chart);

    chart._options = Object.create({}, {
        // simple options, just get/set the necessary values
        width:     {get: function(){return width;}, set: function(_){width=_;}},
        height:    {get: function(){return height;}, set: function(_){height=_;}},

        // Force directed graph specific parameters
        linkStrength:{get: function(){return linkStrength;}, set: function(_){linkStrength=_;}},
        friction:    {get: function(){return friction;}, set: function(_){friction=_;}},
        linkDist:    {get: function(){return linkDist;}, set: function(_){linkDist=_;}},
        charge:      {get: function(){return charge;}, set: function(_){charge=_;}},
        gravity:     {get: function(){return gravity;}, set: function(_){gravity=_;}},
        theta:       {get: function(){return theta;}, set: function(_){theta=_;}},
        alpha:       {get: function(){return alpha;}, set: function(_){alpha=_;}},
        radius:      {get: function(){return radius;}, set: function(_){radius=_;}},

        //functor options
        x: {get: function(){return getX;}, set: function(_){getX=d3.functor(_);}},
        y: {get: function(){return getY;}, set: function(_){getY=d3.functor(_);}},

        // options that require extra logic in the setter
        margin: {get: function(){return margin;}, set: function(_){
            margin.top    = _.top    !== undefined ? _.top    : margin.top;
            margin.right  = _.right  !== undefined ? _.right  : margin.right;
            margin.bottom = _.bottom !== undefined ? _.bottom : margin.bottom;
            margin.left   = _.left   !== undefined ? _.left   : margin.left;
        }},
        color:  {get: function(){return color;}, set: function(_){
            color = nv.utils.getColor(_);
        }}
    });

    chart.dispatch = dispatch;
    nv.utils.initOptions(chart);
    return chart;
};
