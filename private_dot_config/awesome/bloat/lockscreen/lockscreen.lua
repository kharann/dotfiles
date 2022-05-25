-- TOTALLY NOT STOLEN FROM ELENAPAN
-- https://github.com/elenapan/dotfiles/tree/master/config/awesome/elemental/lock_screen
-- Disclaimer:
-- This lock screen was not designed with security in mind. There is
-- no guarantee that it will protect you against someone that wants to
-- gain access to your computer.
local awful = require("awful")
local gears = require("gears")
local wibox = require("wibox")
local beautiful = require("beautiful")
local xresources = require("beautiful.xresources")
local dpi = xresources.apply_dpi
local naughty = require("naughty")
local helpers = require("helpers")
local lock_screen = require("bloat.lockscreen")

local lock_screen_symbol = ""
local lock_screen_fail_symbol = ""
local lock_animation_icon = wibox.widget {
    -- Set forced size to prevent flickering when the icon rotates
    forced_height = dpi(80),
    forced_width = dpi(80),
    font = "FiraCode Nerd Font 40",
    align = "center",
    valign = "center",
    widget = wibox.widget.textbox(lock_screen_symbol)
}

-- A dummy textbox needed to get user input.
-- It will not be visible anywhere.
local some_textbox = wibox.widget.textbox()

-- Create the lock screen wibox
-- Set the type to "splash" and set all "splash" windows to be blurred in your
-- compositor configuration file
lock_screen_box = wibox({
    visible = false,
    ontop = true,
    type = "splash",
    screen = screen.primary
})
awful.placement.maximize(lock_screen_box)

lock_screen_box.bg = beautiful.xbackground .. "80" or "#111111"
lock_screen_box.fg = beautiful.xforeground or "#FEFEFE"

-- Add lockscreen to each screen
awful.screen.connect_for_each_screen(function(s)
    if s == screen.primary then
        s.mylockscreen = lock_screen_box
    else
        s.mylockscreen = helpers.screen_mask(s,
                                             beautiful.lock_screen_bg or
                                                 beautiful.exit_screen_bg or
                                                 beautiful.xbackground .. "80")
    end
end)

local function set_visibility(v)
    for s in screen do s.mylockscreen.visible = v end
end

-- Items
local day_of_the_week = wibox.widget {
    font = beautiful.font_name .. "80",
    forced_width = dpi(1000),
    align = "center",
    valign = "center",
    widget = wibox.widget.textclock(helpers.colorize_text("%A",
                                                          beautiful.xcolor4 ..
                                                              "70"))
}

local month = wibox.widget {
    font = beautiful.font_name .. "100",
    align = "center",
    valign = "center",
    widget = wibox.widget.textclock("%B %d")
}

local function update_month()
    month.markup = helpers.colorize_text(month.text:upper(),
                                         beautiful.xcolor6 .. "70")
end

update_month()
month:connect_signal("widget::redraw_needed", function() update_month() end)

local time = {
    {font = "sans bold 16", widget = wibox.widget.textclock("%H")},
    {font = "sans 16", widget = wibox.widget.textclock("%M")},
    spacing = dpi(2),
    layout = wibox.layout.fixed.horizontal
}

local me_pic = wibox.widget {
    nil,
    {
        image = beautiful.me,
        resize = true,
        -- forced_height = dpi(35),
        -- forced_width = dpi(35),
        clip_shape = gears.shape.circle,
        widget = wibox.widget.imagebox
    },
    nil,
    expand = "none",
    layout = wibox.layout.align.horizontal
}

-- Lock animation
local lock_animation_widget_rotate = wibox.container.rotate()

local arc = function()
    return function(cr, width, height)
        gears.shape.arc(cr, width, height, dpi(5), 0, math.pi / 2, true, true)
    end
end

local lock_animation_arc = wibox.widget {
    shape = arc(),
    bg = "#00000000",
    forced_width = dpi(100),
    forced_height = dpi(100),
    widget = wibox.container.background
}

local lock_animation_widget = {
    {lock_animation_arc, widget = lock_animation_widget_rotate},
    {me_pic, margins = dpi(10), widget = wibox.container.margin},
    forced_height = dpi(200),
    forced_width = dpi(200),

    layout = wibox.layout.stack
}

