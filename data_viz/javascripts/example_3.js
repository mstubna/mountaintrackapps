(function() {
  var Example3;

  $(function() {
    return new Example3;
  });

  Example3 = (function() {
    function Example3() {
      this.margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
      };
      this.width = 960 - this.margin.left - this.margin.right;
      this.height = 500 - this.margin.top - this.margin.bottom;
      this.setup_data();
      this.add_graph();
      this.add_axes();
      this.add_tooltips();
      this.add_animate_buttons();
      this.show_horiz_table();
    }

    Example3.prototype.setup_data = function() {
      var i, x_coords, y_coords, _i, _ref;
      this.data = window.data.countries.map(function(x) {
        return {
          country_name: x.country_name,
          life_expectancy: x.life_expectancy[51]
        };
      });
      this.data.sort((function(a, b) {
        return a.life_expectancy - b.life_expectancy;
      }));
      this.buckets = [[45, 50], [50, 55], [55, 60], [60, 65], [65, 70], [70, 75], [75, 80], [80, 85]];
      x_coords = this.data.map((function(_this) {
        return function(d) {
          var bucket, _i, _len, _ref;
          _ref = _this.buckets;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            bucket = _ref[_i];
            if (d.life_expectancy >= bucket[0] && d.life_expectancy < bucket[1]) {
              break;
            }
          }
          return (bucket[1] + bucket[0]) / 2;
        };
      })(this));
      y_coords = [1];
      for (i = _i = 1, _ref = x_coords.length - 1; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        y_coords.push(x_coords[i] === x_coords[i - 1] ? y_coords[i - 1] + 1 : 1);
      }
      return this.data.map(function(d, i) {
        d.histogram_x = x_coords[i];
        return d.histogram_y = y_coords[i];
      });
    };

    Example3.prototype.add_graph = function() {
      this.view = d3.select('#example').append('svg').attr('width', this.width + this.margin.left + this.margin.right).attr('height', this.height + this.margin.top + this.margin.bottom).append('g').attr('transform', "translate(" + this.margin.left + "," + this.margin.top + ")");
      return this.bars = this.view.append('g').selectAll('rect').data(this.data).enter().append('rect');
    };

    Example3.prototype.show_horiz_table = function() {
      var bar_width, x_domain, x_label, y_domain, y_label;
      bar_width = 5;
      x_domain = [44, 85];
      x_label = '';
      y_domain = [0, 600];
      y_label = 'Countries';
      this.update_scales(x_domain, y_domain);
      this.bars.transition().duration(1000).delay(function(d, i) {
        return 10 * i;
      }).attr('width', this.x_scale(x_domain[1]) - this.x_scale(x_domain[0])).attr('x', (function(_this) {
        return function(d) {
          return _this.x_scale(x_domain[0]);
        };
      })(this)).attr('y', (function(_this) {
        return function(d, i) {
          return _this.y_scale(3 * i);
        };
      })(this)).attr('height', this.height - this.y_scale(3)).attr('stroke-width', 1).attr('rx', 0).attr('ry', 0);
      return this.update_axes(x_label, true, y_label, true);
    };

    Example3.prototype.show_vert_table = function() {
      var bar_width, x_domain, x_label, y_domain, y_label;
      bar_width = 5;
      x_domain = [0, 600];
      x_label = 'Countries';
      y_domain = [0, 1];
      y_label = '';
      this.update_scales(x_domain, y_domain);
      this.bars.transition().duration(1000).delay(function(d, i) {
        return 10 * i;
      }).attr('width', 3).attr('x', (function(_this) {
        return function(d, i) {
          return _this.x_scale(3 * i);
        };
      })(this)).attr('y', this.y_scale(1)).attr('height', this.y_scale(0)).attr('stroke-width', 1).attr('rx', 0).attr('ry', 0);
      return this.update_axes(x_label, true, y_label, true);
    };

    Example3.prototype.show_scatterplot = function() {
      var bar_width, x_domain, x_label, y_domain, y_label;
      bar_width = 20;
      x_domain = [44, 85];
      x_label = 'Life Expectancy';
      y_domain = [0, 200];
      y_label = 'Countries';
      this.update_scales(x_domain, y_domain);
      this.bars.transition().duration(1000).delay(function(d, i) {
        return 10 * i;
      }).attr('width', bar_width).attr('x', (function(_this) {
        return function(d) {
          return _this.x_scale(d.life_expectancy) - bar_width / 2;
        };
      })(this)).attr('y', (function(_this) {
        return function(d, i) {
          return _this.y_scale(i) - 20;
        };
      })(this)).attr('height', this.height - this.y_scale(9)).attr('stroke-width', 1).attr('rx', 10).attr('ry', 10);
      return this.update_axes(x_label, false, y_label, true);
    };

    Example3.prototype.show_heatmap = function() {
      var bar_width, x_domain, x_label, y_domain, y_label;
      bar_width = 20;
      x_domain = [44, 85];
      x_label = 'Life Expectancy';
      y_domain = [0, 1];
      y_label = 'Countries';
      this.update_scales(x_domain, y_domain);
      this.bars.transition().duration(1000).delay(function(d, i) {
        return 10 * i;
      }).attr('width', bar_width).attr('x', (function(_this) {
        return function(d) {
          return _this.x_scale(d.life_expectancy) - bar_width / 2;
        };
      })(this)).attr('y', this.y_scale(1)).attr('height', this.y_scale(0)).attr('stroke-width', 0).attr('rx', 0).attr('ry', 0);
      return this.update_axes(x_label, false, y_label, true);
    };

    Example3.prototype.show_histogram = function() {
      var bar_width, x_domain, x_label, x_tick_format, x_tick_values, y_domain, y_label;
      bar_width = 90;
      x_domain = [44, 85];
      x_tick_values = this.buckets.map(function(b) {
        return (b[0] + b[1]) / 2;
      });
      x_tick_format = (function(_this) {
        return function(x, i) {
          var bucket;
          bucket = _this.buckets[i];
          return "" + bucket[0] + "-" + (bucket[1] - 1);
        };
      })(this);
      x_label = 'Life Expectancy (years)';
      y_domain = [0, 50];
      y_label = 'Number of Countries';
      this.update_scales(x_domain, y_domain);
      this.bars.attr('class', 'histogram').transition().duration(1000).delay(function(d, i) {
        return 10 * i;
      }).attr('width', bar_width).attr('x', (function(_this) {
        return function(d) {
          return _this.x_scale(d.histogram_x) - bar_width / 2;
        };
      })(this)).attr('y', (function(_this) {
        return function(d) {
          return _this.y_scale(d.histogram_y);
        };
      })(this)).attr('height', (function(_this) {
        return function(d) {
          return _this.height - _this.y_scale(1);
        };
      })(this)).attr('stroke-width', 1).attr('rx', 0).attr('ry', 0);
      return this.update_axes(x_label, false, y_label, false, x_tick_values, x_tick_format);
    };

    Example3.prototype.update_scales = function(x_domain, y_domain) {
      this.x_scale.domain(x_domain);
      return this.y_scale.domain(y_domain);
    };

    Example3.prototype.update_axes = function(x_label, x_axis_hidden, y_label, y_axis_hidden, x_tick_values, x_tick_format) {
      this.x_axis_label.text(x_label);
      this.y_axis_label.text(y_label);
      this.x_axis_view.classed('hidden', x_axis_hidden);
      this.y_axis_view.classed('hidden', y_axis_hidden);
      if ((x_tick_values != null) && (x_tick_format != null)) {
        this.x_axis = d3.svg.axis().orient('bottom').scale(this.x_scale).tickValues(x_tick_values).tickFormat(x_tick_format);
      } else {
        this.x_axis = d3.svg.axis().orient('bottom').scale(this.x_scale);
      }
      this.y_axis = d3.svg.axis().orient('left').scale(this.y_scale);
      this.x_axis_view.call(this.x_axis);
      return this.y_axis_view.call(this.y_axis);
    };

    Example3.prototype.add_tooltips = function() {
      var format, tip;
      format = d3.format('0.1f');
      tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function(d) {
        return "<span>" + d.country_name + ": " + (format(d.life_expectancy)) + " yrs</span>";
      });
      this.view.call(tip);
      return this.bars.on('mouseover', tip.show).on('mouseout', tip.hide);
    };

    Example3.prototype.add_axes = function() {
      this.x_scale = d3.scale.linear().range([0, this.width]);
      this.y_scale = d3.scale.linear().range([this.height, 0]);
      this.x_axis_view = this.view.append('g').attr('class', 'axis').attr('transform', "translate(0," + this.height + ")");
      this.y_axis_view = this.view.append('g').attr('class', 'axis');
      this.x_axis_label = $("<div class='x_label label'></div>");
      this.y_axis_label = $("<div class='y_label label'></div>");
      return $('#example').append([this.x_axis_label, this.y_axis_label]);
    };

    Example3.prototype.add_animate_buttons = function() {
      var heatmap_button, histogram_button, horiz_button, scatter_button, vert_button;
      horiz_button = $("<button>Horizontal Table</button>");
      horiz_button.on('click', (function(_this) {
        return function() {
          return _this.show_horiz_table();
        };
      })(this));
      vert_button = $("<button>Vertical Table</button>");
      vert_button.on('click', (function(_this) {
        return function() {
          return _this.show_vert_table();
        };
      })(this));
      scatter_button = $("<button>Scatterplot</button>");
      scatter_button.on('click', (function(_this) {
        return function() {
          return _this.show_scatterplot();
        };
      })(this));
      heatmap_button = $("<button>Heatmap</button>");
      heatmap_button.on('click', (function(_this) {
        return function() {
          return _this.show_heatmap();
        };
      })(this));
      histogram_button = $("<button>Histogram</button>");
      histogram_button.on('click', (function(_this) {
        return function() {
          return _this.show_histogram();
        };
      })(this));
      return $('#example').append($("<div id='button_container'></div").append([horiz_button, vert_button, scatter_button, heatmap_button, histogram_button]));
    };

    return Example3;

  })();

}).call(this);
