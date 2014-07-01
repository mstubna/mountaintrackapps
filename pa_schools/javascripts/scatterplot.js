(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.Scatterplot = (function() {
    function Scatterplot(args) {
      this.update_view = __bind(this.update_view, this);
      this.data = args.data;
      this.margin = {
        top: 20,
        right: 20,
        bottom: 80,
        left: 80
      };
      this.width = 500 - this.margin.left - this.margin.right;
      this.height = 500 - this.margin.top - this.margin.bottom;
      this.create_view();
      this.add_controls();
      this.x_selector.prop('selectedIndex', this.select_options.length - 1);
      this.update_view();
    }

    Scatterplot.prototype.create_view = function() {
      var self;
      this.view = d3.select('#scatterplot_graph').append('svg').attr('width', this.width + this.margin.left + this.margin.right).attr('height', this.height + this.margin.top + this.margin.bottom).append('g').attr('transform', "translate(" + this.margin.left + "," + this.margin.top + ")");
      this.points = this.view.selectAll('circle').data(this.data).enter().append('circle').attr('class', 'circle').attr('r', 5);
      this.x_axis_view = this.view.append('g').attr('class', 'axis').attr('transform', "translate(0," + this.height + ")");
      this.y_axis_view = this.view.append('g').attr('class', 'axis');
      this.x_axis_label = this.view.append('text').attr('x', this.width / 2).attr('y', this.height + this.margin.bottom / 2).style('text-anchor', 'middle');
      this.y_axis_label = this.view.append('text').attr('y', -45).attr('x', -this.height / 2).attr('transform', 'rotate(270)').style('text-anchor', 'middle');
      this.tips = d3.tip().attr('class', 'd3-tip').offset([-10, 0]);
      this.view.call(this.tips);
      self = this;
      return this.points.on('mouseover', function(d) {
        self.tips.show(d);
        this.parentNode.appendChild(this);
        return d3.select(this).attr('r', 7).classed('active', true);
      }).on('mouseout', function(d) {
        self.tips.hide(d);
        return d3.select(this).attr('r', 5).classed('active', false);
      });
    };

    Scatterplot.prototype.add_controls = function() {
      this.select_options = ['SAT Subject Scores (Averages) - Math', 'SAT Subject Scores (Averages) - Reading', 'SAT Subject Scores (Averages) - Writing', 'Black or African American (not Hispanic)', 'White (not Hispanic)', 'Hispanic (any race)', 'Asian (not Hispanic)', 'American Indian/Alaskan Native (not Hispanic)', 'Multi-Racial (not Hispanic)', 'Male', 'Female', 'Economically Disadvantaged'];
      this.x_selector = $("<select id='x_selector'></select>");
      this.x_selector.append(this.select_options.map(function(o) {
        return "<option>" + o + "</option>";
      }));
      this.x_selector.on('change', this.update_view);
      this.y_selector = $("<select id='y_selector'></select>");
      this.y_selector.append(this.select_options.map(function(o) {
        return "<option>" + o + "</option>";
      }));
      this.y_selector.on('change', this.update_view);
      return $('#scatterplot_controls').append([this.x_selector, this.y_selector]);
    };

    Scatterplot.prototype.update_view = function() {
      var x_domain, x_metric, y_domain, y_metric;
      x_metric = this.select_options[this.x_selector.prop('selectedIndex')];
      y_metric = this.select_options[this.y_selector.prop('selectedIndex')];
      x_domain = d3.extent(this.data.map(function(d) {
        return parseFloat(d[x_metric]);
      }));
      y_domain = d3.extent(this.data.map(function(d) {
        return parseFloat(d[y_metric]);
      }));
      this.update_scales(x_domain, y_domain);
      this.update_axes(x_metric, y_metric);
      this.points.transition().duration(1000).attr('cx', (function(_this) {
        return function(d) {
          var val;
          val = parseFloat(d[x_metric]);
          return _this.x_scale(isNaN(val) ? -100 : val);
        };
      })(this)).attr('cy', (function(_this) {
        return function(d) {
          var val;
          val = parseFloat(d[y_metric]);
          return _this.y_scale(isNaN(val) ? -100 : val);
        };
      })(this));
      return this.tips.html(function(d) {
        return ("<p>" + d.name + "</p>") + ("<p>" + d['School Address (City)'] + "</p>") + ("<p>" + x_metric + ": " + d[x_metric] + "</p>") + ("<p>" + y_metric + ": " + d[y_metric] + "</p>");
      });
    };

    Scatterplot.prototype.update_scales = function(x_domain, y_domain) {
      this.x_scale = d3.scale.linear().domain(x_domain).range([0, this.width]).nice();
      return this.y_scale = d3.scale.linear().domain(y_domain).range([this.height, 0]).nice();
    };

    Scatterplot.prototype.update_axes = function(x_label, y_label) {
      this.x_axis_label.text(x_label);
      this.y_axis_label.text(y_label);
      this.x_axis = d3.svg.axis().orient('bottom').scale(this.x_scale);
      this.y_axis = d3.svg.axis().orient('left').scale(this.y_scale);
      this.x_axis_view.call(this.x_axis);
      return this.y_axis_view.call(this.y_axis);
    };

    return Scatterplot;

  })();

}).call(this);
