-- rc.lua
-- Main Config
pcall(require, "luarocks.loader")
local gears = require("gears")
local awful = require("awful")
require("awful.autofocus")
local wibox = require("wibox")
local beautiful = require("beautiful")
local dpi = require("beautiful.xresources").apply_dpi
local naughty = require("naughty")
local hotkeys_popup = require("awful.hotkeys_popup")
require("awful.hotkeys_popup.keys")

-- Custom imports
local helpers = require("helpers")

-- Autostart and Errors -------------------------------------------------------

local autostart = require("autostart")
awesome.register_xproperty("WM_NAME", "string")

-- Check if awesome encountered an error during startup and fell back to
-- another config (This code will only ever execute for the fallback config)
if awesome.startup_errors then
    naughty.notify(
        {
            preset = naughty.config.presets.critical,
            title = "Oops, there were errors during startup!",
            text = awesome.startup_errors
        }
    )
end

-- Handle runtime errors after startup
do
    local in_error = false
    awesome.connect_signal(
        "debug::error",
        function(err)
            -- Make sure we don't go into an endless error loop
            if in_error then
                return
            end
            in_error = true

            naughty.notify(
                {
                    preset = naughty.config.presets.critical,
                    title = "Oops, an error happened!",
                    text = tostring(err)
                }
            )
            in_error = false
        end
    )
end

-- Variables & Inits ----------------------------------------------------------

theme = "material-gruvbox"
screen_width = awful.screen.focused().geometry.width
screen_height = awful.screen.focused().geometry.height
terminal = "alacritty"
editor = os.getenv("EDITOR") or "nvim"
editor_cmd = terminal .. " -e " .. editor
browser = "MOZ_X11_EGL=1 firefox"
filemanager = "thunar"
discord = "discord"
music = terminal .. " --class music -e ncspot"
-- Default modkey.
-- Usually, Mod4 is the key with a logo between Control and Alt.
-- If you do not like this or do not have such a key,
-- I suggest you to remap Mod4 to another key using xmodmap or other tools.
-- However, you can use another modifier like Mod1, but it may interact with others.
modkey = "Mod4"
altkey = "Mod1"
shift = "Shift"
ctrl = "Control"

-- Set Theme
beautiful.init(gears.filesystem.get_configuration_dir() .. "theme/" .. theme .. "/theme.lua")

-- Layouts
require("window")

local icons = require("icons")
icons.init("sheet")

-- Menu
myawesomemenu = {
    {
        "hotkeys",
        function()
            hotkeys_popup.show_help(nil, awful.screen.focused())
        end
    },
    {"edit config", editor_cmd .. " " .. awesome.conffile},
    {"restart", awesome.restart},
    {
        "quit",
        function()
            awesome.quit()
        end
    }
}

mymainmenu =
    awful.menu(
    {
        items = {
            {"awesome", myawesomemenu, icons.awesome_menu},
            {"Terminal", terminal},
            {"Web Browser", browser},
            {"File Manager", filemanager}
        }
    }
)

-- Screen Stuff ---------------------------------------------------------------

-- Bling module for wallpaper
local bling = require("bling")
awful.screen.connect_for_each_screen(
    function(s)
        -- Screen padding
        screen[s].padding = {left = 0, right = 0, top = 0, bottom = 0}

        -- Each screen has its own tag table.
        awful.tag({"", "", "", "", "ﭮ"}, s, awful.layout.layouts[1])

        -- Set Wallpaper
        --[[ bling.module.tiled_wallpaper("", s, {
        fg = beautiful.xcolor8,
        bg = beautiful.xcolor0,
        offset_y = beautiful.wibar_height + 5,
        offset_x = 0,
        font = "FiraCode Nerd Font Mono",
        font_size = 12,
        padding = 60,
        zickzack = true
    }) --]]
        --[[gears.wallpaper.fit(gears.filesystem.get_configuration_dir() ..
                            "images/bg.png", s, nil) --]]
        gears.wallpaper.maximized(gears.filesystem.get_configuration_dir() .. "images/bg.png", s, false, nil)
    end
)

-- Keys -----------------------------------------------------------------------

root.buttons(
    gears.table.join(
        awful.button(
            {},
            3,
            function()
                mymainmenu:toggle()
            end
        ),
        awful.button({}, 4, awful.tag.viewnext),
        awful.button({}, 5, awful.tag.viewprev)
    )
)

-- Key bindings
require("keys")

-- Rules ----------------------------------------------------------------------

-- Rules to apply to new clients (through the "manage" signal).
awful.rules.rules = {
    {
        rule = {},
        properties = {
            border_width = beautiful.border_width,
            border_color = beautiful.border_normal,
            focus = awful.client.focus.filter,
            raise = true,
            size_hints_honor = false,
            keys = clientkeys,
            buttons = clientbuttons,
            screen = awful.screen.preferred,
            placement = awful.placement.centered + awful.placement.no_overlap + awful.placement.no_offscreen
        }
    },
    {rule = {}, properties = {}, callback = awful.client.setslave}, -- so items in tasklist have the right order
    {
        rule_any = {
            class = {"Arandr", "Blueman-manager", "Sxiv", "fzfmenu"},
            role = {
                "pop-up" -- e.g. Google Chrome's (detached) Developer Tools.
            }
        },
        properties = {floating = true}
    },
    {
        rule_any = {type = {"normal", "dialog"}},
        properties = {titlebars_enabled = true}
    },
    {
        rule = {class = "jetbrains-studio", name = "^win[0-9]+$"},
        properties = {placement = awful.placement.no_offscreen}
    },
    {
        rule_any = {
            class = {"Steam", "zoom", "jetbrains-studio"},
            type = {"splash"},
            name = {
                "^discord.com is sharing your screen.$" -- Discord (running in browser) screen sharing popup
            },
            properties = {titlebars_enabled = false}
        }
    }
}

-- Signals & Imports ----------------------------------------------------------

-- Signal function to execute when a new client appears.
client.connect_signal(
    "manage",
    function(c)
        -- Set the windows at the slave,
        -- i.e. put it at the end of others instead of setting it master.
        -- if not awesome.startup then awful.client.setslave(c) end

        if awesome.startup and not c.size_hints.user_position and not c.size_hints.program_position then
            -- Prevent clients from being unreachable after screen count changes.
            awful.placement.no_offscreen(c)
        end
    end
)

-- Enable sloppy focus, so that focus follows mouse.
client.connect_signal(
    "mouse::enter",
    function(c)
        c:emit_signal("request::activate", "mouse_enter", {raise = false})
    end
)

client.connect_signal(
    "focus",
    function(c)
        c.border_color = beautiful.border_focus
    end
)

client.connect_signal(
    "unfocus",
    function(c)
        c.border_color = beautiful.border_normal
    end
)

-- Import Daemons and Widgets
require("ears")
require("bloat")

-- EOF ------------------------------------------------------------------------
