import os
import torch
import torchvision.transforms as transforms
from torchvision.models import resnet50, ResNet50_Weights
from PIL import Image
import requests
from io import BytesIO

# Load model
weights = ResNet50_Weights.DEFAULT
model = resnet50(weights=weights)
model = torch.nn.Sequential(*list(model.children())[:-1])
model.eval()

preprocess = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


def encode_image_from_url(image_source: str) -> torch.Tensor:
    """
    image_source can be:
    - Local file path (relative or absolute)
    - Image URL
    """

    try:
        # Convert to absolute path if local file
        abs_path = os.path.abspath(image_source)

        # 🟢 CASE 1: Local file exists
        if os.path.isfile(abs_path):
            image = Image.open(abs_path).convert("RGB")

        # 🟢 CASE 2: URL
        else:
            headers = {
                "User-Agent": "Mozilla/5.0 (IncidentDedup/1.0)"
            }
            response = requests.get(image_source, headers=headers, timeout=5)
            response.raise_for_status()
            image = Image.open(BytesIO(response.content)).convert("RGB")

    except Exception as e:
        raise RuntimeError(f"Failed to load image: {e}")

    image_tensor = preprocess(image).unsqueeze(0)

    with torch.no_grad():
        embedding = model(image_tensor)

    return embedding.squeeze()

