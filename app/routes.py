from flask import Blueprint, render_template, request, jsonify
from .algorithms import GraphAlgorithms
from .graph_utils import GraphManager
import networkx as nx

bp = Blueprint('main', __name__)
algorithms = GraphAlgorithms()
graph_manager = GraphManager()

@bp.route('/')
def index():
    return render_template('index.html')

@bp.route('/api/graph', methods=['POST'])
def handle_graph():
    data = request.json
    action = data.get('action')
    
    try:
        if action == 'update_matrix':
            matrix = data.get('matrix')
            graph_manager.update_from_matrix(matrix)
        elif action == 'add_node':
            graph_manager.add_node(data.get('node_id'))
        elif action == 'add_edge':
            graph_manager.add_edge(data.get('source'), data.get('target'))
        
        return jsonify(graph_manager.get_graph_data())
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@bp.route('/api/algorithm', methods=['POST'])
def run_algorithm():
    data = request.json
    algorithm = data.get('algorithm')
    result = algorithms.execute(algorithm, graph_manager.graph)
    return jsonify(result)

@bp.route('/api/graph', methods=['DELETE'])
def clear_graph():
    try:
        # Полная очистка графа
        graph_manager.graph = nx.Graph()
        
        return jsonify({
            'status': 'success',
            'data': {
                'nodes': [],
                'edges': [],
                'properties': {
                    'vertex_count': 0,
                    'edge_count': 0,
                    'components': 0,
                    'is_eulerian': False,
                    'is_semi_eulerian': False,
                    'is_bipartite': False,
                    'is_complete_bipartite': False
                }
            }
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400