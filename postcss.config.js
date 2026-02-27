'use strict';

module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-preset-env': {
      stage: 1,
      features: {
        'custom-properties': true,
      },
    },
    cssnano: {},
  },
};