from flask import Flask, make_response, jsonify, request, session
from dotenv import load_dotenv
load_dotenv()
from flask_cors import CORS
import json
import os
from pathlib import Path
import openai
import requests
openai.api_key = os.environ.get("OPENAI_API_KEY")

import http.client
import base64




app = Flask(__name__)

cors = CORS(app, resources={r"*": {"origins": "*"}})

@app.post('/storyGenerator')
def storyGenerator():
    data = request.get_json()
    prompt = data.get('prompt')
    # print(prompt)

    if not prompt:
        return make_response(jsonify({'error':"need a prompt"}),400)
    try:
        messages = [{"role": "user", "content": f'write me a short story that is less than 75 words about {prompt}'}]
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages= messages,
            max_tokens= 1000
        )

        story = response.choices[0].message.content
        # print(story)

        return make_response(jsonify({"content": story}), 200)
    
    except Exception as e:
        print(e)
        return make_response(jsonify({'error':"cannot generate story"}), 500)
    
@app.post('/imageGenerator')
def imageGenerator():
    data = request.json
    imagePrompt = data.get('imagePrompt')
    DATA_DIR = Path.cwd() / 'responses'
    DATA_DIR.mkdir(exist_ok=True)

    # if not imagePrompt:
    #     return make_response(jsonify({'error': 'need imagePrompt'}),400)
    try:
        PROMPT = f'3d style image of ${imagePrompt}'
        response = openai.Image.create(
            prompt = PROMPT,
            n = 1,
            size= '512x512',
            response_format = 'b64_json'
        )
        file_name = DATA_DIR / f"{PROMPT[:5]}-{response['created']}.json"

        with open(file_name, mode='w', encoding='utf-8') as file:
            json.dump(response, file)

        image64 = response['data'][0]['b64_json']
        # print(image64)

        return make_response(jsonify({'image64':image64}))

    except Exception as e:
        print(e)
        return make_response(jsonify({'error': 'promot have to be less than less 1000 character'}),400)
    


# @app.post('/imageToStoryGenerator')
# def image_to_data_uri(file_path):
#     with open(file_path, "rb") as image_file:
#         encoded_image = base64.b64encode(image_file.read()).decode("utf-8")
#         return f"data:image/jpeg;base64,{encoded_image}"
# def imageToStoryGenerator():
#     data = {
#         "data": [
#             {"image": image_to_data_uri(f'data:image/png;base64,{image64}'), "features": []},
#         ]
#     }

#     YOUR_GENERATED_KEY = os.environ.get('YOUR_GENERATED_KEY')
#     headers = {
#         "x-api-key": f"token {YOUR_GENERATED_KEY}",
#         "content-type": "application/json",
#     }
#     connection = http.client.HTTPSConnection("api.scenex.jina.ai")
#     connection.request("POST", "/v1/describe", json.dumps(data), headers)
#     response = connection.getresponse()
#     print(response.status, response.reason)
#     response_data = response.read().decode("utf-8")
#     print(response_data)
#     connection.close()
#     return {"story":response_data}

@app.post('/imageToStoryGenerator')
def imageToStoryGenerator():
    try:
        data = request.get_json()
        image64 = data.get('image64')

        YOUR_GENERATED_KEY = os.environ.get('YOUR_GENERATED_KEY')
        headers = {
            "x-api-key": f"token {YOUR_GENERATED_KEY}",
            "content-type": "application/json",
        }

        data = {
            'data': [{'image': f'data:image/png;base64,{image64}', "features": []}]
        }
        # print(data)
        response = requests.post("https://api.scenex.jina.ai/v1/describe", json=data, headers=headers)

        story = response.json()['result'][0]['text']
        # import pdb; pdb.set_trace()
        # story = response_data.get('story')
        print(story)

        return make_response(jsonify({'story': story}))
    except Exception as e:
        print(e)
        return make_response(jsonify({'error': 'cannot generate from image'}))
    
    
if __name__ == '__main__':
    app.run(port=5555, debug=True)