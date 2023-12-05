
import os

class Config:
    # ... outras configurações ...

    # Configuração para utilizar SQLite em memória
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    WTF_CSRF_ENABLED = False