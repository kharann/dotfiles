local awful = require("awful")
local wibox = require("wibox")
local beautiful = require("beautiful")
local helpers = require("helpers")
local set_titlebar = function(c, bottom_edge_height)

    local wid = wibox.widget {
        -- get_titlebar(c),
        {
            {
                bg = beautiful.xbackground,
                shape = helpers.prrect(beautiful.border_radius + 2, false,
                                       false, true, true),
                widget = wibox.container.background
            },
            bottom = beautiful.oof_border_width,
            left = beautiful.oof_border_width,
            right = beautiful.oof_border_width,
            widget = wibox.container.margin
        },
        shape = helpers.prrect(beautiful.border_radius + 2, false, false, true,
                               true),
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

    awful.titlebar(c, {
        size = bottom_edge_height,
        bg = "transparent",
        position = "bottom"
    }):setup{
        nil,
        -- {
        -- {
        wid,
        --[[  bottom = 14,
                left = 14,
                right = 14,
                widget = wibox.container.margin
            },
            bg = beautiful.xbackground,
            shape = helpers.prrect(beautiful.border_radius, false, false, true,
                                   true),
            widget = wibox.container.background]] --
        -- },
        nil,
        layout = wibox.layout.align.horizontal

    }
end

local bottom = function(c)
    local bottom_edge_height = beautiful.titlebar_height
    set_titlebar(c, bottom_edge_height)
end

return bottom
