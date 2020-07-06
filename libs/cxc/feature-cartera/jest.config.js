module.exports = {
  name: 'cxc-feature-cartera',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/cxc/feature-cartera',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
