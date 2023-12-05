from flask import Blueprint, jsonify, request
from uuid import uuid4
from app import app, db
from app.models import Eleitor, Vote, Election
import random
from app.engine import cripto

vote_bp = Blueprint('vote', __name__)

@vote_bp.route('/api/register_vote', methods=['POST'])
def api_register_vote():
    try:
        data = request.get_json()

        # Verificar se os campos necessários estão presentes na requisição
        required_fields = ['voto', 'r', 'identificador_eleitor', 'eleicao_id']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'O campo {field} é obrigatório.'}), 400

        # Verificar se o eleitor já votou nesta eleição
        eleitor_existente = Eleitor.query.filter_by(
            identificador_eleitor=data['identificador_eleitor'],
            eleicao_id=data['eleicao_id']
        ).first()

        if eleitor_existente:
            return jsonify({'error': 'Este eleitor já votou nesta eleição.'}), 400

        # Recuperar os dados da eleição
        eleicao = Election.query.get(data['eleicao_id'])

        if not eleicao:
            return jsonify({'error': 'Eleição não encontrada.'}), 404
        
        if eleicao.finalizada:
            return jsonify({'error': 'Esta eleição já foi finalizada. Não é possível registrar novos votos.'}), 400


        # Iniciar uma transação
        with db.session.begin_nested():

            # Registrar o eleitor na tabela de Eleitor
            novo_eleitor = Eleitor(
                uuid=str(uuid4()),
                identificador_eleitor=data['identificador_eleitor'],
                eleicao_id=data['eleicao_id']
            )

            db.session.add(novo_eleitor)

            # Agora, registrar o voto na tabela de Voto
            novo_voto = gerar_voto(data['voto'], data['r'], eleicao)

            db.session.add(novo_voto)

            # Atualizar os dados votos_acumulados_criptografados na tabela de Eleição
            atualizar_dados_eleicao(eleicao, data['voto'], data['r'])
            print("Post_atualizar_dados_eleicao")

        return jsonify({'message': 'Voto registrado com sucesso.'}), 201

    except Exception as e:
        return jsonify({'error': f'Erro ao registrar o voto: {str(e)}'}), 500
    
@vote_bp.route('/api/list_votes/<int:eleicao_id>', methods=['GET'])
def api_list_votes(eleicao_id):
    try:
        # Verificar se a eleição existe
        eleicao = Election.query.get(eleicao_id)
        if not eleicao:
            return jsonify({'error': 'Eleição não encontrada.'}), 404

        # Obter os votos da eleição
        votos = Vote.query.filter_by(eleicao_id=eleicao_id).all()

        # Montar a lista de votos para retorno
        votos_data = []
        for voto in votos:
            voto_data = {
                'id': voto.id,
                'voto_criptografado': voto.voto_criptografado,
                'hash_identificador_voto': voto.hash_identificador_voto,
                'r': voto.r,
                'eleicao_id': voto.eleicao_id,
            }
            votos_data.append(voto_data)

        return jsonify({'votos': votos_data}), 200

    except Exception as e:
        return jsonify({'error': f'Erro ao listar os votos: {str(e)}'}), 500


def gerar_voto(voto, r, eleicao):
    """Função para gerar os dados de um voto."""
    return Vote(
        voto_criptografado=voto, # cripto.encrypt(cripto.PublicKey.from_string(eleicao.chave_publica_criptografia), voto),
        hash_identificador_voto=str(cripto.hash_function(voto)),
        r=r,
        eleicao_id=eleicao.id
    )

def atualizar_dados_eleicao(eleicao, voto, r):
    """Função para calcular os novos votos acumulados criptografados."""
    public_key = cripto.PublicKey.from_string(eleicao.chave_publica_criptografia)
    commitment = cripto.commitment(eleicao.alpha, eleicao.beta, eleicao.p, r, voto)
    r_ciphered = cripto.encrypt(public_key, r)
    eleicao.c_produtorio = str(cripto.addemup(eleicao.c_produtorio, commitment))
    eleicao.votos_acumulados_criptografados = str(cripto.addemup(eleicao.votos_acumulados_criptografados, r_ciphered))
    eleicao.r_somatorio = str(cripto.addemup(eleicao.r_somatorio, r_ciphered))