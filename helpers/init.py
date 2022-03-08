import os
path = '../src/images'
files = os.listdir(path)
str = "const images = ["
for file in files:
    if os.path.isfile(os.path.join(path, file)):
        str += '"https://github.com/MohaElder/me/raw/main/src/images/' + file + '",'
str += "] \n export { images };"

with open('../src/utils/imageLink.js', "w") as myfile:
    myfile.write(str)

print("Update Complete!")
