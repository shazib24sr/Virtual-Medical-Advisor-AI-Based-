from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import pytesseract
import cv2

app = Flask(__name__)
CORS(app)

# MongoDB connection setup
client = MongoClient('mongodb://localhost:27017/')
db = client['medicine']
collection = db['medicine']

@app.before_first_request
def before_first_request():
    print("Connected to the database successfully!")

@app.route('/live-upload', methods=['POST'])
def live_upload():
    try:
        live_image = request.files['file']
        extracted_text = extract_text_from_image(live_image)
        print("Extracted Text (Live Upload):", extracted_text)  # Print extracted text
        result = search_in_database(extracted_text)
        return prepare_response(result)
    except KeyError:
        return jsonify({"message": "File key not found in request."}), 400
    except Exception as e:
        return jsonify({"message": str(e)}), 500

def extract_text_from_image(uploaded_file):
    if uploaded_file.content_type.startswith('image'):
        temp_image_path = 'temp_image.png'
        uploaded_file.save(temp_image_path)

        # Read the image using OpenCV
        img = cv2.imread(temp_image_path)

        # Convert image to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Apply threshold or other preprocessing techniques as needed
        _, threshold = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)

        # Save the preprocessed image
        cv2.imwrite('preprocessed_image.png', threshold)

        try:
            # Use the preprocessed image for OCR
            extracted_text = pytesseract.image_to_string('preprocessed_image.png')
            return extracted_text.strip()  # Remove leading/trailing spaces
        except Exception as e:
            print(f"Error during OCR: {str(e)}")
            return ""
    else:
        return "Uploaded file is not an image"

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        uploaded_file = request.files['file']
        extracted_text = extract_text_from_image(uploaded_file)

        if not extracted_text:
            return jsonify({"message": "No text extracted from the file."}), 500
        
        print("Extracted Text (File Upload):", extracted_text)
        result = search_in_database(extracted_text)
        return prepare_response(result)
    except KeyError:
        print("No file part in the request.")
        return jsonify({"message": "No file part in the request."}), 400
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"message": "Error processing the file."}), 500
# ... (rest of the code remains the same)



def search_in_database(search_text):
    result = collection.find({"$text": {"$search": search_text}})
    data = []
    for item in result:
        item['_id'] = str(item['_id'])
        selected_fields = {
            "name": item.get("name"),
            "use": item.get("use"),
            "description": item.get("description"),
            "dosage": item.get("dosage")
        }
        data.append(selected_fields)
    return data

@app.route('/search', methods=['POST'])
def search_term():
    search_term = str(request.json.get('searchTerm'))
    result = search_in_database(search_term)
    return prepare_response(result)

def prepare_response(result):
    if result:
        return jsonify(result), 200
    else:
        return jsonify({"message": "Details not found in the database."}), 404

if __name__ == '__main__':
    print("Starting the server...")
    app.run(debug=True)
