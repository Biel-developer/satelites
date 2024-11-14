const satelitesDiv = document.querySelector('.Navbar--Satelites'); // O container onde os satélites serão exibidos

function clearSatellites() {
    satelitesDiv.innerHTML = '';  // Limpa todos os cards da div
}

// Função para buscar e criar os cards
function fetchAndDisplaySatellites() {
    // Usa fetch para obter o arquivo JSON
    fetch('index.json') // Substitua o caminho pelo correto
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(satellites => {
            // Verifica se satellites é um array
            if (!Array.isArray(satellites)) {
                throw new Error('Dados de satélites inválidos');
            }

            // Limpa o container antes de adicionar novos cards
            satelitesDiv.innerHTML = '';

            // Cria os cards
            satellites.forEach((satellite, index) => {
                const card = document.createElement('div');
                card.classList.add('satellite-card');

                // Adiciona as informações do satélite no card
                card.innerHTML = `
                    <div class="card-satelite">
                        <img src="./textures/photo-satelite.png" alt="Satellite Icon" class="satellite-icon">
                        <div class="satellite-info">
                            <h3 class="satellite-name">${satellite.OBJECT_NAME}</h3>
                            <p class="satellite-id"><strong>ID:</strong> ${satellite.OBJECT_ID}</p>
                        </div>
                    </div>
                `;

                // Adiciona um pequeno atraso para cada card
                card.style.animationDelay = `${index * 0.2}s`;

                // Adiciona o card ao container
                satelitesDiv.appendChild(card);
            });

            // Função para trocar as informações entre os cards de maneira sequencial
            function swapCardInfo() {
                // Obtém todos os cards
                const allCards = Array.from(satelitesDiv.querySelectorAll('.satellite-card'));

                // Verifica se há pelo menos dois cards
                if (allCards.length < 2) return;

                // Realiza a troca de informações de todos os cards sequencialmente
                for (let i = 0; i < allCards.length - 1; i++) {
                    const card1 = allCards[i];  // Card atual
                    const card2 = allCards[i + 1];  // Próximo card

                    // Pega as informações de ambos os cards
                    const card1Name = card1.querySelector('.satellite-name').textContent;
                    const card1Id = card1.querySelector('.satellite-id').textContent;

                    const card2Name = card2.querySelector('.satellite-name').textContent;
                    const card2Id = card2.querySelector('.satellite-id').textContent;

                    // Troca as informações entre os cards
                    card1.querySelector('.satellite-name').textContent = card2Name;
                    card1.querySelector('.satellite-id').textContent = card2Id;

                    card2.querySelector('.satellite-name').textContent = card1Name;
                    card2.querySelector('.satellite-id').textContent = card1Id;
                }
            }

            // Inverte as informações entre os cards a cada 2 segundos (2000 ms)
            setInterval(swapCardInfo, 2500); // A cada 2 segundos

        })
        .catch(error => console.error('Erro ao carregar os satélites:', error));
}

// Chama a função inicialmente para exibir os satélites
fetchAndDisplaySatellites();

// Atualiza os dados a cada 5 segundos (5000 ms)
setInterval(fetchAndDisplaySatellites, 2500);
