(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.RankingGraph = (function() {
    function RankingGraph(args) {
      this.update_view = __bind(this.update_view, this);
      this.data = args.data, this.sat_extent = args.sat_extent, this.color_scale = args.color_scale, this.append_color_scale_legend = args.append_color_scale_legend, this.get_tooltip = args.get_tooltip;
      this.margin = {
        top: 20,
        right: 0,
        bottom: 50,
        left: 80
      };
      this.width = 940 - this.margin.left - this.margin.right;
      this.height = 500 - this.margin.top - this.margin.bottom;
      this.create_view();
      this.append_color_scale_legend('ranking_graph_legend_1');
      this.add_controls();
      this.update_view();
    }

    RankingGraph.prototype.create_view = function() {
      var d, data, i, self, tip, x_axis_view, x_scale, y_axis, y_axis_view, y_scale;
      this.view = d3.select('#ranking_graph').append('svg').attr('width', this.width + this.margin.left + this.margin.right).attr('height', this.height + this.margin.top + this.margin.bottom).append('g').attr('transform', "translate(" + this.margin.left + "," + this.margin.top + ")");
      this.view.append('text').text('Worst schools').attr('x', this.width / 4).attr('y', this.height + this.margin.bottom / 2).style('text-anchor', 'middle');
      this.view.append('text').text('Best schools').attr('x', 3 * this.width / 4).attr('y', this.height + this.margin.bottom / 2).style('text-anchor', 'middle');
      this.view.append('text').text('SAT score').attr('y', -45).attr('x', -this.height / 2).attr('transform', 'rotate(270)').style('text-anchor', 'middle');
      x_axis_view = this.view.append('g').attr('class', 'x axis').attr('transform', "translate(0," + this.height + ")");
      y_axis_view = this.view.append('g').attr('class', 'y axis');
      x_scale = d3.scale.linear().domain([0, 2 * this.data.length / 7]).range([0, this.width]);
      y_scale = d3.scale.linear().domain([0, this.sat_extent[1]]).range([this.height, 0]);
      y_axis = d3.svg.axis().scale(y_scale).orient('left').tickFormat(d3.format('.0f'));
      data = (function() {
        var _i, _len, _ref, _results;
        _ref = this.data.slice().reverse();
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          d = _ref[i];
          if (i < this.data.length / 7 || i > 6 * this.data.length / 7) {
            _results.push(d);
          }
        }
        return _results;
      }).call(this);
      this.bars = this.view.selectAll(".bar").data(data);
      this.bars.enter().append('rect').attr('class', 'bar').attr('width', 4).attr('fill', (function(_this) {
        return function(d) {
          return _this.color_scale(d['SAT Subject Scores (Averages) - Math']);
        };
      })(this)).attr('x', function(d, i) {
        return x_scale(i);
      }).attr('height', (function(_this) {
        return function(d) {
          return _this.height - y_scale(d['SAT Subject Scores (Averages) - Math']);
        };
      })(this)).attr('y', function(d) {
        return y_scale(d['SAT Subject Scores (Averages) - Math']);
      });
      y_axis_view.call(y_axis);
      tip = this.get_tooltip();
      this.view.call(tip);
      self = this;
      return this.bars.on('mouseover', function(d) {
        tip.show(d);
        return d3.select(this).attr('fill', 'rgb(50,50,50)');
      }).on('mouseout', function(d) {
        tip.hide(d);
        return d3.select(this).attr('fill', function(d) {
          return self.color_scale(d['SAT Subject Scores (Averages) - Math']);
        });
      });
    };

    RankingGraph.prototype.add_controls = function() {
      var label;
      this.checkbox = $("<input type='checkbox' name='ranking_checkbox' id='ranking_checkbox'>");
      this.checkbox.on('change', (function(_this) {
        return function() {
          _this.update_view();
          return false;
        };
      })(this));
      label = $("<label for='ranking_checkbox'>Highlight Philadelphia schools</label>");
      return $('#ranking_graph_controls').append(this.checkbox, label);
    };

    RankingGraph.prototype.update_view = function() {
      var should_highlight_philly;
      should_highlight_philly = this.checkbox.prop('checked');
      return this.bars.attr('opacity', function(d) {
        if (!should_highlight_philly) {
          return 1;
        } else {
          if (d['School Address (City)'] === 'Philadelphia') {
            return 1;
          } else {
            return 0.3;
          }
        }
      });
    };

    return RankingGraph;

  })();

}).call(this);
