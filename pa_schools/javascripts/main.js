(function() {
  var Main;

  $(function() {
    return new Main;
  });

  Main = (function() {
    function Main() {
      var args;
      this.data = window.high_school_data;
      this.data.sort(function(a, b) {
        return b['SAT Subject Scores (Averages) - Math'] - a['SAT Subject Scores (Averages) - Math'];
      });
      this.sat_scores = this.data.map(function(d) {
        return d['SAT Subject Scores (Averages) - Math'];
      });
      this.sat_extent = d3.extent(this.sat_scores);
      this.color_scale = d3.scale.quantile().domain(this.sat_scores).range(['rgb(215,48,39)', 'rgb(252,141,89)', 'rgb(254,224,139)', 'rgb(255,255,191)', 'rgb(217,239,139)', 'rgb(145,207,96)', 'rgb(26,152,80)']);
      args = {
        data: this.data,
        sat_scores: this.sat_scores,
        sat_extent: this.sat_extent,
        color_scale: this.color_scale,
        append_color_scale_legend: this.append_color_scale_legend,
        get_tooltip: this.get_tooltip
      };
      new DistributionGraph(args);
      new RankingGraph(args);
      new RegionalGraph(args);
      new Scatterplot(args);
      FastClick.attach(document.body);
    }

    Main.prototype.append_color_scale_legend = function(parent_view_id) {
      var colors, legend, legend_data, legend_view;
      colors = this.color_scale.range();
      legend_data = colors.map((function(_this) {
        return function(c) {
          return {
            color: c,
            scores: _this.color_scale.invertExtent(c)
          };
        };
      })(this));
      legend_view = d3.select("#" + parent_view_id).append('svg').attr('width', 200).attr('height', 180).append('g').attr('transform', "translate(25,20)");
      legend_view.append('text').text('Math SAT').attr('class', 'legend_header');
      legend = legend_view.selectAll('.legend').data(legend_data.reverse()).enter().append('g').attr('transform', function(d, i) {
        return "translate(0," + (i * 20 + 10) + ")";
      });
      legend.append('rect').attr('width', 18).attr('height', 18).style('fill', function(d) {
        return d.color;
      });
      return legend.append('text').attr('x', 24).attr('y', 9).attr('dy', '.35em').text(function(d) {
        return "" + (Math.round(d.scores[0])) + "-" + (Math.round(d.scores[1]));
      });
    };

    Main.prototype.get_tooltip = function() {
      var tip;
      return tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function(d) {
        return ("<p>" + d.name + "</p>") + ("<p>" + d['School Address (City)'] + "</p>") + ("<p>Math SAT: " + (Math.round(d['SAT Subject Scores (Averages) - Math'])) + "</p>") + ("<p>Class size: " + (Math.round(d['School Enrollment'] / (d['Grades Offered'].split(',').length))) + "</p>");
      });
    };

    return Main;

  })();

}).call(this);
