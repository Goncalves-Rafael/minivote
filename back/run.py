from app import app, db

app.secret_key = "super secret key"

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)