local awful = require("awful")
local gears = require("gears")
local beautiful = require("beautiful")
local bling = require("bling")
local dpi = require("beautiful.xresources").apply_dpi
local wibox = require("wibox")

-- Table of layouts to cover with awful.layout.inc, order matters.
awful.layout.layouts = {
    awful.layout.suit.tile,
    awful.layout.suit.floating,
    bling.layout.centered,
    bling.layout.vertical,
    bling.layout.horizontal,
    awful.layout.suit.spiral
    --    bling.layout.mstab
}
-- }}}

-- Layout List
local ll =
    awful.widget.layoutlist {
    source = awful.widget.layoutlist.source.default_layouts, -- DOC_HIDE
    spacing = dpi(24),
    base_layout = wibox.widget {
        spacing = dpi(24),
        forced_num_cols = 4,
        layout = wibox.layout.grid.vertical
    },
    widget_template = {
        {
            {
                id = "icon_role",
                forced_height = dpi(68),
                forced_width = dpi(68),
                widget = wibox.widget.imagebox
            },
            margins = dpi(24),
            widget = wibox.container.margin
        },
        id = "background_role",
        forced_width = dpi(68),
        forced_height = dpi(68),
        widget = wibox.container.background
    }
}

-- Rounded corners
client.connect_signal(
    "manage",
    function(c, startup)
        if not c.fullscreen and not c.maximized then
            c.shape = function(cr, width, height)
                gears.shape.rounded_rect(cr, width, height, beautiful.border_radius)
            end
        end
    end
)
-- Fullscreen clients should not have rounded corners
local function no_rounded_corners(c)
    if c.fullscreen or c.maximized then
        c.shape = function(cr, width, height)
            gears.shape.rectangle(cr, width, height)
        end
    else
        c.shape = function(cr, width, height)
            gears.shape.rounded_rect(cr, width, height, beautiful.border_radius)
        end
    end
end
client.connect_signal("property::fullscreen", no_rounded_corners)
client.connect_signal(
    "property::maximized",
    function(c)
        no_rounded_corners(c)
    end
)
