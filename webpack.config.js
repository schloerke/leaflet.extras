const path = require("path");
// const webpack = require('webpack');
// const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const src_path = "./inst/htmlwidgets/src/";
const build_path = path.resolve(__dirname, "./inst/htmlwidgets/build");

library_module = function(name) {
  return {
    rules: [
      {
        test: /\.(png|jpg|gif|svg|woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: "css/" + name + ".[ext]"
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      }
      // {
      //   test: /\.css$/,
      //   use: ["style-loader", "css-loader"]
      // }
    ]
  }
}


library_prod = function(name, filename = name, library = undefined) {
  foldername = filename
  filename = filename + "-prod"
  var ret = {
    mode: "development",
    entry: name,
    // devtool: "source-map",
    externals: {
      leaflet: "L",
    },
    module: library_module(filename),
    plugins: [
      new MiniCssExtractPlugin({
        filename: filename + ".css"
      })
    ],
    output: {
      filename: filename + ".js",
      path: build_path + "/" + foldername
    }
  }
  if (typeof library != 'undefined') {
    ret.output.library = library
  }
  return ret;
}
library_prod_externals = function(externals, ...info) {
  var ret = library_prod(...info);
  ret.externals = Object.assign({}, ret.externals, externals);
  return ret;
}
library_prod_attachements = function(attachments, output_folder, ...info) {
  var ret = library_prod(...info)
  ret.plugins = [
    new CopyWebpackPlugin(
      [{
        from: attachments,
        to: build_path + "/" + output_folder,
        flatten: true
      }]
    )
  ]
  return ret;
}

library_raw = function(entry, filename, foldername) {
  return {
    mode: "development",
    entry: entry,
    output: {
      filename: filename,
      path: build_path + "/" + foldername
    },
    module: {
      rules: [
        {use: "raw-loader"}
      ]
    }
  }
}
library_binding = function(name) {
  var filename = name + "-bindings"
  var folder = "bindings"
  return library_raw(
    folder + "/" + filename + ".js",
    filename + ".js",
    name
  )
}

const config = [

  // library_prod(LIBRARY, SAVE_NAME, GLOBAL_JS_VAR_NAME)

  // library_raw(
  //   src_path + "utils/leaflet_extras-utils.js",
  //   "leaflet_extras-utils.js",
  //   "leaflet_extras-utils"
  // ),


  // "csv2geojson": "5.0.2",
  // "togeojson": "0.16.0",
  // "topojson": "3.0.2"
  library_prod("csv2geojson", "csv2geojson", "csv2geojson"),
  library_prod("@mapbox/togeojson", "togeojson", "toGeoJSON"),
  library_prod("topojson", "topojson", "topojson"),

  // "@mapbox/leaflet-omnivore": "0.3.4",
  library_prod_externals({
    topojson: "topojson",
    csv2geojson: "csv2geojson",
    togeojson: "toGeoJSON",
  }, "@mapbox/leaflet-omnivore", "leaflet-omnivore"),
  // library_binding("leaflet-omnivore"),

  // "Leaflet.Geodesic": "github:henrythasler/Leaflet.Geodesic#c5fe36b",
  library_prod("Leaflet.Geodesic", "leaflet-geodesic"),
  // library_binding("leaflet-geodesic"),

  // "Leaflet.StyleEditor": "github:dwilhelm89/Leaflet.StyleEditor#24366b9"
  library_prod(
    ["Leaflet.StyleEditor", "Leaflet.StyleEditor/dist/css/Leaflet.StyleEditor.min.css"],
    "leaflet-styleeditor"
  ),
  // library_binding("leaflet-styleeditor"),


  // "leaflet-choropleth": "1.1.4",
  library_prod("leaflet-choropleth"),

  // "leaflet-draw": "1.0.2",
  // "leaflet-draw-drag": "1.0.2",
  library_prod(
    ["leaflet-draw", "leaflet-draw/dist/leaflet.draw.css"],
    "leaflet-draw"
  ),
  library_prod("leaflet-draw-drag"),
  // library_binding("leaflet-draw"),

  // "leaflet-fullscreen": "1.0.2",
  library_prod(
    ["leaflet-fullscreen", "leaflet-fullscreen/dist/leaflet.fullscreen.css"],
    "leaflet-fullscreen"
  ),
  // library_raw(
  //   "leaflet-fullscreen/dist/leaflet.fullscreen.css",
  //   "leaflet-fullscreen" + ".css",
  //   "leaflet-fullscreen"
  // ),

  // "leaflet-gps": "1.7.0",
  library_prod(
    ["leaflet-gps", "leaflet-gps/dist/leaflet-gps.min.css"],
    "leaflet-gps"
  ),

  // "leaflet-hash": "github:PowerPan/leaflet-hash#4020d13",
  library_prod("leaflet-hash/dist/leaflet-hash.min.js", "leaflet-hash"),

  // "leaflet-measure-path": "1.3.1",
  library_prod(
    ["leaflet-measure-path", "leaflet-measure-path/leaflet-measure-path.css"],
    "leaflet-measure-path"
  ),
  // library_binding("leaflet-measure-path"),

  // "leaflet-plugins": "3.0.2",
  library_prod("leaflet-plugins/layer/tile/Bing.js", "tile-bing"),
  // library_binding("tile-bing"),
    // For google support!!
    // "leaflet.gridlayer.googlemutant": "^0.6.4",

  // "leaflet-pulse-icon": "0.1.0",
  library_prod(
    ["leaflet-pulse-icon", "leaflet-pulse-icon/src/L.Icon.Pulse.css"],
    "leaflet-pulse-icon"
  ),
  // library_binding("leaflet-pulse-icon"),

  // "fuse.js": "3.2.0",
  // "leaflet-search": "2.3.7",
  library_prod("fuse.js", "fuse_js", "Fuse"),
  library_prod(
    ["leaflet-search", "leaflet-search/dist/leaflet-search.min.css"],
    "leaflet-search"
  ),
  // library_binding("leaflet-search"),

  // "leaflet-sleep": "0.5.1",
  library_prod("leaflet-sleep"),

  // "leaflet-webgl-heatmap": "0.2.7",
  library_prod_attachements(
    "node_modules/webgl-heatmap/*.png",
    "leaflet-webgl-heatmap",
    ["webgl-heatmap/webgl-heatmap.js", "leaflet-webgl-heatmap"],
    "leaflet-webgl-heatmap"
  ),
  // library_binding("leaflet-webgl-heatmap"),

  // napa kartoza/leaflet-wms-legend#0f59578:leaflet-wms-legend
  library_prod(
    ["leaflet-wms-legend/leaflet.wmslegend.js", "leaflet-wms-legend/leaflet.wmslegend.css"],
    "leaflet-wms-legend"
  ),


  // "leaflet.heat": "0.2.0",
  library_prod(src_path + "heat/leaflet-heat.js", "leaflet-heat"),
  // library_binding("leaflet-heat"),

  // "pouchdb-browser": "6.4.3",
  // "leaflet.tilelayer.pouchdbcached": "nikolauskrismer/Leaflet.TileLayer.PouchDBCached#a92b176",
  library_prod("pouchdb-browser/lib/index.js", "pouchdb-browser", "PouchDB"),
  library_prod("leaflet.tilelayer.pouchdbcached", "leaflet-tilelayer"),

  // napa tallsam/Leaflet.weather-markers#afda5b3:leaflet-weather-markers
  library_prod(
    [
      "leaflet-weather-markers/dist/leaflet.weather-markers.js",
      "leaflet-weather-markers/dist/leaflet.weather-markers.css",
      src_path + "weather-icons/weather-icons.min.css",
      src_path + "weather-icons/weather-icons-wind.min.css"
    ],
    "leaflet-weather-markers"
  ),
  // library_binding("leaflet-weather-markers")


  // "leaflet.BounceMarker": "github:maximeh/leaflet.bouncemarker#v1.1",
  library_prod("leaflet.BounceMarker", "leaflet-bouncemarker")
  // library_binding("leaflet-bounce-marker")




];

module.exports = config
