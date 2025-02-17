'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('products', [
      {
        product_id: 1,
        productName: 'obat',
        productPrice: 20000,
        productImage: 'obat',
        productStock: 23,
        description: 'Product desc',
        packageType: 'Kantong plastik',
        servingType: 'Kapsul',
        isPublic: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        product_id: 2,
        productName: 'obat2',
        productPrice: 69000,
        productImage: 'obat',
        productStock: 45,
        description: 'Product desc2',
        packageType: 'Botol',
        servingType: 'Tablet',
        isPublic: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        product_id: 3,
        productName: 'obat3',
        productPrice: 54000,
        productImage: 'obat',
        productStock: 96,
        description: 'Product desc3',
        packageType: 'Strip',
        servingType: 'Kapsul',
        isPublic: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('products', null, {});
  },
};
