from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, TextAreaField
from wtforms.validators import DataRequired, Length

class LoginForm(FlaskForm):
    login = StringField('Login', validators=[DataRequired(), Length(min=4, max=50)])
    password = PasswordField('Senha', validators=[DataRequired()])
    submit = SubmitField('Login')

class RegistrationForm(FlaskForm):
    login = StringField('Login', validators=[DataRequired(), Length(min=4, max=50)])
    password = PasswordField('Senha', validators=[DataRequired()])
    submit = SubmitField('Registrar')

class ElectionForm(FlaskForm):
    nome = StringField('Nome da Eleição', validators=[DataRequired()])
    descricao = TextAreaField('Descrição da Eleição', validators=[DataRequired()])
    # Adicione outros campos conforme necessário
    submit = SubmitField('Criar Eleição')