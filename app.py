from groq import Groq
import os
import requests
from flask_cors import CORS
from flask import Flask,jsonify,request
app = Flask(__name__)

CORS(app)


API_KEY_LLAMA = "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"

def generate_llama_response(context,prompt):
    pre_defined=f"""You will recieve user's medical history :{context}\n
                    You are a professional doctor,you have to assist the user with his basic questions: {prompt}
                 """
    
    client = Groq(api_key=API_KEY_LLAMA)
    response = client.chat.completions.create(
        messages=[{"role": "user", "content": pre_defined}],
        model="llama3-8b-8192",
    )
    return response.choices[0].message.content


@app.route('/chat', methods=['POST'])

def chat():
    data=request.get_json()
    if not 'prompt' or 'user_data' not in data:
        return jsonify({"error": "Invalid input. Please provide 'user_data' in JSON format."}), 400

    query = data['prompt']
    user= data['user_data']
    response=generate_llama_response(user,query)
    

    return jsonify({"response": response})



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)