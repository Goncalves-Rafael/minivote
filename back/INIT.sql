CREATE TABLE admin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    login VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(128) NOT NULL,
    -- Outros campos relevantes para o administrador, se necessário
);

CREATE TABLE election (
    id INT PRIMARY KEY AUTO_INCREMENT,
    data_criacao DATETIME NOT NULL,
    admin_responsavel INT,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    p VARCHAR(255) NOT NULL,
    alpha VARCHAR(255) NOT NULL,
    beta VARCHAR(255) NOT NULL,
    chave_publica_criptografia VARCHAR(255) NOT NULL,
    chave_privada_criptografia VARCHAR(255) NOT NULL,
    votos_acumulados_criptografados VARCHAR(255) NOT NULL,
    finalizada BOOLEAN NOT NULL,
    FOREIGN KEY (admin_responsavel) REFERENCES admin(id)
);

CREATE TABLE vote (
    id INT PRIMARY KEY AUTO_INCREMENT,
    election_id INT,
    voto_criptografado VARCHAR(255) NOT NULL,
    hash_identificador_voto VARCHAR(255) UNIQUE NOT NULL,
    -- Outros campos relevantes para o voto, se necessário
    FOREIGN KEY (election_id) REFERENCES election(id)
);