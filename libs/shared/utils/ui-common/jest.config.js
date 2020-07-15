module.exports = {
  name: 'shared-utils-ui-common',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/shared/utils/ui-common',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
