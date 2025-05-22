from flask import Flask
from .routes import bp

def create_app():
    app = Flask(__name__)
    app.config.from_object('config')
    
    # Регистрируем blueprint
    app.register_blueprint(bp)
    
    return app