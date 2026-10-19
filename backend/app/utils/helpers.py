from flask import jsonify

def api_response(data=None, message="Success", status_code=200, success=True):
    response = {
        "status": "success" if success else "error",
        "message": message,
        "data": data if data is not None else {}
    }
    return jsonify(response), status_code

def error_response(message="An error occurred", status_code=400, details=None):
    response = {
        "status": "error",
        "message": message,
        "details": details or {}
    }
    return jsonify(response), status_code
