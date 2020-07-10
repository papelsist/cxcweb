module.exports = {
  name: 'shared-cxc-ui-devoluciones',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/shared/cxc/ui-devoluciones',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
