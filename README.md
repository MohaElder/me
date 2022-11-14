# me
This is the source code repository of my personal website

It's a purely static website powered by Vue. I use Github Action + Github Pages + a Python script to perform content update for my blogs and photos.

The website uses [Vuetify](https://vuetifyjs.com/en/) for UI support. I added my own designs and some gentle touches based on some primitive Vuetify demos in its documentation to form the UI of the website. The wave animation on the homepage is inspired by [Apple's Airpods Pro Ad](https://www.apple.com/airpods-pro/).

The python script that I wrote helps me to generate two `.js` files to serve as config files for blogs and photos. It has a TUI which provides easy access to its functions.

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