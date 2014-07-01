(function() {
  var Example1;

  $(function() {
    return new Example1;
  });

  Example1 = (function() {
    function Example1() {
      var slider;
      this.margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
      };
      this.width = 960 - this.margin.left - this.margin.right;
      this.height = 500 - this.margin.top - this.margin.bottom;
      this.countries = window.data.countries;
      this.years = window.data.years;
      this.add_graph();
      this.define_scales();
      this.add_year_slider();
      this.add_axes();
      this.add_tooltips();
      slider = $('#slider');
      slider.val('1960');
      slider.change();
    }

    Example1.prototype.add_graph = function() {
      this.view = d3.select('#example').append('svg').attr('width', this.width + this.margin.left + this.margin.right).attr('height', this.height + this.margin.top + this.margin.bottom).append('g').attr('transform', "translate(" + this.margin.left + "," + this.margin.top + ")");
      return this.circles = this.view.selectAll('circle').data(this.countries).enter().append('circle').attr('class', 'circle');
    };

    Example1.prototype.define_scales = function() {
      this.x_scale = d3.scale.linear().domain([10, 90]).range([0, this.width]);
      this.y_scale = d3.scale.linear().domain([0.5, 10]).range([this.height, 0]);
      return this.r_scale = d3.scale.linear().domain(this.get_population_min_max().map(function(x) {
        return Math.sqrt(x);
      })).range([1, 50]);
    };

    Example1.prototype.get_population_min_max = function() {
      var all_data;
      all_data = this.countries.reduce(function(prev, curr) {
        return prev.concat(curr.population);
      }, []);
      return d3.extent(all_data);
    };

    Example1.prototype.add_year_slider = function() {
      var curr_val, slider;
      slider = $("<input id='slider' type='range' min='1960' max='2011'/>");
      curr_val = $("<span id='currentValue'></span>");
      $('#example').append([slider, $("<p id='note'>Year: </p>").append(curr_val)]);
      return slider.on('change', (function(_this) {
        return function() {
          var val;
          val = slider.val();
          curr_val.html(val);
          return _this.view_year(_this.years.indexOf(Number(val)));
        };
      })(this));
    };

    Example1.prototype.view_year = function(i) {
      return this.circles.attr('cx', (function(_this) {
        return function(d) {
          return _this.x_scale(d.life_expectancy[i]);
        };
      })(this)).attr('cy', (function(_this) {
        return function(d) {
          return _this.y_scale(d.fertility_rate[i]);
        };
      })(this)).attr('r', (function(_this) {
        return function(d) {
          return _this.r_scale(Math.sqrt(d.population[i]));
        };
      })(this));
    };

    Example1.prototype.add_axes = function() {
      this.x_axis_view = this.view.append('g').attr('class', 'axis').attr('transform', "translate(0," + this.height + ")");
      this.y_axis_view = this.view.append('g').attr('class', 'axis');
      this.x_axis = d3.svg.axis().scale(this.x_scale).orient('bottom');
      this.x_axis_view.call(this.x_axis);
      this.y_axis = d3.svg.axis().scale(this.y_scale).orient('left');
      this.y_axis_view.call(this.y_axis);
      return $('#example').append([$("<div class='x_label label'>Life Expectancy (years)</div>"), $("<div class='y_label label'>Fertility Rate</div>")]);
    };

    Example1.prototype.add_tooltips = function() {
      var tip;
      tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function(d) {
        return "<span>" + d.country_name + "</span>";
      });
      this.view.call(tip);
      return this.circles.on('mouseover', tip.show).on('mouseout', tip.hide);
    };

    return Example1;

  })();

}).call(this);
