module.exports = {
  name: 'shared-cxc-ui-cxc-common',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/shared/cxc/ui-cxc-common',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
