import collections
import os
import psutil
import time
from datetime import datetime
import logging
import smtplib
import sys

import cv2
import firebase_admin
import numpy as np
from dotenv import load_dotenv
from firebase_admin import credentials, firestore
from ultralytics import YOLO

# Setup logging
logging.basicConfig(
    level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s"
)

load_dotenv()

private_key = os.getenv("ELDERLY_KEY")
doc_id = os.getenv("DOC_ID")
email = os.getenv("APP_EMAIL")
receiver_email = os.getenv("ADMIN_EMAIL")
app_password = os.getenv("APP_PASSWORD")
# Making request: POST https://oauth2.googleapis.com/token


def initialize_firestore(private_key):
    try:
        cred = credentials.Certificate(private_key)
        firebase_admin.initialize_app(cred)
        return firestore.client()
    except Exception as e:
        logging.error(f"Error initializing Firestore: {e}")
        return None


def push_to_database(act_dict, db, doc_id):
    if not db or not doc_id:
        logging.error("Database or Document ID is not initialized.")
        return

    act_log = {
        "stand": act_dict["stand"]["total_duration"],
        "sit": act_dict["sit"]["total_duration"],
        "sleep": act_dict["sleep"]["total_duration"],
        "stand_to_sit": act_dict["stand_to_sit"]["total_duration"],
        "sit_to_stand": act_dict["sit_to_stand"]["total_duration"],
        "sit_to_sleep": act_dict["sit_to_sleep"]["total_duration"],
        "sleep_to_sit": act_dict["sleep_to_sit"]["total_duration"],
        "timestamp": firestore.SERVER_TIMESTAMP,
    }

    try:
        doc_ref = (
            db.collection("patients")
            .document(doc_id)
            .collection("activities")
            .document()
        )
        doc_ref.set(act_log)
    except Exception as e:
        logging.error(f"Error pushing to database: {e}")
        return

    # Reset activity log
    for key in act_dict:
        if key != "prev":
            act_dict[key]["start_time"] = 0
            act_dict[key]["duration"] = 0
            act_dict[key]["total_duration"] = 0

    act_dict["prev"] = None


def check_camera(camera_index):
    cap = cv2.VideoCapture(camera_index)
    if not cap.isOpened():
        return False
    ret, frame = cap.read()
    cap.release()
    return ret


def find_camera(camera_indices):
    for index in camera_indices:
        if check_camera(index):
            logging.info(f"Found camera on port: {index}")
            return cv2.VideoCapture(index)
    return None


def notify_admin(type):

    # Define alert templates
    logging.info("Notifying Admin...")
    alerts = {
        0: {
            "type": "System Alert",
            "title": "Camera Connection Issue",
            "text": "The camera is disconnected or in use by another application. Video feed interrupted.",
        },
        1: {
            "type": "System Alert",
            "title": "Camera Connection Issue",
            "text": "Camera feed lost. Attempting to switch to backup camera.",
        },
        2: {
            "type": "System Warning",
            "title": "High Resource Usage",
            "text": "High resource usage detected for a sustained period of time (600s). Restarting activity recognition program to avoid performance issues or system crashes.",
        },
        3: {
            "type": "System Alert",
            "title": "System Initialization",
            "text": "System is starting up.",
        },
    }

    alert = alerts.get(type, alerts[3])

    alert.update(
        {
            "patientID": doc_id,
            "timestamp": datetime.now(),
        }
    )

    subject = f"{alert['type']}"
    message = f"{alert['title']}: {alert['text']} \ntime: {alert['timestamp']} \nID: {alert['patientID']}"
    text = f"Subject:{subject}\n\n{message}"

    try:
        logging.info("Sending email...")
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()

        server.login(email, app_password)
        server.sendmail(email, receiver_email, text)
        logging.info("Email sent to Admin")
    except Exception as e:
        logging.error(f"Error pushing to alert: {e}")


