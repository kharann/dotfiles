local apps = {
    terminal = "alacritty",
    launcher = "sh /home/kharann/.config/rofi/launch.sh",
    switcher = require("widgets.alt-tab"),
    xrandr = "lxrandr",
    screenshot = "scrot -e 'echo $f'",
    volume = "pavucontrol",
    appearance = "lxappearance",
    browser = "firefox-developer-edition",
    fileexplorer = "thunar",
    settings = "code /home/kharann/awesome/"
}

user = {
    terminal = "alacritty",
    floating_terminal = "alacritty"
}

return apps
