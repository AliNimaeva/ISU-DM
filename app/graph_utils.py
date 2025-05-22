import networkx as nx
import numpy as np

class GraphManager:
    def __init__(self):
        self.graph = nx.Graph()
    
    def update_from_matrix(self, matrix):
        self.graph = nx.from_numpy_array(matrix)
    
    def add_node(self, node_id):
        self.graph.add_node(node_id)
    
    def add_edge(self, source, target):
        self.graph.add_edge(source, target)
    
    def get_graph_data(self):
        return {
            'nodes': list(self.graph.nodes),
            'edges': list(self.graph.edges),
            'properties': self._calculate_properties()
        }
    
    def _calculate_properties(self):
        return {
            'vertex_count': self.graph.number_of_nodes(),
            'edge_count': self.graph.number_of_edges(),
            'components': nx.number_connected_components(self.graph),
            'is_eulerian': nx.is_eulerian(self.graph),
            'is_semi_eulerian': self._is_semi_eulerian(),
            'is_bipartite': nx.is_bipartite(self.graph),
            'is_complete_bipartite': nx.is_bipartite(self.graph) and 
                                    nx.is_connected(self.graph)
        }
    
    def _is_semi_eulerian(self):
        # Реализация проверки на полуэйлеров граф
        try:
            return nx.has_eulerian_path(self.graph)
        except:
            return False
        
    def update_from_matrix(self, matrix):
        try:
            # Преобразуем в numpy array для проверки
            matrix = np.array(matrix)
            if matrix.ndim != 2 or matrix.shape[0] != matrix.shape[1]:
                raise ValueError("Матрица должна быть квадратной")
            
            # Создаем новый граф из матрицы
            self.graph = nx.from_numpy_array(matrix)
            
            # Перенумеровываем узлы с 1 вместо 0
            self.graph = nx.relabel_nodes(self.graph, {i: i+1 for i in range(len(matrix))})
            
        except Exception as e:
            raise ValueError(f"Ошибка обработки матрицы: {str(e)}")