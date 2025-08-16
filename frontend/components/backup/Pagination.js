// Componente para la paginación de productos
const Pagination = (paginationData) => {
  // Validar datos de paginación
  if (!paginationData || typeof paginationData !== 'object') {
    console.error('Pagination component: Invalid pagination data', paginationData);
    return '';
  }
  
  const {
    currentPage = 1,
    totalPages = 1,
    hasNextPage = false,
    hasPrevPage = false
  } = paginationData;
  
  // Validar tipos de datos
  if (typeof currentPage !== 'number' || typeof totalPages !== 'number') {
    console.error('Pagination component: Invalid page numbers', { currentPage, totalPages });
    return '';
  }
  
  // No mostrar paginación si solo hay una página
  if (totalPages <= 1) {
    return '';
  }
  
  return `
    <div class="pagination-container">
      <div class="pagination-info">
        <span>Página ${currentPage} de ${totalPages}</span>
      </div>
      <div class="pagination-controls">
        <button class="btn btn-secondary pagination-btn prev-page" 
                ${hasPrevPage ? '' : 'disabled'} 
                aria-label="Página anterior"
                data-page="${currentPage - 1}">
          <i class="fas fa-chevron-left"></i> Anterior
        </button>
        <button class="btn btn-secondary pagination-btn next-page" 
                ${hasNextPage ? '' : 'disabled'} 
                aria-label="Página siguiente"
                data-page="${currentPage + 1}">
          Siguiente <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  `;
};

export default Pagination;