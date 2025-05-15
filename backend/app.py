from flask import Flask, jsonify,Response
import subprocess
from flask_cors import CORS
import cv2

app = Flask(__name__)
camera = cv2.VideoCapture(0)
CORS(app)

def generate_frames():
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            # Encode frame as JPEG
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()

            # Use multipart for continuous stream
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/start-detection', methods=['GET'])
def start_detection():
    try:
        # Run the detection script
        subprocess.Popen(["python", "drowsiness.py"])
        return jsonify({"message": "Drowsiness detection started."})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/stop-detection', methods=['GET'])
def stop_detection():
    try:
        # Terminate the detection script
        subprocess.Popen(["pkill", "-f", "drowsiness.py"])
        return jsonify({"message": "Drowsiness detection stopped."})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get-analytics', methods=['GET'])
def get_analytics():
    import openpyxl
    wb = openpyxl.load_workbook("drowsiness_data.xlsx")
    ws = wb.active
    data = []
    for row in ws.iter_rows(min_row=2, values_only=True):
        data.append({"start_time": str(row[0]), "end_time": str(row[1]), "duration": row[2]})
    return jsonify(data)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
