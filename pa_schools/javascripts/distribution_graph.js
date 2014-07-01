(function() {
  this.DistributionGraph = (function() {
    function DistributionGraph(args) {
      this.data = args.data, this.sat_scores = args.sat_scores, this.sat_extent = args.sat_extent, this.color_scale = args.color_scale, this.append_color_scale_legend = args.append_color_scale_legend, this.get_tooltip = args.get_tooltip;
      this.margin = {
        top: 20,
        right: 0,
        bottom: 50,
        left: 80
      };
      this.width = 940 - this.margin.left - this.margin.right;
      this.height = 500 - this.margin.top - this.margin.bottom;
      this.create_view();
      this.append_color_scale_legend('distribution_graph_legend_1');
    }

    DistributionGraph.prototype.create_view = function() {
      var bars, hist_data, max_y_value, view, x_axis, x_axis_view, x_scale, y_axis, y_axis_view, y_scale;
      view = d3.select('#distribution_graph').append('svg').attr('width', this.width + this.margin.left + this.margin.right).attr('height', this.height + this.margin.top + this.margin.bottom).append('g').attr('transform', "translate(" + this.margin.left + "," + this.margin.top + ")");
      view.append('text').text('SAT score').attr('x', this.width / 2).attr('y', this.height + this.margin.bottom - 5).style('text-anchor', 'middle');
      view.append('text').text('Number of schools').attr('y', -40).attr('x', -this.height / 2).attr('transform', 'rotate(270)').style('text-anchor', 'middle');
      x_axis_view = view.append('g').attr('class', 'x axis').attr('transform', "translate(0," + this.height + ")");
      y_axis_view = view.append('g').attr('class', 'y axis');
      x_scale = d3.scale.linear().domain(this.sat_extent).range([0, this.width]);
      x_axis = d3.svg.axis().scale(x_scale).orient('bottom').ticks(10);
      hist_data = d3.layout.histogram().bins(x_scale.ticks(75))(this.sat_scores);
      max_y_value = d3.max(hist_data, function(d) {
        return d.y;
      });
      y_scale = d3.scale.linear().domain([0, max_y_value]).range([this.height, 0]);
      y_axis = d3.svg.axis().scale(y_scale).orient('left').tickFormat(d3.format('.0f'));
      bars = view.selectAll(".bar").data(hist_data);
      bars.enter().append('rect').attr('class', 'bar').attr('width', 10).attr('fill', (function(_this) {
        return function(d) {
          return _this.color_scale(d.x);
        };
      })(this));
      bars.exit().remove();
      bars.attr('x', function(d) {
        return x_scale(d.x);
      }).attr('height', (function(_this) {
        return function(d) {
          return _this.height - y_scale(d.y);
        };
      })(this)).attr('y', function(d) {
        return y_scale(d.y);
      });
      x_axis_view.call(x_axis);
      return y_axis_view.call(y_axis);
    };

    return DistributionGraph;

  })();

}).call(this);
