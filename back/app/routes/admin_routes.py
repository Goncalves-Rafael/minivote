from flask import Blueprint, jsonify, request
from flask_login import current_user
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import check_password_hash
from app.models import Admin, Election, Vote
from app.forms import ElectionForm
from app.engine import cripto
from app import app, db
from datetime import datetime
from sqlalchemy import func

@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.get_json()
    login = data.get('login')
    password = data.get('password')

    user = Admin.query.filter_by(login=login).first()
    if user and user.id and check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"error": "Invalid login credentials"}), 401

@app.route('/api/current_user', methods=['GET'])
@jwt_required()
def api_current_user():
    current_user_id = get_jwt_identity()
    user = Admin.query.get(current_user_id)
    return jsonify({"login": user.login, "is_admin": user.is_admin, "id": user.id}), 200

@app.route('/api/register', methods=['POST'])
def api_register():
    data = request.get_json()
    login = data.get('login')
    password = data.get('password')

    existing_user = Admin.query.filter_by(login=login).first()

    if existing_user:
        return jsonify({"error": "User with this login already exists"}), 400

    new_user = Admin(login=login)
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Registration successful"}), 201


admin_bp = Blueprint('admin', __name__)

# Rota para criar uma nova eleição
@admin_bp.route('/api/create_election', methods=['POST'])
@jwt_required()
def api_create_election():
    # Verificar se o usuário autenticado é um administrador
    current_user_id = get_jwt_identity()
    user = Admin.query.get(current_user_id)
    if not user.is_admin:
        return jsonify({'error': 'Você não tem permissão para criar uma eleição.'}), 403

    # Obter os dados do corpo da requisição JSON
    data = request.get_json()

    # Verificar se os campos obrigatórios estão presentes
    required_fields = ['nome', 'descricao']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'O campo {field} é obrigatório.'}), 400

    p, alpha, beta = cripto.get_new_election_random_values()
    priv, pub = cripto.generate_keypair()

    # Verificar se os dados fornecidos são válidos
    form = ElectionForm(data=data)
    if form.validate():
        # Criar uma nova eleição e salvar no banco de dados
        new_election = Election(
            nome=form.nome.data,
            descricao=form.descricao.data,
            p=str(p),
            alpha=str(alpha),
            beta=str(beta),
            chave_publica_criptografia = str(pub),
            chave_privada_criptografia = str(priv),
            c_produtorio='1',
            votos_acumulados_criptografados='1',
            r_somatorio='1',
            admin_responsavel=user.id
        )
        db.session.add(new_election)
        db.session.commit()

        return jsonify({'message': 'Eleição criada com sucesso', 'id': new_election.id}), 201
    else:
        # Se os dados não são válidos, retornar uma resposta de erro
        return jsonify({'error': 'Falha ao criar a eleição. Verifique seus dados.'}), 400
    
@admin_bp.route('/api/list_elections', methods=['GET'])
@jwt_required()
def api_list_elections():
    try:
        # Obter o ID do admin a partir do token JWT
        admin_id = get_jwt_identity()

        # Verificar se o admin existe
        admin = Admin.query.get(admin_id)
        if not admin:
            return jsonify({'error': 'Admin não encontrado.'}), 404

        # Obter todas as eleições associadas a este admin
        eleicoes = Election.query.filter_by(admin_responsavel=admin_id).all()

        # Montar a lista de eleições para retorno
        eleicoes_data = []
        for eleicao in eleicoes:
            eleicao_data = {
                'id': eleicao.id,
                'nome': eleicao.nome,
                'descricao': eleicao.descricao,
                'data_criacao': eleicao.data_criacao.isoformat(),
                'data_finalizacao': eleicao.data_finalizacao.isoformat() if eleicao.data_finalizacao else None,
                'finalizada': eleicao.finalizada,
            }
            eleicoes_data.append(eleicao_data)

        return jsonify({'eleicoes': eleicoes_data}), 200

    except Exception as e:
        return jsonify({'error': f'Erro ao listar as eleições: {str(e)}'}), 500
    
@admin_bp.route('/api/get_election/<int:election_id>', methods=['GET'])
def api_get_election(election_id):

    # Obter a eleição do banco de dados
    election = Election.query.get(election_id)

    # Verificar se a eleição existe
    if not election:
        return jsonify({'error': 'Eleição não encontrada.'}), 404
    
    # Obter resultados da eleição se ela estiver finalizada
    resultados = None
    if election.finalizada:
        resultados = obter_resultados(election_id)

    # Montar os dados da eleição para retorno, excluindo a chave privada
    election_data = {
        'id': election.id,
        'nome': election.nome,
        'descricao': election.descricao,
        'alpha': election.alpha,
        'beta': election.beta,
        'p': election.p,
        'chave_publica': election.chave_publica_criptografia,
        'finalizada': election.finalizada,
        'data_criacao': election.data_criacao.strftime('%Y-%m-%d %H:%M:%S'),
        'admin_responsavel': election.admin_responsavel,
        'c_produtorio': election.c_produtorio if election.finalizada else None,
        'resultados': resultados,
    }

    return jsonify(election_data), 200


def obter_resultados(eleicao_id):
    # Consultar o banco de dados para obter resultados da eleição
    resultados = (
        db.session.query(
            Vote.voto_criptografado,
            func.count(Vote.voto_criptografado).label('total_votos')
        )
        .filter_by(eleicao_id=eleicao_id)
        .group_by(Vote.voto_criptografado)
        .order_by(func.count(Vote.voto_criptografado).desc())
        .all()
    )

    # Montar a lista de resultados
    resultados_data = []
    for resultado in resultados:
        resultado_data = {
            'voto_criptografado': resultado[0],
            'total_votos': resultado[1],
        }
        resultados_data.append(resultado_data)

    return resultados_data


@admin_bp.route('/api/finalize_election/<int:eleicao_id>', methods=['POST'])
@jwt_required()
def api_finalize_election(eleicao_id):
    try:
        # Verificar se a eleição existe
        eleicao = Election.query.get(eleicao_id)
        if not eleicao:
            return jsonify({'error': 'Eleição não encontrada.'}), 404

        # Verificar se o usuário logado é o admin responsável pela eleição
        admin_id = get_jwt_identity()
        admin = Admin.query.get(admin_id)
        print("admin responsavel" + str(eleicao.admin_responsavel))
        if not admin or eleicao.admin_responsavel != admin.id:
            return jsonify({'error': 'Usuário não autorizado para finalizar esta eleição.'}), 403

        # Verificar se a eleição já foi finalizada
        if eleicao.finalizada:
            return jsonify({'error': 'Esta eleição já foi finalizada.'}), 400

        # Atualizar a data de finalização da eleição
        eleicao.data_finalizacao = datetime.utcnow()
        eleicao.finalizada = True

        # Realizar a validação dos votos (chame o método apropriado para sua lógica)
        votos = Vote.query.filter_by(eleicao_id=eleicao_id).all()
        if (not cripto.validar_eleicao(eleicao, votos)):
            return jsonify({'error': 'Falha ao validar dados da eleição.'}), 400

        # Commitar as alterações no banco de dados
        db.session.commit()

        return jsonify({'message': 'Eleição finalizada com sucesso.'}), 200

    except Exception as e:
        return jsonify({'error': f'Erro ao finalizar a eleição: {str(e)}'}), 500
