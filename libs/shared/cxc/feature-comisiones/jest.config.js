module.exports = {
  name: 'shared-cxc-feature-comisiones',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/shared/cxc/feature-comisiones',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
