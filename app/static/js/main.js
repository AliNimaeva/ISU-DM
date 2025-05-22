// Инициализация визуализации графа
let network = null;

function initGraphVisualization() {
    const container = document.getElementById('network');
    const options = {
        nodes: {
            shape: 'dot',
            size: 20,
            font: {
                size: 14
            }
        },
        edges: {
            width: 2,
            arrows: {
                to: { enabled: false }
            }
        }
    };

    network = new vis.Network(container, { nodes: new vis.DataSet([]), edges: new vis.DataSet([]) }, options);
}

// Функция для парсинга матрицы смежности
function parseMatrix(matrixStr) {
    const rows = matrixStr.trim().split('\n');
    return rows.map(row =>
        row.trim().split(/\s+/).map(Number)
    );
}

// Функция обновления визуализации графа
function updateGraphVisualization(graphData) {
    const nodes = graphData.nodes.map(node => ({
        id: node,
        label: String(node)
    }));

    const edges = graphData.edges.map(edge => ({
        from: edge[0],
        to: edge[1]
    }));

    network.setData({
        nodes: new vis.DataSet(nodes),
        edges: new vis.DataSet(edges)
    });
}

// Обработчик кнопки "Готово"
document.getElementById('draw-graph').addEventListener('click', function () {
    const matrixInput = document.getElementById('adjacency-matrix');
    const matrix = parseMatrix(matrixInput.value);

    fetch('/api/graph', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'update_matrix',
            matrix: matrix
        })
    })
        .then(response => response.json())
        .then(data => {
            updateGraphVisualization(data);
            updateGraphProperties(data.properties);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ошибка при обработке матрицы: ' + error.message);
        });
});


// Функция сброса свойств графа
function resetGraphProperties() {
    document.getElementById('vertex-count').textContent = '0';
    document.getElementById('edge-count').textContent = '0';
    document.getElementById('components').textContent = '0';
    document.getElementById('is-eulerian').textContent = 'Нет';
    document.getElementById('is-semi-eulerian').textContent = 'Нет';
    document.getElementById('is-bipartite').textContent = 'Нет';
    document.getElementById('is-complete-bipartite').textContent = 'Нет';
}

// Обработчик ввода матрицы смежности
// document.getElementById('adjacency-matrix').addEventListener('keydown', function (e) {
//     if (e.key === 'Enter') {
//         e.preventDefault();
//         const matrix = parseMatrix(this.value);

//         fetch('/api/graph', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 action: 'update_matrix',
//                 matrix: matrix
//             })
//         })
// .then(response => response.json())
// .then(data => {
//     updateGraphVisualization(data);
//     updateGraphProperties(data.properties);
// })
//             .catch(error => console.error('Error:', error));
//     }
// });

// Обновление свойств графа
function updateGraphProperties(properties) {
    document.getElementById('vertex-count').textContent = properties.vertex_count;
    document.getElementById('edge-count').textContent = properties.edge_count;
    document.getElementById('components').textContent = properties.components;
    document.getElementById('is-eulerian').textContent = properties.is_eulerian ? 'Да' : 'Нет';
    document.getElementById('is-semi-eulerian').textContent = properties.is_semi_eulerian ? 'Да' : 'Нет';
    document.getElementById('is-bipartite').textContent = properties.is_bipartite ? 'Да' : 'Нет';
    document.getElementById('is-complete-bipartite').textContent = properties.is_complete_bipartite ? 'Да' : 'Нет';
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    initGraphVisualization();
});

function clearAll() {
    // 1. Очищаем поле ввода матрицы
    document.getElementById('adjacency-matrix').value = '';

    // 2. Очищаем визуализацию графа
    if (network) {
        network.setData({
            nodes: new vis.DataSet([]),
            edges: new vis.DataSet([])
        });
    }

    // 3. Сбрасываем счётчик узлов
    document.getElementById('node-count').value = '0';

    // 4. Сбрасываем свойства графа
    resetGraphProperties();

    // 5. Отправляем запрос на сервер для очистки
    fetch('/api/graph', {
        method: 'DELETE'
    }).catch(error => console.error('Ошибка при очистке:', error));
}

// Функция сброса свойств графа
function resetGraphProperties() {
    const properties = {
        'vertex-count': '0',
        'edge-count': '0',
        'components': '0',
        'is-eulerian': 'Нет',
        'is-semi-eulerian': 'Нет',
        'is-bipartite': 'Нет',
        'is-complete-bipartite': 'Нет',
        'vertex-degree': '-',
        'vertex-value': '-'
    };

    Object.entries(properties).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
}

// Обработчик кнопки "Очистить всё"
document.getElementById('clear-all').addEventListener('click', clearAll);

document.getElementById('clear-all').addEventListener('click', () => {
    if (confirm('Вы уверены, что хотите полностью очистить граф?')) {
        clearAll();
    }
});