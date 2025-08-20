# me
## This repository contains the source code of my personal website

## Tech Stack

The website is static and is powered by [Vue](https://vuejs.org/). I use [Github Action](https://github.com/features/actions) + [Github Pages](https://pages.github.com/) + [a Python script](https://github.com/MohaElder/me/blob/main/helpers/init.py) to perform content update for my blogs and photos.

## UI
The website uses [Vuetify](https://next.vuetifyjs.com/en/) for UI support. I added my own designs and some gentle touches based on some demos in their documentation to create the UI of the website.

The animation uses [Animate.css](https://animate.style/)

### Homepage animation
The star animation on the homepage is inspired by [Apple's Airpods Pro Ad](https://www.apple.com/airpods-pro/).

## "Backend"
There is no backend for this site for the sake of being a simple personal website. However, to support my my blog and images' content creation on the site. I wrote a python script that kind of serves as a "backend" of the site.

The python script that I wrote helps me to generate two `.json` files to serve as config files for blogs and photos. 

It has a TUI which provides easy access to its functions.

For images: The python script compresses files, extracts exif, and generates thumbnail

For blog: The python script reads metadata based on predefined template pattern for each markdown file

## Updates

Update: 2025/8/20

There has been tons of updates made if you track the commit changes. The major updates include:

1. Upgraded Vue3 to 3.5.18 which grants all the new speed optimizations without using a VirtualDOM
2. UI Overhauls for a better layout and more OLED friendly look

Update: 2023/3/4

The project has now been upgraded from Vue2 to Vue3 with a number of dependency updates, the major updates are:

1. Vue2 -> Vue3
2. Vue cli -> Vite
3. Vuetify2 -> Vuetify3
4. VueMarkdown -> Markdown It + Custom postprocess

The project has also switched from JavaScript to TypeScript, but most of the code are still written in JavaScript, the migration process will take some time and finish page by page.

The project running with Vue2 can be found in the [vue2](https://github.com/MohaElder/me/tree/vue2) branch.

This Readme will **not** contain any information about the vue2 version website except for the development log. You may find the old read me in the [vue2](https://github.com/MohaElder/me/tree/vue2) branch


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

Update: 2023/2/22

The migration to Vue3 and Vuetify3 has officially started. It is a bit more work than I thought, but it will work out :)
A branch with Vue3 will be uploaded soon. This major update will also bring in vite, a considerably faster bundler for building the app.

Update: 2023/3/4

The project has officially been upgraded from Vue2 to Vue3. This is the first log in the new ReadMe :). The following updates have occurred:

1. Vue2 -> Vue3
2. Vue cli -> Vite
3. Vuetify2 -> Vuetify3
4. VueMarkdown -> Markdown It + Custom postprocess
5. The animated beach frames now load on a need based manner. It will only load the future 10 frames if the user starts scrolling down a bit. This greatly helped with the site's loading speed.
6. cdn has been applied to most of the image content for faster site experience
7. The work page has been revamped. It is now called 'Me'. A short introduction of myself and a selfie of mine has been included. The idea is from [Daniel Eden's Website](https://daneden.me/), the creator of [Animate.css](https://animate.style/)!
8. A theme has been properly configured for the site, no more patchy css!(There are still lots of patchy css, I will resolve them in the near future)
9. Various changes has been made to resolve breaking changes that occurs from upgrading Vue2 to Vue3 and upgrading Vuetify2 to Vuetify3

### Known Issues:

Open Source page is not fully localized: I will translate it in the near future
