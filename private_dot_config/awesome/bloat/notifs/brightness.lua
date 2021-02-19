local wibox = require("wibox")
local awful = require("awful")
local gears = require("gears")
local beautiful = require("beautiful")
local helpers = require("helpers")
local dpi = beautiful.xresources.apply_dpi

local width = dpi(200)
local height = dpi(200)
local screen = awful.screen.focused()

local icon_theme = "sheet"
local icons = require("icons")
icons.init(icon_theme)

local bright_icon = icons.brightness

local active_color_1 = {
    type = 'linear',
    from = {0, 0},
    to = {200, 50}, -- replace with w,h later
    stops = {{0, beautiful.xcolor6}, {0.50, beautiful.xcolor4}}
}

-- create the bright_adjust component
local bright_adjust = wibox({
    screen = screen.primary,
    type = "notification",
    x = screen.geometry.width / 2 - width / 2,
    y = screen.geometry.height / 2 - height / 2 + 300,
    width = width,
    height = height,
    visible = false,
    ontop = true,
    bg = beautiful.xbackground .. "00"
})

local bright_bar = wibox.widget {
    widget = wibox.widget.progressbar,
    shape = gears.shape.rounded_bar,
    bar_shape = gears.shape.rounded_bar,
    color = active_color_1,
    background_color = beautiful.xcolor0,
    max_value = 100,
    value = 0
}

bright_adjust:setup{
    {
        layout = wibox.layout.align.vertical,
        {
            {image = bright_icon, widget = wibox.widget.imagebox},
            top = dpi(30),
            left = dpi(50),
            right = dpi(50),
            bottom = dpi(0),
            widget = wibox.container.margin
        },
        {
            bright_bar,
            top = dpi(20),
            left = dpi(25),
            right = dpi(25),
            bottom = dpi(30),
            widget = wibox.container.margin
        }

    },
    shape = helpers.rrect(beautiful.client_radius),
    bg = beautiful.xbackground,
    border_width = beautiful.widget_border_width,
    border_color = beautiful.widget_border_color,
    widget = wibox.container.background
}

-- create a 3 second timer to hide the volume adjust
-- component whenever the timer is started
local hide_bright_adjust = gears.timer {
    timeout = 3,
    autostart = true,
    callback = function() bright_adjust.visible = false end
}

awesome.connect_signal("ears::brightness", function(value)
    bright_bar.value = value
    if bright_adjust.visible then
        hide_bright_adjust:again()
    else
        bright_adjust.visible = true
        hide_bright_adjust:start()
    end
end)
