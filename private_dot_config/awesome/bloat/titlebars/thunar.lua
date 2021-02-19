local gears = require("gears")
local awful = require("awful")
local wibox = require("wibox")
local beautiful = require("beautiful")
local dpi = beautiful.xresources.apply_dpi

local helpers = require("helpers")
local button = require("utils.button")

local create_shortcut = function(c, icon, location)
    local shortcut = button.create_text(beautiful.fg_normal .. "E6",
                                        beautiful.xcolor6, icon,
                                        "FiraCode Nerd Font Mono 25", function()
        awful.spawn.with_shell("xdotool key ctrl+l; xdotool type --delay 0 " ..
                                   location .. "; xdotool key Return;")
    end)

    shortcut.forced_width = dpi(50)
    shortcut.forced_height = dpi(40)

    return shortcut
end

local get_widget = function(c)

    return wibox.widget {
        {
            {
                nil,
                {
                    nil,
                    {
                        create_shortcut(c, "", "/home/javacafe01"),
                        create_shortcut(c, "", "trash:///"),
                        {
                            {
                                bg = beautiful.xcolor8,
                                forced_height = dpi(1),
                                widget = wibox.container.background
                            },
                            left = dpi(4),
                            right = dpi(5),
                            widget = wibox.container.margin
                        },
                        create_shortcut(c, "", "/home/javacafe01/Downloads"),
                        create_shortcut(c, "", "/home/javacafe01/Documents"),
                        create_shortcut(c, "", "/home/javacafe01/Pictures"),
                        spacing = dpi(10),
                        layout = wibox.layout.fixed.vertical
                    },
                    expand = "none",
                    layout = wibox.layout.align.horizontal
                },
                expand = "none",
                layout = wibox.layout.align.vertical
            },
            bg = beautiful.xcolor0,
            shape = helpers.prrect(dpi(30), false, true, true, false),
            widget = wibox.container.background
        },
        left = dpi(0),
        widget = wibox.container.margin
    }
end

return get_widget
