=== ===    README    === ===

Follow the following steps in order to properly setup the Eldercare Motion Detection System.
1. Open VS Code (or your preferred code editor) and open the Eldercare Motion Detection System folder. Make sure you have Python installed on your computer.

2. Create a folder named 'keys' in the motion_detection_system folder.

3. Create a file called 'elderly-private-key.json'. Please contact us for the private key. 

4. Create a '.env' file in the root folder of the project and add the private key path and document id to the .env file: 
ELDERLY_KEY="path/to/private/key"
DOC_ID="firestore-doc-id"

5. Open the 'activity-detect-cam.py' file under the 'motion_detection_system' folder.

6. Launch a new terminal within VS Code.

7. Create a Python virtual environment and activate it.

8. Install the necessary libraries in order for the program to function properly. Install one library at a time by executing the following code (without $) in the terminal:
8.1 $ pip install opencv-python
8.2 $ pip install firebase_admin
8.3 $ pip install screeninfo
8.4 $ pip install ultralytics
8.5 $ pip install python-dotenv

9. (Optional) Run the 'camera-check.py' script to check your webcam port. If you have more than 1 webcam connected to your computer, make sure to edit the camera port in the 'activity-detect-cam.py' file to correspond to the port you want the script to capture the video frames from.
9.1 If the 'activity-detect-cam.py' script fails to launch with the error "Error: Could not open video capture.", you may try removing ', cv2.CAP_DSHOW' and try executing the script again.

Done!
