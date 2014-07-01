(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.RegionalGraph = (function() {
    function RegionalGraph(args) {
      this.zoom = __bind(this.zoom, this);
      this.data = args.data, this.sat_scores = args.sat_scores, this.sat_extent = args.sat_extent, this.color_scale = args.color_scale, this.append_color_scale_legend = args.append_color_scale_legend, this.get_tooltip = args.get_tooltip;
      this.margin = {
        top: 20,
        right: 80,
        bottom: 20,
        left: 20
      };
      this.width = 960 - this.margin.left - this.margin.right;
      this.height = 500 - this.margin.top - this.margin.bottom;
      this.create_view();
      this.append_color_scale_legend('regional_graph_legend_1');
    }

    RegionalGraph.prototype.enrollment_r = function(d) {
      return (d['School Enrollment'] / (d['Grades Offered'].split(',').length * Math.PI)) ^ (1 / 2);
    };

    RegionalGraph.prototype.create_view = function() {
      var legend, legend_data, legend_view_2, path, self, sizes, tip;
      this.lng_extent = d3.extent(this.data.map(function(d) {
        return d.lng;
      }));
      this.lat_extent = d3.extent(this.data.map(function(d) {
        return d.lat;
      }));
      this.r_scale = d3.scale.linear().domain(d3.extent(this.data.map(this.enrollment_r))).range([5, 20]);
      this.projection = d3.geo.conicConformal().rotate([77.7, 0]).center([0, 41]).parallels(this.lat_extent).scale(10000).translate([this.width / 2, this.height / 2]).precision(.1);
      this.view = d3.select('#regional_graph').append('svg').attr('width', this.width + this.margin.left + this.margin.right).attr('height', this.height + this.margin.top + this.margin.bottom).append('g').attr('transform', "translate(" + this.margin.left + "," + this.margin.top + ")").call(d3.behavior.zoom().scaleExtent([1, 5]).on("zoom", this.zoom)).append('g');
      this.view.append('rect').attr('class', 'overlay').attr('width', this.width).attr('height', this.height);
      this.boundary_view = this.view.append('g');
      path = d3.geo.path().projection(this.projection);
      d3.json('vendor/us.json', (function(_this) {
        return function(error, us) {
          _this.boundary_view.append("path", ".boundary").datum(topojson.feature(us, us.objects.land)).attr("class", "land").attr("d", path);
          _this.boundary_view.append("path", ".boundary").datum(topojson.mesh(us, us.objects.states, function(a, b) {
            return a !== b;
          })).attr("class", "state-boundary").attr("d", path);
          return _this.boundary_view.insert("path", ".boundary").datum(topojson.mesh(us, us.objects.counties, function(a, b) {
            return a !== b && !(a.id / 1000 ^ b.id / 1000);
          })).attr("class", "county-boundary").attr("d", path);
        };
      })(this));
      this.regional_graph_view = this.view.append('g');
      this.circles = this.regional_graph_view.selectAll('circle').data(this.data).enter().append('circle').attr('class', 'circle');
      this.circles.attr('cx', (function(_this) {
        return function(d) {
          return _this.projection([d.lng, d.lat])[0];
        };
      })(this)).attr('cy', (function(_this) {
        return function(d) {
          return _this.projection([d.lng, d.lat])[1];
        };
      })(this)).attr('r', (function(_this) {
        return function(d) {
          return _this.r_scale(_this.enrollment_r(d));
        };
      })(this)).attr('stroke', (function(_this) {
        return function(d) {
          return _this.color_scale(d['SAT Subject Scores (Averages) - Math']);
        };
      })(this)).attr('fill', 'rgba(0,0,0,0)');
      sizes = [20, 250, 500, 750, 1000];
      legend_data = sizes.map(function(s) {
        return {
          r: Math.sqrt(s / Math.PI),
          size: s
        };
      });
      legend_view_2 = d3.select('#regional_graph_legend_2').append('svg').attr('width', 200).attr('height', 250).append('g').attr('transform', "translate(25,20)");
      legend_view_2.append('text').text('Grad. class size').attr('class', 'legend_header').attr('x', -15);
      legend = legend_view_2.selectAll('.legend').data(legend_data.reverse()).enter().append('g').attr('transform', function(d, i) {
        return "translate(10," + ((Math.sqrt(i + 1)) * 50 - 40) + ")";
      });
      this.legend_circles = legend.append('circle').attr('class', 'legend-circle').attr('cy', function(d, i) {
        return 20 * i + 20;
      }).attr('r', function(d) {
        return d.r;
      });
      legend.append('text').attr('x', 34).attr('y', function(d, i) {
        return 20 * i + 20;
      }).attr('dy', '.35em').text(function(d) {
        return "" + (Math.round(d.size));
      });
      tip = this.get_tooltip();
      this.regional_graph_view.call(tip);
      self = this;
      return this.circles.on('mouseover', function(d) {
        tip.show(d);
        return d3.select(this).attr('fill', function(d) {
          return self.color_scale(d['SAT Subject Scores (Averages) - Math']);
        });
      }).on('mouseout', function(d) {
        tip.hide(d);
        return d3.select(this).attr('fill', 'rgba(0,0,0,0)');
      });
    };

    RegionalGraph.prototype.zoom = function() {
      var scale;
      scale = d3.event.scale;
      this.view.attr("transform", "translate(" + d3.event.translate + ")scale(" + scale + ")");
      this.circles.attr('r', (function(_this) {
        return function(d) {
          return _this.r_scale(_this.enrollment_r(d)) / Math.pow(scale * scale, 2 / 3);
        };
      })(this)).style('stroke-width', 1.5 / scale);
      return this.legend_circles.attr('r', function(d) {
        return d.r / Math.pow(scale, 2 / 3);
      });
    };

    return RegionalGraph;

  })();

}).call(this);
