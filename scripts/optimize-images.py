import os
from PIL import Image

static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static')

target_images = [
    'project-hotel',
    'project-kenna',
    'project-movies',
    'project-resume'
]

print("Starting image optimization...")
for img_name in target_images:
    png_path = os.path.join(static_dir, f"{img_name}.png")
    webp_path = os.path.join(static_dir, f"{img_name}.webp")
    
    if os.path.exists(png_path):
        orig_size = os.path.getsize(png_path)
        
        # Load and convert to WebP
        with Image.open(png_path) as img:
            # Convert RGBA to RGB if needed (or keep RGBA since WebP supports transparency)
            img.save(webp_path, format="WEBP", quality=82, method=6)
            
        new_size = os.path.getsize(webp_path)
        savings = (orig_size - new_size) / orig_size * 100
        print(f"Optimized {img_name}.png:")
        print(f"  Original: {orig_size / 1024:.2f} KB")
        print(f"  WebP:     {new_size / 1024:.2f} KB")
        print(f"  Savings:  {savings:.1f}%")
        
        # Remove original PNG
        os.remove(png_path)
        print(f"  Removed original PNG file.")
    else:
        print(f"File {png_path} not found.")

print("Image optimization finished.")
