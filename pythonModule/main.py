from flask import Flask, request, jsonify
from route_utils import compute_full_route

app = Flask(__name__)

@app.route("/", methods=["GET"])
def api():
    return jsonify("Hello World!!!")

@app.route("/route", methods=["POST"])
def route():
    data = request.get_json()

    full_route = compute_full_route(data["start"], data["addresses"])

    return jsonify(full_route)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)