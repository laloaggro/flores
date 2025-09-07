export default {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        },
        modules: false // Preservar los módulos ES6
      }
    ]
  ],
  plugins: [
    '@babel/plugin-transform-modules-commonjs'
  ]
};