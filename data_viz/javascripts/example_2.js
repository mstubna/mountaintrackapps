(function() {
  var Example2;

  $(function() {
    return new Example2;
  });

  Example2 = (function() {
    function Example2() {
      this.data = window.data;
      this.activity_names = this.data[0].map(function(x) {
        return x.name;
      });
      this.margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
      };
      this.width = 960 - this.margin.left - this.margin.right;
      this.height = 500 - this.margin.top - this.margin.bottom;
      this.create_graph();
      this.add_axes();
      this.add_legend();
      this.add_activity_selector();
      this.add_year_selector();
    }

    Example2.prototype.create_graph = function() {
      var data;
      this.view = d3.select('#example').append('svg').attr('width', this.width + this.margin.left + this.margin.right).attr('height', this.height + this.margin.top + this.margin.bottom).append('g').attr('transform', "translate(" + this.margin.left + "," + this.margin.top + ")");
      this.x_scale = d3.scale.linear().domain([0, 23]).range([0, this.width]);
      this.y_scale = d3.scale.linear().domain([0, 100]).range([this.height, 0]);
      this.color_scale = d3.scale.category20().domain(this.activity_names);
      this.area = d3.svg.area().x((function(_this) {
        return function(d) {
          return _this.x_scale(d.x);
        };
      })(this)).y0((function(_this) {
        return function(d) {
          return _this.y_scale(d.y0);
        };
      })(this)).y1((function(_this) {
        return function(d) {
          return _this.y_scale(d.y0 + d.y);
        };
      })(this));
      this.stack = d3.layout.stack().values(function(d) {
        return d.values;
      });
      data = this.stack(this.data[0].map(function(x) {
        return {
          name: x.name,
          values: x.values.map(function(d, i) {
            return {
              x: i,
              y: d
            };
          })
        };
      }));
      return this.view.selectAll('path').data(data).enter().append('path').attr('d', (function(_this) {
        return function(d) {
          return _this.area(d.values);
        };
      })(this)).style('fill', (function(_this) {
        return function(d) {
          return _this.color_scale(d.name);
        };
      })(this));
    };

    Example2.prototype.add_axes = function() {
      var x_axis, y_axis;
      x_axis = d3.svg.axis().scale(this.x_scale).orient('bottom');
      y_axis = d3.svg.axis().scale(this.y_scale).orient('left');
      this.view.append('g').attr('class', 'axis').attr('transform', "translate(0," + this.height + ")").call(x_axis);
      this.view.append('g').attr('class', 'axis').call(y_axis);
      return $('#example').append([$("<div class='x_label label'>Time of Day</div>"), $("<div class='y_label label'>Percentage of Total Time</div>")]);
    };

    Example2.prototype.add_legend = function() {
      var legend;
      this.legend_view = d3.select('#example').append('svg').attr('width', this.width + this.margin.left + this.margin.right).attr('height', 700 + this.margin.top + this.margin.bottom).append('g').attr('transform', "translate(" + this.margin.left + "," + this.margin.top + ")");
      legend = this.legend_view.selectAll('.legend').data(this.activity_names.slice().reverse()).enter().append('g').attr('class', 'legend').attr('transform', function(d, i) {
        return "translate(0," + (i * 20) + ")";
      });
      legend.append('rect').attr('width', 18).attr('height', 18).style('fill', this.color_scale);
      return legend.append('text').attr('x', 24).attr('y', 9).attr('dy', '.35em').text(function(d) {
        return d;
      });
    };

    Example2.prototype.add_activity_selector = function() {
      this.activity_select = $("<select id='activity_selector'></select>");
      this.activity_select.append($("<option value='All'>All</option>"));
      this.activity_names.map((function(_this) {
        return function(x) {
          return _this.activity_select.append($("<option>" + x + "</option>"));
        };
      })(this));
      $('#example').append(this.activity_select);
      return this.activity_select.on('change', (function(_this) {
        return function() {
          return _this.transition();
        };
      })(this));
    };

    Example2.prototype.add_year_selector = function() {
      this.year_select = $("<select id='year_selector'></select>");
      this.year_select.append([$("<option>2003-2007</option>"), $("<option>2007-2011</option>")]);
      $('#example').append(this.year_select);
      return this.year_select.on('change', (function(_this) {
        return function() {
          return _this.transition();
        };
      })(this));
    };

    Example2.prototype.transition = function() {
      var data, index;
      data = this.data[this.year_select.prop('selectedIndex')];
      index = this.activity_select.prop('selectedIndex');
      data = this.stack(data.map(function(x, i) {
        return {
          name: x.name,
          values: x.values.map(function(d, j) {
            return {
              x: j,
              y: index === 0 || index - 1 === i ? d : 0
            };
          })
        };
      }));
      return d3.selectAll('path').data(data).transition().duration(1000).attr('d', (function(_this) {
        return function(d) {
          return _this.area(d.values);
        };
      })(this));
    };

    return Example2;

  })();

}).call(this);
