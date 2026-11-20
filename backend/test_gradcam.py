
import cv2

from preprocessing import preprocess_image
from gradcam import generate_gradcam

image_path = "sample_retina.png"

# Preprocess the image
image_array = preprocess_image(image_path)

# Generate Grad-CAM heatmap
heatmap = generate_gradcam(image_array)

# Read original image
original = cv2.imread(image_path)
original = cv2.resize(original, (384, 384))

# Convert heatmap into an image
heatmap = (heatmap * 255).astype("uint8")
heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

# Combine original image and heatmap
result = cv2.addWeighted(original, 0.6, heatmap, 0.4, 0)

# Save result
cv2.imwrite("gradcam_result.jpg", result)

print("Grad-CAM generated successfully!")
print("Saved as gradcam_result.jpg")

