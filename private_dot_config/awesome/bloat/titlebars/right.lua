local awful = require("awful")
local wibox = require("wibox")
local beautiful = require("beautiful")

local set_titlebar = function(c)

    --[[local wid = wibox.widget {widget = wibox.container.background}

    local function update()
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
        position = "right",
        -- size = beautiful.titlebar_height * (3 / 5),
        size = beautiful.oof_border_width,
        bg = beautiful.xcolor0
    })

    --[[:setup{
        wid,
        right = 14,
        left = 6 + beautiful.widget_border_width,
        widget = wibox.container.margin
    }]] --

end

local left = function(c) set_titlebar(c) end

return left
