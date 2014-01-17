module.exports = {
  production: {
    root: require('path').normalize(__dirname),
    db: 'mongodb://localhost/justbrew',
    sessionSecret: 'somesecretsecretlyguarded',
    app: {
      name: 'Justbrew',
      port: 80,
      compressCss: true
    },
    auth: {
      saltSize: 9, //512 bytes
      minPassword: 8,
      iterations: 10000
    },
    logger: {
      level: 'warn',
      file: '/log/app.log',
      maxsize: 10 //10 megabytes
    }
  },

  development: {
    db: 'mongodb://localhost/justbrew_dev',
    app: {
      port: 3000,
      compressCss: false
    },
    logger: {
      level: 'debug'
    }
  },

  test: {
    db: 'mongodb://localhost/justbrew_test',
    clearCollectionsAfter: true,
    useMemorySessionStore: true,
    logger: {
      level: 'debug'
    }
  }
};
