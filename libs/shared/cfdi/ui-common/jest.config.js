module.exports = {
  name: 'shared-cfdi-ui-common',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/shared/cfdi/ui-common',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