-- Lock helper functions
local characters_entered = 0
local function reset()
    characters_entered = 0;
    lock_animation_icon.markup = helpers.colorize_text(lock_screen_symbol,
                                                       beautiful.xcolor7)
    lock_animation_widget_rotate.direction = "north"
    lock_animation_arc.bg = "#00000000"
end

local function fail()
    characters_entered = 0;
    lock_animation_icon.text = lock_screen_fail_symbol
    lock_animation_widget_rotate.direction = "north"
    lock_animation_arc.bg = "#00000000"
end

local animation_colors = {
    -- Rainbow sequence =)
    beautiful.xcolor1, beautiful.xcolor5, beautiful.xcolor4, beautiful.xcolor6,
    beautiful.xcolor2, beautiful.xcolor3
}

local animation_directions = {"north", "west", "south", "east"}

-- Function that "animates" every key press
local function key_animation(char_inserted)
    local color
    local direction = animation_directions[(characters_entered % 4) + 1]
    if char_inserted then
        color = animation_colors[(characters_entered % 6) + 1]
        lock_animation_icon.text = lock_screen_symbol
    else
        if characters_entered == 0 then
            reset()
        else
            color = beautiful.xcolor7 .. "55"
        end
    end

    lock_animation_arc.bg = color
    lock_animation_widget_rotate.direction = direction
end

-- Get input from user
local function grab_password()
    awful.prompt.run {
        hooks = {
            -- Custom escape behaviour: Do not cancel input with Escape
            -- Instead, this will just clear any input received so far.
            {
                {}, 'Escape', function(_)
                    reset()
                    grab_password()
                end
            }, -- Fix for Control+Delete crashing the keygrabber
            {
                {'Control'}, 'Delete', function()
                    reset()
                    grab_password()
                end
            }
        },
        keypressed_callback = function(mod, key, cmd)
            -- Only count single character keys (thus preventing
            -- "Shift", "Escape", etc from triggering the animation)
            if #key == 1 then
                characters_entered = characters_entered + 1
                key_animation(true)
            elseif key == "BackSpace" then
                if characters_entered > 0 then
                    characters_entered = characters_entered - 1
                end
                key_animation(false)
            end

            -- Debug
            -- naughty.notify { title = 'You pressed:', text = key }
        end,
        exe_callback = function(input)
            -- Check input
            if lock_screen.authenticate(input) then
                -- YAY
                reset()
                set_visibility(false)
            else
                -- NAY
                fail()
                grab_password()
            end
        end,
        textbox = some_textbox
    }
end

function lock_screen_show()
    set_visibility(true)
    grab_password()
end

-- Item placement
lock_screen_box:setup{
    -- Horizontal centering
    nil,
    {
        -- Vertical centering
        nil,
        {
            {
                {
                    {
                        lock_animation_widget,
                        month,
                        day_of_the_week,
                        layout = wibox.layout.align.vertical
                    },
                    {
                        nil,
                        {
                            -- Small circle
                            {
                                forced_height = dpi(5),
                                forced_width = dpi(5),
                                shape = gears.shape.star,
                                bg = beautiful.xcolor6,
                                widget = wibox.container.background
                            },
                            time,
                            -- Small circle
                            {
                                forced_height = dpi(5),
                                forced_width = dpi(5),
                                shape = gears.shape.star,
                                bg = beautiful.xcolor6,
                                widget = wibox.container.background
                            },
                            spacing = dpi(4),
                            layout = wibox.layout.fixed.horizontal
                        },
                        expand = "none",
                        layout = wibox.layout.align.horizontal
                    },
                    spacing = dpi(20),
                    -- spacing = dpi(10),
                    layout = wibox.layout.fixed.vertical
                },
                spacing = dpi(40),
                layout = wibox.layout.fixed.vertical

            },
            bottom = dpi(60),
            widget = wibox.container.margin
        },
        expand = "none",
        layout = wibox.layout.align.vertical
    },
    expand = "none",
    layout = wibox.layout.align.horizontal
}
