#!/usr/bin/python

import os
from PIL import Image
from PIL.ExifTags import TAGS
from datetime import datetime
import climage
import uuid
import json

# compressing image, getting exif information, tagging the image

def updateImageData(image_data, file):
    # Get the path of the file
    filepath = os.path.join("../src/images",
                            file)

    # open the image
    picture = Image.open(filepath)
    thumbnail_extension = "_thumbnail"
    compress(filepath, thumbnail_extension, picture, True)

    image_data["thumbnail"] = "https://cdn.jsdelivr.net/gh/mohaelder/me/src/images/" + \
        file + thumbnail_extension + ".jpg"
        
    return image_data

def getImageData(file, verbose=False):

    # Get the path of the file
    filepath = os.path.join("../src/images",
                            file)

    # open the image
    picture = Image.open(filepath)

    # retreive and process exif data from picture
    exif_data = {}
    for k, v in picture.getexif().items():
        exif_data[TAGS.get(k)] = v

    # assign image data from extracted exif data
    image_data = {}

    image_data["DateTime"] = datetime.strptime(exif_data["DateTime"], '%Y:%m:%d %H:%M:%S').timestamp(
    ) if "DateTime" in exif_data else datetime.now().timestamp()

    if "Make" in exif_data and "Model" in exif_data:
        image_data["Camera"] = exif_data["Make"] + " " + exif_data["Model"]
    # show a bit-format thumbnail of the picture we are tagging
    print(climage.convert(filepath, is_unicode=True, is_truecolor=True,
          is_256color=False, is_16color=False, is_8color=False))

    # tag input and processing
    tags = input("input tags and seperate by <,>: ").split(",")
    for i in range(0, len(tags)):
        tags[i] = tags[i].strip().capitalize()

    # assign tag value
    image_data["Tags"] = tags

    thumbnail_extension = "_thumbnail"
    compress(filepath, thumbnail_extension, picture, False)

    image_data["url"] = "https://cdn.jsdelivr.net/gh/mohaelder/me/src/images/" + file
    image_data["thumbnail"] = "https://cdn.jsdelivr.net/gh/mohaelder/me/src/images/" + \
        file + thumbnail_extension + ".jpg"

    # returns the image metadata
    return image_data

 # Save the picture with desired quality
    # To change the quality of image,
    # set the quality variable at
    # your desired level, The more
    # the value of quality  variable
    # and lesser the compression
def compress(filepath, thumbnail_extension, picture, thumbnail_only=False):
    try:
        if not thumbnail_only:
            picture.save(filepath,
                        "JPEG",
                        optimize=True,
                        quality=80)

        size = 512, 512
        thumbnail_extension = "_thumbnail"
        picture.thumbnail(size)
        picture.save(filepath + thumbnail_extension + ".jpg", "JPEG")

    except:
        print("there's something wrong when saving the image")


def updateImageLink(path, updateOldLink = False):
    files = os.listdir(path)

    with open('../src/utils/imageLink.json', "r") as file:
        imageLinks = json.load(file)
    for file in files:
        if updateOldLink:
            imageLinks["images"][file] = updateImageData(imageLinks["images"][file], file)
        elif file not in imageLinks["images"]:
            if os.path.isfile(os.path.join(path, file)):
                imageLinks["images"][file] = getImageData(file)
                
        else:
            print("already processed before")
    print("All Images processed!")
    for key in imageLinks["images"]:
        for tag in imageLinks["images"][key]["Tags"]:
            if tag not in imageLinks["tags"]:
                imageLinks["tags"].append(tag)

    with open('../src/utils/imageLink.json', "w") as myfile:
        myfile.write(json.dumps(imageLinks))

    print("imageLink.json Updated!")


def updateBlogLink(path):
    files = os.listdir(path)
    org_content = ""
    str = "const blogs = {"
    for file in files:
        if os.path.isfile(os.path.join(path, file)):
            colors = {
                "share": "#64b5f6",
                "life": "#ffee58",
                "comment": "#ff8a65",
            }
            id = ""
            color = ""
            img = ""
            title = ""
            brief = ""
            date = ""
            published = True

            with open(os.path.join(path, file), "r", encoding="utf-8") as myfile:
                print("Reading markdown file to get all data")
                org_content = myfile.readlines()

            with open(os.path.join(path, file), "r", encoding="utf-8") as myfile:
                print("Reading markdown file to get header")
                while content := myfile.readline():
                    if "-->" in content:
                        print("End of header")
                        break
                    lst = content.split(": ")
                    if "<!--" in content:
                        print("Start of header:")
                    else:
                        res = lst[1].strip().replace("\n", "")
                        match lst[0]:
                            case "id":
                                if (id := res) == "":
                                    print("generating id")
                                    id = uuid.uuid1().hex
                                org_content[1] = "id: " + id + "\n"
                                print("id: " + res)
                            case "published":
                                print("Published: " + res)
                                published = True if res == "true" else False
                            case "type":
                                print("type: " + res)
                                if not res in colors.keys():
                                    print("key not found: " + res)
                                else:
                                    color = colors[res]
                            case "cover":
                                print("cover: " + res)
                                img = res
                            case "title":
                                print("title: " + res)
                                title = res
                            case "brief":
                                print("brief: " + res)
                                brief = res
                            case "date":
                                print("date: " + res)
                                date = res
                            case _:
                                print(
                                    "warning: possible syntax error at md file heading")

                if published:
                    str += \
                        '"' + id + '''": {
                    color:"''' + color + '''",
                    img: "''' + img + '''",
                    title: "''' + title + '''",
                    brief: "''' + brief + '''",
                    date: "''' + date + '''",
                    article: "https://raw.githubusercontent.com/MohaElder/me/main/src/blogs/''' + file + '''",
                    },
                    '''

            with open(os.path.join(path, file), "w", encoding="utf-8") as myfile:
                myfile.writelines(org_content)

    str += "} \n export { blogs };"

    with open('../src/utils/blogLink.js', "w", encoding="utf-8") as myfile:
        myfile.write(str)

    print("blogLink.js Updated!")


while True:
    print("This is a helper that updates javascript files, enter 'h' for help")
    command = input("Enter your command: ")

    match command:
        case "h":
            print("image: update images")
            print("blog: update blogs")
            print("all: executes all update commands")
            print("help: help screen")
            print("q: quit")
        case "old_image":
            updateImageLink('../src/images', True)
        case "image":
            updateImageLink('../src/images')
        case "blog":
            updateBlogLink('../src/blogs')
        case "all":
            updateImageLink('../src/images')
            updateBlogLink('../src/blogs')
        case "q":
            print("Exited gracefully")
            break
        case _:
            print("command not found, please try again! You can enter 'h' for help")