def main():
    # Initialize Firebase Firestore DB
    db = initialize_firestore(private_key)
    if not db:
        logging.error("Failed to initialize Firestore. Exiting...")
        return

    # Initialize YOLO Model
    try:
        model = YOLO("yolo-Weights/activity-model-v8m.pt")
    except Exception as e:
        logging.error(f"Error loading YOLO model: {e}")
        return

    camera_indices = [0]
    cap = None
    initial_notification = False

    try:
        cap = find_camera(camera_indices)

        if cap is None:
            # TODO: Notify
            logging.error("No camera available. Exiting...")
            # notify_admin(type=0)
            return

        cap.set(3, 640)  # width
        cap.set(4, 480)  # height

        track_hist = collections.defaultdict(list)
        frequency, MAX_TRACK_HISTORY = 60, 30
        start_time = last_detection_time = last_push_time = time.time()
        curr, cpu, high_usage_start, high_usage_dur = None, None, None, None
        CPU_THRESH, DUR_THRESH, DETECTION_TIMEOUT = 80.0, 600.0, 300.0

        # Activity classes map
        act_map = {0: "stand", 1: "sleep", 2: "sit"}

        # Activity log dictionary
        act_dict = {
            "prev": None,
            "stand": {"start_time": 0, "duration": 0, "total_duration": 0},
            "sit": {"start_time": 0, "duration": 0, "total_duration": 0},
            "sleep": {"start_time": 0, "duration": 0, "total_duration": 0},
            "stand_to_sit": {"start_time": 0, "duration": 0, "total_duration": 0},
            "sit_to_stand": {"start_time": 0, "duration": 0, "total_duration": 0},
            "sit_to_sleep": {"start_time": 0, "duration": 0, "total_duration": 0},
            "sleep_to_sit": {"start_time": 0, "duration": 0, "total_duration": 0},
        }

        while cap.isOpened():
            success, frame = cap.read()

            # Continuously check for working camera
            if not success:
                # TODO: Notify
                logging.warning("Camera feed lost, attempting to switch to backup...")
                # notify_admin(type=1)
                cap.release()
                cap = find_camera(camera_indices)
                if cap is None:
                    # TODO: Notify
                    logging.error("No camera available. Exiting...")
                    # notify_admin(type=0)
                    break

            elapsed_time = time.time() - start_time

            if not initial_notification:
                notify_admin(3)
                initial_notification = True


            # Display information on frame
            cv2.putText(
                frame,
                f"Time: {elapsed_time:.2f} s",
                (10, 40),
                cv2.FONT_HERSHEY_SIMPLEX,
                1.25,
                (255, 255, 255),
                2,
            )

            # Track object in frame
            results = model.track(frame, persist=True)
            if results and results[0].boxes.id is not None:
                boxes = results[0].boxes.xywh.cpu()
                track_ids = results[0].boxes.id.int().cpu().tolist()
                activity = results[0].boxes.cls.cpu().numpy().astype(int)[0]

                last_detection_time = time.time()

                for box, track_id in zip(boxes, track_ids):
                    x, y, w, h = box
                    track = track_hist[track_id]
                    track.append((float(x), float(y), float(w), float(h)))

                    # Determine current activity
                    if len(track) >= 10:
                        x_diff = track[-1][0] - track[-10][0]
                        y_diff = track[-1][1] - track[-10][1]
                        w_diff = track[-1][2] - track[-10][2]
                        h_diff = track[-1][3] - track[-10][3]

                        if abs(y_diff) > 10 or abs(h_diff) > 10 or abs(w_diff) > 10:
                            if h > w:
                                if h_diff < -15 and y_diff > 5:
                                    curr = "stand_to_sit"
                                elif h_diff > 15 and y_diff < -5:
                                    curr = "sit_to_stand"
                                else:
                                    curr = act_map.get(activity)
                            else:
                                if w_diff > 10:
                                    curr = "sit_to_sleep"
                                elif w_diff < -10:
                                    curr = "sleep_to_sit"
                                else:
                                    curr = act_map.get(activity)
                        else:
                            curr = act_map.get(activity)

                        # Update start time if activity just started
                        # NOTE: or act_dict["prev"] != curr should be used when NOT pushing to DB
                        if act_dict[curr]["start_time"] == 0 or act_dict["prev"] != curr:
                            if act_dict["prev"] and act_dict["prev"] != curr:
                                prev_act = act_dict["prev"]
                                elapsed_duration = round(elapsed_time - act_dict[prev_act]["start_time"])
                                act_dict[prev_act]["total_duration"] += elapsed_duration
                                act_dict[prev_act]["duration"] = 0  # Reset previous activity duration
                                act_dict[prev_act]["start_time"] = 0  # Reset start time
                            act_dict[curr]["start_time"] = round(elapsed_time, 2)

                        # Push to DB every frequency seconds
                        # if time.time() - last_push_time >= frequency:
                        #     print('PUSHED TO DATABASE...')
                        #     push_to_database(act_dict, db, doc_id)
                        #     last_push_time = time.time()

                        cv2.putText(
                            frame,
                            f"Current Act: {curr}",
                            (10, 80),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            1.25,
                            (0, 0, 0),
                            2,
                        )
                        i = 0
                        for key, value in act_dict.items():
                            if key != "prev":
                                cv2.putText(
                                    frame,
                                    f"{key}: {value['duration']} s \ {value['total_duration']} s ",
                                    (10, 120 + (i * 35)),
                                    cv2.FONT_HERSHEY_SIMPLEX,
                                    1.0,
                                    (0, 0, 0),
                                    2,
                                )
                                i += 1

                    else:
                        cv2.putText(
                            frame,
                            f"Calibrating...",
                            (10, 80),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            1.25,
                            (255, 255, 255),
                            2,
                        )

                    if len(track) > MAX_TRACK_HISTORY:
                        track.pop(0)

            else:
                # Camera obstruction / No person in view
                # TODO: Notify
                if time.time() - last_detection_time > DETECTION_TIMEOUT:
                    logging.warning(
                        "No detection for a while, attempting to switch to backup camera..."
                    )
                    # notify_admin(type=1)
                    cap.release()
                    cap = find_camera(camera_indices)
                    if cap is None:
                        logging.error("No camera available. Exiting...")
                        # notify_admin(type=0)
                        break
                    last_detection_time = time.time()

            # Update duration if activity hasn't changed
            if (
                act_dict["prev"] is not None
                and act_dict[curr]["start_time"] != 0
                and act_dict["prev"] == curr
            ):
                act_dict[curr]["duration"] = round(
                    elapsed_time - act_dict[curr]["start_time"], 2
                )

            act_dict["prev"] = curr

            # CPU Monitoring
            cpu = psutil.cpu_percent()
            logging.info(f"cpu percentage: {cpu}")
            if cpu > CPU_THRESH:
                if high_usage_start is None:
                    high_usage_start = time.time()

                high_usage_dur = time.time() - high_usage_start

                if high_usage_dur > DUR_THRESH:
                    logging.critical(
                        "High memory usage for prolonged duration detected!"
                    )
                    notify_admin(type=2)
                    cap.release()
                    try: 
                        os.execv(sys.executable, ["python"] + sys.argv)
                    except Exception as e:
                        logging.error(f"Error restarting script: {e}")

            annotated_frame = results[0].plot()
            cv2.imshow("YOLOv8 Tracking", annotated_frame)

            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

    except Exception as e:
        logging.error(f"Error during video processing: {e}")
    finally:
        if cap is not None:
            cap.release()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
