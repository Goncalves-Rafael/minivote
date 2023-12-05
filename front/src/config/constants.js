const INSTRUCTIONS = {
    HOME: {
        description: 'Nesta tela é possível criar um novo grupo para realizar um amigo oculto, assim que criado salve os links que serão gerados e envie para os participantes.',
        tips: [
            'Preencha o campo "Nome do grupo" com o nome que deseja nomear seu amigo oculto',
            'Clique em "CRIAR" para criar um novo amigo oculto, após isso os campos abaixo serão preenchidos com links para interagir com o seu amigo oculto',
            'Salve a URL Admin em algum local e não compartilhe, nele você poderá verificar quem já se cadastrou, realizar o sorteio e acompanhar quem já verificou o resultado do sorteio',
            'Copie a URL Convite e envie para todos os seus amigos que irão participar do amigo oculto'
        ]
    },
    ADMIN: {
        description: 'Nesta tela é possível acompanhar o andamento do amigo oculto criado.',
        tips: [
            'Na lista é possível observar o nome de todos os participantes que já foram cadastrados',
            'Na frente do nome o ícone do olho aberto ou fechado indica se o participante já visualizou ou não o resultado do sorteio',
            'Na última coluna é possível habilitar/desabilitar cada participante do grupo do amigo oculto',
            'Ao clicar em "SORTEAR" todos os amigos são sorteados, e cada um passa a poder acompanhar o resultado do sorteio (descobrir quem é o amigo oculto) na URL gerada na página de convite'
        ]
    },
    INVITE: {
        description: 'Nesta tela é possível participar de um amigo oculto criado.',
        tips: [
            'Preencha o campo "Seu nome" com seu nome',
            'Clique em "REGISTRAR" para se cadastrar no amigo oculto',
            'Salve a URL do Participante em algum local, nela será possível acompanhar o amigo oculto, e assim que o sorteio for realizado poderá ver quem é seu amigo oculto'
        ]
    }
}

export {
    INSTRUCTIONS
};