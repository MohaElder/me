#!/usr/bin/python

import os
from PIL import Image
from PIL.ExifTags import TAGS
from datetime import datetime
import uuid
import json

# Try to import climage, but make it optional
try:
    import climage
    HAS_CLIMAGE = True
except ImportError:
    HAS_CLIMAGE = False
    print("Warning: climage not available, thumbnail preview will be disabled")

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
    if HAS_CLIMAGE:
        print(climage.convert(filepath, is_unicode=True, is_truecolor=True,
              is_256color=False, is_16color=False, is_8color=False))
    else:
        print(f"Preview for: {file}")

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


def updateImageLink(path):
    files = os.listdir(path)

    with open('../src/utils/imageLink.json', "r") as file:
        imageLinks = json.load(file)
    for file in files:
        if file not in imageLinks["images"] and "thumbnail" not in file:
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
            img_caption = ""
            title = ""
            brief = ""
            date = ""
            published = True

            with open(os.path.join(path, file), "r", encoding="utf-8") as myfile:
                print("Reading markdown file" +
                      myfile.name + " to get all data")
                org_content = myfile.readlines()

            # Parse header from org_content directly
            print("Reading markdown file to get header")
            for i, line in enumerate(org_content):
                if "-->" in line:
                    print("End of header")
                    break
                if "<!--" in line:
                    print("Start of header:")
                    continue

                # Split on first colon only
                if ":" in line:
                    key, _, value = line.partition(":")
                    key = key.strip()
                    res = value.strip()
                    match key:
                        case "id":
                            if (id := res) == "":
                                print("generating id")
                                id = uuid.uuid1().hex
                                org_content[i] = "id: " + id + "\n"
                            print("id: " + id)
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
                        case "cover-caption":
                            print("cover-caption: " + res)
                            img_caption = res
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
                    img_caption: "''' + img_caption + '''",
                    article: "https://raw.githubusercontent.com/MohaElder/me/main/src/blogs/''' + file + '''",
                    },
                    '''

            with open(os.path.join(path, file), "w", encoding="utf-8") as myfile:
                myfile.writelines(org_content)

    str += "} \n export { blogs };"

    with open('../src/utils/blogLink.js', "w", encoding="utf-8") as myfile:
        myfile.write(str)

    print("blogLink.js Updated!")


def updateStoryLink(path):
    files = os.listdir(path)
    org_content = ""
    str = "const stories = {"
    for file in files:
        if os.path.isfile(os.path.join(path, file)):
            id = ""
            person_name = ""
            title = ""
            published = True

            with open(os.path.join(path, file), "r", encoding="utf-8") as myfile:
                print("Reading markdown file" +
                      myfile.name + " to get all data")
                org_content = myfile.readlines()

            # Parse header from org_content directly
            print("Reading markdown file to get header")
            for i, line in enumerate(org_content):
                if "-->" in line:
                    print("End of header")
                    break
                if "<!--" in line:
                    print("Start of header:")
                    continue

                # Split on first colon only
                if ":" in line:
                    key, _, value = line.partition(":")
                    key = key.strip()
                    res = value.strip()
                    match key:
                        case "id":
                            if (id := res) == "":
                                print("generating id")
                                id = uuid.uuid1().hex
                                org_content[i] = "id: " + id + "\n"
                            print("id: " + id)
                        case "published":
                            print("Published: " + res)
                            published = True if res == "true" else False
                        case "person":
                            print("person: " + res)
                            person_name = res
                        case "title":
                            print("title: " + res)
                            title = res
                        case _:
                            print(
                                "warning: possible syntax error at md file heading")

                if published:
                    str += \
                        '"' + id + '''": {
                    person: "''' + person_name + '''",
                    title: "''' + title + '''",
                    article: "https://raw.githubusercontent.com/MohaElder/me/main/src/stories/''' + file + '''",
                    published: "true",
                    },
                    '''

            with open(os.path.join(path, file), "w", encoding="utf-8") as myfile:
                myfile.writelines(org_content)

    str += "} \n export { stories };"

    with open('../src/utils/storyLink.js', "w", encoding="utf-8") as myfile:
        myfile.write(str)

    print("storyLink.js Updated!")


while True:
    print("This is a helper that updates javascript files, enter 'h' for help")
    command = input("Enter your command: ")

    match command:
        case "h":
            print("image: update images")
            print("blog: update blogs")
            print("story: update stories")
            print("all: executes all update commands")
            print("help: help screen")
            print("q: quit")
        case "image":
            updateImageLink('../src/images')
        case "blog":
            updateBlogLink('../src/blogs')
        case "story":
            updateStoryLink('../src/stories')
        case "all":
            updateImageLink('../src/images')
            updateBlogLink('../src/blogs')
            updateStoryLink('../src/stories')
        case "q":
            print("Exited gracefully")
            break
        case _:
            print("command not found, please try again! You can enter 'h' for help")
