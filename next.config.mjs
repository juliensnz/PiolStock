/** @type {import('next').NextConfig} */
import webpack from 'webpack';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  transpilePackages: ['akeneo-design-system'],
  turbopack: {
    resolveAlias: {
      'akeneo-design-system/lib/components/Input/TextAreaInput/RichTextEditor.js': path.resolve(
        __dirname,
        'src/lib/wysiwyg.js'
      ),
    },
  },
  webpack: (config, options) => {
    if (!options.isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/browser';
    }
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /akeneo-design-system\/lib\/components\/Input\/TextAreaInput\/RichTextEditor.js/,
        path.resolve(__dirname, 'src/lib/wysiwyg.js')
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
        hostname: 'firebasestorage.googleapis.com',
        port: '',
      },
    ],
  },
};

export default nextConfig;
