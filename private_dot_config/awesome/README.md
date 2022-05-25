NOTICE: My configuration for AwesomeWM only works on the latest git master branch. On Arch based distros, all you would have to do is install `awesome-git` from the AUR. On others, you will have to build it manually.

## Setup
This repository has submodules, so make sure you clone it correctly:
```bash
git clone --recurse-submodules https://github.com/JavaCafe01/awesome-config.git ~/.config/awesome
```
## Modules
### :star: [bling](https://github.com/Nooo37/bling) :star:
Bling brings extra utilities to AwesomeWM such as tabs, swallowing, layouts, and flash focus. Please check it out and give it a star!

### [collision](https://github.com/Elv13/collision)
Collision is great for window navigation. It is created by one of the AwesomeWM devs, and is a great utility for your configuration. Give this one a star as well!

<img src="https://github.com/JavaCafe01/awesome-config/blob/master/images/rice.png" alt="img" align="right" width="500px">

## System Info
+ **OS**: Endeavour
+ **Terminal**: Termite
+ **Browser**: Firefox
    + [firefox-css](https://github.com/JavaCafe01/firefox-css)
+ **Music**: Ncspot
+ **GTK Theme**: [Phocus](https://github.com/JavaCafe01/phocus)
+ **File Manager**: Thunar
+ **Color Scheme**: [javacafe](https://github.com/JavaCafe01/javacafe.vim)
+ **Dotfiles**: [my neovim, terminal, and other stuff](https://github.com/JavaCafe01/dotfiles)

## Common Questions

### Where did I steal `ears` from?
It was taken from [elenapan](https://github.com/elenapan/dotfiles).

### How are you getting anti-aliased rounded corners?
To start off, I do not round any corners with picom or any other fork. I round with AwesomeWM. If you round a widget and lay that ontop of another widget, the corners or anti-aliased (AA). Using this fact, all my panels and notifications are rounded widgets which contain a bottom transparent layer. For the clients, you do the same thing but with titlebars. 

But how did I get shadows? Usually, when you add shadows, it shadows the transparent widget as well, like this: 

<img src="https://github.com/JavaCafe01/awesome-config/blob/master/images/round_transparent.png" alt="img">

In picom, if you edit the wintypes option by adding `full-shadow = true` for every window type you need, you will fix that problem:

```
wintypes:
{
# ...
    normal = {full-shadow = true;};
# ...
};
```

Here is the result:

<img src="https://github.com/JavaCafe01/awesome-config/blob/master/images/round_shadow.png" alt="img">

Currently I don't have shadows, but I can easily just enable it in picom and still retain my AA corners.
