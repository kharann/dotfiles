-- autostart.lua
-- Autostart Stuff Here
local awful = require("awful")
local gears = require("gears")

local function run_once(cmd)
    local findme = cmd
    local firstspace = cmd:find(" ")
    if firstspace then
        findme = cmd:sub(0, firstspace - 1)
    end
    awful.spawn.easy_async_with_shell(string.format("pgrep -u $USER -x %s > /dev/null || (%s)", findme, cmd))
end

-- Network Manager Applet
run_once("nm-applet")

-- Disable Bell
run_once("xset -b")

-- Mpd Cleanup
run_once([[
    ps aux | grep "mpc idleloop player" | grep -v grep | awk '{print $2}' | xargs kill
    ]])

run_once("~/.screenlayout/layout.sh")

-- Bluetooth
run_once("blueman-applet")

run_once("setxkbmap -option caps:swapescape")

-- Compositor
run_once("picom --experimental-backends --config " .. gears.filesystem.get_configuration_dir() .. "configs/picom.conf")

--Media controller daemon
run_once("playerctld daemon")

return autostart

-- EOF ------------------------------------------------------------------------
