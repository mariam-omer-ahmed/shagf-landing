from PIL import Image

img = Image.open("public/images/m1.jpg")
print("Mode:", img.mode)
img.convert("RGB").save("public/images/m1.jpg", "JPEG", quality=95)
print("Done")