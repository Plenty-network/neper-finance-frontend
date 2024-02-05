module.exports = function override(config, env) {
  console.log("override...");
  let loaders = config.resolve;

  loaders.fallback = {
    fs: false,
    https: require.resolve("https-browserify"),
    http: require.resolve("stream-http"),
    zlib: require.resolve("browserify-zlib"),
    path: require.resolve("path-browserify"),
    crypto: require.resolve("crypto-browserify"),
    os: require.resolve("os-browserify"),
    assert: require.resolve("assert"),
    url: require.resolve("url")
  };

  return config;
};
