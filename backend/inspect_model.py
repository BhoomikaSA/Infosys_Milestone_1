
from pathlib import Path
import tensorflow as tf

# Locate the trained model
MODEL_PATH = (
    Path(__file__).resolve().parent.parent
    / "densenet121_aptos_50ep_best.keras"
)

print("Loading DenseNet121 model...")

# Load the trained model
model = tf.keras.models.load_model(
    MODEL_PATH,
    compile=False
)

print("\nModel loaded successfully!")

# Display input and output shapes
print("\nInput shape:", model.input_shape)
print("Output shape:", model.output_shape)

# Display model architecture
model.summary()

# Find convolutional layers for Grad-CAM investigation
print("\nConvolutional layers:")

for layer in model.layers:
    if isinstance(layer, tf.keras.layers.Conv2D):
        print(layer.name)
# Access the DenseNet121 backbone
backbone = model.get_layer("densenet121")

print("\nConvolutional layers inside DenseNet121:")

for layer in backbone.layers:
    if isinstance(layer, tf.keras.layers.Conv2D):
        print(layer.name, layer.output.shape)

target_layer = backbone.get_layer("conv5_block16_2_conv")

print("\nSelected Grad-CAM layer:")
print(target_layer.name)
print("Output shape:", target_layer.output.shape)

print("\nOUTER MODEL LAYERS:")

for i, layer in enumerate(model.layers):
    print(i, layer.name, type(layer).__name__)

backbone = model.get_layer("densenet121")

print("\nDENSENET121 CONNECTIONS:")
print("Number of inbound nodes:", len(backbone._inbound_nodes))

for node in backbone._inbound_nodes:
    print("Input tensors:", node.input_tensors)
    print("Output tensors:", node.output_tensors)