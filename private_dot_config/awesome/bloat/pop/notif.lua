-- notif.lua
-- Notification Popup Widget
local awful = require("awful")
local gears = require("gears")
local wibox = require("wibox")
local beautiful = require("beautiful")
local xresources = require("beautiful.xresources")
local dpi = xresources.apply_dpi

local popupLib = require("utils.popupLib")

local popupWidget = wibox.widget {
    {
        require("bloat.notifs.notif-center"),
        margins = dpi(8),
        widget = wibox.container.margin
    },
    expand = "none",
    layout = wibox.layout.fixed.horizontal
}

local width = 400
local margin = -1 * beautiful.widget_border_width

local popup = popupLib.create(awful.screen.focused().geometry.width - width +
                                  (-1 * margin), margin, nil, width,
                              popupWidget, dpi(25), false, false, false, true)

popup:set_xproperty("WM_NAME", "panel")

return popup

-- EOF ------------------------------------------------------------------------
