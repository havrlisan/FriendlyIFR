from flask import Flask, render_template, send_from_directory

app = Flask(__name__, static_url_path='')

# Ensure templates are auto-reloaded
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

# Ensure responses aren't cached
@app.after_request
def after_request(response):
  response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
  response.headers['Expires'] = 0
  response.headers['Pragma'] = 'no-cache'
  return response

# Routes for files
@app.route('/lib/<path:path>')
def send_lib(path):
    return send_from_directory('lib', path)

@app.route('/source/<path:path>')
def send_source(path):
    return send_from_directory('source', path)

@app.route('/styles/<path:path>')
def send_styles(path):
    return send_from_directory('styles', path)

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

@app.route('/favicon.ico')
def favicon():
    return app.send_static_file('favicon.ico')

# FriendlyIFR route
@app.route('/')
def home():
    return render_template('friendlyIFR.html')

# Documentation route
@app.route('/docs')
def docs():
    return render_template('documentation.html')

# About route
@app.route('/about')
def about():
    return render_template('about.html')