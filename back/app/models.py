from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
from app import db
from datetime import datetime

class Admin(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    is_admin = db.Column(db.Boolean, default=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    

class Election(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(128), index=True, unique=True, nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    alpha = db.Column(db.String(9999))
    beta = db.Column(db.String(9999))
    p = db.Column(db.String(9999))
    chave_publica_criptografia = db.Column(db.String(9999))
    chave_privada_criptografia = db.Column(db.String(9999))
    votos_acumulados_criptografados = db.Column(db.String(9999)) 
    c_produtorio = db.Column(db.String(9999))
    r_somatorio = db.Column(db.String(9999))
    finalizada = db.Column(db.Boolean, default=False)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    data_finalizacao = db.Column(db.DateTime)
    admin_responsavel = db.Column(db.Integer, db.ForeignKey('admin.id'))

    def __repr__(self):
        return f'<Election {self.nome}>'
    

class Eleitor(db.Model):
    uuid = db.Column(db.String(36), nullable=False, primary_key=True, default=str(uuid.uuid4()))
    identificador_eleitor = db.Column(db.String(128), nullable=False, unique=True)
    eleicao_id = db.Column(db.Integer, db.ForeignKey('election.id'), nullable=False)
    eleicao = db.relationship('Election', backref=db.backref('eleitores', lazy=True))

    def __repr__(self):
        return f'<Eleitor {self.identificador_eleitor}>'
    

class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    voto_criptografado = db.Column(db.String(9999), nullable=False)
    hash_identificador_voto = db.Column(db.String(9999), unique=False, nullable=False)
    r = db.Column(db.String(9999))
    eleicao_id = db.Column(db.Integer, db.ForeignKey('election.id'), nullable=False)
    eleicao = db.relationship('Election', backref=db.backref('votos', lazy=True))

    def __repr__(self):
        return f'<Vote {self.id}>'