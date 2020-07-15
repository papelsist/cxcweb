module.exports = {
  name: 'cxc-feature-cobranza-che',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/cxc/feature-cobranza-che',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
