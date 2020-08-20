module.exports = {
  name: 'shared-cxc-data-access-devoluciones',
  preset: '../../../../jest.config.js',
  coverageDirectory:
    '../../../../coverage/libs/shared/cxc/data-access-devoluciones',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
