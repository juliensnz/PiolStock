/** @type {import('next').NextConfig} */
const withImages = require('next-images');
const webpack = require('webpack');
const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules')(['akeneo-design-system']);

module.exports = withPlugins([withTM, [withImages]], {
  webpack: (config, options) => {
    if (!options.isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/browser';
    }
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /akeneo-design-system\/lib\/components\/Input\/TextAreaInput\/RichTextEditor.js/,
        require.resolve(`${__dirname}/src/lib/wysiwyg.js`)
      )
    );

    return config;
  },
  compiler: {styledComponents: true},
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'scontent.cdninstagram.com',
        port: '',
      },
    ],
  },
});
