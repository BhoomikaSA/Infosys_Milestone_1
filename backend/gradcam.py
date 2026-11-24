
import tensorflow as tf
import numpy as np
import cv2

from .prediction import model


TARGET_LAYER = "conv5_block16_2_conv"


def generate_gradcam(image_array, class_index=None):

    # Get the DenseNet121 backbone
    backbone = model.get_layer("densenet121")

    # Get the selected convolutional layer
    target_layer = backbone.get_layer(TARGET_LAYER)

    # Create a model that returns both feature maps
    # and the final backbone output
    backbone_model = tf.keras.Model(
        inputs=backbone.input,
        outputs=[
            target_layer.output,
            backbone.output
        ]
    )

    # Rebuild the classifier using the existing trained layers
    image_input = tf.keras.Input(shape=(384, 384, 3))

    x = model.get_layer("sequential")(image_input)

    feature_maps, backbone_output = backbone_model(x)

    x = model.get_layer("global_average_pooling2d")(backbone_output)
    x = model.get_layer("batch_normalization")(x, training=False)
    x = model.get_layer("dropout")(x, training=False)
    x = model.get_layer("dense")(x)
    x = model.get_layer("dropout_1")(x, training=False)
    predictions = model.get_layer("dense_1")(x)

    grad_model = tf.keras.Model(
        inputs=image_input,
        outputs=[feature_maps, predictions]
    )

    # Calculate gradients
    with tf.GradientTape() as tape:

        feature_maps, predictions = grad_model(
            image_array,
            training=False
        )

        if class_index is None:
            class_index = tf.argmax(predictions[0])

        class_score = predictions[:, class_index]

    gradients = tape.gradient(class_score, feature_maps)

    # Calculate importance weights
    weights = tf.reduce_mean(
        gradients,
        axis=(1, 2)
    )

    # Generate heatmap
    heatmap = tf.reduce_sum(
        weights[:, tf.newaxis, tf.newaxis, :] * feature_maps,
        axis=-1
    )

    heatmap = tf.maximum(heatmap, 0)
    heatmap = heatmap[0]

    heatmap = heatmap / (
        tf.reduce_max(heatmap) + tf.keras.backend.epsilon()
    )

    heatmap = heatmap.numpy()

    # Resize heatmap
    heatmap = cv2.resize(heatmap, (384, 384))

    return heatmap
