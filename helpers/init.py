#!/usr/bin/python

import os
from PIL import Image
import uuid
import fileinput

# define a function for
# compressing an image
def compress(file, verbose=False):

    # Get the path of the file
    filepath = os.path.join("../src/images",
                            file)

    # open the image
    picture = Image.open(filepath)

    # Save the picture with desired quality
    # To change the quality of image,
    # set the quality variable at
    # your desired level, The more
    # the value of quality  variable
    # and lesser the compression
    picture.save(filepath,
                 "JPEG",
                 optimize=True,
                 quality=80)
    return


def updateImageLink(path):
    files = os.listdir(path)
    js_str = "const images = ["
    json_str = '{"images": ['
    for file in files:
        if os.path.isfile(os.path.join(path, file)):
            compress(file)
            print("Image compressed!")
            str = '"https://github.com/MohaElder/me/raw/main/src/images/' + file + '",'
            js_str += str
            json_str += str
    json_str = json_str[:-1]
    js_str += "] \n export { images };"
    json_str += "]}"

    with open('../src/utils/imageLink.js', "w") as myfile:
        myfile.write(js_str)

    with open('../src/utils/imageLink.json', "w") as myfile:
        myfile.write(json_str)

    print("imageLink.js Updated!")


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
