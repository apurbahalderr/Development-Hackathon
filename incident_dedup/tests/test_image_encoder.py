import torch
from incident_dedup.image_encoder import encode_image_from_url


def test_image_encoder_output_shape():
    emb = encode_image_from_url("test_images/img1.png")
    assert isinstance(emb, torch.Tensor)
    assert emb.ndim == 1
