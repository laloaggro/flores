const { ObjectId } = require('mongodb');

/**
 * Modelo de producto para el servicio de productos
 */
class Product {
  constructor(db) {
    this.collection = db.collection('products');
  }

  /**
   * Crear un nuevo producto
   * @param {object} productData - Datos del producto
   * @returns {object} Producto creado
   */
  async create(productData) {
    const product = {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await this.collection.insertOne(product);
    return { id: result.insertedId, ...product };
  }

  /**
   * Obtener todos los productos
   * @param {object} filters - Filtros de búsqueda
   * @param {object} options - Opciones de paginación
   * @returns {array} Lista de productos
   */
  async findAll(filters = {}, options = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const products = await this.collection
      .find(filters)
      .skip(skip)
      .limit(limit)
      .toArray();

    return products.map(product => ({
      ...product,
      id: product._id,
      _id: undefined
    }));
  }

  /**
   * Buscar producto por ID
   * @param {string} id - ID del producto
   * @returns {object|null} Producto encontrado o null
   */
  async findById(id) {
    const product = await this.collection.findOne({ _id: new ObjectId(id) });
    
    if (product) {
      return {
        ...product,
        id: product._id,
        _id: undefined
      };
    }
    
    return null;
  }

  /**
   * Actualizar producto
   * @param {string} id - ID del producto
   * @param {object} updateData - Datos a actualizar
   * @returns {object|null} Producto actualizado o null
   */
  async update(id, updateData) {
    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return null;
    }

    return await this.findById(id);
  }

  /**
   * Eliminar producto
   * @param {string} id - ID del producto
   * @returns {boolean} Si el producto fue eliminado
   */
  async delete(id) {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  /**
   * Crear índices en la colección
   */
  async createIndexes() {
    await this.collection.createIndex({ name: 1 });
    await this.collection.createIndex({ category: 1 });
    await this.collection.createIndex({ price: 1 });
  }
}

module.exports = Product;