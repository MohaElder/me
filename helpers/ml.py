import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import models, transforms
from PIL import Image, UnidentifiedImageError
import json
import os

# Set device (GPU if available, else CPU)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load the JSON file
with open('../src/utils/imageLink.json') as f:
    json_data = json.load(f)

# Extract image paths and corresponding tags from the JSON data
image_paths = []
tags = []
for filename, info in json_data["images"].items():
    image_paths.append(os.path.join("..\\src\\images",
                                    filename))
    tags.append(info['Tags'])

# Define transformation to apply to the images
transform = transforms.Compose([
    transforms.RandomResizedCrop((256, 256)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

# Create a custom dataset class


# Create a custom dataset class
class CustomDataset(torch.utils.data.Dataset):
    def __init__(self, image_paths, tags, transform=None):
        self.image_paths = image_paths
        self.tags = tags
        self.transform = transform

    def __len__(self):
        return len(self.image_paths)

    def __getitem__(self, index):
        image_path = self.image_paths[index]
        try:
            image = Image.open(image_path).convert('RGB')
            if self.transform is not None:
                image = self.transform(image)
                # Check if image has 3 dimensions (channels, height, width)
                if len(image.shape) != 3:
                    raise ValueError(f"Invalid image shape: {image.shape}")

            tag = self.tags[index]
            return image, tag
        except (UnidentifiedImageError, ValueError) as e:
            print(f"Error opening or processing image: {image_path}")
            # Return a placeholder tensor and tag
            return torch.zeros((3, 256, 256)), self.tags[index]


# Create an instance of the custom dataset
dataset = CustomDataset(image_paths, tags, transform=transform)

# Split the dataset into training and validation sets
train_size = int(0.8 * len(dataset))
val_size = len(dataset) - train_size
train_dataset, val_dataset = torch.utils.data.random_split(
    dataset, [train_size, val_size])

# Create data loaders
train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False)

# Define your model
# Example model (ResNet-18), pretrained on ImageNet
model = models.resnet18(pretrained=True)
num_classes = len(dataset.tags)
# Replace the last fully connected layer
model.fc = nn.Linear(model.fc.in_features, num_classes)

# Move the model to the device
model = model.to(device)

# Define the loss function
criterion = nn.CrossEntropyLoss()

# Define the optimizer
optimizer = optim.Adam(model.parameters(), lr=0.001)

# Training loop
num_epochs = 10

for epoch in range(num_epochs):
    model.train()  # Set the model to train mode
    running_loss = 0.0

    for images, labels in train_loader:
        images = images.to(device)
        labels = labels.to(device)

        # Forward pass
        outputs = model(images)
        loss = criterion(outputs, labels)

        # Backward pass and optimization
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        running_loss += loss.item() * images.size(0)

    epoch_loss = running_loss / len(train_dataset)

    # Validation
    model.eval()  # Set the model to evaluation mode
    val_loss = 0.0
    correct = 0

    with torch.no_grad():
        for images, labels in val_loader:
            images = images.to(device)
            labels = labels.to(device)

            outputs = model(images)
            val_loss += criterion(outputs, labels).item() * images.size(0)

            _, predicted = torch.max(outputs, 1)
            correct += (predicted == labels).sum().item()

    val_loss /= len(val_dataset)
    accuracy = correct / len(val_dataset)

    # Print training and validation metrics for each epoch
    print(f"Epoch {epoch+1}/{num_epochs} | Training Loss: {epoch_loss:.4f} | Validation Loss: {val_loss:.4f} | Accuracy: {accuracy*100:.2f}%")
    torch.save(model.state_dict(), './tag_model.pt')
