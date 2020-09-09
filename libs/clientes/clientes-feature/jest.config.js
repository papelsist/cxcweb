module.exports = {
  name: 'clientes-clientes-feature',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/clientes/clientes-feature',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
