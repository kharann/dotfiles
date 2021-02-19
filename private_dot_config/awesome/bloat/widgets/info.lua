local awful = require("awful")
local gears = require("gears")
local wibox = require("wibox")
local beautiful = require("beautiful")
local naughty = require("naughty")
local xresources = require("beautiful.xresources")
local dpi = xresources.apply_dpi

local helpers = require("helpers")
local pad = helpers.pad

-- Construct layouts
--------------------------------------------------------------------------------

-- Poster (image)
------------------------------------------------------------
local box_image = wibox.widget {
    shape = helpers.rrect(dpi(10)),
    widget = wibox.widget.imagebox
}

local image_cont = wibox.widget {
    box_image,
    shape = gears.shape.circle,
    widget = wibox.container.background
}

box_image:set_image(gears.filesystem.get_configuration_dir() .. "images/me.png")

------------------------------------------------------------

-- Text lines
------------------------------------------------------------
local user = wibox.widget {
    markup = "<span foreground='" .. beautiful.xcolor6 .. "'>JavaCafe01</span>",
    widget = wibox.widget.textbox
}
local name = wibox.widget {
    markup = "<span foreground='" .. beautiful.xcolor4 .. "'>Gokul Swami</span>",
    widget = wibox.widget.textbox
}

user:set_font(beautiful.font)
user:set_valign("top")
name:set_font(beautiful.font_name .. "14")
name:set_valign("top")

local text_area = wibox.layout.fixed.vertical()
text_area:add(name)
text_area:add(user)
------------------------------------------------------------

-- Bring it all together
------------------------------------------------------------
local align_vertical = wibox.layout.align.vertical()
align_vertical:set_middle(text_area)
align_vertical.expand = "none"
local area = wibox.widget {
    {
        markup = "<span foreground='" .. beautiful.xcolor2 .. "'></span>",
        font = "FiraCode Nerd Font Mono 40",
        widget = wibox.widget.textbox
    },
    align_vertical,
    expand = "outside",
    layout = wibox.layout.align.horizontal
}

local main_wd = wibox.widget {
    area,
    left = dpi(80),
    forced_width = dpi(200),
    forced_height = dpi(100),
    widget = wibox.container.margin
}

return main_wd
