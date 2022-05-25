-- exitscreen.lua
-- Exit Screen Widget
local awful = require("awful")
local gears = require("gears")
local wibox = require("wibox")
local beautiful = require("beautiful")
local xresources = require("beautiful.xresources")
local dpi = xresources.apply_dpi
local helpers = require("helpers")
local pad = helpers.pad

-- Appearance
local icon_font = "Fira Code NerdFont Mono 45"
local poweroff_text_icon = ""
local reboot_text_icon = ""
local suspend_text_icon = ""
local exit_text_icon = ""
local lock_text_icon = ""
local exitscreen_bg = beautiful.xbackground .. "80"

local button_bg = beautiful.xcolor0
local button_size = dpi(120)

local lock_screen = require("bloat.lockscreen")
lock_screen.init()

-- Commands
local poweroff_command =
    function() awful.spawn.with_shell("systemctl poweroff") end
local reboot_command = function() awful.spawn.with_shell("systemctl reboot") end
local suspend_command = function()
    lock_screen_show()
    awful.spawn.with_shell("systemctl hibernate")
end
local exit_command = function() awesome.quit() end
local lock_command = function() lock_screen_show() end

-- Helper function that generates the clickable buttons
local create_button = function(symbol, hover_color, text, command)
    local icon = wibox.widget {
        forced_height = button_size,
        forced_width = button_size,
        align = "center",
        valign = "center",
        font = icon_font,
        text = symbol,
        widget = wibox.widget.textbox()
    }

    local button = wibox.widget {
        {nil, icon, expand = "none", layout = wibox.layout.align.horizontal},
        forced_height = button_size,
        forced_width = button_size,
        border_width = dpi(3),
        border_color = button_bg,
        shape = helpers.rrect(10),
        bg = button_bg,
        widget = wibox.container.background
    }

    -- Bind left click to run the command
    button:buttons(gears.table.join(
                       awful.button({}, 1, function() command() end)))

    -- Change color on hover
    button:connect_signal("mouse::enter", function()
        icon.markup = helpers.colorize_text(icon.text, hover_color)
        button.border_color = hover_color
    end)
    button:connect_signal("mouse::leave", function()
        icon.markup = helpers.colorize_text(icon.text, beautiful.xforeground)
        button.border_color = button_bg
    end)

    -- Use helper function to change the cursor on hover
    helpers.add_hover_cursor(button, "hand1")

    return button
end

-- Create the buttons
local poweroff = create_button(poweroff_text_icon, beautiful.xcolor1,
                               "Poweroff", poweroff_command)
local reboot = create_button(reboot_text_icon, beautiful.xcolor2, "Reboot",
                             reboot_command)
local suspend = create_button(suspend_text_icon, beautiful.xcolor3, "Suspend",
                              suspend_command)
local exit = create_button(exit_text_icon, beautiful.xcolor4, "Exit",
                           exit_command)
local lock = create_button(lock_text_icon, beautiful.xcolor5, "Lock",
                           lock_command)

-- Create the exit screen wibox
exit_screen = wibox({visible = false, ontop = true, type = "splash"})
awful.placement.maximize(exit_screen)

exit_screen.bg = beautiful.exit_screen_bg or exitscreen_bg or "#111111"
exit_screen.fg = beautiful.exit_screen_fg or beautiful.wibar_fg or "#FEFEFE"

local exit_screen_grabber
function exit_screen_hide()
    awful.keygrabber.stop(exit_screen_grabber)
    exit_screen.visible = false
end
function exit_screen_show()
    exit_screen_grabber = awful.keygrabber.run(
                              function(_, key, event)
            -- Ignore case
            key = key:lower()

            if event == "release" then return end

            if key == 's' then
                suspend_command()
                exit_screen_hide()
                -- 'e' for exit
            elseif key == 'e' then
                exit_command()
            elseif key == 'l' then
                exit_screen_hide()
                lock_command()
            elseif key == 'p' then
                poweroff_command()
            elseif key == 'r' then
                reboot_command()
            elseif key == 'escape' or key == 'q' or key == 'x' then
                exit_screen_hide()
            end
        end)
    exit_screen.visible = true
end

exit_screen:buttons(gears.table.join( -- Left click - Hide exit_screen
                        awful.button({}, 1, function() exit_screen_hide() end),
    -- Middle click - Hide exit_screen
                        awful.button({}, 2, function() exit_screen_hide() end),
    -- Right click - Hide exit_screen
                        awful.button({}, 3, function() exit_screen_hide() end)))

-- Item placement
exit_screen:setup{
    nil,
    {
        nil,
        {
            poweroff,
            reboot,
            suspend,
            exit,
            lock,
            spacing = dpi(50),
            layout = wibox.layout.fixed.horizontal
        },
        expand = "none",
        layout = wibox.layout.align.horizontal
    },
    expand = "none",
    layout = wibox.layout.align.vertical
}

-- EOF ------------------------------------------------------------------------
