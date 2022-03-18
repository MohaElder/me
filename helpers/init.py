import os
from PIL import Image

# define a function for
# compressing an image
def compressMe(file, verbose = False):
    
      # Get the path of the file
    filepath = os.path.join("../src/images", 
                            file)
      
    # open the image
    picture = Image.open(filepath)
      
    # Save the picture with desired quality
    # To change the quality of image,
    # set the quality variable at
    # your desired level, The more 
    # the value of quality variable 
    # and lesser the compression
    picture.save(filepath, 
                 "JPEG", 
                 optimize = True, 
                 quality = 80)
    return


path = '../src/images'
files = os.listdir(path)
str = "const images = ["
for file in files:
    if os.path.isfile(os.path.join(path, file)):
        compressMe(file)
        str += '"https://github.com/MohaElder/me/raw/main/src/images/' + file + '",'
str += "] \n export { images };"

with open('../src/utils/imageLink.js', "w") as myfile:
    myfile.write(str)

print("Update Complete!")
