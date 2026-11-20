

from PIL import Image, UnidentifiedImageError
import numpy as np


def preprocess_image(image_path):

    try:
        image = Image.open(image_path).convert("RGB")
        image = image.resize((384, 384))

    except (UnidentifiedImageError, OSError):
        raise ValueError("Invalid or unsupported image file")

    image_array = np.array(image, dtype=np.float32)

    # Add batch dimension
    image_array = np.expand_dims(image_array, axis=0)

    return image_array
