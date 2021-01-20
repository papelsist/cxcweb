module.exports = {
  name: 'shared-cxc-feature-antipos',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/shared/cxc/feature-antipos',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
