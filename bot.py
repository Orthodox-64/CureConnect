from groq import Groq
import os
import requests
from flask_cors import CORS
from flask import Flask, jsonify, request

app = Flask(__name__)

CORS(app)

API_KEY_LLAMA = "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"

def generate_llama_response(context, prompt, lan):
    # Define the language-specific pre-defined message
    pre_defined = ""
    if lan == 'en':
        pre_defined = f"""
        Answer in English.
        You will receive the user's medical history: {context}
        You are a professional doctor. Assist the user with their basic questions: {prompt}

        If the user mentions symptoms like cough, fever, or any other illness, provide advice on possible home remedies, and suggest basic steps to take at home. You should not diagnose but rather offer helpful tips to manage the symptoms. professionaly in very short.
        """
    elif lan == 'hi':
        pre_defined = f"""
        Answer in Hindi.
        उपयोगकर्ता की चिकित्सा इतिहास प्राप्त होगा: {context}
        आप एक पेशेवर डॉक्टर हैं, उपयोगकर्ता के सामान्य सवालों में सहायता करें: {prompt}

        यदि उपयोगकर्ता खांसी, बुखार या अन्य किसी बीमारी के लक्षणों का उल्लेख करता है, तो घर के इलाज के लिए सलाह दें, और घर पर उठाए जाने वाले बुनियादी कदमों का सुझाव दें। आपको निदान नहीं करना चाहिए, बल्कि लक्षणों को प्रबंधित करने के लिए सहायक सुझाव देना चाहिए। उपयोगकर्ता को याद दिलाएं कि यदि लक्षण बने रहें, तो उन्हें स्वास्थ्य पेशेवर से परामर्श करना चाहिए।
        """
    elif lan == 'mr':
        pre_defined = f"""
        Answer in Marathi.
        उपयोगकर्त्याचा वैद्यकीय इतिहास मिळेल: {context}
        तुम्ही एक व्यावसायिक डॉक्टर आहात, वापरकर्त्याच्या सामान्य प्रश्नांची उत्तरे द्या: {prompt}

        जर वापरकर्त्याने खोकला, ताप किंवा इतर कोणत्याही आजाराच्या लक्षणांचा उल्लेख केला, तर घरगुती उपचारांबद्दल सल्ला द्या आणि घरच्या घरी करण्यासाठी काही सोप्या उपायांचा सुचवणूक करा. तुम्हाला निदान करू नये, तर लक्षणांचा व्यवस्थापन करण्यासाठी मदत करणारे टिप्स द्यावीत. जर लक्षणे टिकली तर, वापरकर्त्याला आरोग्य तज्ञाशी सल्लामसलत करण्याची आठवण द्या.
        """
    else:
        return "Unsupported language."

    # Call the Groq API for completion
    try:
        client = Groq(api_key=API_KEY_LLAMA)
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": pre_defined}],
            model="llama3-8b-8192",
        )
        return response.choices[0].message.content
    except Exception as e:
        print("Error in API call:", str(e))
        return "API call failed."


@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        print("Received data:", data)

        if not data or 'prompt' not in data or 'user_data' not in data or 'language' not in data:
            return jsonify({"error": "Invalid input. Please provide 'prompt', 'user_data', and 'language' in JSON format."}), 400

        query = data['prompt']
        user = data['user_data']
        lan = data['language']
        print("User Data:", lan)

        response = generate_llama_response(user, query, lan)
        print("Response Generated.")

        return jsonify({"response": response})

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": "Internal server error.", "details": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=8000)