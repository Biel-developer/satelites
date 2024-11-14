// Seleciona todos os checkboxes
const checkboxes = document.querySelectorAll('input[type="checkbox"][name="company"]');
const selectedCompaniesDiv = document.getElementById('selectedCompanies');
const filterButton = document.getElementById('filterButton');
const filterOptions = document.getElementById('filterOptions');

// Adiciona evento 'change' a cada checkbox
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateSelectedCompanies);
});

// Função para atualizar a lista de empresas selecionadas
function updateSelectedCompanies() {
    selectedCompaniesDiv.innerHTML = ''; // Limpa a div de empresas selecionadas

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            // Cria o botão para cada empresa selecionada
            const companyButton = document.createElement('button');
            companyButton.textContent = checkbox.value;
            
            // Cria o botão "X" para remover a empresa
            const removeButton = document.createElement('span');
            removeButton.textContent = 'X';
            removeButton.classList.add('remove-btn');
            
            // Adiciona o evento de clique no "X" para remover a empresa
            removeButton.addEventListener('click', () => {
                checkbox.checked = false; // Desmarca o checkbox
                updateSelectedCompanies(); // Atualiza a lista de selecionados
            });

            companyButton.appendChild(removeButton);
            selectedCompaniesDiv.appendChild(companyButton);
        }
    });

    if (selectedCompaniesDiv.innerHTML === '') {
        selectedCompaniesDiv.innerHTML = 'Nenhuma empresa selecionada.';
    }
}

// Toggle de exibição das opções de filtro
filterButton.addEventListener('click', function() {
    filterOptions.style.display = filterOptions.style.display === 'block' ? 'none' : 'block';
});
