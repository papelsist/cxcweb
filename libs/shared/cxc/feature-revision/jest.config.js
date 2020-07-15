module.exports = {
  name: 'shared-cxc-feature-revision',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/shared/cxc/feature-revision',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
