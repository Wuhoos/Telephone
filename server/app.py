from flask import Flask, make_response, jsonify, request, session
from config import app
import os
from dotenv import load_dotenv
load_dotenv()
import openai
openai.api_key = os.environ.get("OPENAI_API_KEY")


# response = openai.ChatCompletion.create(
#     model='gpt-3.5-turbo',
#     messages=[
#         {"role": "user", "content": "Write a short story about two lions in two paragraphs"}
#     ]
# )
# print(response.choices[0].message)

@app.post('/generateStory')
def generateStoru():
    data = request.get_json()
    # prompt = data.get('prompt')

    # if not prompt:
    #     return make_response(jsonify({'error':"need a prompt"}),400)
    try:
        messages = [{"role": "user", "content": data.get('prompt')}]
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages= messages,
            max_tokens= 1000
        )
        story = response.choices[0].message.content

        return make_response(jsonify({"content": story}), 200)
    except Exception as e:
        print(e)
        return make_response(jsonify({'error':"cannot generate story"}), 500)
    
if __name__ == '__main__':
    app.run(port=5555, debug=True)