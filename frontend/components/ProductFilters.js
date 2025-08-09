// Componente para los filtros de productos
const ProductFilters = (categories = []) => {
  // Validar que categories sea un array
  if (!Array.isArray(categories)) {
    console.error('ProductFilters component: categories should be an array', categories);
    categories = [];
  }
  
  // Generar opciones de categoría
  const categoryOptions = categories.map(category => `
    <option value="${category}">${category}</option>
  `).join('');
  
  return `
    <div class="product-filters">
      <div class="filter-group">
        <label for="categoryFilter">Categoría:</label>
        <select id="categoryFilter" class="filter-select">
          <option value="">Todas las categorías</option>
          ${categoryOptions}
        </select>
      </div>
      <div class="filter-group">
        <label for="searchFilter">Buscar:</label>
        <input type="text" id="searchFilter" class="filter-input" placeholder="Nombre del producto...">
      </div>
      <div class="filter-actions">
        <button id="clearFilters" class="btn btn-secondary">Limpiar filtros</button>
      </div>
    </div>
  `;
};

export default ProductFilters;