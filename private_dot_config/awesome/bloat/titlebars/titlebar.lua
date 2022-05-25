-- Shamelessly stolen from
-- https://raw.githubusercontent.com/arndtphillip/dotfiles/master/.config/awesome/decorations/titlebar.lua
local wibox = require("wibox")
local awful = require("awful")
local gears = require("gears")
local beautiful = require("beautiful")
local dpi = beautiful.xresources.apply_dpi

-- {{ Helper to create mult tb buttons
local function create_title_button(c, color_focus, color_unfocus)
    local tb_color = wibox.widget {
        forced_width = dpi(8),
        forced_height = dpi(8),
        bg = color_focus,
        shape = gears.shape.circle,
        widget = wibox.container.background
    }

    local tb = wibox.widget {
        tb_color,
        width = 25,
        height = 20,
        strategy = "min",
        layout = wibox.layout.constraint
    }

    local function update()
        if client.focus == c then
            tb_color.bg = color_focus
        else
            tb_color.bg = color_unfocus
        end
    end
    update()
    c:connect_signal("focus", update)
    c:connect_signal("unfocus", update)

    tb:connect_signal("mouse::enter",
                      function() tb_color.bg = color_focus .. "70" end)

    tb:connect_signal("mouse::leave", function() tb_color.bg = color_focus end)

    tb.visible = true
    return tb
end
-- }}

local get_titlebar = function(c)
    local buttons = gears.table.join(awful.button({}, 1, function()
        c:emit_signal("request::activate", "titlebar", {raise = true})
        if c.maximized == true then c.maximized = false end
        awful.mouse.client.move(c)
    end), awful.button({}, 3, function()
        c:emit_signal("request::activate", "titlebar", {raise = true})
        awful.mouse.client.resize(c)
    end))
    local borderbuttons = gears.table.join(
                              awful.button({}, 3, function()
            c:emit_signal("request::activate", "titlebar", {raise = true})
            awful.mouse.client.resize(c)
        end), awful.button({}, 1, function()
            c:emit_signal("request::activate", "titlebar", {raise = true})
            awful.mouse.client.resize(c)
        end))

    local close = create_title_button(c, beautiful.xcolor1, beautiful.xcolor0)
    close:connect_signal("button::press", function() c:kill() end)

    local floating =
        create_title_button(c, beautiful.xcolor5, beautiful.xcolor0)
    floating:connect_signal("button::press",
                            function() c.floating = not c.floating end)

    local min = create_title_button(c, beautiful.xcolor3, beautiful.xcolor0)
    min:connect_signal("button::press", function() c.minimized = true end)

    local left = {buttons = buttons, layout = wibox.layout.fixed.horizontal}

    local middle = {
        --[[{
            align = "center",
            font = beautiful.font,
            widget = awful.titlebar.widget.titlewidget(c)
        },]] --
        buttons = buttons,
        layout = wibox.layout.flex.horizontal
    }

    local right = {
        {min, floating, close, layout = wibox.layout.fixed.horizontal},
        right = dpi(5),
        top = dpi(15),
        bottom = dpi(13),
        widget = wibox.container.margin
    }

    local titlebar = {
        {left, middle, right, layout = wibox.layout.align.horizontal},
        -- bg = beautiful.bg_normal,
        widget = wibox.container.background
    }

    return titlebar
end

return get_titlebar
