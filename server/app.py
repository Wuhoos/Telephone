from flask import Flask, make_response, jsonify, request, session
from dotenv import load_dotenv
from flask_cors import CORS, cross_origin
import json
import os
from pathlib import Path
import openai
import requests
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# import http.client
# import base64
from flask_bcrypt import Bcrypt
from models import db, User, Story

load_dotenv()


app = Flask(__name__)

app.config["SECRET_KEY"] = "mysecret"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.json.compact = False


db.init_app(app)
cors = CORS(app, resources="/*", support_credentials=True)

# app.config["CORS_SUPPORTS_CREDENTIALS"] = True

# app.config["CORS_ALLOW_HEADERS"] = [
#     "Content-Type",
#     "Authorization",
#     "DNT",
#     "X-CustomHeader",
#     "Keep-Alive",
#     "User-Agent",
#     "X-Requested-With",
#     "If-Modified-Since",
#     "Cache-Control",
# ]

# app.config["CORS_EXPOSE_HEADERS"] = [
#     "Content-Type",
#     "Authorization",
#     "DNT",
#     "X-CustomHeader",
#     "Keep-Alive",
#     "User-Agent",
#     "X-Requested-With",
#     "If-Modified-Since",
#     "Cache-Control",
# ]

# app.config["CORS_ORIGINS"] = "http:127.0.0.1:3000"

# app.config["CORS_HEADERS"] = [
#     "DNT",
#     "X-CustomHeader",
#     "Keep-Alive",
#     "User-Agent",
#     "X-Requested-With",
#     "If-Modified-Since",
#     "Cache-Control",
#     "Content-Type",
# ]

# # CORS(app.app)

# CORS(
#     app,
#     resources={
#         r"*": {
#             "origins": "http:127.0.0.1:3000",
#             "allow_headers": ["Content-Type", "Authorization"],
#             "expose_headers": ["Content-Type", "Authorization"],
#             "supports_credentials": True,
#         },
#     },
# )


cors = CORS(app, resources={r"*": {"origins": "*"}}, support_credentials=True)
app.config['CORS_HEADERS'] = 'Content-Type'
bcrypt = Bcrypt(app)
migrate = Migrate(app, db)

openai.api_key = os.environ.get("OPENAI_API_KEY")


@app.post("/storyGenerator")
def storyGenerator():
    data = request.get_json()
    prompt = data.get("prompt")
    # print(prompt)

    if not prompt:
        return make_response(jsonify({"error": "need a prompt"}), 400)
    try:
        messages = [
            {
                "role": "user",
                "content": f"write me a short story that is less than 75 words about {prompt}",
            }
        ]
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo", messages=messages, max_tokens=1000
        )

        story = response.choices[0].message.content
        # print(story)

        return make_response(jsonify({"content": story}), 200)

    except Exception as e:
        print(e)
        return make_response(jsonify({"error": "cannot generate story"}), 500)


@app.post("/imageGenerator")
def imageGenerator():
    data = request.json
    imagePrompt = data.get("imagePrompt")
    DATA_DIR = Path.cwd() / "responses"
    DATA_DIR.mkdir(exist_ok=True)

    if not imagePrompt:
        return make_response(jsonify({"error": "need imagePrompt"}), 400)
    try:
        PROMPT = f"3d style image of ${imagePrompt}"
        response = openai.Image.create(
            prompt=PROMPT, n=1, size="512x512", response_format="b64_json"
        )
        file_name = DATA_DIR / f"{PROMPT[:5]}-{response['created']}.json"

        with open(file_name, mode="w", encoding="utf-8") as file:
            json.dump(response, file)

        image64 = response["data"][0]["b64_json"]
        # print(image64)

        return make_response(jsonify({"image64": image64}))

    except Exception as e:
        print(e)
        return make_response(
            jsonify({"error": "promot have to be less than less 1000 character"}), 400
        )


@app.post("/imageToStoryGenerator")
def imageToStoryGenerator():
    try:
        data = request.get_json()
        image64 = data.get("image64")

        YOUR_GENERATED_KEY = os.environ.get("YOUR_GENERATED_KEY")
        headers = {
            "x-api-key": f"token {YOUR_GENERATED_KEY}",
            "content-type": "application/json",
        }

        data = {"data": [{"image": f"data:image/png;base64,{image64}", "features": []}]}
        # print(data)
        response = requests.post(
            "https://api.scenex.jina.ai/v1/describe", json=data, headers=headers
        )

        story = response.json()["result"][0]["text"]
        # import pdb; pdb.set_trace()
        # story = response_data.get('story')
        print(story)

        return make_response(jsonify({"story": story}))
    except Exception as e:
        print(e)
        return make_response(jsonify({"error": "cannot generate from image"}))


@app.post("/signup")
def signup():
    data = request.get_json()

    try:
        newUser = User(username=data["username"])
        newUser.password = bcrypt.generate_password_hash(data["password"])

        db.session.add(newUser)
        db.session.commit()
        session["user_id"] = newUser.id
        return newUser.to_dict(), 201
    except Exception as e:
        print(e)
        return make_response(jsonify({"error": "cannot signup"}, 422))


@app.post("/login")
def login():
    data = request.get_json()

    user = User.query.filter(User.username == data["username"]).first()

    if not user and bcrypt.check_password_hash(user.password, data["password"]):
        response = make_response(jsonify({"error": "invalid loging info"}), 404)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    session["user_id"] = user.id
    response = make_response(jsonify(user.to_dict()), 201)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@app.delete("/logout")
def logout():
    response = make_response(jsonify({"msg": "Logged Out"}), 204)
    response.headers.add("Access-Control-Allow-Origin", "*")
    session.pop("user_id")
    return response


@app.get("/checkSession")
@cross_origin()
def checkSession():
    user_id = session.get("user_id")
    user = User.query.filter(User.id == user_id).first()
    if not user:
        print('test')
        response = make_response(jsonify({"error": "invalid loging info"}), 404)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    response = make_response(jsonify(user.to_dict()), 200)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


if __name__ == "__main__":
    app.run(port=5555, debug=True)
