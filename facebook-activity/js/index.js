function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var URL = "https://raw.githubusercontent.com/Ventrosky/osint-projects/master/facebook-activity/data/FB-sleep.csv";
var groups = ["Group1", "Group2", "Group3"];
var selection = false;
var topTree;

var svg = d3.select("svg"),
    margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x0 = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1);

var x1 = d3.scaleBand().padding(0.05);

var y = d3.scaleLinear().rangeRound([height, 0]);

var z = d3.scaleOrdinal().range(["#FFDE19", "#AD00FF", "#14C4CC"]);

var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

d3.csv(URL, function (d, i, columns) {
  for (var i = 1, n = columns.length; i < n; ++i) {
    d[columns[i]] = +d[columns[i]];
  }return d;
}, function (error, data) {
  if (error) throw error;

  var keys = data.columns.slice(1);
  var totals = data.map(function (d) {
    return keys.map(function (key) {
      return d[key];
    }).reduce(function (t, n) {
      return t + n;
    });
  });
  topTree = findHourTop(totals);

  x0.domain(data.map(function (d) {
    return d.Hour;
  }));
  x1.domain(keys).rangeRound([0, x0.bandwidth()]);
  y.domain([0, d3.max(data, function (d) {
    return d3.max(keys, function (key) {
      return d[key];
    });
  })]).nice();

  var count = -1;
  g.append("g").selectAll("g").data(data).enter().append("g").attr("transform", function (d) {
    return "translate(" + x0(d.Hour) + ",0)";
  }).selectAll("rect").data(function (d) {
    return keys.map(function (key) {
      return { key: key, value: d[key] };
    });
  }).enter().append("rect").attr("x", function (d) {
    return x1(d.key);
  }).attr("y", function (d) {
    return y(d.value);
  }).attr("width", x1.bandwidth()).attr("height", function (d) {
    return height - y(d.value);
  }).attr("id", function (d) {
    return d.key;
  }).attr("class", function (d, i) {
    return "h" + (i == 0 ? ++count : count);
  }).attr("fill", function (d) {
    return z(d.key);
  }).on("click", function (d) {
    if (selection != true) {
      selection = true;
      var currentColor = z(d.key);
      console.log(z(d.key));
      currentColor = currentColor == "#d3d3d3" ? "magenta" : "#d3d3d3";
      console.log(z(d.key) == "#d3d3d3");
      var grayed = groups.filter(function (g) {
        return g != d.key;
      });
      console.log(grayed);
      d3.selectAll("#" + grayed[0]).style("fill", "#d3d3d3");
      d3.selectAll("#" + grayed[1]).style("fill", "#d3d3d3");
    } else {
      document.getElementById("d3-dropdown").options.selectedIndex = 0;
      selection = false;
      for (var i = 0; i < groups.length; i++) {
        d3.selectAll("#" + groups[i]).style("fill", z(groups[i]));
      }
    }
  }).on("mouseover", function (d) {
    d3.select(this).attr("stroke", "black");
    div.transition().duration(200).style("opacity", .9);
    div.html(d.value + " posts").style("left", d3.event.pageX + "px").style("top", d3.event.pageY - 28 + "px");
  }).on("mouseout", function () {
    d3.select(this).attr("stroke", "none");
    div.transition().duration(500).style("opacity", 0);
  });

  g.append("g").attr("class", "axis").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x0)).append("text").attr("x", width - 10).attr("y", y(y.ticks().pop()) + 11).attr("dy", "0.32em").attr("fill", "#000").attr("font-weight", "bold").attr("text-anchor", "start").text("Hours");

  g.append("g").attr("class", "axis").call(d3.axisLeft(y).ticks(null, "s")).append("text").attr("x", 2).attr("y", y(y.ticks().pop()) + 0.5).attr("dy", "0.32em").attr("fill", "#000").attr("font-weight", "bold").attr("text-anchor", "start").text("Posts");

  var legend = g.append("g").attr("font-family", "sans-serif").attr("font-size", 10).attr("text-anchor", "end").selectAll("g").data(keys.slice().reverse()).enter().append("g").attr("transform", function (d, i) {
    return "translate(0," + i * 20 + ")";
  });

  legend.append("rect").attr("x", width - 19).attr("width", 19).attr("height", 19).attr("fill", z).attr("id", function (d) {
    return d + "L";
  });

  legend.append("text").attr("x", width - 24).attr("y", 9.5).attr("dy", "0.32em").text(function (d) {
    return d.slice(-1) + "° Year";
  });
});

d3.select("#selected-dropdown").text("first");

d3.select("select").on("change", function (d) {
  var selected = d3.select("#d3-dropdown").node().value;
  console.log(selected);
  d3.select("#selected-dropdown").text(selected);
  if (selected == "all") {
    selected = false;
    for (var i = 0; i < groups.length; i++) {
      d3.selectAll("#" + groups[i]).style("fill", z(groups[i]));
    }
  } else {
    for (var i = 0; i < groups.length; i++) {
      d3.selectAll("#" + groups[i]).style("fill", "#d3d3d3");
    }var offset = selected == "active" ? 0 : 3;
    for (var i = 0; i < 3; i++) {
      d3.selectAll(".h" + topTree[i + offset] + "#Group1").style("fill", z("Group1"));
      d3.selectAll(".h" + topTree[i + offset] + "#Group2").style("fill", z("Group2"));
      d3.selectAll(".h" + topTree[i + offset] + "#Group3").style("fill", z("Group3"));
    }
  }
});

function findHourTop(totals) {
  var topTree = [];
  var massimi = totals.slice();
  var minimi = totals.slice();
  var max = void 0,
      min = void 0;
  for (var i = 0; i < 3; i++) {
    max = massimi.indexOf(Math.max.apply(Math, _toConsumableArray(massimi)));
    topTree.push(max);
    massimi[max] = Math.min.apply(Math, _toConsumableArray(massimi)) - 1;
  }
  for (var _i = 0; _i < 3; _i++) {
    min = minimi.indexOf(Math.min.apply(Math, _toConsumableArray(minimi)));
    topTree.push(min);
    minimi[min] = Math.max.apply(Math, _toConsumableArray(minimi)) + 1;
  }
  return topTree;
}