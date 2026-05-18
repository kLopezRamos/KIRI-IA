
import os
from dotenv import load_dotenv
import google.generativeai as genai
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from gtts import gTTS
import threading

load_dotenv()  

api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    raise ValueError("No se encontró GOOGLE_API_KEY")

app = Flask(__name__)
CORS(app)

genai.configure(api_key=api_key)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No se recibió ningún archivo"}), 400
         
        file = request.files['file']
        print(f"DEBUG: Procesando archivo: {file.filename}")

        image_data = file.read()
        
        model = genai.GenerativeModel('models/gemini-flash-latest')
        
        prompt = "Identifica el objeto principal. Responde solo con el nombre en inglés."
        response = model.generate_content([
            prompt,
            {'mime_type': 'image/jpeg', 'data': image_data}
        ])

        object_name = response.text.strip()


        # MOCKING DATA FOR AUDIO FILE
        # object_name = 'Apple'
        # print(f"DEBUG (MOCK): Objeto dimulado: {object_name}")
        # END OF MOCKING DATA FOR AUDIO FILE 


        print(f"DEBUG: Objeto detectado: {object_name}")
        
        audio_path = os.path.join(os.path.dirname(__file__), "pronunciation.mp3")
        
        tts = gTTS(text=object_name, lang='en')
        tts.save(audio_path)
        
        return jsonify({
            "object": object_name,
            "message": "Success"
        })

    except Exception as e:
        import traceback
        print("\nERROR DETECTADO EN EL BACKEND:")
        print(f"Tipo: {type(e).__name__}")
        print(f"Mensaje: {str(e)}")
        traceback.print_exc()  
        return jsonify({"error": str(e)}), 500

# @app.route('/get-audio')
# def get_audio():
#     audio_path = os.path.join(os.path.dirname(__file__), "pronunciation.mp3")
#     return send_file(audio_path, mimetype="audio/mpeg")


@app.route('/get-audio', methods=['GET']) 
def get_audio():
    print("-> Query recibida en el servidor:", request.args)
    

    word = request.args.get('text')
    print(f"-> Palabra extraída: '{word}'")

    if word and word.strip() and word != "undefined":
        print(f" [HISTORIAL] Generando audio exclusivo para la palabra: '{word}'")
        
        audio_path = os.path.join(os.path.dirname(__file__), f"pronunciation_{word}.mp3")
        
        tts = gTTS(text=word, lang='en', slow=False)
        tts.save(audio_path)

        def borrar_archivo_despues():
            import time
            time.sleep(2) 
            try:
                if os.path.exists(audio_path):
                    os.remove(audio_path)
                    print(f" [LIMPIEZA] Archivo temporal eliminado con éxito: {audio_path}")
            except Exception as e:
                print(f" No se pudo borrar el archivo temporal: {e}")

        threading.Thread(target=borrar_archivo_despues).start()
        
        return send_file(audio_path, mimetype="audio/mpeg")
    
    else:
        print(" [CÁMARA] No se detectó parámetro 'text'. Enviando el archivo estático de la última captura.")
        audio_path = os.path.join(os.path.dirname(__file__), "pronunciation.mp3")
        return send_file(audio_path, mimetype="audio/mpeg")



if __name__ == '__main__':
    port = int(os.getenv("Flask_PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

