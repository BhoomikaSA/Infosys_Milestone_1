
from pathlib import Path
import numpy as np
import tensorflow as tf

from preprocessing import preprocess_image


MODEL_PATH = (
    Path(__file__).resolve().parent.parent
    / "densenet121_aptos_50ep_best.keras"
)

CLASS_NAMES = {
    0: "No DR",
    1: "Mild",
    2: "Moderate",
    3: "Severe",
    4: "Proliferative DR"
}

model = tf.keras.models.load_model(
    MODEL_PATH,
    compile=False
)


def predict_image(image_path):

    image_array = preprocess_image(image_path)

    predictions = model.predict(image_array, verbose=0)[0]

    predicted_class = int(np.argmax(predictions))
    confidence = float(predictions[predicted_class])

    return {
        "class_id": predicted_class,
        "prediction": CLASS_NAMES[predicted_class],
        "confidence": round(confidence * 100, 2)
    }
