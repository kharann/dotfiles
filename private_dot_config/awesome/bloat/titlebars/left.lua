local awful = require("awful")
local wibox = require("wibox")
local beautiful = require("beautiful")
local helpers = require("helpers")

local set_left_titlebar = function(c)
    local wid = wibox.widget {widget = wibox.container.background}

    wid.bg = beautiful.xcolor0

    --[[local function update()
        if client.focus == c then
            wid.bg = beautiful.xcolor8
        else
            wid.bg = beautiful.xcolor0
        end
    end
    update()
    c:connect_signal("focus", update)
    c:connect_signal("unfocus", update)]] --

    awful.titlebar(c, {
        position = "left",
        -- size = beautiful.titlebar_height * (3 / 5),
        size = beautiful.oof_border_width,
        bg = beautiful.xcolor0
    })

    --[[:setup{
        wid,
        left = 14,
        right = 6 + beautiful.widget_border_width,
        widget = wibox.container.margin
    }]] --
end

local set_thunar_left_titlebar = function(c)
    local custom_titlebar = require("bloat.titlebars.thunar")(c)

    local wid = wibox.widget {
        forced_width = beautiful.widget_border_width,
        widget = wibox.container.background
    }

    wid.bg = beautiful.xcolor0
    --[[local function update()
        if client.focus == c then
            wid.bg = beautiful.xcolor8
        else
            wid.bg = beautiful.xcolor0
        end
    end
    update()
    c:connect_signal("focus", update)
    c:connect_signal("unfocus", update)]] --

    awful.titlebar(c, {position = "left", size = 70, bg = transparent}):setup{
        wid,
        {
            custom_titlebar,
            bg = beautiful.xbackground,
            widget = wibox.container.background
        },
        layout = wibox.layout.fixed.horizontal
    }
end

local left = function(c)
    if c.class == "Thunar" and c.type == "normal" then
        set_thunar_left_titlebar(c)
    else
        set_left_titlebar(c)
    end
end

return left
