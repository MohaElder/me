module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
  ? '/me/'
  : '/',
  transpileDependencies: [
    'vuetify'
  ]
}
