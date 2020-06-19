from flask import Flask
from flask import render_template
import os

app = Flask(__name__)
port = int(os.environ.get("PORT", 5000))

@app.route('/')
def index():
    return render_template("index.html")

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0',port=port)