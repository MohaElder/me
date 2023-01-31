# me
> This repository contains the source code of my personal website

## Tech Stack

The website is static and is powered by [Vue](https://vuejs.org/). I use [Github Action](https://github.com/features/actions) + [Github Pages](https://pages.github.com/) + [a Python script](https://github.com/MohaElder/me/blob/main/helpers/init.py) to perform content update for my blogs and photos.

## UI
The website uses [Vuetify](https://vuetifyjs.com/en/) for UI support. I added my own designs and some gentle touches based on some demos in their documentation to create the UI of the website.

The animation uses [Animate.css](https://animate.style/)

*The site is using Vuetify2. I am planning to update it to Vuetify3 in the future together with an update to Vue3*

### Homepage animation
The wave animation on the homepage is inspired by [Apple's Airpods Pro Ad](https://www.apple.com/airpods-pro/).

## "Backend"
There is no backend for this site for the sake of being a simple personal website. However, to support my my blog and images' content creation on the site. I wrote a python script that kind of serves as a "backend" of the site.

The python script that I wrote helps me to generate two `.json` files to serve as config files for blogs and photos. 

It has a TUI which provides easy access to its functions.

For images: The python script compresses files, extracts exif, and generates thumbnail

For blog: The python script reads metadata based on predefined template pattern for each markdown file

## Updates

Update: 2022/8/16

There is now a <b>Gallery Mode</b> that utilizes WebGl + Unity to bring you a 3D gallery image viewing experience, allowing you to view my photos like you are viewing them in a gallery.

If you like the way I develop my website, feel free to give me a star! If you want to use my website to build your own website, feel free to do so.

Update: 2022/10/17

I will be working on a localization system for the website when I'm free.

Update: 2022/11/8

A localization system using [Vue I18n](https://kazupon.github.io/vue-i18n/) has been implemented in the code. The website currently supports 2 languages: English and Simplified Chinese. These languages can be toggled with a button on the right cornor of the top bar. The Chinese localization is still ongoing and should be expected to be completed in a week or two.

Ideas:

Make a MohaElder's Guide Section

Feature 2 sub-sections:

Trips & Reviews

Trip should feature all trips that I have been to

Reviews should feature all things that I tried and wanted to comment on

Add sorting features and tags for images

Update: 2023/2/1

Formatted the Readme file into a more organized matter. I optimized Photo page. It is now considerably faster than before thanks to thumbnails and this solves the bug on Photo page when viewing it on phones.

Roadmap for future:

Guide section