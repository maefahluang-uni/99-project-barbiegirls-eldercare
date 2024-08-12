=== ===    README    === ===

Follow the following steps in order to properly setup the Eldercare Motion Detection System.
1. Open VS Code (or your preferred code editor) and open the Eldercare Motion Detection System folder. Make sure you have Python installed on your computer.

2. Create a folder named 'keys' in the motion_detection_system folder.

3. Create a file called 'elderly-private-key.json' and add the following code to the .json file: 
{
  "type": "service_account",
  "project_id": "eldery-3rmpw8",
  "private_key_id": "e4afe521ef770e73f3c44757b02e129d05f32a21",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDZXnuYtwFnLtk4\n5vdCcVECqgV5hlDQfMN/DT8b8KSTz85MvFcM7gH+nxfDEndZv09u353+htKfOAEp\nG9dTJjgYm/YMDSN4mroPo8E8Frt6/HfO7xUhtrSoHLYSMW31S2FIC/7NV9YGzijj\nwwmVleJEVilbOHS4lUbETotw7wtPVPNrMV2GZw+y+GpHp7MWpwJRJ8L3iQTcmCNu\n+wLRqtYMBlr1xw3JhXkVHHYV3nEdPF1MzlUkV0b1oj+NEFxmJZT/H2fH3NGpEH6p\nLuvpDR8l3SDEdvKzgt+DUUqFOCScLqPxw430aiOsQBkF8QxXB4vcl0Yv/eBCVag+\noWhj2o2lAgMBAAECggEAB2WLX77gEz9JKmigz4fkmx2AmMok+nTSzQJJ4sab1+D+\nSUBiPYqx0nsrOoeb1eSuxfwung6/bXL6uYfjGi2J3IiEfsd84AM/3P1hCECFYHt/\nDJfriHcO2BoJNgt5jU6Wpyl4iH56X+C1cn6pPYfyqAmlWAXO4i/haLFIvG73jw6Q\nalx4eGm/B2klnDf8k+JcmcY5SYCOhT9bYfs8PE2s4cPx26BuEQSgQICZriffixuo\nNcq/1yCHtZORhNtDCozeofXkyrY4hM4hbYk0osLubyYUpFZ7nqAoTwN5TPGhPv0e\n2tb+ktUW4tlJqofoIwrPwAvKE7LwwGkoRE6lXsTtsQKBgQDzeek/PyVhhjQI6JiE\nbDn5mmkPpC4oq7psNN5mhyinmTTjAEyR+l6V+RAfSTQO6UcOU9vTG5AcXsuchcA2\n24QZZDx+GTzWmIjkJ9eOrMglz/lILNjnXNd0nknMS3lD1e2pkMvhIK3i/lxnuzJ6\nTsI7tRijsS+kmqy6wjrWG4p+nQKBgQDkjMsgwn8Z76GPq9sxY8E5mZ5+dd4/6T/Q\nfRGH8f2HPHvOrUZnHjMDQoVVO1q3olTq4+YeOXQh4xwHnm3JVp3nO0WvrTM19j92\numO7DFAKX4ILHz4VCZ+FZGfZRwMfp+r4VwswOkXUe3+Oja7wd4i7YDiKGmfU8ZXo\ntvGTsVNYqQKBgQDTjHaUhJpHLWMi5m42iQ6qiHaGp6GPpv54rEsdDIzParfgEM92\n+vKaHmjatjEsT5Z0pXpX6BgD/n2thy0mvP7/TO+epPEOiERQ8SlDB290I0s2Yfko\ntati4XG/t0grH8K7VVtARbOwik/htW47hRkQ5d39xKNfwyEXuFGE3TMtpQKBgEbd\nxSpORJzlKcJjtl6VINfcY0GxCI3mpCvga+wsQ8GIJpeKMNdOjODI4pDwC4v/ILeI\nnNToWbMcOZe/LymL2wBU56G2YbesuDb3Sm84PSVKQgdy04wwZK821+COXVCWf4wr\naUO1/esJtB6engzf85yuFDn2QBXOJv52o2d5R2+pAoGAO9+VLt4ggadG6ns5JuqG\nI9DBQKsDh5zvWhyydHd5Yp/GeVVlj64swp7r5sDdETfrJbijFvXZX32nxLxX9j8s\nmdW0d4lfY85yaEgQRToVni2tFOHx8RRio+IUHWiSyZtKGbVsad1Fjeb7Pi+h1yeJ\nPMUyROm8VXUUQaOUJaEIHK0=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-rffle@eldery-3rmpw8.iam.gserviceaccount.com",
  "client_id": "103953584767456567123",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-rffle%40eldery-3rmpw8.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

4. Create a '.env' file in the root folder of the project and add the following code to the .env file: 
ELDERLY_KEY="motion_detection_system/keys/elderly-private-key.json"
DOC_ID="Fjc8tC4B4ucVR9RtxRt4"

5. Open the 'activity-detect-cam.py' file under the 'motion_detection_system' folder.

6. Launch a new terminal within VS Code.

7. Create a Python virtual environment and activate it.

8. Install the necessary libraries in order for the program to function properly. Install one library at a time by executing the following code (without $) in the terminal:
8.1 $ pip install opencv-python
8.2 $ pip install firebase_admin
8.3 $ pip install screeninfo
8.4 $ pip install ultralytics
8.5 $ pip install python-dotenv

9. (Optional) Run the 'camera-check.py' script to check your webcam port. If you have more than 1 webcam connected to your computer, make sure to edit the camera port in the 'activity-detect-cam.py' file on line 72 to correspond to the port you want the script to capture the video frames from.
9.1 If the 'activity-detect-cam.py' script fails to launch with the error "Error: Could not open video capture.", you may try removing ', cv2.CAP_DSHOW' on line 72 and try executing the script again.

Done!
